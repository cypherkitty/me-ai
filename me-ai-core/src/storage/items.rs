//! Items and contacts: counts, date range. Uses Rexie stores.

use serde::{Deserialize, Serialize};

use wasm_bindgen::JsValue;

use crate::db::{key_range_only, store, RexieDb};
use crate::error::CoreError;
use crate::storage::sync::ItemRow;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct DateRow {
    pub date: Option<i64>,
}

/// Count of all items (any source).
pub async fn get_items_count(db: &RexieDb) -> Result<i64, CoreError> {
    let n = db.store_count(store::ITEMS, None).await?;
    Ok(n as i64)
}

/// Count of items with sourceType = 'gmail'.
pub async fn get_items_count_gmail(db: &RexieDb) -> Result<i64, CoreError> {
    let range = key_range_only("gmail")?;
    let n = db.index_count(store::ITEMS, "sourceType", Some(range)).await?;
    Ok(n as i64)
}

/// Count of contacts.
pub async fn get_contacts_count(db: &RexieDb) -> Result<i64, CoreError> {
    let n = db.store_count(store::CONTACTS, None).await?;
    Ok(n as i64)
}

/// Count of email classifications.
pub async fn get_email_classifications_count(db: &RexieDb) -> Result<i64, CoreError> {
    let n = db.store_count(store::EMAIL_CLASSIFICATIONS, None).await?;
    Ok(n as i64)
}

#[derive(Deserialize)]
struct ItemDate {
    date: Option<i64>,
}

/// Oldest date among gmail items.
pub async fn get_items_date_min(db: &RexieDb) -> Result<Option<i64>, CoreError> {
    let range = key_range_only("gmail")?;
    let items: Vec<ItemDate> = db
        .index_get_all(store::ITEMS, "sourceType", Some(range), Some(5000))
        .await?;
    Ok(items.into_iter().filter_map(|i| i.date).min())
}

/// Newest date among gmail items.
pub async fn get_items_date_max(db: &RexieDb) -> Result<Option<i64>, CoreError> {
    let range = key_range_only("gmail")?;
    let items: Vec<ItemDate> = db
        .index_get_all(store::ITEMS, "sourceType", Some(range), Some(5000))
        .await?;
    Ok(items.into_iter().filter_map(|i| i.date).max())
}

/// Normalize an `ItemRow` into a JS-friendly value: parse `labels` from JSON string
/// to array and `raw` from JSON string to object.
fn normalise_item(row: &ItemRow) -> serde_json::Value {
    let labels: serde_json::Value =
        serde_json::from_str(&row.labels).unwrap_or(serde_json::Value::Array(vec![]));
    let raw: serde_json::Value = row
        .raw
        .as_deref()
        .and_then(|s| serde_json::from_str(s).ok())
        .unwrap_or(serde_json::Value::Null);
    serde_json::json!({
        "id": row.id,
        "sourceType": row.source_type,
        "sourceId": row.source_id,
        "threadKey": row.thread_key,
        "type": row.r#type,
        "from": row.from,
        "to": row.to,
        "cc": row.cc,
        "subject": row.subject,
        "snippet": row.snippet,
        "body": row.body,
        "htmlBody": row.html_body,
        "date": row.date,
        "syncedAt": row.synced_at,
        "labels": labels,
        "raw": raw,
        "messageId": row.message_id,
        "inReplyTo": row.in_reply_to,
        "references": row.references,
    })
}

/// Fetch stored Gmail emails with optional text search filtering.
/// Returns `{ items: [...], total: number }` as a `JsValue`.
pub async fn get_stored_emails_filtered(
    db: &RexieDb,
    query: Option<&str>,
    limit: u32,
    offset: u32,
) -> Result<JsValue, CoreError> {
    let fetch_size = if query.is_some() { 2000 } else { limit + offset };
    let range = key_range_only("gmail")?;
    let mut rows: Vec<ItemRow> = db
        .index_get_all(store::ITEMS, "sourceType", Some(range.clone()), Some(fetch_size))
        .await?;
    rows.sort_by(|a, b| b.date.unwrap_or(0).cmp(&a.date.unwrap_or(0)));

    let filtered: Vec<&ItemRow> = if let Some(q) = query {
        let q = q.to_lowercase();
        rows.iter()
            .filter(|r| {
                r.subject.to_lowercase().contains(&q)
                    || r.from.to_lowercase().contains(&q)
                    || r.to.to_lowercase().contains(&q)
                    || r.snippet.to_lowercase().contains(&q)
            })
            .collect()
    } else {
        rows.iter().collect()
    };

    let total = if query.is_some() {
        filtered.len() as i64
    } else {
        let range2 = key_range_only("gmail")?;
        db.index_count(store::ITEMS, "sourceType", Some(range2)).await? as i64
    };

    let page: Vec<serde_json::Value> = filtered
        .into_iter()
        .skip(offset as usize)
        .take(limit as usize)
        .map(normalise_item)
        .collect();

    let out = serde_json::json!({ "items": page, "total": total });
    serde_wasm_bindgen::to_value(&out).map_err(|e| CoreError::Serialize(e.to_string()))
}
