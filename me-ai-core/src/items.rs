//! Items and contacts: counts, date range. Uses Rexie stores.

use serde::{Deserialize, Serialize};

use crate::db::{key_range_only, DbRef};
use crate::error::CoreError;
use crate::schema::store;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DateRow {
    pub date: Option<i64>,
}

/// Count of all items (any source).
pub async fn get_items_count(db: DbRef<'_>) -> Result<i64, CoreError> {
    let n = db.store_count(store::ITEMS, None).await?;
    Ok(n as i64)
}

/// Count of items with sourceType = 'gmail'.
pub async fn get_items_count_gmail(db: DbRef<'_>) -> Result<i64, CoreError> {
    let range = key_range_only("gmail")?;
    let n = db.index_count(store::ITEMS, "sourceType", Some(range)).await?;
    Ok(n as i64)
}

/// Count of contacts.
pub async fn get_contacts_count(db: DbRef<'_>) -> Result<i64, CoreError> {
    let n = db.store_count(store::CONTACTS, None).await?;
    Ok(n as i64)
}

/// Count of email classifications.
pub async fn get_email_classifications_count(db: DbRef<'_>) -> Result<i64, CoreError> {
    let n = db.store_count(store::EMAIL_CLASSIFICATIONS, None).await?;
    Ok(n as i64)
}

#[derive(Deserialize)]
struct ItemDate {
    date: Option<i64>,
}

/// Oldest date among gmail items.
pub async fn get_items_date_min(db: DbRef<'_>) -> Result<Option<i64>, CoreError> {
    let range = key_range_only("gmail")?;
    let items: Vec<ItemDate> = db
        .index_get_all(store::ITEMS, "sourceType", Some(range), Some(5000))
        .await?;
    Ok(items.into_iter().filter_map(|i| i.date).min())
}

/// Newest date among gmail items.
pub async fn get_items_date_max(db: DbRef<'_>) -> Result<Option<i64>, CoreError> {
    let range = key_range_only("gmail")?;
    let items: Vec<ItemDate> = db
        .index_get_all(store::ITEMS, "sourceType", Some(range), Some(5000))
        .await?;
    Ok(items.into_iter().filter_map(|i| i.date).max())
}
