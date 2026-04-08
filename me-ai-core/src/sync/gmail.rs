//! Gmail sync orchestration.
//!
//! Mirrors `me-ai-web/src/lib/store/gmail-sync.ts`:
//! - `sync_gmail`        — full or incremental sync
//! - `sync_gmail_more`   — fetch older messages beyond initial sync
//! - `clear_gmail_data`  — wipe all local Gmail data
//! - `get_gmail_sync_status` — return sync status

use std::collections::HashMap;

use js_sys::Function;
use wasm_bindgen::JsValue;

use crate::api::gmail;
use crate::db::RexieDb;
use crate::error::CoreError;
use crate::storage::sync::{
    self, ItemInput, SyncStateRow,
};

use super::{
    check_aborted, emit_progress, now_ms,
    SyncProgress, SyncResult, SyncStatus,
};

const SOURCE_TYPE: &str = "gmail";
const BATCH_SIZE: usize = 8;
const PAGE_SIZE: u32 = 100;

// ── Public API ─────────────────────────────────────────────────────────

/// Full or incremental Gmail sync.
///
/// First call: fetches up to `limit` messages.
/// Subsequent calls: uses History API for incremental sync.
/// If history has expired (404), falls back to a full re-sync.
pub async fn sync_gmail(
    db: &RexieDb,
    token: &str,
    limit: u32,
    on_progress: &Option<Function>,
    signal: &Option<JsValue>,
) -> Result<SyncResult, CoreError> {
    let state = sync::get_sync_state(db, SOURCE_TYPE).await?;

    if let Some(ref st) = state {
        if !st.history_id.is_empty() {
            match incremental_sync(db, token, st, on_progress, signal).await {
                Ok(result) => return Ok(result),
                Err(e) => {
                    let is_history_expired = is_gmail_history_expired(&e);
                    if is_history_expired {
                        emit_progress(
                            on_progress,
                            &SyncProgress::new("info", "History expired, performing full re-sync..."),
                        );
                        sync::delete_sync_state(db, SOURCE_TYPE).await?;
                        // Fall through to full sync
                    } else {
                        return Err(e);
                    }
                }
            }
        }
    }

    let effective_limit = if limit == 0 { u32::MAX } else { limit };
    full_sync(db, token, effective_limit, on_progress, signal).await
}

/// Continue downloading older messages beyond the initial sync.
pub async fn sync_gmail_more(
    db: &RexieDb,
    token: &str,
    limit: u32,
    on_progress: &Option<Function>,
    signal: &Option<JsValue>,
) -> Result<SyncResult, CoreError> {
    let state = sync::get_sync_state(db, SOURCE_TYPE).await?;

    match state {
        Some(ref st) if !st.oldest_page_token.is_empty() => {
            let effective_limit = if limit == 0 { u32::MAX } else { limit };
            continue_fetch(db, token, st, effective_limit, on_progress, signal).await
        }
        _ => {
            emit_progress(on_progress, &SyncProgress::done("All messages already synced"));
            Ok(SyncResult { added: 0, deleted: None, errors: 0 })
        }
    }
}

/// Clear all local Gmail data (items + sync state + contacts).
pub async fn clear_gmail_data(db: &RexieDb) -> Result<(), CoreError> {
    sync::delete_items_by_source(db, SOURCE_TYPE).await?;
    sync::delete_sync_state(db, SOURCE_TYPE).await?;
    sync::clear_contacts(db).await?;
    Ok(())
}

/// Get current Gmail sync status.
pub async fn get_gmail_sync_status(db: &RexieDb) -> Result<SyncStatus, CoreError> {
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
            history_id: Some(st.history_id),
        }),
    }
}

// ── Full sync (initial) ────────────────────────────────────────────────

async fn full_sync(
    db: &RexieDb,
    token: &str,
    limit: u32,
    on_progress: &Option<Function>,
    signal: &Option<JsValue>,
) -> Result<SyncResult, CoreError> {
    emit_progress(on_progress, &SyncProgress::new("counting", "Getting mailbox info..."));
    check_aborted(signal)?;

    let profile = gmail::get_profile(token).await?;
    let messages_total = profile["messagesTotal"].as_u64().unwrap_or(0) as u32;
    let history_id = profile["historyId"].as_str().unwrap_or("").to_string();

    let display_total = messages_total.min(limit);
    emit_progress(
        on_progress,
        &SyncProgress::with_counts("listing", "Listing messages...", 0, display_total),
    );

    // List message IDs up to `limit`
    let mut all_ids: Vec<String> = Vec::new();
    let mut page_token: Option<String> = None;
    let mut next_page_after_limit: Option<String> = None;

    while (all_ids.len() as u32) < limit {
        check_aborted(signal)?;
        let remaining = limit - all_ids.len() as u32;
        let page_size = PAGE_SIZE.min(remaining);

        let result = gmail::list_messages(token, page_size, page_token.as_deref(), None).await?;
        let messages = result["messages"].as_array();
        let ids: Vec<String> = messages
            .map(|arr| {
                arr.iter()
                    .filter_map(|m| m["id"].as_str().map(String::from))
                    .collect()
            })
            .unwrap_or_default();

        if ids.is_empty() {
            break;
        }

        all_ids.extend(ids);

        emit_progress(
            on_progress,
            &SyncProgress::with_counts(
                "listing",
                &format!("Listed {} messages...", all_ids.len()),
                all_ids.len() as u32,
                display_total,
            ),
        );

        page_token = result["nextPageToken"].as_str().map(String::from);
        if page_token.is_none() {
            break;
        }
    }

    next_page_after_limit = page_token;

    if all_ids.is_empty() {
        sync::upsert_sync_state(db, SOURCE_TYPE, &history_id, now_ms(), 0, "").await?;
        return Ok(SyncResult { added: 0, deleted: Some(0), errors: 0 });
    }

    let (added, errors) = batch_fetch_and_store(db, token, &all_ids, on_progress, signal).await?;
    let total_items = get_gmail_item_count(db).await?;

    sync::upsert_sync_state(
        db,
        SOURCE_TYPE,
        &history_id,
        now_ms(),
        total_items,
        next_page_after_limit.as_deref().unwrap_or(""),
    )
    .await?;

    emit_progress(
        on_progress,
        &SyncProgress::done_with_counts(&format!("Synced {} messages", added), added, added),
    );

    Ok(SyncResult { added, deleted: Some(0), errors })
}

// ── Continue fetch (sync more older messages) ──────────────────────────

async fn continue_fetch(
    db: &RexieDb,
    token: &str,
    state: &SyncStateRow,
    limit: u32,
    on_progress: &Option<Function>,
    signal: &Option<JsValue>,
) -> Result<SyncResult, CoreError> {
    emit_progress(
        on_progress,
        &SyncProgress::with_current("listing", "Loading more messages...", 0),
    );
    check_aborted(signal)?;

    let mut all_ids: Vec<String> = Vec::new();
    let mut page_token: Option<String> = if state.oldest_page_token.is_empty() {
        None
    } else {
        Some(state.oldest_page_token.clone())
    };
    let mut next_page_after_limit: Option<String> = None;

    while (all_ids.len() as u32) < limit {
        check_aborted(signal)?;
        let remaining = limit - all_ids.len() as u32;
        let page_size = PAGE_SIZE.min(remaining);

        let result = gmail::list_messages(token, page_size, page_token.as_deref(), None).await?;
        let messages = result["messages"].as_array();
        let ids: Vec<String> = messages
            .map(|arr| {
                arr.iter()
                    .filter_map(|m| m["id"].as_str().map(String::from))
                    .collect()
            })
            .unwrap_or_default();

        if ids.is_empty() {
            break;
        }

        all_ids.extend(ids);

        emit_progress(
            on_progress,
            &SyncProgress::with_current(
                "listing",
                &format!("Listed {} more messages...", all_ids.len()),
                all_ids.len() as u32,
            ),
        );

        page_token = result["nextPageToken"].as_str().map(String::from);
        if page_token.is_none() {
            break;
        }
    }

    next_page_after_limit = page_token;

    if all_ids.is_empty() {
        sync::upsert_sync_state(
            db,
            SOURCE_TYPE,
            &state.history_id,
            now_ms(),
            state.total_items,
            "",
        )
        .await?;
        emit_progress(on_progress, &SyncProgress::done("All messages synced"));
        return Ok(SyncResult { added: 0, deleted: None, errors: 0 });
    }

    let (added, errors) = batch_fetch_and_store(db, token, &all_ids, on_progress, signal).await?;
    let total_items = get_gmail_item_count(db).await?;

    sync::upsert_sync_state(
        db,
        SOURCE_TYPE,
        &state.history_id,
        now_ms(),
        total_items,
        next_page_after_limit.as_deref().unwrap_or(""),
    )
    .await?;

    let done_msg = if next_page_after_limit.is_some() {
        format!("Downloaded {} more (more available)", added)
    } else {
        format!("Downloaded {} more (all synced)", added)
    };
    emit_progress(
        on_progress,
        &SyncProgress::done_with_counts(&done_msg, total_items as u32, total_items as u32),
    );

    Ok(SyncResult { added, deleted: None, errors })
}

// ── Incremental sync ───────────────────────────────────────────────────

async fn incremental_sync(
    db: &RexieDb,
    token: &str,
    state: &SyncStateRow,
    on_progress: &Option<Function>,
    signal: &Option<JsValue>,
) -> Result<SyncResult, CoreError> {
    emit_progress(on_progress, &SyncProgress::new("syncing", "Checking for changes..."));
    check_aborted(signal)?;

    let mut added: u32 = 0;
    let mut deleted: u32 = 0;
    let mut errors: u32 = 0;
    let mut next_page_token: Option<String> = None;
    let mut new_history_id = state.history_id.clone();

    loop {
        check_aborted(signal)?;

        let history = gmail::list_history(
            token,
            &state.history_id,
            next_page_token.as_deref(),
            500,
        )
        .await?;

        if let Some(hid) = history["historyId"].as_str() {
            new_history_id = hid.to_string();
        }

        next_page_token = history["nextPageToken"].as_str().map(String::from);

        if let Some(records) = history["history"].as_array() {
            for record in records {
                // Handle added messages
                if let Some(messages_added) = record["messagesAdded"].as_array() {
                    let new_ids: Vec<String> = messages_added
                        .iter()
                        .filter_map(|m| m["message"]["id"].as_str().map(String::from))
                        .filter(|id| !id.is_empty())
                        .collect();

                    // Deduplicate
                    let unique_ids: Vec<String> = {
                        let mut seen = std::collections::HashSet::new();
                        new_ids.into_iter().filter(|id| seen.insert(id.clone())).collect()
                    };

                    if !unique_ids.is_empty() {
                        let mut items: Vec<ItemInput> = Vec::new();
                        for id in &unique_ids {
                            match gmail::get_message(token, id, "full").await {
                                Ok(msg) => {
                                    items.push(normalize_gmail_message(&msg));
                                }
                                Err(_) => {
                                    errors += 1;
                                }
                            }
                        }

                        if !items.is_empty() {
                            let batch_count = items.len() as u32;
                            upsert_contacts_from_items(db, &items).await?;
                            sync::insert_items_batch(db, items).await?;
                            added += batch_count;
                        }
                    }
                }

                // Handle deleted messages
                if let Some(messages_deleted) = record["messagesDeleted"].as_array() {
                    let deleted_ids: Vec<String> = messages_deleted
                        .iter()
                        .filter_map(|m| m["message"]["id"].as_str())
                        .filter(|id| !id.is_empty())
                        .map(|id| make_item_id(id))
                        .collect();

                    if !deleted_ids.is_empty() {
                        sync::delete_items_by_ids(db, deleted_ids.clone()).await?;
                        deleted += deleted_ids.len() as u32;
                    }
                }
            }
        }

        emit_progress(
            on_progress,
            &SyncProgress::with_current(
                "syncing",
                &format!("Changes: +{} -{}", added, deleted),
                added + deleted,
            ),
        );

        if next_page_token.is_none() {
            break;
        }
    }

    let total_items = get_gmail_item_count(db).await?;

    sync::upsert_sync_state(
        db,
        SOURCE_TYPE,
        &new_history_id,
        now_ms(),
        total_items,
        &state.oldest_page_token,
    )
    .await?;

    let done_msg = if added == 0 && deleted == 0 {
        "Already up to date".to_string()
    } else {
        format!("Synced: +{} -{}", added, deleted)
    };
    emit_progress(
        on_progress,
        &SyncProgress::done_with_counts(&done_msg, total_items as u32, total_items as u32),
    );

    Ok(SyncResult { added, deleted: Some(deleted), errors })
}

// ── Shared: batch fetch and store ──────────────────────────────────────

async fn batch_fetch_and_store(
    db: &RexieDb,
    token: &str,
    ids: &[String],
    on_progress: &Option<Function>,
    signal: &Option<JsValue>,
) -> Result<(u32, u32), CoreError> {
    let total = ids.len() as u32;
    emit_progress(
        on_progress,
        &SyncProgress::with_counts("downloading", "Downloading messages...", 0, total),
    );

    let mut added: u32 = 0;
    let mut errors: u32 = 0;

    for chunk in ids.chunks(BATCH_SIZE) {
        check_aborted(signal)?;

        let mut items: Vec<ItemInput> = Vec::new();
        for id in chunk {
            match gmail::get_message(token, id, "full").await {
                Ok(msg) => {
                    items.push(normalize_gmail_message(&msg));
                }
                Err(_) => {
                    errors += 1;
                }
            }
        }

        let batch_count = items.len() as u32;
        if !items.is_empty() {
            upsert_contacts_from_items(db, &items).await?;
            sync::insert_items_batch(db, items).await?;
        }

        added += batch_count;
        emit_progress(
            on_progress,
            &SyncProgress::with_counts(
                "downloading",
                &format!("Downloaded {} of {} messages", added, total),
                added,
                total,
            ),
        );
    }

    Ok((added, errors))
}

// ── Normalisation ──────────────────────────────────────────────────────

/// Transform a raw Gmail API message JSON into an ItemInput ready for storage.
fn normalize_gmail_message(msg: &serde_json::Value) -> ItemInput {
    let msg_json = msg.to_string();

    let gmail_id = msg["id"].as_str().unwrap_or("");
    let thread_id = msg["threadId"].as_str().unwrap_or("unknown");
    let snippet = msg["snippet"].as_str().unwrap_or("").to_string();
    let internal_date = msg["internalDate"].as_str().unwrap_or("");

    let label_ids: Vec<String> = msg["labelIds"]
        .as_array()
        .map(|arr| {
            arr.iter()
                .filter_map(|v| v.as_str().map(String::from))
                .collect()
        })
        .unwrap_or_default();

    let from = gmail::get_gmail_header(&msg_json, "From");
    let to = gmail::get_gmail_header(&msg_json, "To");
    let cc = gmail::get_gmail_header(&msg_json, "Cc");
    let subject_raw = gmail::get_gmail_header(&msg_json, "Subject");
    let subject = if subject_raw.is_empty() { "(no subject)".to_string() } else { subject_raw };
    let date_str = gmail::get_gmail_header(&msg_json, "Date");
    let message_id = gmail::get_gmail_header(&msg_json, "Message-ID");
    let in_reply_to = gmail::get_gmail_header(&msg_json, "In-Reply-To");
    let references = gmail::get_gmail_header(&msg_json, "References");

    // Parse date: prefer Date header, fall back to internalDate, then now.
    let date = parse_date(&date_str, internal_date);

    let body = gmail::parse_gmail_body(&msg_json);
    let html_body = gmail::parse_gmail_html_body(&msg_json);

    let labels_json = serde_json::to_string(&label_ids).unwrap_or_else(|_| "[]".to_string());

    ItemInput {
        id: make_item_id(gmail_id),
        source_type: SOURCE_TYPE.to_string(),
        source_id: gmail_id.to_string(),
        thread_key: format!("gmail:{}", thread_id),
        r#type: "email".to_string(),
        from,
        to,
        cc,
        subject,
        snippet,
        body,
        html_body,
        date: Some(date),
        labels: labels_json,
        message_id,
        in_reply_to,
        references,
        raw: Some(msg_json),
        synced_at: Some(now_ms()),
    }
}

/// Parse a date string (RFC 2822 style) into epoch millis. Falls back to internalDate, then now.
fn parse_date(date_str: &str, internal_date: &str) -> i64 {
    if !date_str.is_empty() {
        // Try parsing with js_sys::Date for maximum browser compatibility
        let d = js_sys::Date::new(&JsValue::from_str(date_str));
        let t = d.get_time();
        if t.is_finite() && t > 0.0 {
            return t as i64;
        }
    }
    if !internal_date.is_empty() {
        if let Ok(ms) = internal_date.parse::<i64>() {
            return ms;
        }
    }
    now_ms()
}

/// Build the composite item ID: `gmail:{sourceId}`
fn make_item_id(source_id: &str) -> String {
    format!("{}:{}", SOURCE_TYPE, source_id)
}

// ── Contact extraction ─────────────────────────────────────────────────

/// Extract contacts from email items and upsert them.
async fn upsert_contacts_from_items(db: &RexieDb, items: &[ItemInput]) -> Result<(), CoreError> {
    let mut contact_map: HashMap<String, (String, i64)> = HashMap::new();

    for item in items {
        let date = item.date.unwrap_or_else(now_ms);
        for field in [&item.from, &item.to, &item.cc] {
            if field.is_empty() {
                continue;
            }
            let addresses: Vec<&str> = field.split(',').map(|s| s.trim()).filter(|s| !s.is_empty()).collect();
            for addr in addresses {
                if let Some((email, name)) = parse_email_address(addr) {
                    contact_map.entry(email).or_insert((name, date));
                }
            }
        }
    }

    for (email, (name, date)) in &contact_map {
        let existing = sync::get_contact_by_email(db, email).await?;
        match existing {
            Some(row) => {
                let use_name = if row.name.is_empty() && !name.is_empty() {
                    name.as_str()
                } else {
                    &row.name
                };
                let last_seen = (*date).max(row.last_seen);
                sync::upsert_contact(db, email, use_name, row.first_seen, last_seen).await?;
            }
            None => {
                sync::upsert_contact(db, email, name, *date, *date).await?;
            }
        }
    }

    Ok(())
}

/// Parse an email address string like `"Name" <email@example.com>` or `email@example.com`.
fn parse_email_address(s: &str) -> Option<(String, String)> {
    if s.is_empty() {
        return None;
    }
    // Check for angle-bracket format: Name <email>
    if let Some(start) = s.find('<') {
        if let Some(end) = s.find('>') {
            let email = s[start + 1..end].trim().to_lowercase();
            let name = s[..start].replace('"', "").trim().to_string();
            if email.contains('@') {
                return Some((email, name));
            }
        }
    }
    // Plain email address
    let email = s.trim().to_lowercase();
    if email.contains('@') {
        return Some((email, String::new()));
    }
    None
}

// ── Helpers ────────────────────────────────────────────────────────────

/// Get the total item count for Gmail source.
async fn get_gmail_item_count(db: &RexieDb) -> Result<i64, CoreError> {
    sync::get_items_count_by_source(db, SOURCE_TYPE).await
}

/// Detect whether a Gmail API error means the history ID has expired.
fn is_gmail_history_expired(e: &CoreError) -> bool {
    let msg = e.to_string();
    msg.contains("404") || msg.contains("notFound") || msg.contains("Start history id")
}
