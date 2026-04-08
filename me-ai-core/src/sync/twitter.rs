//! Twitter/X sync orchestration.
//!
//! Mirrors `me-ai-web/src/lib/store/twitter-sync.ts`:
//! - `sync_twitter`        — full or incremental sync
//! - `sync_twitter_more`   — fetch older tweets beyond initial sync
//! - `clear_twitter_data`  — wipe all local Twitter data
//! - `get_twitter_sync_status` — return sync status

use std::collections::HashMap;

use js_sys::Function;
use web_sys::AbortSignal;

use crate::api::twitter;
use crate::db::RexieDb;
use crate::error::CoreError;
use crate::storage::sync::{
    self, ItemInput,
};

use super::{
    check_aborted, emit_progress, now_ms,
    SyncProgress, SyncResult, SyncStatus,
};

const SOURCE_TYPE: &str = "twitter";

// ── Public API ─────────────────────────────────────────────────────────

/// Full or incremental Twitter sync.
///
/// First call: fetches up to `limit` tweets from user's timeline.
/// Subsequent calls: incremental (fetches newer tweets and stops when a known tweet is found).
pub async fn sync_twitter(
    db: &RexieDb,
    token: &str,
    limit: u32,
    on_progress: &Option<Function>,
    signal: Option<&AbortSignal>,
) -> Result<SyncResult, CoreError> {
    check_aborted(signal)?;

    let (user_id, username) = get_twitter_user(token).await?;

    let state = sync::get_sync_state(db, SOURCE_TYPE).await?;

    match state {
        None => full_sync(db, token, &user_id, &username, limit, on_progress, signal).await,
        Some(ref st) => {
            incremental_sync(db, token, &user_id, &username, st, limit, on_progress, signal).await
        }
    }
}

/// Continue fetching older tweets beyond the initial sync.
pub async fn sync_twitter_more(
    db: &RexieDb,
    token: &str,
    limit: u32,
    on_progress: &Option<Function>,
    signal: Option<&AbortSignal>,
) -> Result<SyncResult, CoreError> {
    check_aborted(signal)?;

    let (user_id, username) = get_twitter_user(token).await?;

    let state = sync::get_sync_state(db, SOURCE_TYPE).await?;
    match state {
        Some(ref st) if !st.oldest_page_token.is_empty() => {
            continue_fetch(db, token, &user_id, &username, st, limit, on_progress, signal).await
        }
        _ => Ok(SyncResult { added: 0, deleted: None, errors: 0 }),
    }
}

/// Clear all local Twitter data (items + sync state).
pub async fn clear_twitter_data(db: &RexieDb) -> Result<(), CoreError> {
    sync::delete_items_by_source(db, SOURCE_TYPE).await?;
    sync::delete_sync_state(db, SOURCE_TYPE).await?;
    Ok(())
}

/// Get current Twitter sync status.
pub async fn get_twitter_sync_status(db: &RexieDb) -> Result<SyncStatus, CoreError> {
    let state = sync::get_sync_state(db, SOURCE_TYPE).await?;
    match state {
        None => Ok(SyncStatus {
            synced: false,
            total_items: 0,
            last_sync_at: None,
            has_more: false,
            history_id: None,
        }),
        Some(st) => Ok(SyncStatus {
            synced: true,
            total_items: st.total_items,
            last_sync_at: st.last_sync_at,
            has_more: !st.oldest_page_token.is_empty(),
            history_id: None,
        }),
    }
}

// ── Full sync (initial) ────────────────────────────────────────────────

async fn full_sync(
    db: &RexieDb,
    token: &str,
    user_id: &str,
    username: &str,
    limit: u32,
    on_progress: &Option<Function>,
    signal: Option<&AbortSignal>,
) -> Result<SyncResult, CoreError> {
    let mut added: u32 = 0;
    let mut errors: u32 = 0;
    let mut pagination_token: Option<String> = None;
    let mut newest_id: Option<String> = None;
    let mut oldest_page_token: Option<String> = None;

    emit_progress(
        on_progress,
        &SyncProgress::with_counts("listing", "Fetching tweets...", 0, limit),
    );

    while added < limit {
        check_aborted(signal)?;

        let batch_size = (limit - added).min(100);
        let response = match twitter::get_user_timeline(
            token,
            user_id,
            batch_size,
            pagination_token.as_deref(),
        )
        .await
        {
            Ok(r) => r,
            Err(_) => {
                errors += 1;
                break;
            }
        };

        let tweets = response["data"].as_array();
        let tweet_list = match tweets {
            Some(arr) if !arr.is_empty() => arr,
            _ => break,
        };

        let user_map = build_user_map(&response);
        let items: Vec<ItemInput> = tweet_list
            .iter()
            .map(|t| normalize_tweet(t, &user_map, username))
            .collect();

        if newest_id.is_none() && !items.is_empty() {
            newest_id = Some(items[0].source_id.clone());
        }

        let batch_count = items.len() as u32;
        sync::insert_items_batch(db, items).await?;
        added += batch_count;

        emit_progress(
            on_progress,
            &SyncProgress::with_counts(
                "fetching",
                &format!("Downloaded {} tweets...", added),
                added,
                limit,
            ),
        );

        let next_token = response["meta"]["next_token"].as_str().map(String::from);
        match next_token {
            Some(nt) => {
                pagination_token = Some(nt.clone());
                oldest_page_token = Some(nt);
            }
            None => break,
        }
    }

    sync::upsert_sync_state(
        db,
        SOURCE_TYPE,
        newest_id.as_deref().unwrap_or(""),
        now_ms(),
        added as i64,
        oldest_page_token.as_deref().unwrap_or(""),
    )
    .await?;

    emit_progress(
        on_progress,
        &SyncProgress::done_with_counts(&format!("Synced {} tweets", added), added, added),
    );

    Ok(SyncResult { added, deleted: None, errors })
}

// ── Incremental sync ───────────────────────────────────────────────────

#[allow(clippy::too_many_arguments)]
async fn incremental_sync(
    db: &RexieDb,
    token: &str,
    user_id: &str,
    username: &str,
    state: &sync::SyncStateRow,
    limit: u32,
    on_progress: &Option<Function>,
    signal: Option<&AbortSignal>,
) -> Result<SyncResult, CoreError> {
    let mut added: u32 = 0;
    let mut errors: u32 = 0;
    let mut pagination_token: Option<String> = None;

    emit_progress(
        on_progress,
        &SyncProgress::with_counts("incremental", "Checking for new tweets...", 0, 0),
    );

    while added < limit {
        check_aborted(signal)?;

        let batch_size = (limit - added).min(100);
        let response = match twitter::get_user_timeline(
            token,
            user_id,
            batch_size,
            pagination_token.as_deref(),
        )
        .await
        {
            Ok(r) => r,
            Err(_) => {
                errors += 1;
                break;
            }
        };

        let tweets = response["data"].as_array();
        let tweet_list = match tweets {
            Some(arr) if !arr.is_empty() => arr,
            _ => break,
        };

        let user_map = build_user_map(&response);

        // Filter out tweets we already have (stop at the known history_id)
        let mut new_tweets: Vec<&serde_json::Value> = Vec::new();
        let mut hit_known = false;
        for t in tweet_list {
            let tweet_id = t["id"].as_str().unwrap_or("");
            if tweet_id == state.history_id {
                hit_known = true;
                break;
            }
            new_tweets.push(t);
        }

        if !new_tweets.is_empty() {
            let items: Vec<ItemInput> = new_tweets
                .iter()
                .map(|t| normalize_tweet(t, &user_map, username))
                .collect();
            let batch_count = items.len() as u32;
            sync::insert_items_batch(db, items).await?;
            added += batch_count;

            emit_progress(
                on_progress,
                &SyncProgress::with_counts(
                    "incremental",
                    &format!("{} new tweets...", added),
                    added,
                    0,
                ),
            );
        }

        if hit_known {
            break;
        }

        let next_token = response["meta"]["next_token"].as_str().map(String::from);
        match next_token {
            Some(nt) => {
                pagination_token = Some(nt);
            }
            None => break,
        }
    }

    let new_total = (state.total_items as u32) + added;

    // Get newest tweet ID from DB if we added new tweets
    let newest_id = if added > 0 {
        sync::get_newest_source_id(db, SOURCE_TYPE)
            .await?
            .unwrap_or_else(|| state.history_id.clone())
    } else {
        state.history_id.clone()
    };

    sync::upsert_sync_state(
        db,
        SOURCE_TYPE,
        &newest_id,
        now_ms(),
        new_total as i64,
        &state.oldest_page_token,
    )
    .await?;

    let done_msg = if added > 0 {
        format!("{} new tweets synced", added)
    } else {
        "Already up to date".to_string()
    };
    emit_progress(
        on_progress,
        &SyncProgress::done_with_counts(&done_msg, added, added),
    );

    Ok(SyncResult { added, deleted: None, errors })
}

// ── Continue fetch (older tweets) ──────────────────────────────────────

#[allow(clippy::too_many_arguments)]
async fn continue_fetch(
    db: &RexieDb,
    token: &str,
    user_id: &str,
    username: &str,
    state: &sync::SyncStateRow,
    limit: u32,
    on_progress: &Option<Function>,
    signal: Option<&AbortSignal>,
) -> Result<SyncResult, CoreError> {
    let mut added: u32 = 0;
    let mut errors: u32 = 0;
    let mut pagination_token: Option<String> = if state.oldest_page_token.is_empty() {
        None
    } else {
        Some(state.oldest_page_token.clone())
    };

    emit_progress(
        on_progress,
        &SyncProgress::with_counts("fetching", "Fetching older tweets...", 0, limit),
    );

    while added < limit {
        let pt = match &pagination_token {
            Some(pt) => pt.clone(),
            None => break,
        };

        check_aborted(signal)?;

        let batch_size = (limit - added).min(100);
        let response = match twitter::get_user_timeline(
            token,
            user_id,
            batch_size,
            Some(&pt),
        )
        .await
        {
            Ok(r) => r,
            Err(_) => {
                errors += 1;
                break;
            }
        };

        let tweets = response["data"].as_array();
        let tweet_list = match tweets {
            Some(arr) if !arr.is_empty() => arr,
            _ => break,
        };

        let user_map = build_user_map(&response);
        let items: Vec<ItemInput> = tweet_list
            .iter()
            .map(|t| normalize_tweet(t, &user_map, username))
            .collect();

        let batch_count = items.len() as u32;
        sync::insert_items_batch(db, items).await?;
        added += batch_count;

        emit_progress(
            on_progress,
            &SyncProgress::with_counts(
                "fetching",
                &format!("Downloaded {} tweets total...", state.total_items as u32 + added),
                added,
                limit,
            ),
        );

        pagination_token = response["meta"]["next_token"].as_str().map(String::from);
    }

    sync::upsert_sync_state(
        db,
        SOURCE_TYPE,
        &state.history_id,
        now_ms(),
        (state.total_items as u32 + added) as i64,
        pagination_token.as_deref().unwrap_or(""),
    )
    .await?;

    emit_progress(
        on_progress,
        &SyncProgress::done_with_counts(&format!("Fetched {} more tweets", added), added, added),
    );

    Ok(SyncResult { added, deleted: None, errors })
}

// ── Normalisation ──────────────────────────────────────────────────────

/// Transform a raw Twitter API v2 tweet JSON into an ItemInput ready for storage.
fn normalize_tweet(
    tweet: &serde_json::Value,
    user_map: &HashMap<String, (String, String)>,
    current_username: &str,
) -> ItemInput {
    let tweet_id = tweet["id"].as_str().unwrap_or("");
    let author_id = tweet["author_id"].as_str().unwrap_or("");
    let text = tweet["text"].as_str().unwrap_or("");
    let conversation_id = tweet["conversation_id"].as_str().unwrap_or(tweet_id);
    let created_at = tweet["created_at"].as_str().unwrap_or("");

    let (author_handle, _author_name) = user_map
        .get(author_id)
        .map(|(u, n)| (u.as_str(), n.as_str()))
        .unwrap_or((current_username, ""));

    let subject = text.chars().take(120).collect::<String>().replace('\n', " ");

    let date = if !created_at.is_empty() {
        crate::time_util::parse_http_date_to_ms(created_at)
            .filter(|&ms| ms > 0)
            .unwrap_or_else(now_ms)
    } else {
        now_ms()
    };

    let has_referenced = tweet["referenced_tweets"].as_array().is_some_and(|a| !a.is_empty());
    let item_type = if has_referenced { "retweet" } else { "tweet" };

    // Build labels from public_metrics
    let mut labels = Vec::new();
    if let Some(metrics) = tweet["public_metrics"].as_object() {
        let likes = metrics.get("like_count").and_then(|v| v.as_u64()).unwrap_or(0);
        let retweets = metrics.get("retweet_count").and_then(|v| v.as_u64()).unwrap_or(0);
        labels.push(format!("\u{2661}{}", likes));      // heart
        labels.push(format!("\u{1f504}{}", retweets));   // arrows
    }
    let labels_json = serde_json::to_string(&labels).unwrap_or_else(|_| "[]".to_string());

    let snippet = text.chars().take(200).collect::<String>();

    ItemInput {
        id: format!("{}:{}", SOURCE_TYPE, tweet_id),
        source_type: SOURCE_TYPE.to_string(),
        source_id: tweet_id.to_string(),
        thread_key: conversation_id.to_string(),
        r#type: item_type.to_string(),
        from: format!("@{}", author_handle),
        to: String::new(),
        cc: String::new(),
        subject,
        snippet,
        body: text.to_string(),
        html_body: None,
        date: Some(date),
        labels: labels_json,
        message_id: tweet_id.to_string(),
        in_reply_to: String::new(),
        references: String::new(),
        raw: Some(tweet.to_string()),
        synced_at: Some(now_ms()),
    }
}

// ── Helpers ────────────────────────────────────────────────────────────

/// Build a user lookup map from the `includes.users` expansion in Twitter API response.
/// Returns Map<user_id, (username, name)>.
fn build_user_map(response: &serde_json::Value) -> HashMap<String, (String, String)> {
    let mut map = HashMap::new();
    if let Some(users) = response["includes"]["users"].as_array() {
        for u in users {
            let id = u["id"].as_str().unwrap_or("").to_string();
            let username = u["username"].as_str().unwrap_or("").to_string();
            let name = u["name"].as_str().unwrap_or("").to_string();
            if !id.is_empty() {
                map.insert(id, (username, name));
            }
        }
    }
    map
}

/// Get the authenticated user's ID and username.
async fn get_twitter_user(token: &str) -> Result<(String, String), CoreError> {
    let me = twitter::get_me(token).await?;
    let user_id = me["data"]["id"]
        .as_str()
        .ok_or_else(|| CoreError::Auth("Twitter me.data.id missing".into()))?
        .to_string();
    let username = me["data"]["username"]
        .as_str()
        .ok_or_else(|| CoreError::Auth("Twitter me.data.username missing".into()))?
        .to_string();
    Ok((user_id, username))
}
