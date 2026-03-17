//! Items, syncState, contacts: CRUD and batch operations via Rexie.

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

use crate::db::{key_range_only, store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(typescript_custom_section)]
const SYNC_TYPES: &'static str = r#"
export interface StoredItem {
    id: string;
    sourceType: string;
    sourceId: string;
    threadKey: string;
    type: string;
    from: string;
    to: string;
    cc: string;
    subject: string;
    snippet: string;
    body: string;
    htmlBody: string | null;
    date: number | null;
    labels: string[];
    messageId: string;
    inReplyTo: string;
    references: string;
    raw: unknown;
    syncedAt: number | null;
}

export interface StoredItemRow extends Omit<StoredItem, 'labels' | 'raw'> {
    labels: string;
    raw: string;
}

export interface SyncState {
    sourceType: string;
    historyId: string;
    lastSyncAt: number | null;
    totalItems: number;
    oldestPageToken: string;
}

export interface SyncProgress {
    phase: string;
    message: string;
    current?: number;
    total?: number;
}

export interface GetStoredEmailsOptions {
    query?: string;
    limit?: number;
    offset?: number;
}

export interface GetStoredEmailsResult {
    items: StoredItem[];
    total: number;
}

export interface PendingActionsResult {
    categories: Record<string, unknown[]>;
    order: string[];
    total: number;
}

export interface MessageLike {
    subject?: string;
    date?: number | string | null;
    raw?: unknown;
}
"#;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SyncStateRow {
    #[serde(rename = "sourceType")]
    #[wasm_bindgen(js_name = "sourceType")]
    pub source_type: String,
    #[serde(rename = "historyId", default)]
    #[wasm_bindgen(js_name = "historyId")]
    pub history_id: String,
    #[serde(rename = "lastSyncAt")]
    #[wasm_bindgen(js_name = "lastSyncAt")]
    pub last_sync_at: Option<i64>,
    #[serde(rename = "totalItems", default)]
    #[wasm_bindgen(js_name = "totalItems")]
    pub total_items: i64,
    #[serde(rename = "oldestPageToken", default)]
    #[wasm_bindgen(js_name = "oldestPageToken")]
    pub oldest_page_token: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ContactRow {
    pub email: String,
    #[serde(default)]
    pub name: String,
    #[serde(rename = "firstSeen", default)]
    #[wasm_bindgen(js_name = "firstSeen")]
    pub first_seen: i64,
    #[serde(rename = "lastSeen", default)]
    #[wasm_bindgen(js_name = "lastSeen")]
    pub last_seen: i64,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ItemRow {
    pub id: String,
    #[serde(rename = "sourceType")]
    #[wasm_bindgen(js_name = "sourceType")]
    pub source_type: String,
    #[serde(rename = "sourceId", default)]
    #[wasm_bindgen(js_name = "sourceId")]
    pub source_id: String,
    #[serde(rename = "threadKey", default)]
    #[wasm_bindgen(js_name = "threadKey")]
    pub thread_key: String,
    #[serde(rename = "type", default)]
    #[wasm_bindgen(js_name = "type")]
    pub r#type: String,
    #[serde(rename = "from", default)]
    #[wasm_bindgen(js_name = "from")]
    pub from: String,
    #[serde(rename = "to", default)]
    #[wasm_bindgen(js_name = "to")]
    pub to: String,
    #[serde(default)]
    pub cc: String,
    #[serde(default)]
    pub subject: String,
    #[serde(default)]
    pub snippet: String,
    #[serde(default)]
    pub body: String,
    #[serde(rename = "htmlBody")]
    #[wasm_bindgen(js_name = "htmlBody")]
    pub html_body: Option<String>,
    pub date: Option<i64>,
    #[serde(default)]
    pub labels: String,
    #[serde(rename = "messageId", default)]
    #[wasm_bindgen(js_name = "messageId")]
    pub message_id: String,
    #[serde(rename = "inReplyTo", default)]
    #[wasm_bindgen(js_name = "inReplyTo")]
    pub in_reply_to: String,
    #[serde(default)]
    pub references: String,
    pub raw: Option<String>,
    #[serde(rename = "syncedAt")]
    #[wasm_bindgen(js_name = "syncedAt")]
    pub synced_at: Option<i64>,
}

#[derive(Clone, Debug, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
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

#[derive(Clone, Debug, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
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


/// Input struct for batch insert from JS — mirrors ItemRow fields with camelCase serde renames.
#[derive(Clone, Debug, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct ItemInput {
    pub id: String,
    pub source_type: String,
    #[serde(default)]
    pub source_id: String,
    #[serde(default)]
    pub thread_key: String,
    #[serde(rename = "type", default)]
    pub r#type: String,
    #[serde(default)]
    pub from: String,
    #[serde(default)]
    pub to: String,
    #[serde(default)]
    pub cc: String,
    #[serde(default)]
    pub subject: String,
    #[serde(default)]
    pub snippet: String,
    #[serde(default)]
    pub body: String,
    pub html_body: Option<String>,
    pub date: Option<i64>,
    #[serde(default)]
    pub labels: String,
    #[serde(default)]
    pub message_id: String,
    #[serde(default)]
    pub in_reply_to: String,
    #[serde(default)]
    pub references: String,
    pub raw: Option<String>,
    pub synced_at: Option<i64>,
}

impl From<ItemInput> for ItemRow {
    fn from(r: ItemInput) -> Self {
        Self {
            id: r.id,
            source_type: r.source_type,
            source_id: r.source_id,
            thread_key: r.thread_key,
            r#type: r.r#type,
            from: r.from,
            to: r.to,
            cc: r.cc,
            subject: r.subject,
            snippet: r.snippet,
            body: r.body,
            html_body: r.html_body,
            date: r.date,
            labels: r.labels,
            message_id: r.message_id,
            in_reply_to: r.in_reply_to,
            references: r.references,
            raw: r.raw,
            synced_at: r.synced_at,
        }
    }
}

pub async fn insert_items_batch(db: DbRef<'_>, rows: Vec<ItemInput>) -> Result<(), CoreError> {
    let docs: Vec<ItemRow> = rows.into_iter().map(ItemRow::from).collect();
    db.store_put_all(store::ITEMS, &docs).await
}

pub async fn insert_sync_state_batch(db: DbRef<'_>, rows: Vec<SyncStateInput>) -> Result<(), CoreError> {
    let arr = rows;
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

pub async fn insert_contacts_batch(db: DbRef<'_>, rows: Vec<ContactInput>) -> Result<(), CoreError> {
    let arr = rows;
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

pub async fn delete_items_by_ids(db: DbRef<'_>, ids: Vec<String>) -> Result<(), CoreError> {
    let arr = ids;
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
            name: row.name,
            first_seen: row.first_seen,
            last_seen: row.last_seen,
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
