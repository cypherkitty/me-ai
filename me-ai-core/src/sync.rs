//! Items, syncState, contacts: CRUD and batch operations.
//! All SQL is built here; execution via JS adapter.

use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::from_value;

use crate::db::{run_exec_batch, run_exec_raw, run_query_raw, Param, ParamValue};
use crate::error::CoreError;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SyncStateRow {
    #[serde(rename = "sourceType")]
    pub source_type: Option<String>,
    #[serde(rename = "historyId")]
    pub history_id: Option<String>,
    #[serde(rename = "lastSyncAt")]
    pub last_sync_at: Option<i64>,
    #[serde(rename = "totalItems")]
    pub total_items: Option<i64>,
    #[serde(rename = "oldestPageToken")]
    pub oldest_page_token: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ContactRow {
    pub email: Option<String>,
    pub name: Option<String>,
    #[serde(rename = "firstSeen")]
    pub first_seen: Option<i64>,
    #[serde(rename = "lastSeen")]
    pub last_seen: Option<i64>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct ItemRow {
    pub id: String,
    pub source_type: String,
    pub source_id: Option<String>,
    pub thread_key: Option<String>,
    pub r#type: Option<String>,
    pub from: Option<String>,
    pub to: Option<String>,
    pub cc: Option<String>,
    pub subject: Option<String>,
    pub snippet: Option<String>,
    pub body: Option<String>,
    pub html_body: Option<String>,
    pub date: Option<i64>,
    pub labels: Option<String>,
    pub message_id: Option<String>,
    pub in_reply_to: Option<String>,
    pub references: Option<String>,
    pub raw: Option<String>,
    pub synced_at: Option<i64>,
}

#[derive(Clone, Debug, Deserialize)]
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

#[derive(Clone, Debug, Deserialize)]
pub struct ContactInput {
    pub email: String,
    pub name: String,
    #[serde(rename = "firstSeen")]
    pub first_seen: i64,
    #[serde(rename = "lastSeen")]
    pub last_seen: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CountRow {
    pub cnt: Option<i64>,
}

fn str_param(s: &str) -> Param {
    Some(ParamValue::Str(s.to_string()))
}
fn int_param(n: i64) -> Param {
    Some(ParamValue::Int(n))
}
fn opt_str_param(s: Option<&str>) -> Param {
    s.map(|x| ParamValue::Str(x.to_string()))
}

/// DELETE FROM syncState WHERE sourceType = ?
pub async fn delete_sync_state(source_type: &str) -> Result<(), CoreError> {
    run_exec_raw("DELETE FROM syncState WHERE sourceType = ?", vec![str_param(source_type)]).await
}

/// DELETE FROM items WHERE sourceType = ?
pub async fn delete_items_by_source(source_type: &str) -> Result<(), CoreError> {
    run_exec_raw("DELETE FROM items WHERE sourceType = ?", vec![str_param(source_type)]).await
}

/// DELETE FROM items; DELETE FROM syncState; DELETE FROM contacts;
pub async fn clear_items_sync_contacts() -> Result<(), CoreError> {
    let empty: Vec<Param> = vec![];
    run_exec_raw("DELETE FROM items", empty.clone()).await?;
    run_exec_raw("DELETE FROM syncState", empty.clone()).await?;
    run_exec_raw("DELETE FROM contacts", empty).await?;
    Ok(())
}

/// SELECT COUNT(*) AS cnt FROM items WHERE sourceType = ?
pub async fn get_items_count_by_source(source_type: &str) -> Result<i64, CoreError> {
    let rows = run_query_raw::<CountRow>(
        "SELECT COUNT(*) AS cnt FROM items WHERE sourceType = ?",
        vec![str_param(source_type)],
    )
    .await?;
    Ok(rows.first().and_then(|r| r.cnt).unwrap_or(0))
}

/// SELECT * FROM syncState WHERE sourceType = ?
pub async fn get_sync_state(source_type: &str) -> Result<Option<SyncStateRow>, CoreError> {
    #[derive(Deserialize)]
    struct Row {
        source_type: Option<String>,
        history_id: Option<String>,
        last_sync_at: Option<i64>,
        total_items: Option<i64>,
        oldest_page_token: Option<String>,
    }
    let rows = run_query_raw::<Row>(
        r#"SELECT sourceType as source_type, historyId as history_id, lastSyncAt as last_sync_at,
           totalItems as total_items, oldestPageToken as oldest_page_token
           FROM syncState WHERE sourceType = ?"#,
        vec![str_param(source_type)],
    )
    .await?;
    let r = match rows.into_iter().next() {
        Some(x) => x,
        None => return Ok(None),
    };
    Ok(Some(SyncStateRow {
        source_type: r.source_type,
        history_id: r.history_id,
        last_sync_at: r.last_sync_at,
        total_items: r.total_items,
        oldest_page_token: r.oldest_page_token,
    }))
}

/// INSERT INTO syncState ... ON CONFLICT DO UPDATE
pub async fn upsert_sync_state(
    source_type: &str,
    history_id: &str,
    last_sync_at: i64,
    total_items: i64,
    oldest_page_token: &str,
) -> Result<(), CoreError> {
    let params = vec![
        str_param(source_type),
        str_param(history_id),
        int_param(last_sync_at),
        int_param(total_items),
        str_param(oldest_page_token),
    ];
    run_exec_raw(
        r#"INSERT INTO syncState (sourceType, historyId, lastSyncAt, totalItems, oldestPageToken)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT (sourceType) DO UPDATE SET
             historyId = excluded.historyId,
             lastSyncAt = excluded.lastSyncAt,
             totalItems = excluded.totalItems,
             oldestPageToken = excluded.oldestPageToken"#,
        params,
    )
    .await
}

/// Build (sql, params) for one item insert/upsert. DuckDB uses ? placeholders.
fn item_statement(row: &ItemRow) -> (String, Vec<Param>) {
    let sql = r#"INSERT INTO items
       (id, sourceType, sourceId, threadKey, type, "from", "to", cc, subject,
        snippet, body, htmlBody, date, labels, messageId, inReplyTo, "references",
        raw, syncedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       sourceType = excluded.sourceType,
       sourceId = excluded.sourceId,
       threadKey = excluded.threadKey,
       type = excluded.type,
       "from" = excluded."from",
       "to" = excluded."to",
       cc = excluded.cc,
       subject = excluded.subject,
       snippet = excluded.snippet,
       body = excluded.body,
       htmlBody = excluded.htmlBody,
       date = excluded.date,
       labels = excluded.labels,
       messageId = excluded.messageId,
       inReplyTo = excluded.inReplyTo,
       "references" = excluded."references",
       raw = excluded.raw,
       syncedAt = excluded.syncedAt"#
        .to_string();
    let params = vec![
        str_param(&row.id),
        str_param(&row.source_type),
        opt_str_param(row.source_id.as_deref()),
        opt_str_param(row.thread_key.as_deref()),
        opt_str_param(row.r#type.as_deref()),
        opt_str_param(row.from.as_deref()),
        opt_str_param(row.to.as_deref()),
        opt_str_param(row.cc.as_deref()),
        opt_str_param(row.subject.as_deref()),
        opt_str_param(row.snippet.as_deref()),
        opt_str_param(row.body.as_deref()),
        opt_str_param(row.html_body.as_deref()),
        row.date.map(ParamValue::Int).into(),
        opt_str_param(row.labels.as_deref()),
        opt_str_param(row.message_id.as_deref()),
        opt_str_param(row.in_reply_to.as_deref()),
        opt_str_param(row.references.as_deref()),
        opt_str_param(row.raw.as_deref()),
        row.synced_at.map(ParamValue::Int).into(),
    ];
    (sql, params)
}

/// Insert or update items in batch. rows: JsValue = array of item objects (camelCase from JS).
pub async fn insert_items_batch(rows: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    #[derive(Deserialize)]
    #[allow(non_snake_case)]
    struct JsItem {
        id: String,
        sourceType: String,
        sourceId: Option<String>,
        threadKey: Option<String>,
        r#type: Option<String>,
        from: Option<String>,
        to: Option<String>,
        cc: Option<String>,
        subject: Option<String>,
        snippet: Option<String>,
        body: Option<String>,
        htmlBody: Option<String>,
        date: Option<i64>,
        labels: Option<String>,
        messageId: Option<String>,
        inReplyTo: Option<String>,
        references: Option<String>,
        raw: Option<String>,
        syncedAt: Option<i64>,
    }
    let arr: Vec<JsItem> = from_value(rows).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let mut statements = Vec::with_capacity(arr.len());
    for r in arr {
        let row = ItemRow {
            id: r.id,
            source_type: r.sourceType,
            source_id: r.sourceId,
            thread_key: r.threadKey,
            r#type: r.r#type,
            from: r.from,
            to: r.to,
            cc: r.cc,
            subject: r.subject,
            snippet: r.snippet,
            body: r.body,
            html_body: r.htmlBody,
            date: r.date,
            labels: r.labels,
            message_id: r.messageId,
            in_reply_to: r.inReplyTo,
            references: r.references,
            raw: r.raw,
            synced_at: r.syncedAt,
        };
        statements.push(item_statement(&row));
    }
    run_exec_batch(&statements).await
}

/// INSERT syncState rows (ON CONFLICT DO NOTHING). rows: array of { sourceType, historyId, ... }.
pub async fn insert_sync_state_batch(rows: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<SyncStateInput> = from_value(rows).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let sql = r#"INSERT INTO syncState (sourceType, historyId, lastSyncAt, totalItems, oldestPageToken)
                 VALUES (?, ?, ?, ?, ?) ON CONFLICT (sourceType) DO NOTHING"#;
    let mut statements = Vec::with_capacity(arr.len());
    for r in arr {
        let params = vec![
            str_param(&r.source_type),
            str_param(&r.history_id),
            int_param(r.last_sync_at),
            int_param(r.total_items),
            str_param(&r.oldest_page_token),
        ];
        statements.push((sql.to_string(), params));
    }
    run_exec_batch(&statements).await
}

/// INSERT contacts (ON CONFLICT DO NOTHING). rows: array of { email, name, firstSeen, lastSeen }.
pub async fn insert_contacts_batch(rows: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<ContactInput> = from_value(rows).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let sql = "INSERT INTO contacts (email, name, firstSeen, lastSeen) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING";
    let mut statements = Vec::with_capacity(arr.len());
    for r in arr {
        let params = vec![
            str_param(&r.email),
            str_param(&r.name),
            int_param(r.first_seen),
            int_param(r.last_seen),
        ];
        statements.push((sql.to_string(), params));
    }
    run_exec_batch(&statements).await
}

/// DELETE FROM items WHERE id = ? for each id.
pub async fn delete_items_by_ids(ids: wasm_bindgen::JsValue) -> Result<(), CoreError> {
    let arr: Vec<String> = from_value(ids).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let sql = "DELETE FROM items WHERE id = ?".to_string();
    let statements: Vec<(String, Vec<Param>)> = arr
        .iter()
        .map(|id| (sql.clone(), vec![str_param(id)]))
        .collect();
    run_exec_batch(&statements).await
}

/// SELECT * FROM contacts WHERE email = ?
pub async fn get_contact_by_email(email: &str) -> Result<Option<ContactRow>, CoreError> {
    #[derive(Deserialize)]
    struct Row {
        email: Option<String>,
        name: Option<String>,
        first_seen: Option<i64>,
        last_seen: Option<i64>,
    }
    let rows = run_query_raw::<Row>(
        "SELECT email, name, firstSeen as first_seen, lastSeen as last_seen FROM contacts WHERE email = ?",
        vec![str_param(email)],
    )
    .await?;
    let r = match rows.into_iter().next() {
        Some(x) => x,
        None => return Ok(None),
    };
    Ok(Some(ContactRow {
        email: r.email,
        name: r.name,
        first_seen: r.first_seen,
        last_seen: r.last_seen,
    }))
}

/// UPDATE or INSERT contact.
pub async fn upsert_contact(email: &str, name: &str, first_seen: i64, last_seen: i64) -> Result<(), CoreError> {
    let existing = get_contact_by_email(email).await?;
    if let Some(row) = existing {
        let mut updates = Vec::new();
        let mut params: Vec<Param> = vec![];
        if !name.is_empty() && row.name.as_deref().unwrap_or("").is_empty() {
            updates.push("name = ?");
            params.push(str_param(name));
        }
        if last_seen > row.last_seen.unwrap_or(0) {
            updates.push("lastSeen = ?");
            params.push(int_param(last_seen));
        }
        if !updates.is_empty() {
            params.push(str_param(email));
            let sql = format!("UPDATE contacts SET {} WHERE email = ?", updates.join(", "));
            run_exec_raw(&sql, params).await?;
        }
    } else {
        run_exec_raw(
            "INSERT INTO contacts (email, name, firstSeen, lastSeen) VALUES (?, ?, ?, ?)",
            vec![str_param(email), str_param(name), int_param(first_seen), int_param(last_seen)],
        )
        .await?;
    }
    Ok(())
}

/// SELECT sourceId FROM items WHERE sourceType = ? ORDER BY date DESC LIMIT 1
pub async fn get_newest_source_id(source_type: &str) -> Result<Option<String>, CoreError> {
    #[derive(Deserialize)]
    struct Row {
        source_id: Option<String>,
    }
    let rows = run_query_raw::<Row>(
        "SELECT sourceId as source_id FROM items WHERE sourceType = ? ORDER BY date DESC LIMIT 1",
        vec![str_param(source_type)],
    )
    .await?;
    Ok(rows.into_iter().next().and_then(|r| r.source_id))
}
