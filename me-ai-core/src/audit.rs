//! Audit log: log execution, sync after execution, list and clear.
//! All SQL is built here; execution via JS adapter.

use serde::{Deserialize, Serialize};

use crate::db::{run_exec_raw, run_query_raw, Param, ParamValue};
use crate::error::CoreError;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuditLogRow {
    pub id: Option<String>,
    #[serde(rename = "emailId")]
    pub email_id: Option<String>,
    pub subject: Option<String>,
    #[serde(rename = "from")]
    pub from_addr: Option<String>,
    #[serde(rename = "eventType")]
    pub event_type: Option<String>,
    #[serde(rename = "executedAt")]
    pub executed_at: Option<i64>,
    pub success: Option<bool>,
    pub error: Option<String>,
    pub steps: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CountRow {
    pub cnt: Option<i64>,
}

/// Log one pipeline execution to auditLog.
pub async fn log_execution(
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
    let params: Vec<Param> = vec![
        Some(ParamValue::Str(id.to_string())),
        Some(ParamValue::Str(email_id.to_string())),
        Some(ParamValue::Str(subject.to_string())),
        Some(ParamValue::Str(from.to_string())),
        Some(ParamValue::Str(event_type.to_string())),
        Some(ParamValue::Int(executed_at)),
        Some(ParamValue::Bool(success)),
        Some(ParamValue::Str(error.to_string())),
        Some(ParamValue::Str(steps_json.to_string())),
    ];
    run_exec_raw(
        r#"INSERT INTO auditLog (id, emailId, subject, "from", eventType, executedAt, success, error, steps)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
        params,
    )
    .await
}

/// Mark email as executed; optionally delete item (for destructive/archiving actions).
pub async fn sync_after_execution(email_id: &str, delete_item: bool) -> Result<(), CoreError> {
    let eid = vec![Some(ParamValue::Str(email_id.to_string()))];
    run_exec_raw(
        "UPDATE emailClassifications SET status = 'executed' WHERE emailId = ?",
        eid.clone(),
    )
    .await?;
    if delete_item {
        run_exec_raw("DELETE FROM items WHERE id = ?", eid).await?;
    }
    Ok(())
}

#[derive(Serialize, Deserialize)]
pub struct GetAuditLogResult {
    pub entries: Vec<AuditLogRow>,
    pub total: i64,
}

/// Count and page of audit log entries.
pub async fn get_audit_log(
    limit: i64,
    offset: i64,
    failures_only: bool,
) -> Result<GetAuditLogResult, CoreError> {
    let where_clause = if failures_only { "WHERE success = false" } else { "" };
    let count_sql = format!("SELECT COUNT(*) AS cnt FROM auditLog {}", where_clause);
    let count_rows = run_query_raw::<CountRow>(&count_sql, vec![]).await?;
    let total = count_rows.first().and_then(|r| r.cnt).unwrap_or(0);

    let list_sql = format!(
        r#"SELECT id, emailId as email_id, subject, "from" as from_addr, eventType as event_type,
           executedAt as executed_at, success, error, steps
           FROM auditLog {} ORDER BY executedAt DESC LIMIT ? OFFSET ?"#,
        where_clause
    );
    let params = vec![
        Some(ParamValue::Int(limit)),
        Some(ParamValue::Int(offset)),
    ];
    let rows = run_query_raw::<AuditLogRow>(&list_sql, params).await?;
    Ok(GetAuditLogResult { entries: rows, total })
}

/// Delete all audit log entries.
pub async fn clear_audit_log() -> Result<(), CoreError> {
    run_exec_raw("DELETE FROM auditLog", vec![]).await
}
