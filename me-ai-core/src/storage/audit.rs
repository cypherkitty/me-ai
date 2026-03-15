//! Audit log: log execution, sync after execution, list and clear. Uses Rexie.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use rexie::Direction;

use crate::db::{store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuditLogRow {
    pub id: Option<String>,
    #[serde(rename = "emailId")]
    #[wasm_bindgen(js_name = "emailId")]
    pub email_id: Option<String>,
    pub subject: Option<String>,
    #[serde(rename = "from")]
    #[wasm_bindgen(js_name = "from")]
    pub from_addr: Option<String>,
    #[serde(rename = "eventType")]
    #[wasm_bindgen(js_name = "eventType")]
    pub event_type: Option<String>,
    #[serde(rename = "executedAt")]
    #[wasm_bindgen(js_name = "executedAt")]
    pub executed_at: Option<i64>,
    pub success: Option<bool>,
    pub error: Option<String>,
    pub steps: Option<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct AuditLogDoc {
    id: String,
    #[serde(rename = "emailId")]
    email_id: String,
    subject: String,
    #[serde(rename = "from")]
    from: String,
    #[serde(rename = "eventType")]
    event_type: String,
    #[serde(rename = "executedAt")]
    executed_at: i64,
    success: bool,
    error: String,
    steps: String,
}

pub async fn log_execution(
    db: DbRef<'_>,
    id: &str,
    email_id: &str,
    subject: &str,
    from: &str,
    event_type: &str,
    executed_at: i64,
    success: bool,
    error: &str,
    steps_json: &str,
) -> Result<(), CoreError> {
    let doc = AuditLogDoc {
        id: id.to_string(),
        email_id: email_id.to_string(),
        subject: subject.to_string(),
        from: from.to_string(),
        event_type: event_type.to_string(),
        executed_at,
        success,
        error: error.to_string(),
        steps: steps_json.to_string(),
    };
    db.store_put(store::AUDIT_LOG, &doc, Some(id)).await
}

#[derive(Clone, Serialize, Deserialize)]
struct EmailClassificationRow {
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

pub async fn sync_after_execution(db: DbRef<'_>, email_id: &str, delete_item: bool) -> Result<(), CoreError> {
    if let Some(mut row) = db.store_get::<EmailClassificationRow>(store::EMAIL_CLASSIFICATIONS, email_id).await? {
        row.status = Some("executed".to_string());
        db.store_put(store::EMAIL_CLASSIFICATIONS, &row, Some(email_id)).await?;
    }
    if delete_item {
        db.store_delete(store::ITEMS, email_id).await?;
    }
    Ok(())
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Serialize, Deserialize)]
pub struct GetAuditLogResult {
    pub entries: Vec<AuditLogRow>,
    pub total: i64,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Serialize)]
pub struct AuditStats {
    pub completed: u32,
    pub failed: u32,
}

pub async fn get_audit_log(
    db: DbRef<'_>,
    limit: i64,
    offset: i64,
    failures_only: bool,
) -> Result<GetAuditLogResult, CoreError> {
    let (entries, total) = if failures_only {
        let all: Vec<AuditLogRow> = db
            .index_scan(
                store::AUDIT_LOG,
                "executedAt",
                None,
                None,
                None,
                Some(Direction::Prev),
            )
            .await?;
        let failures: Vec<AuditLogRow> =
            all.into_iter().filter(|r| r.success == Some(false)).collect();
        let total = failures.len() as i64;
        let entries = failures
            .into_iter()
            .skip(offset as usize)
            .take(limit as usize)
            .collect();
        (entries, total)
    } else {
        let entries = db
            .index_scan(
                store::AUDIT_LOG,
                "executedAt",
                None,
                Some(limit as u32),
                Some(offset as u32),
                Some(Direction::Prev),
            )
            .await?;
        let total = db.store_count(store::AUDIT_LOG, None).await? as i64;
        (entries, total)
    };

    Ok(GetAuditLogResult { entries, total })
}

pub async fn clear_audit_log(db: DbRef<'_>) -> Result<(), CoreError> {
    db.store_clear(store::AUDIT_LOG).await
}

/// Count audit entries by success (for event stats).
pub async fn get_audit_stats(db: DbRef<'_>) -> Result<AuditStats, CoreError> {
    let rows: Vec<AuditLogRow> = db.store_get_all(store::AUDIT_LOG, None, None).await?;
    let mut completed = 0u32;
    let mut failed = 0u32;
    for row in rows {
        match row.success {
            Some(true) => completed += 1,
            Some(false) => failed += 1,
            None => {}
        }
    }
    Ok(AuditStats { completed, failed })
}
