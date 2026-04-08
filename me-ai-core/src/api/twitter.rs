//! Twitter/X API v2 — wrapper using reqwest.
//! Matches the interface of me-ai-web/src/lib/twitter-api.ts.

use std::fmt::Write;

use super::ApiJson;
use crate::error::CoreError;

const BASE: &str = "https://api.twitter.com/2";

async fn twitter_get(token: &str, path: &str) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}{path}");
    let resp = reqwest::Client::new()
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
        .send()
        .await
        .map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let body: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = body["detail"]
            .as_str()
            .or_else(|| body["title"].as_str())
            .unwrap_or(&format!("Twitter API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

async fn twitter_post(
    token: &str,
    path: &str,
    body: Option<ApiJson>,
) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}{path}");
    let mut req = reqwest::Client::new()
        .post(&url)
        .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
        .header(reqwest::header::CONTENT_TYPE, "application/json");
    if let Some(b) = body {
        req = req.json(&b);
    }
    let resp = req.send().await.map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let err: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = err["detail"]
            .as_str()
            .or_else(|| err["title"].as_str())
            .unwrap_or(&format!("Twitter API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

async fn twitter_delete(token: &str, path: &str) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}{path}");
    let resp = reqwest::Client::new()
        .delete(&url)
        .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
        .send()
        .await
        .map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let err: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = err["detail"]
            .as_str()
            .or_else(|| err["title"].as_str())
            .unwrap_or(&format!("Twitter API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

pub async fn get_me(token: &str) -> Result<ApiJson, CoreError> {
    twitter_get(
        token,
        "/users/me?user.fields=id,name,username,profile_image_url,public_metrics",
    )
    .await
}

pub async fn get_user_timeline(
    token: &str,
    user_id: &str,
    max_results: u32,
    pagination_token: Option<&str>,
) -> Result<ApiJson, CoreError> {
    let max = max_results.min(100);
    let mut path = format!(
        "/users/{user_id}/tweets?max_results={max}&tweet.fields=created_at,author_id,public_metrics,referenced_tweets,conversation_id,text&user.fields=username,name&expansions=author_id"
    );
    if let Some(pt) = pagination_token {
        let _ = write!(path, "&pagination_token={pt}");
    }
    twitter_get(token, &path).await
}

pub async fn get_user_mentions(
    token: &str,
    user_id: &str,
    max_results: u32,
    pagination_token: Option<&str>,
) -> Result<ApiJson, CoreError> {
    let max = max_results.min(100);
    let mut path = format!(
        "/users/{user_id}/mentions?max_results={max}&tweet.fields=created_at,author_id,public_metrics,text&user.fields=username,name&expansions=author_id"
    );
    if let Some(pt) = pagination_token {
        let _ = write!(path, "&pagination_token={pt}");
    }
    twitter_get(token, &path).await
}

pub async fn search_recent_tweets(
    token: &str,
    query: &str,
    max_results: u32,
) -> Result<ApiJson, CoreError> {
    let max = max_results.min(100);
    let url = format!("{BASE}/tweets/search/recent");
    let resp = reqwest::Client::new()
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
        .query(&[
            ("query", query),
            ("max_results", &max.to_string()),
            ("tweet.fields", "created_at,author_id,public_metrics,text"),
            ("user.fields", "username,name"),
            ("expansions", "author_id"),
        ])
        .send()
        .await
        .map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let err: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = err["detail"]
            .as_str()
            .unwrap_or(&format!("Twitter API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

pub async fn get_tweet(token: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_get(
        token,
        &format!(
            "/tweets/{tweet_id}?tweet.fields=created_at,author_id,public_metrics,referenced_tweets,text&user.fields=username,name&expansions=author_id"
        ),
    )
    .await
}

pub async fn like_tweet(token: &str, user_id: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_post(
        token,
        &format!("/users/{user_id}/likes"),
        Some(serde_json::json!({"tweet_id": tweet_id})),
    )
    .await
}

pub async fn unlike_tweet(token: &str, user_id: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_delete(token, &format!("/users/{user_id}/likes/{tweet_id}")).await
}

pub async fn retweet(token: &str, user_id: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_post(
        token,
        &format!("/users/{user_id}/retweets"),
        Some(serde_json::json!({"tweet_id": tweet_id})),
    )
    .await
}

pub async fn unretweet(token: &str, user_id: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_delete(token, &format!("/users/{user_id}/retweets/{tweet_id}")).await
}

pub async fn bookmark_tweet(token: &str, user_id: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_post(
        token,
        &format!("/users/{user_id}/bookmarks"),
        Some(serde_json::json!({"tweet_id": tweet_id})),
    )
    .await
}

pub async fn remove_bookmark(token: &str, user_id: &str, tweet_id: &str) -> Result<ApiJson, CoreError> {
    twitter_delete(token, &format!("/users/{user_id}/bookmarks/{tweet_id}")).await
}

pub async fn mute_user(
    token: &str,
    source_user_id: &str,
    target_user_id: &str,
) -> Result<ApiJson, CoreError> {
    twitter_post(
        token,
        &format!("/users/{source_user_id}/muting"),
        Some(serde_json::json!({"target_user_id": target_user_id})),
    )
    .await
}

pub async fn block_user(
    token: &str,
    source_user_id: &str,
    target_user_id: &str,
) -> Result<ApiJson, CoreError> {
    twitter_post(
        token,
        &format!("/users/{source_user_id}/blocking"),
        Some(serde_json::json!({"target_user_id": target_user_id})),
    )
    .await
}
