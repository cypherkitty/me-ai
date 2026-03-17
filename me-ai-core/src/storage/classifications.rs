//! Email classifications store (Rexie). CRUD and filters.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{key_range_only, store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ClassificationRow {
    #[serde(rename = "emailId", default)]
    #[wasm_bindgen(js_name = "emailId")]
    pub email_id: String,
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
pub struct ClassificationDoc {
    #[serde(rename = "emailId")]
    pub email_id: String,
    pub action: Option<String>,
    pub category: Option<String>,
    pub reason: Option<String>,
    pub summary: Option<String>,
    pub tags: Option<String>,
    pub subject: Option<String>,
    #[serde(rename = "from")]
    pub from: Option<String>,
    pub date: Option<i64>,
    #[serde(rename = "scannedAt")]
    pub scanned_at: Option<i64>,
    pub status: Option<String>,
}

#[wasm_bindgen(typescript_custom_section)]
const TS_CLASSIFICATION_DOC: &str = r#"
export interface ClassificationDoc {
  emailId: string;
  action?: string | null;
  category?: string | null;
  reason?: string | null;
  summary?: string | null;
  tags?: string | null;
  subject?: string | null;
  from?: string | null;
  date?: number | null;
  scannedAt?: number | null;
  status?: string | null;
}
"#;

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
        if !row.email_id.is_empty() {
            db.store_delete(store::EMAIL_CLASSIFICATIONS, &row.email_id).await?;
        }
    }
    Ok(())
}

/// Count classifications with status "pending" or "escalated".
pub async fn count_pending_classifications(db: DbRef<'_>) -> Result<i64, CoreError> {
    let all: Vec<ClassificationRow> = db.store_get_all(store::EMAIL_CLASSIFICATIONS, None, Some(50000)).await?;
    let count = all.iter().filter(|r| {
        r.status.as_deref() == Some("pending") || r.status.as_deref() == Some("escalated")
    }).count();
    Ok(count as i64)
}

/// Insert or replace one classification (for triage scan results).
pub async fn put_classification(
    db: DbRef<'_>,
    doc: ClassificationDoc,
) -> Result<(), CoreError> {
    let key = doc.email_id.clone();
    db.store_put(store::EMAIL_CLASSIFICATIONS, &doc, Some(&key)).await
}
