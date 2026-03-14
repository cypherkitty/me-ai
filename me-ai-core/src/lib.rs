//! me-ai-core: business logic and IndexedDB persistence via Rexie (WASM).
//!
//! **Architecture: Rust owns all DB access; no JS adapter.**
//! - Persistence is IndexedDB via the Rexie crate. No SQL; stores and indexes only.
//! - TS calls core WASM methods only; no query/exec from the app layer.
//!
//! Error handling: [thiserror](https://docs.rs/thiserror) + [anyhow](https://docs.rs/anyhow) internally;
//! errors are converted to JsValue at the WASM boundary.

mod app;
mod audit;
mod classifications;
mod db;
mod error;
mod events;
mod items;
mod pipelines;
mod rexie_schema;
mod rules;
mod rules_data;
mod schema;
mod sync;

use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;

use crate::error::{to_js as error_to_js, CoreError};
use crate::rexie_schema::RexieDb;

fn serialize_to_js<T: serde::Serialize>(value: &T) -> Result<JsValue, JsValue> {
    to_value(value).map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
}

fn wasm_result<T: serde::Serialize>(r: Result<T, CoreError>) -> Result<JsValue, JsValue> {
    r.map_err(|e| error_to_js(&e)).and_then(|v| serialize_to_js(&v))
}

/// Core instance. Rexie is built once at init (meta-secret WasmRepo pattern).
#[wasm_bindgen(js_name = MeAiCore)]
pub struct MeAiCore {
    rexie_db: RexieDb,
}

#[wasm_bindgen(js_class = MeAiCore)]
impl MeAiCore {
    /// Build Rexie once. Call after WASM module is loaded. Returns core instance.
    #[wasm_bindgen(constructor)]
    pub async fn new() -> Result<MeAiCore, JsValue> {
        let rexie_db = RexieDb::new().await.map_err(|e| error_to_js(&e))?;
        Ok(MeAiCore { rexie_db })
    }

    #[wasm_bindgen(js_name = getEventTypes)]
    pub async fn get_event_types(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(events::get_event_types(db).await)
    }

    #[wasm_bindgen(js_name = getEventCategories)]
    pub async fn get_event_categories(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(events::get_event_categories(db).await)
    }

    #[wasm_bindgen(js_name = upsertEventType)]
    pub async fn upsert_event_type(
        &self,
        name: &str,
        label: &str,
        category_name: &str,
        auto_created: bool,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        events::upsert_event_type(db, name, label, category_name, auto_created)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getSources)]
    pub async fn get_sources(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(rules::get_sources(db).await)
    }

    #[wasm_bindgen(js_name = getActions)]
    pub async fn get_actions(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(rules::get_actions(db).await)
    }

    #[wasm_bindgen(js_name = getItemsCount)]
    pub async fn get_items_count(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(items::get_items_count(db).await)
    }

    #[wasm_bindgen(js_name = getItemsCountGmail)]
    pub async fn get_items_count_gmail(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(items::get_items_count_gmail(db).await)
    }

    #[wasm_bindgen(js_name = getContactsCount)]
    pub async fn get_contacts_count(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(items::get_contacts_count(db).await)
    }

    #[wasm_bindgen(js_name = getItemsDateMin)]
    pub async fn get_items_date_min(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(items::get_items_date_min(db).await)
    }

    #[wasm_bindgen(js_name = getItemsDateMax)]
    pub async fn get_items_date_max(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(items::get_items_date_max(db).await)
    }

    #[wasm_bindgen(js_name = getEmailClassificationsCount)]
    pub async fn get_email_classifications_count(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(items::get_email_classifications_count(db).await)
    }

    #[wasm_bindgen(js_name = createSchemaAndMigrations)]
    pub async fn create_schema_and_migrations(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        app::create_schema_and_migrations(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTableCount)]
    pub async fn get_table_count(&self, table: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(app::get_table_count(db, table).await)
    }

    #[wasm_bindgen(js_name = clearAllData)]
    pub async fn clear_all_data(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        app::clear_all_data(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getSetting)]
    pub async fn get_setting(&self, key: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(app::get_setting(db, key).await)
    }

    #[wasm_bindgen(js_name = setSetting)]
    pub async fn set_setting(&self, key: &str, value: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        app::set_setting(db, key, value).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = removeSetting)]
    pub async fn remove_setting(&self, key: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        app::remove_setting(db, key).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = logAuditExecution)]
    pub async fn log_audit_execution(
        &self,
        id: &str,
        email_id: &str,
        subject: &str,
        from: &str,
        event_type: &str,
        executed_at: f64,
        success: bool,
        error: &str,
        steps_json: &str,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        audit::log_execution(
            db, id, email_id, subject, from, event_type,
            executed_at as i64, success, error, steps_json,
        )
        .await
        .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = syncAfterAuditExecution)]
    pub async fn sync_after_audit_execution(&self, email_id: &str, delete_item: bool) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        audit::sync_after_execution(db, email_id, delete_item)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getAuditLog)]
    pub async fn get_audit_log(&self, limit: u32, offset: u32, failures_only: bool) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(audit::get_audit_log(db, limit as i64, offset as i64, failures_only).await)
    }

    #[wasm_bindgen(js_name = clearAuditLog)]
    pub async fn clear_audit_log(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        audit::clear_audit_log(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getAuditStats)]
    pub async fn get_audit_stats(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let (completed, failed) = audit::get_audit_stats(db).await.map_err(|e| error_to_js(&e))?;
        #[derive(serde::Serialize)]
        struct Out { completed: u32, failed: u32 }
        wasm_result(Ok(Out { completed, failed }))
    }

    #[wasm_bindgen(js_name = getCategoryPipelineActions)]
    pub async fn get_category_pipeline_actions(&self, category_name: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(pipelines::get_category_pipeline_actions(db, category_name).await)
    }

    #[wasm_bindgen(js_name = getTypePipelineActions)]
    pub async fn get_type_pipeline_actions(&self, type_name: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(pipelines::get_type_pipeline_actions(db, type_name).await)
    }

    #[wasm_bindgen(js_name = getEventTypeCategory)]
    pub async fn get_event_type_category(&self, type_name: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = pipelines::get_event_type_category(db, type_name).await.map_err(|e| error_to_js(&e))?;
        match opt { Some(s) => Ok(JsValue::from_str(&s)), None => Ok(JsValue::NULL) }
    }

    #[wasm_bindgen(js_name = getEventCategoryPolicy)]
    pub async fn get_event_category_policy(&self, category_name: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = pipelines::get_event_category_policy(db, category_name).await.map_err(|e| error_to_js(&e))?;
        match opt { Some(s) => Ok(JsValue::from_str(&s)), None => Ok(JsValue::NULL) }
    }

    #[wasm_bindgen(js_name = updateCategoryPipeline)]
    pub async fn update_category_pipeline(&self, category_name: &str, actions_js: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let arr: Vec<serde_json::Value> = serde_wasm_bindgen::from_value(actions_js)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let actions: Vec<(String, String)> = arr
            .iter()
            .map(|a| {
                let p = a.get("pluginId").and_then(|v| v.as_str()).unwrap_or("");
                let c = a.get("commandId").and_then(|v| v.as_str()).unwrap_or("");
                (p.to_string(), c.to_string())
            })
            .collect();
        pipelines::update_category_pipeline(db, category_name, &actions)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = updateCategoryPolicy)]
    pub async fn update_category_policy(&self, category_name: &str, policy: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        pipelines::update_category_policy(db, category_name, policy).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = updateEventTypeCategory)]
    pub async fn update_event_type_category(&self, type_name: &str, category_name: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        pipelines::update_event_type_category(db, type_name, category_name).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearEventTypeCategory)]
    pub async fn clear_event_type_category(&self, type_name: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        pipelines::clear_event_type_category(db, type_name).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteEventType)]
    pub async fn delete_event_type(&self, type_name: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        pipelines::delete_event_type(db, type_name).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = setSourceEnabled)]
    pub async fn set_source_enabled(&self, name: &str, enabled: bool) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        pipelines::set_source_enabled(db, name, enabled).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = setPluginEnabled)]
    pub async fn set_plugin_enabled(&self, name: &str, enabled: bool) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        pipelines::set_plugin_enabled(db, name, enabled).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteSyncState)]
    pub async fn delete_sync_state(&self, source_type: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::delete_sync_state(db, source_type).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteItemsBySource)]
    pub async fn delete_items_by_source(&self, source_type: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::delete_items_by_source(db, source_type).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearContacts)]
    pub async fn clear_contacts(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::clear_contacts(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearItemsSyncContacts)]
    pub async fn clear_items_sync_contacts(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::clear_items_sync_contacts(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getItemsCountBySource)]
    pub async fn get_items_count_by_source(&self, source_type: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(sync::get_items_count_by_source(db, source_type).await)
    }

    #[wasm_bindgen(js_name = getSyncState)]
    pub async fn get_sync_state(&self, source_type: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = sync::get_sync_state(db, source_type).await.map_err(|e| error_to_js(&e))?;
        match opt { Some(row) => serialize_to_js(&row), None => Ok(JsValue::NULL) }
    }

    #[wasm_bindgen(js_name = upsertSyncState)]
    pub async fn upsert_sync_state(
        &self,
        source_type: &str,
        history_id: &str,
        last_sync_at: f64,
        total_items: i32,
        oldest_page_token: &str,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::upsert_sync_state(db, source_type, history_id, last_sync_at as i64, total_items as i64, oldest_page_token)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = insertItemsBatch)]
    pub async fn insert_items_batch(&self, rows: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::insert_items_batch(db, rows).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = insertSyncStateBatch)]
    pub async fn insert_sync_state_batch(&self, rows: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::insert_sync_state_batch(db, rows).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = insertContactsBatch)]
    pub async fn insert_contacts_batch(&self, rows: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::insert_contacts_batch(db, rows).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteItemsByIds)]
    pub async fn delete_items_by_ids(&self, ids: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::delete_items_by_ids(db, ids).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getContactByEmail)]
    pub async fn get_contact_by_email(&self, email: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = sync::get_contact_by_email(db, email).await.map_err(|e| error_to_js(&e))?;
        match opt { Some(row) => serialize_to_js(&row), None => Ok(JsValue::NULL) }
    }

    #[wasm_bindgen(js_name = upsertContact)]
    pub async fn upsert_contact(&self, email: &str, name: &str, first_seen: f64, last_seen: f64) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        sync::upsert_contact(db, email, name, first_seen as i64, last_seen as i64).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getPlugins)]
    pub async fn get_plugins(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(rules::get_plugins(db).await)
    }

    #[wasm_bindgen(js_name = getRules)]
    pub async fn get_rules(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(rules_data::get_rules(db).await)
    }

    #[wasm_bindgen(js_name = getRule)]
    pub async fn get_rule(&self, id: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = rules_data::get_rule(db, id).await.map_err(|e| error_to_js(&e))?;
        match opt {
            Some(v) => serde_wasm_bindgen::to_value(&v).map_err(|e| error_to_js(&CoreError::Serialize(e.to_string()))),
            None => Ok(JsValue::NULL),
        }
    }

    #[wasm_bindgen(js_name = saveRule)]
    pub async fn save_rule(&self, payload: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let v: serde_json::Value = serde_wasm_bindgen::from_value(payload)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        rules_data::save_rule(db, v).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteRule)]
    pub async fn delete_rule(&self, id: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        rules_data::delete_rule(db, id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getEvents)]
    pub async fn get_events(&self, limit: u32, offset: u32) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(rules_data::get_events(db, limit, offset).await)
    }

    #[wasm_bindgen(js_name = updateEventStatus)]
    pub async fn update_event_status(&self, id: &str, status: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        rules_data::update_event_status(db, id, status).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearEvents)]
    pub async fn clear_events(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        rules_data::clear_events(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = insertEvent)]
    pub async fn insert_event(
        &self,
        id: &str,
        content: Option<String>,
        subject: Option<String>,
        sender: Option<String>,
        timestamp: f64,
        status: Option<String>,
        event_type: Option<String>,
        event_category: Option<String>,
        source_name: Option<String>,
        rule_id: Option<String>,
        actions_taken: Option<String>,
        output: Option<String>,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        rules_data::insert_event(
            db, id,
            content.as_deref(), subject.as_deref(), sender.as_deref(),
            timestamp as i64,
            status.as_deref(), event_type.as_deref(), event_category.as_deref(),
            source_name.as_deref(), rule_id.as_deref(),
            actions_taken.as_deref(), output.as_deref(),
        )
        .await
        .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getNewestSourceId)]
    pub async fn get_newest_source_id(&self, source_type: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = sync::get_newest_source_id(db, source_type).await.map_err(|e| error_to_js(&e))?;
        match opt { Some(s) => Ok(JsValue::from_str(&s)), None => Ok(JsValue::NULL) }
    }

    #[wasm_bindgen(js_name = getItemById)]
    pub async fn get_item_by_id(&self, id: &str) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let opt = sync::get_item_by_id(db, id).await.map_err(|e| error_to_js(&e))?;
        match opt { Some(row) => serialize_to_js(&row), None => Ok(JsValue::NULL) }
    }

    #[wasm_bindgen(js_name = getItemsGmailByDateDesc)]
    pub async fn get_items_gmail_by_date_desc(&self, limit: u32) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(sync::get_items_gmail_by_date_desc(db, limit).await)
    }

    #[wasm_bindgen(js_name = getItemsBySource)]
    pub async fn get_items_by_source(&self, source_type: &str, limit: u32, offset: u32) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        wasm_result(sync::get_items_by_source(db, source_type, limit, offset).await)
    }

    #[wasm_bindgen(js_name = getEmailClassifications)]
    pub async fn get_email_classifications(&self, action_filter: Option<String>, limit: Option<u32>) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let filter = action_filter.as_deref();
        wasm_result(classifications::get_classifications(db, filter, limit).await)
    }

    #[wasm_bindgen(js_name = updateEmailClassificationStatus)]
    pub async fn update_email_classification_status(&self, email_id: &str, status: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        classifications::update_classification_status(db, email_id, status).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearEmailClassifications)]
    pub async fn clear_email_classifications(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        classifications::clear_classifications(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteEmailClassification)]
    pub async fn delete_email_classification(&self, email_id: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        classifications::delete_classification(db, email_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = deleteEmailClassificationsByAction)]
    pub async fn delete_email_classifications_by_action(&self, action: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        classifications::delete_classifications_by_action(db, action).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = putEmailClassification)]
    pub async fn put_email_classification(
        &self,
        email_id: &str,
        action: Option<String>,
        category: Option<String>,
        reason: Option<String>,
        summary: Option<String>,
        tags: Option<String>,
        subject: Option<String>,
        from: Option<String>,
        date: Option<f64>,
        scanned_at: Option<f64>,
        status: Option<String>,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        classifications::put_classification(
            db, email_id,
            action.as_deref(), category.as_deref(), reason.as_deref(),
            summary.as_deref(), tags.as_deref(),
            subject.as_deref(), from.as_deref(),
            date.map(|f| f as i64), scanned_at.map(|f| f as i64),
            status.as_deref(),
        )
        .await
        .map_err(|e| error_to_js(&e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn placeholder() {
        assert!(true);
    }
}
