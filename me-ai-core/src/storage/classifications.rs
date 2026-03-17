//! Email classifications store (Rexie). CRUD and filters.

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
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

#[derive(Clone, Serialize, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct ClassificationDoc {
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
    pub scanned_at: Option<i64>,
    pub status: Option<String>,
}

// ── Aggregation result types ────────────────────────────────────────────────

/// A classification row with tags parsed from JSON string to `Vec<String>`.
/// Used in aggregation results for clean consumption by the UI.
#[derive(Clone, Debug, Serialize, Tsify)]
#[serde(rename_all = "camelCase")]
pub struct ClassificationView {
    pub email_id: String,
    pub action: String,
    pub category: String,
    pub reason: String,
    pub summary: String,
    pub tags: Vec<String>,
    pub subject: String,
    #[serde(rename = "from")]
    pub from: String,
    pub date: Option<i64>,
    pub scanned_at: Option<i64>,
    pub status: String,
}

fn to_view(row: &ClassificationRow) -> ClassificationView {
    let tags: Vec<String> = row
        .tags
        .as_deref()
        .and_then(|s| serde_json::from_str(s).ok())
        .unwrap_or_default();
    ClassificationView {
        email_id: row.email_id.clone(),
        action: row.action.clone().unwrap_or_default(),
        category: row.category.clone().unwrap_or_default(),
        reason: row.reason.clone().unwrap_or_default(),
        summary: row.summary.clone().unwrap_or_default(),
        tags,
        subject: row.subject.clone().unwrap_or_default(),
        from: row.from.clone().unwrap_or_default(),
        date: row.date,
        scanned_at: row.scanned_at,
        status: row.status.clone().unwrap_or_else(|| "pending".to_string()),
    }
}

/// Classifications grouped by action, sorted by count descending.
#[derive(Clone, Debug, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ClassificationsByCategory {
    #[tsify(type = "Record<string, ClassificationView[]>")]
    pub categories: HashMap<String, Vec<ClassificationView>>,
    pub order: Vec<String>,
    pub total: usize,
}

/// Classification counts by action.
#[derive(Clone, Debug, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ClassificationCounts {
    #[tsify(type = "Record<string, number>")]
    pub counts: HashMap<String, u32>,
    pub total: u32,
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

// ── Aggregation queries ─────────────────────────────────────────────────────

/// Get classifications grouped by action, with optional pending-only filter.
/// Items within each group are sorted by date desc; groups sorted by count desc.
pub async fn get_classifications_by_category(
    db: DbRef<'_>,
    pending_only: bool,
) -> Result<ClassificationsByCategory, CoreError> {
    let rows = get_classifications(db, None, Some(5000)).await?;

    let filtered: Vec<&ClassificationRow> = if pending_only {
        rows.iter()
            .filter(|r| {
                let status = r.status.as_deref().unwrap_or("");
                status == "pending" || status == "escalated"
            })
            .collect()
    } else {
        rows.iter().collect()
    };

    let total = filtered.len();

    // Group by action
    let mut categories: HashMap<String, Vec<ClassificationView>> = HashMap::new();
    for row in &filtered {
        let key = row.action.as_deref().unwrap_or("UNKNOWN").to_string();
        categories.entry(key).or_default().push(to_view(row));
    }

    // Items within each group already sorted by date desc (from get_classifications)

    // Order: keys sorted by count descending
    let mut order: Vec<String> = categories.keys().cloned().collect();
    order.sort_by(|a, b| categories[b].len().cmp(&categories[a].len()));

    Ok(ClassificationsByCategory { categories, order, total })
}

/// Count classifications by action.
pub async fn get_classification_counts(
    db: DbRef<'_>,
) -> Result<ClassificationCounts, CoreError> {
    let rows = get_classifications(db, None, Some(50000)).await?;
    let total = rows.len() as u32;
    let mut counts: HashMap<String, u32> = HashMap::new();
    for row in &rows {
        let key = row.action.as_deref().unwrap_or("UNKNOWN").to_string();
        *counts.entry(key).or_default() += 1;
    }
    Ok(ClassificationCounts { counts, total })
}
