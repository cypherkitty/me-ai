//! Cross-store aggregations: event stats, pending approvals, pipeline views.
//! These mirror the business logic previously in me-ai-web/src/lib/rules.ts.

use std::collections::HashSet;

use serde::Serialize;

use crate::db::DbRef;
use crate::error::CoreError;

// ── Result types ─────────────────────────────────────────────────────────────

#[derive(Clone, Debug, Serialize)]
pub struct EventStatsResult {
    pub awaiting_user: u32,
    pub escalated: u32,
    pub completed: u32,
    pub failed: u32,
    pub total: u32,
}

#[derive(Clone, Debug, Serialize)]
pub struct PendingApprovalView {
    pub id: String,
    pub subject: String,
    pub source_name: String,
    pub content: String,
    pub timestamp: i64,
    pub event_category: String,
    pub event_type: String,
    pub reason: String,
    pub summary: String,
    pub status: String,
    pub sender: String,
    pub from: String,
    pub actions_taken: Vec<String>,
    pub rule_name: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct PendingItemByCategoryResult {
    pub id: String,
    #[serde(rename = "emailId")]
    pub email_id: String,
    pub subject: String,
    pub from: String,
    #[serde(rename = "eventType")]
    pub event_type: String,
    pub event_category: String,
    #[serde(rename = "sourceType")]
    pub source_type: String,
    pub status: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct CategoryPipelineView {
    pub category: String,
    pub label: String,
    pub priority: i64,
    pub policy: String,
    pub actions: Vec<PipelineActionEntry>,
    #[serde(rename = "eventTypes")]
    pub event_types: Vec<EventTypeEntry>,
}

#[derive(Clone, Debug, Serialize)]
pub struct PipelineActionEntry {
    #[serde(rename = "pluginId")]
    pub plugin_id: String,
    #[serde(rename = "commandId")]
    pub command_id: String,
    pub order: i64,
}

#[derive(Clone, Debug, Serialize)]
pub struct EventTypeEntry {
    pub name: String,
    pub label: String,
    #[serde(rename = "autoCreated")]
    pub auto_created: bool,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/// Build the set of category names (lowercased) whose policy is "manual".
fn manual_category_set(categories: &[super::events::EventCategoryRow]) -> HashSet<String> {
    categories
        .iter()
        .filter(|c| c.policy.to_lowercase() == "manual")
        .map(|c| c.name.to_lowercase())
        .collect()
}

/// Return true if the email_id string is valid (non-empty, not "null"/"undefined").
fn is_valid_id(id: &str) -> bool {
    let t = id.trim();
    !t.is_empty() && t != "null" && t != "undefined"
}

// ── Public aggregation functions ──────────────────────────────────────────────

/// Aggregate event stats across classifications and audit log.
///
/// - `awaiting_user`: pending classifications in a manual-policy category
/// - `escalated`: escalated classifications
/// - `completed` / `failed`: from the audit log
pub async fn get_event_stats(db: DbRef<'_>) -> Result<EventStatsResult, CoreError> {
    let classifications = super::classifications::get_classifications(db, None, None).await?;
    let categories = super::events::get_event_categories(db).await?;
    let audit_stats = super::audit::get_audit_stats(db).await?;

    let manual_set = manual_category_set(&categories);

    let mut awaiting_user: u32 = 0;
    let mut escalated: u32 = 0;

    for row in &classifications {
        let status = row.status.as_deref().unwrap_or("");
        let cat = row.category.as_deref().unwrap_or("").to_lowercase();
        if status == "pending" && manual_set.contains(&cat) {
            awaiting_user += 1;
        } else if status == "escalated" {
            escalated += 1;
        }
    }

    let completed = audit_stats.completed;
    let failed = audit_stats.failed;
    let total = awaiting_user + escalated + completed + failed;

    Ok(EventStatsResult { awaiting_user, escalated, completed, failed, total })
}

/// Fetch pending approvals (status == "pending" in a manual-policy category),
/// sorted by date desc, up to `limit`.
pub async fn get_pending_approvals(
    db: DbRef<'_>,
    limit: usize,
) -> Result<Vec<PendingApprovalView>, CoreError> {
    let classifications = super::classifications::get_classifications(db, None, None).await?;
    let categories = super::events::get_event_categories(db).await?;

    let manual_set = manual_category_set(&categories);

    // Filter: status == "pending" AND category in manual_set.
    // classifications are already sorted date desc by get_classifications.
    let pending: Vec<_> = classifications
        .into_iter()
        .filter(|r| {
            let status = r.status.as_deref().unwrap_or("");
            let cat = r.category.as_deref().unwrap_or("").to_lowercase();
            status == "pending" && manual_set.contains(&cat)
        })
        .take(limit)
        .collect();

    let mut out = Vec::with_capacity(pending.len());
    for r in pending {
        let email_id = r.email_id.as_str();
        let item = if is_valid_id(email_id) {
            super::sync::get_item_by_id(db, email_id).await?
        } else {
            None
        };

        let subject = item
            .as_ref()
            .map(|i| i.subject.as_str())
            .filter(|s| !s.is_empty())
            .or_else(|| r.subject.as_deref())
            .unwrap_or("")
            .to_string();

        let from = item
            .as_ref()
            .map(|i| i.from.as_str())
            .filter(|s| !s.is_empty())
            .or_else(|| r.from.as_deref())
            .unwrap_or("")
            .to_string();

        let content = item
            .as_ref()
            .map(|i| i.body.as_str())
            .unwrap_or("")
            .to_string();

        let timestamp = r
            .date
            .or_else(|| item.as_ref().and_then(|i| i.date))
            .unwrap_or(0);

        let event_category = r.category.clone().unwrap_or_default();
        let rule_name = format!("Manual Review: {}", &event_category);

        out.push(PendingApprovalView {
            id: email_id.to_string(),
            subject,
            source_name: from.clone(),
            content,
            timestamp,
            event_category,
            event_type: r.action.clone().unwrap_or_default(),
            reason: r.reason.clone().unwrap_or_default(),
            summary: r.summary.clone().unwrap_or_default(),
            status: r.status.clone().unwrap_or_default(),
            sender: from.clone(),
            from,
            actions_taken: Vec::new(),
            rule_name,
        });
    }

    Ok(out)
}

/// Count pending or escalated classifications in a given category (case-insensitive).
pub async fn get_pending_count_by_category(
    db: DbRef<'_>,
    category_name: &str,
) -> Result<u32, CoreError> {
    let classifications = super::classifications::get_classifications(db, None, None).await?;
    let want = category_name.trim().to_lowercase();
    let count = classifications
        .iter()
        .filter(|r| {
            let cat = r.category.as_deref().unwrap_or("").trim().to_lowercase();
            let status = r.status.as_deref().unwrap_or("");
            cat == want && (status == "pending" || status == "escalated")
        })
        .count();
    Ok(count as u32)
}

/// Fetch pending/escalated items in a given category, sorted date desc, up to `limit`.
pub async fn get_pending_items_by_category(
    db: DbRef<'_>,
    category_name: &str,
    limit: usize,
) -> Result<Vec<PendingItemByCategoryResult>, CoreError> {
    let classifications = super::classifications::get_classifications(db, None, None).await?;
    let want = category_name.trim().to_lowercase();

    // classifications are already sorted date desc
    let filtered: Vec<_> = classifications
        .into_iter()
        .filter(|r| {
            let cat = r.category.as_deref().unwrap_or("").trim().to_lowercase();
            let status = r.status.as_deref().unwrap_or("");
            cat == want && (status == "pending" || status == "escalated")
        })
        .take(limit)
        .collect();

    let mut out = Vec::with_capacity(filtered.len());
    for r in filtered {
        let email_id = r.email_id.as_str();
        let item = if is_valid_id(email_id) {
            super::sync::get_item_by_id(db, email_id).await?
        } else {
            None
        };

        // subject: classification first, then item
        let subject = r
            .subject
            .as_deref()
            .filter(|s| !s.is_empty())
            .or_else(|| item.as_ref().map(|i| i.subject.as_str()).filter(|s| !s.is_empty()))
            .unwrap_or("")
            .to_string();

        // from: classification first, then item
        let from = r
            .from
            .as_deref()
            .filter(|s| !s.is_empty())
            .or_else(|| item.as_ref().map(|i| i.from.as_str()).filter(|s| !s.is_empty()))
            .unwrap_or("")
            .to_string();

        let event_type = r.action.as_deref().unwrap_or("UNKNOWN").to_string();
        let event_category = r
            .category
            .as_deref()
            .unwrap_or(category_name)
            .to_string();
        let source_type = item
            .as_ref()
            .map(|i| i.source_type.as_str())
            .filter(|s| !s.is_empty())
            .unwrap_or("gmail")
            .to_string();
        let status = r.status.as_deref().unwrap_or("pending").to_string();

        out.push(PendingItemByCategoryResult {
            id: email_id.to_string(),
            email_id: email_id.to_string(),
            subject,
            from,
            event_type,
            event_category,
            source_type,
            status,
        });
    }

    Ok(out)
}

/// Build a full display view of all category pipelines including their event types.
pub async fn get_category_pipelines(db: DbRef<'_>) -> Result<Vec<CategoryPipelineView>, CoreError> {
    let categories = super::events::get_event_categories(db).await?;
    let event_types = super::events::get_event_types(db).await?;

    let mut result = Vec::with_capacity(categories.len());
    for cat in categories {
        let pipeline_actions =
            super::pipelines::get_category_pipeline_actions(db, &cat.name).await?;

        let actions = pipeline_actions
            .into_iter()
            .map(|a| PipelineActionEntry {
                plugin_id: a.plugin_id,
                command_id: a.command_id,
                order: a.action_idx,
            })
            .collect();

        let cat_name = cat.name.clone();
        let types = event_types
            .iter()
            .filter(|t| t.category_name.as_deref() == Some(cat_name.as_str()))
            .map(|t| EventTypeEntry {
                name: t.name.clone(),
                label: if t.label.is_empty() { t.name.clone() } else { t.label.clone() },
                auto_created: t.auto_created,
            })
            .collect();

        result.push(CategoryPipelineView {
            category: cat.name,
            label: if cat.label.is_empty() { cat_name.clone() } else { cat.label },
            priority: cat.priority,
            policy: cat.policy,
            actions,
            event_types: types,
        });
    }

    Ok(result)
}
