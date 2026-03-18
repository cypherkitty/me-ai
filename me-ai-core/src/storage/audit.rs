//! Audit log: log execution, sync after execution, list and clear. Uses Rexie.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use rexie::Direction;

use crate::db::{store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(typescript_custom_section)]
const AUDIT_TYPES: &'static str = r#"
export interface PipelineAction {
    id?: string;
    name?: string;
    commandId?: string;
    pluginId?: string;
}

export interface ActionExecutionResult {
    actionId?: string;
    actionName?: string;
    commandId?: string;
    pluginId?: string;
    success: boolean;
    message: string;
}

export interface AuditStep {
    actionId: string;
    actionName: string;
    commandId: string;
    pluginId: string;
    success: boolean;
    message: string;
}

export interface AuditLogEntry {
    id: string;
    emailId: string;
    subject: string;
    from: string;
    eventType: string;
    executedAt: number;
    success: boolean;
    error: string;
    steps: AuditStep[];
}

export interface LogExecutionParams {
    emailId: string;
    subject?: string;
    from?: string;
    eventType: string;
    actions?: PipelineAction[];
    results?: ActionExecutionResult[];
    success: boolean;
    error?: string;
}

export interface GetAuditLogOptions {
    limit?: number;
    offset?: number;
    failuresOnly?: boolean;
}
"#;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuditLogRow {
    #[serde(default)]
    pub id: String,
    #[serde(rename = "emailId", default)]
    #[wasm_bindgen(js_name = "emailId")]
    pub email_id: String,
    #[serde(default)]
    pub subject: String,
    #[serde(rename = "from")]
    #[serde(default)]
    #[wasm_bindgen(js_name = "from")]
    pub from_addr: String,
    #[serde(rename = "eventType", default)]
    #[wasm_bindgen(js_name = "eventType")]
    pub event_type: String,
    #[serde(rename = "executedAt", default)]
    #[wasm_bindgen(js_name = "executedAt")]
    pub executed_at: i64,
    #[serde(default)]
    pub success: bool,
    #[serde(default)]
    pub error: String,
    #[serde(default)]
    pub steps: String,
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

#[allow(clippy::too_many_arguments)]
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
            all.into_iter().filter(|r| !r.success).collect();
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

/// Destructive command IDs that delete the email from the mailbox.
const DESTRUCTIVE_COMMANDS: &[&str] = &["trash", "delete", "mark_spam"];
/// Archiving command IDs that remove the email from inbox.
const ARCHIVING_COMMANDS: &[&str] = &["archive"];

/// Audit step for serialization into the steps JSON blob.
#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AuditStep {
    action_id: String,
    action_name: String,
    command_id: String,
    plugin_id: String,
    success: bool,
    message: String,
}

/// Combined audit log + sync-after-execution helper.
///
/// 1. Builds `AuditStep` entries from the action inputs and results.
/// 2. Writes an audit log row via [`log_execution`].
/// 3. Determines whether the stored item should be deleted (destructive/archiving
///    commands succeeded) and calls [`sync_after_execution`].
#[allow(clippy::too_many_arguments)]
pub async fn log_and_sync_execution(
    db: DbRef<'_>,
    email_id: &str,
    subject: &str,
    from: &str,
    event_type: &str,
    actions: &[crate::plugins::ActionInput],
    results: &[crate::plugins::ActionResult],
    success: bool,
) -> Result<(), CoreError> {
    // 1. Build audit steps from results
    let steps: Vec<AuditStep> = results
        .iter()
        .enumerate()
        .map(|(i, r)| AuditStep {
            action_id: if !r.action_id.is_empty() {
                r.action_id.clone()
            } else {
                actions.get(i).map(|a| a.id.clone()).unwrap_or_default()
            },
            action_name: if !r.action_name.is_empty() {
                r.action_name.clone()
            } else {
                actions.get(i).map(|a| a.name.clone()).unwrap_or_default()
            },
            command_id: if !r.command_id.is_empty() {
                r.command_id.clone()
            } else {
                actions.get(i).map(|a| a.command_id.clone()).unwrap_or_default()
            },
            plugin_id: if !r.plugin_id.is_empty() {
                r.plugin_id.clone()
            } else {
                actions.get(i).map(|a| a.plugin_id.clone()).unwrap_or_default()
            },
            success: r.success,
            message: r.message.clone(),
        })
        .collect();

    // 2. Generate ID and timestamp, then log
    let id = js_sys::Math::random().to_string().replace("0.", "audit_");
    let now = js_sys::Date::now() as i64;
    let steps_json = serde_json::to_string(&steps).unwrap_or_else(|_| "[]".to_string());
    log_execution(db, &id, email_id, subject, from, event_type, now, success, "", &steps_json).await?;

    // 3. Determine if we should delete the stored item
    if !email_id.is_empty() {
        let successful_commands: Vec<&str> = results
            .iter()
            .filter(|r| r.success && !r.command_id.is_empty())
            .map(|r| r.command_id.as_str())
            .collect();
        let is_destructive = successful_commands
            .iter()
            .any(|c| DESTRUCTIVE_COMMANDS.contains(c));
        let is_archiving = successful_commands
            .iter()
            .any(|c| ARCHIVING_COMMANDS.contains(c));
        let delete_item = is_destructive || is_archiving;
        sync_after_execution(db, email_id, delete_item).await?;
    }

    Ok(())
}

/// Count audit entries by success (for event stats).
pub async fn get_audit_stats(db: DbRef<'_>) -> Result<AuditStats, CoreError> {
    let rows: Vec<AuditLogRow> = db.store_get_all(store::AUDIT_LOG, None, None).await?;
    let mut completed = 0u32;
    let mut failed = 0u32;
    for row in rows {
        if row.success {
            completed += 1;
        } else {
            failed += 1;
        }
    }
    Ok(AuditStats { completed, failed })
}
