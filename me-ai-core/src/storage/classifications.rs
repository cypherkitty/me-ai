//! Email classifications store (Rexie). CRUD and filters.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{key_range_only, store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ClassificationRow {
    #[serde(rename = "emailId")]
    #[wasm_bindgen(js_name = "emailId")]
    pub email_id: Option<String>,
    pub action: Option<String>,
    pub category: Option<String>,
    pub reason: Option<String>,
    pub summary: Option<String>,
    pub tags: Option<String>,
    pub subject: Option<String>,
    #[serde(rename = "from")]
    #[wasm_bindgen(js_name = "from")]
    pub from: Option<String>,
    pub date: Option<i64>,
    #[serde(rename = "scannedAt")]
    #[wasm_bindgen(js_name = "scannedAt")]
    pub scanned_at: Option<i64>,
    pub status: Option<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct ClassificationDoc {
    #[serde(rename = "emailId")]
    email_id: String,
    action: Option<String>,
    category: Option<String>,
    reason: Option<String>,
    summary: Option<String>,
    tags: Option<String>,
    subject: Option<String>,
    #[serde(rename = "from")]
    from: Option<String>,
    date: Option<i64>,
    #[serde(rename = "scannedAt")]
    scanned_at: Option<i64>,
    status: Option<String>,
}

/// Get all classifications, optionally filtered by action. Sorted by date desc in Rust.
pub async fn get_classifications(
    db: DbRef<'_>,
    action_filter: Option<&str>,
    limit: Option<u32>,
) -> Result<Vec<ClassificationRow>, CoreError> {
    let mut rows: Vec<ClassificationRow> = if let Some(action) = action_filter {
        let range = key_range_only(action)?;
        db.index_get_all(
            store::EMAIL_CLASSIFICATIONS,
            "action",
            Some(range),
            limit.or(Some(5000)),
        )
        .await?
    } else {
        db.store_get_all(store::EMAIL_CLASSIFICATIONS, None, limit.or(Some(5000)))
            .await?
    };
    rows.sort_by(|a, b| b.date.unwrap_or(i64::MIN).cmp(&a.date.unwrap_or(i64::MIN)));
    Ok(rows)
}

/// Get one classification by emailId.
#[allow(dead_code)]
pub async fn get_classification_by_email_id(
    db: DbRef<'_>,
    email_id: &str,
) -> Result<Option<ClassificationRow>, CoreError> {
    db.store_get(store::EMAIL_CLASSIFICATIONS, email_id).await
}

/// Update status for one classification.
pub async fn update_classification_status(
    db: DbRef<'_>,
    email_id: &str,
    status: &str,
) -> Result<(), CoreError> {
    if let Some(mut row) = db.store_get::<ClassificationRow>(store::EMAIL_CLASSIFICATIONS, email_id).await? {
        row.status = Some(status.to_string());
        db.store_put(store::EMAIL_CLASSIFICATIONS, &row, Some(email_id)).await?;
    }
    Ok(())
}

/// Delete one classification by emailId.
pub async fn delete_classification(db: DbRef<'_>, email_id: &str) -> Result<(), CoreError> {
    db.store_delete(store::EMAIL_CLASSIFICATIONS, email_id).await
}

/// Clear all classifications.
pub async fn clear_classifications(db: DbRef<'_>) -> Result<(), CoreError> {
    db.store_clear(store::EMAIL_CLASSIFICATIONS).await
}

/// Delete all classifications with the given action.
pub async fn delete_classifications_by_action(db: DbRef<'_>, action: &str) -> Result<(), CoreError> {
    let range = key_range_only(action)?;
    let rows: Vec<ClassificationRow> = db
        .index_get_all(
            store::EMAIL_CLASSIFICATIONS,
            "action",
            Some(range),
            Some(50000),
        )
        .await?;
    for row in rows {
        if let Some(ref email_id) = row.email_id {
            db.store_delete(store::EMAIL_CLASSIFICATIONS, email_id).await?;
        }
    }
    Ok(())
}

/// Insert or replace one classification (for triage scan results).
pub async fn put_classification(
    db: DbRef<'_>,
    email_id: &str,
    action: Option<&str>,
    category: Option<&str>,
    reason: Option<&str>,
    summary: Option<&str>,
    tags: Option<&str>,
    subject: Option<&str>,
    from: Option<&str>,
    date: Option<i64>,
    scanned_at: Option<i64>,
    status: Option<&str>,
) -> Result<(), CoreError> {
    let doc = ClassificationDoc {
        email_id: email_id.to_string(),
        action: action.map(String::from),
        category: category.map(String::from),
        reason: reason.map(String::from),
        summary: summary.map(String::from),
        tags: tags.map(String::from),
        subject: subject.map(String::from),
        from: from.map(String::from),
        date,
        scanned_at,
        status: status.map(String::from),
    };
    db.store_put(store::EMAIL_CLASSIFICATIONS, &doc, Some(email_id)).await
}
