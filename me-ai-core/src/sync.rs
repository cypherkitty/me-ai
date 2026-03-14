//! Items, syncState, contacts: CRUD and batch operations via Rexie.

use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::from_value;

use crate::db::{key_range_only, DbRef};
use crate::error::CoreError;
use crate::schema::store;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SyncStateRow {
    #[serde(rename = "sourceType")]
    pub source_type: Option<String>,
    #[serde(rename = "historyId")]
    pub history_id: Option<String>,
    #[serde(rename = "lastSyncAt")]
    pub last_sync_at: Option<i64>,
    #[serde(rename = "totalItems")]
    pub total_items: Option<i64>,
    #[serde(rename = "oldestPageToken")]
    pub oldest_page_token: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ContactRow {
    pub email: Option<String>,
    pub name: Option<String>,
    #[serde(rename = "firstSeen")]
    pub first_seen: Option<i64>,
    #[serde(rename = "lastSeen")]
    pub last_seen: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ItemRow {
    pub id: String,
    #[serde(rename = "sourceType")]
    pub source_type: String,
    #[serde(rename = "sourceId")]
    pub source_id: Option<String>,
    #[serde(rename = "threadKey")]
    pub thread_key: Option<String>,
    #[serde(rename = "type")]
    pub r#type: Option<String>,
    #[serde(rename = "from")]
    pub from: Option<String>,
    #[serde(rename = "to")]
    pub to: Option<String>,
    pub cc: Option<String>,
    pub subject: Option<String>,
    pub snippet: Option<String>,
    pub body: Option<String>,
    #[serde(rename = "htmlBody")]
    pub html_body: Option<String>,
    pub date: Option<i64>,
    pub labels: Option<String>,
    #[serde(rename = "messageId")]
    pub message_id: Option<String>,
    #[serde(rename = "inReplyTo")]
    pub in_reply_to: Option<String>,
    #[serde(rename = "references")]
    pub references: Option<String>,
    pub raw: Option<String>,
    #[serde(rename = "syncedAt")]
    pub synced_at: Option<i64>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct SyncStateInput {
    #[serde(rename = "sourceType")]
    pub source_type: String,
    #[serde(rename = "historyId")]
    pub history_id: String,
    #[serde(rename = "lastSyncAt")]
    pub last_sync_at: i64,
    #[serde(rename = "totalItems")]
    pub total_items: i64,
    #[serde(rename = "oldestPageToken")]
    pub oldest_page_token: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct SyncStateDoc {
    #[serde(rename = "sourceType")]
    source_type: String,
    #[serde(rename = "historyId")]
    history_id: String,
    #[serde(rename = "lastSyncAt")]
    last_sync_at: i64,
    #[serde(rename = "totalItems")]
    total_items: i64,
    #[serde(rename = "oldestPageToken")]
    oldest_page_token: String,
}

#[derive(Clone, Debug, Deserialize)]
pub struct ContactInput {
    pub email: String,
    pub name: String,
    #[serde(rename = "firstSeen")]
    pub first_seen: i64,
    #[serde(rename = "lastSeen")]
    pub last_seen: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct ContactDoc {
    email: String,
    name: String,
    #[serde(rename = "firstSeen")]
    first_seen: i64,
    #[serde(rename = "lastSeen")]
    last_seen: i64,
}

pub async fn delete_sync_state(db: DbRef<'_>, source_type: &str) -> Result<(), CoreError> {
    db.store_delete(store::SYNC_STATE, source_type).await
}

pub async fn delete_items_by_source(db: DbRef<'_>, source_type: &str) -> Result<(), CoreError> {
    let range = key_range_only(source_type)?;
    let items: Vec<ItemRow> = db.index_get_all(store::ITEMS, "sourceType", Some(range), None).await?;
    for item in items {
        db.store_delete(store::ITEMS, &item.id).await?;
    }
    Ok(())
}

pub async fn clear_contacts(db: DbRef<'_>) -> Result<(), CoreError> {
    db.store_clear(store::CONTACTS).await
}

pub async fn clear_items_sync_contacts(db: DbRef<'_>) -> Result<(), CoreError> {
    db.store_clear(store::ITEMS).await?;
    db.store_clear(store::SYNC_STATE).await?;
    db.store_clear(store::CONTACTS).await?;
    Ok(())
}

pub async fn get_items_count_by_source(db: DbRef<'_>, source_type: &str) -> Result<i64, CoreError> {
    let range = key_range_only(source_type)?;
    let n = db.index_count(store::ITEMS, "sourceType", Some(range)).await?;
    Ok(n as i64)
}

pub async fn get_sync_state(db: DbRef<'_>, source_type: &str) -> Result<Option<SyncStateRow>, CoreError> {
    db.store_get::<SyncStateRow>(store::SYNC_STATE, source_type).await
}

pub async fn upsert_sync_state(
    db: DbRef<'_>,
    source_type: &str,
    history_id: &str,
    last_sync_at: i64,
    total_items: i64,
    oldest_page_token: &str,
) -> Result<(), CoreError> {
    let doc = SyncStateDoc {
        source_type: source_type.to_string(),
        history_id: history_id.to_string(),
        last_sync_at,
        total_items,
        oldest_page_token: oldest_page_token.to_string(),
    };
    db.store_put(store::SYNC_STATE, &doc, Some(source_type)).await
}

#[derive(Deserialize)]
#[allow(non_snake_case)]
struct JsItem {
    id: String,
    sourceType: String,
    sourceId: Option<String>,
    threadKey: Option<String>,
    r#type: Option<String>,
    from: Option<String>,
    to: Option<String>,
    cc: Option<String>,
    subject: Option<String>,
    snippet: Option<String>,
    body: Option<String>,
    htmlBody: Option<String>,
    date: Option<i64>,
    labels: Option<String>,
    messageId: Option<String>,
    inReplyTo: Option<String>,
    references: Option<String>,
    raw: Option<String>,
    syncedAt: Option<i64>,
}

pub async fn insert_items_batch(db: DbRef<'_>, rows: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<JsItem> = from_value(rows).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let docs: Vec<ItemRow> = arr
        .into_iter()
        .map(|r| ItemRow {
            id: r.id,
            source_type: r.sourceType,
            source_id: r.sourceId,
            thread_key: r.threadKey,
            r#type: r.r#type,
            from: r.from,
            to: r.to,
            cc: r.cc,
            subject: r.subject,
            snippet: r.snippet,
            body: r.body,
            html_body: r.htmlBody,
            date: r.date,
            labels: r.labels,
            message_id: r.messageId,
            in_reply_to: r.inReplyTo,
            references: r.references,
            raw: r.raw,
            synced_at: r.syncedAt,
        })
        .collect();
    db.store_put_all(store::ITEMS, &docs).await
}

pub async fn insert_sync_state_batch(db: DbRef<'_>, rows: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<SyncStateInput> = from_value(rows).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    for r in arr {
        let key = r.source_type.clone();
        let existing = db.store_get::<SyncStateRow>(store::SYNC_STATE, &key).await?;
        if existing.is_none() {
            let doc = SyncStateDoc {
                source_type: r.source_type,
                history_id: r.history_id,
                last_sync_at: r.last_sync_at,
                total_items: r.total_items,
                oldest_page_token: r.oldest_page_token,
            };
            db.store_put(store::SYNC_STATE, &doc, Some(&key)).await?;
        }
    }
    Ok(())
}

pub async fn insert_contacts_batch(db: DbRef<'_>, rows: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<ContactInput> = from_value(rows).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    for r in arr {
        let doc = ContactDoc {
            email: r.email.clone(),
            name: r.name,
            first_seen: r.first_seen,
            last_seen: r.last_seen,
        };
        let existing = db.store_get::<ContactRow>(store::CONTACTS, &r.email).await?;
        if existing.is_none() {
            db.store_put(store::CONTACTS, &doc, Some(&r.email)).await?;
        }
    }
    Ok(())
}

pub async fn delete_items_by_ids(db: DbRef<'_>, ids: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<String> = from_value(ids).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    for id in arr {
        db.store_delete(store::ITEMS, &id).await?;
    }
    Ok(())
}

pub async fn get_contact_by_email(db: DbRef<'_>, email: &str) -> Result<Option<ContactRow>, CoreError> {
    db.store_get(store::CONTACTS, email).await
}

pub async fn upsert_contact(db: DbRef<'_>, email: &str, name: &str, first_seen: i64, last_seen: i64) -> Result<(), CoreError> {
    let existing = get_contact_by_email(db, email).await?;
    if let Some(row) = existing {
        let mut updated = ContactDoc {
            email: email.to_string(),
            name: row.name.unwrap_or_default(),
            first_seen: row.first_seen.unwrap_or(0),
            last_seen: row.last_seen.unwrap_or(0),
        };
        if !name.is_empty() && updated.name.is_empty() {
            updated.name = name.to_string();
        }
        if last_seen > updated.last_seen {
            updated.last_seen = last_seen;
        }
        db.store_put(store::CONTACTS, &updated, Some(email)).await?;
    } else {
        let doc = ContactDoc {
            email: email.to_string(),
            name: name.to_string(),
            first_seen,
            last_seen,
        };
        db.store_put(store::CONTACTS, &doc, Some(email)).await?;
    }
    Ok(())
}

#[derive(Deserialize)]
struct ItemSourceId {
    #[serde(rename = "sourceId")]
    source_id: Option<String>,
    date: Option<i64>,
}

pub async fn get_item_by_id(db: DbRef<'_>, id: &str) -> Result<Option<ItemRow>, CoreError> {
    db.store_get(store::ITEMS, id).await
}

/// Get items for gmail source, sorted by date desc, with limit (for scan).
pub async fn get_items_gmail_by_date_desc(db: DbRef<'_>, limit: u32) -> Result<Vec<ItemRow>, CoreError> {
    let range = key_range_only("gmail")?;
    let mut rows: Vec<ItemRow> =
        db.index_get_all(store::ITEMS, "sourceType", Some(range), Some(limit)).await?;
    rows.sort_by(|a, b| b.date.unwrap_or(0).cmp(&a.date.unwrap_or(0)));
    Ok(rows)
}

/// Get items for a source type, sorted by date desc, with limit and offset (for UI pagination).
pub async fn get_items_by_source(
    db: DbRef<'_>,
    source_type: &str,
    limit: u32,
    offset: u32,
) -> Result<Vec<ItemRow>, CoreError> {
    let range = key_range_only(source_type)?;
    let fetch = limit.saturating_add(offset).min(5000);
    let mut rows: Vec<ItemRow> =
        db.index_get_all(store::ITEMS, "sourceType", Some(range), Some(fetch)).await?;
    rows.sort_by(|a, b| b.date.unwrap_or(0).cmp(&a.date.unwrap_or(0)));
    let start = offset as usize;
    let end = start.saturating_add(limit as usize).min(rows.len());
    Ok(rows.get(start..end).unwrap_or(&[]).to_vec())
}

pub async fn get_newest_source_id(db: DbRef<'_>, source_type: &str) -> Result<Option<String>, CoreError> {
    let range = key_range_only(source_type)?;
    let items: Vec<ItemSourceId> =
        db.index_get_all(store::ITEMS, "sourceType", Some(range), Some(1000)).await?;
    let best = items
        .into_iter()
        .filter_map(|i| i.date.map(|d| (i.source_id, d)))
        .max_by_key(|(_, d)| *d);
    Ok(best.and_then(|(sid, _)| sid))
}
