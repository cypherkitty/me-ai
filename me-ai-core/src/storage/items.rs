//! Items and contacts: counts, date range. Uses Rexie stores.

use serde::{Deserialize, Serialize};

use crate::db::{key_range_only, store, RexieDb};
use crate::error::CoreError;
use crate::storage::sync::{GetStoredEmailsResult, ItemRow, StoredItem};

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

/// Fetch stored Gmail emails with optional text search filtering.
pub async fn get_stored_emails_filtered(
    db: &RexieDb,
    query: Option<&str>,
    limit: u32,
    offset: u32,
) -> Result<GetStoredEmailsResult, CoreError> {
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

    let page: Vec<StoredItem> = filtered
        .into_iter()
        .skip(offset as usize)
        .take(limit as usize)
        .map(StoredItem::from_item_row)
        .collect();

    Ok(GetStoredEmailsResult { items: page, total })
}
