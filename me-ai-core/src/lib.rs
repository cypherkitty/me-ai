//! me-ai-core: business logic and IndexedDB persistence via Rexie (WASM).
//!
//! **Architecture: Rust owns all DB access; no JS adapter.**
//! - Persistence is IndexedDB via the Rexie crate. No SQL; stores and indexes only.
//! - TS calls core WASM methods only; no query/exec from the app layer.
//!
//! Error handling: [thiserror](https://docs.rs/thiserror) + [anyhow](https://docs.rs/anyhow) internally;
//! errors are converted to JsValue at the WASM boundary.

mod db;
mod storage;
mod error;
mod llm;
mod plugins;

use js_sys::Function;
use wasm_bindgen::prelude::*;

use crate::db::RexieDb;
use crate::error::{to_js as error_to_js, CoreError};
use crate::llm::models::ApiModel;
use crate::plugins::{ActionInput, ActionMetadata, EventInput, PipelineBatchResult, PipelineResult, PluginDefinition, PluginForPrompt};
use crate::storage::audit::{AuditStats, GetAuditLogResult};
use crate::storage::catalog::{ActionRow, PluginSummary, SourceRow};
use crate::storage::classifications::ClassificationRow;
use crate::storage::events::{EventCategoryRow, EventTypeRow};
use crate::storage::pipelines::{PipelineActionInput, PipelineActionRow};
use crate::storage::rules::{EventRow, RuleSavePayload, RuleView};
use crate::storage::sync::{ContactRow, ItemRow, SyncStateRow};

/// Core instance. Rexie is built once at init (meta-secret WasmRepo pattern).
#[wasm_bindgen(js_name = MeAiCore)]
pub struct MeAiCore {
    rexie_db: RexieDb,
}

#[wasm_bindgen(js_class = MeAiCore)]
impl MeAiCore {
    /// Build Rexie once. Call after WASM module is loaded. Returns core instance.
    #[wasm_bindgen(constructor)]
    #[allow(deprecated)]
    pub async fn new() -> Result<MeAiCore, JsValue> {
        let rexie_db = RexieDb::new().await.map_err(|e| error_to_js(&e))?;
        Ok(MeAiCore { rexie_db })
    }

    #[wasm_bindgen(js_name = getEventTypes)]
    pub async fn get_event_types(&self) -> Result<Vec<EventTypeRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::events::get_event_types(db).await?)
    }

    #[wasm_bindgen(js_name = getEventCategories)]
    pub async fn get_event_categories(&self) -> Result<Vec<EventCategoryRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::events::get_event_categories(db).await?)
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
        Ok(storage::events::upsert_event_type(db, name, label, category_name, auto_created).await?)
    }

    #[wasm_bindgen(js_name = getSources)]
    pub async fn get_sources(&self) -> Result<Vec<SourceRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::catalog::get_sources(db).await?)
    }

    #[wasm_bindgen(js_name = getActions)]
    pub async fn get_actions(&self) -> Result<Vec<ActionRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::catalog::get_actions(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsCount)]
    pub async fn get_items_count(&self) -> Result<i64, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::items::get_items_count(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsCountGmail)]
    pub async fn get_items_count_gmail(&self) -> Result<i64, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::items::get_items_count_gmail(db).await?)
    }

    #[wasm_bindgen(js_name = getContactsCount)]
    pub async fn get_contacts_count(&self) -> Result<i64, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::items::get_contacts_count(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsDateMin)]
    pub async fn get_items_date_min(&self) -> Result<Option<i64>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::items::get_items_date_min(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsDateMax)]
    pub async fn get_items_date_max(&self) -> Result<Option<i64>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::items::get_items_date_max(db).await?)
    }

    #[wasm_bindgen(js_name = getEmailClassificationsCount)]
    pub async fn get_email_classifications_count(&self) -> Result<i64, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::items::get_email_classifications_count(db).await?)
    }

    #[wasm_bindgen(js_name = createSchemaAndMigrations)]
    pub async fn create_schema_and_migrations(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::create_schema_and_migrations(db).await?)
    }

    #[wasm_bindgen(js_name = getTableCount)]
    pub async fn get_table_count(&self, table: &str) -> Result<i64, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::get_table_count(db, table).await?)
    }

    #[wasm_bindgen(js_name = clearAllData)]
    pub async fn clear_all_data(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::clear_all_data(db).await?)
    }

    #[wasm_bindgen(js_name = getSetting)]
    pub async fn get_setting(&self, key: &str) -> Result<Option<String>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::get_setting(db, key).await?)
    }

    #[wasm_bindgen(js_name = setSetting)]
    pub async fn set_setting(&self, key: &str, value: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::set_setting(db, key, value).await?)
    }

    #[wasm_bindgen(js_name = removeSetting)]
    pub async fn remove_setting(&self, key: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::remove_setting(db, key).await?)
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
        Ok(storage::audit::log_execution(
            db, id, email_id, subject, from, event_type,
            executed_at as i64, success, error, steps_json,
        )
        .await?)
    }

    #[wasm_bindgen(js_name = syncAfterAuditExecution)]
    pub async fn sync_after_audit_execution(&self, email_id: &str, delete_item: bool) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::audit::sync_after_execution(db, email_id, delete_item).await?)
    }

    #[wasm_bindgen(js_name = getAuditLog)]
    pub async fn get_audit_log(&self, limit: u32, offset: u32, failures_only: bool) -> Result<GetAuditLogResult, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::audit::get_audit_log(db, limit as i64, offset as i64, failures_only).await?)
    }

    #[wasm_bindgen(js_name = clearAuditLog)]
    pub async fn clear_audit_log(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::audit::clear_audit_log(db).await?)
    }

    #[wasm_bindgen(js_name = getAuditStats)]
    pub async fn get_audit_stats(&self) -> Result<AuditStats, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::audit::get_audit_stats(db).await?)
    }

    #[wasm_bindgen(js_name = getCategoryPipelineActions)]
    pub async fn get_category_pipeline_actions(&self, category_name: &str) -> Result<Vec<PipelineActionRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::get_category_pipeline_actions(db, category_name).await?)
    }

    #[wasm_bindgen(js_name = getTypePipelineActions)]
    pub async fn get_type_pipeline_actions(&self, type_name: &str) -> Result<Vec<PipelineActionRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::get_type_pipeline_actions(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = getEventTypeCategory)]
    pub async fn get_event_type_category(&self, type_name: &str) -> Result<Option<String>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::get_event_type_category(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = getEventCategoryPolicy)]
    pub async fn get_event_category_policy(&self, category_name: &str) -> Result<Option<String>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::get_event_category_policy(db, category_name).await?)
    }

    #[wasm_bindgen(js_name = updateCategoryPipeline)]
    pub async fn update_category_pipeline(&self, category_name: &str, actions_js: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let actions: Vec<PipelineActionInput> = serde_wasm_bindgen::from_value(actions_js)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let pairs: Vec<(String, String)> = actions
            .into_iter()
            .map(|a| (a.plugin_id, a.command_id))
            .collect();
        Ok(storage::pipelines::update_category_pipeline(db, category_name, &pairs).await?)
    }

    #[wasm_bindgen(js_name = updateCategoryPolicy)]
    pub async fn update_category_policy(&self, category_name: &str, policy: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::update_category_policy(db, category_name, policy).await?)
    }

    #[wasm_bindgen(js_name = updateEventTypeCategory)]
    pub async fn update_event_type_category(&self, type_name: &str, category_name: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::update_event_type_category(db, type_name, category_name).await?)
    }

    #[wasm_bindgen(js_name = clearEventTypeCategory)]
    pub async fn clear_event_type_category(&self, type_name: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::clear_event_type_category(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = deleteEventType)]
    pub async fn delete_event_type(&self, type_name: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::delete_event_type(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = setSourceEnabled)]
    pub async fn set_source_enabled(&self, name: &str, enabled: bool) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::set_source_enabled(db, name, enabled).await?)
    }

    #[wasm_bindgen(js_name = setPluginEnabled)]
    pub async fn set_plugin_enabled(&self, name: &str, enabled: bool) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::pipelines::set_plugin_enabled(db, name, enabled).await?)
    }

    #[wasm_bindgen(js_name = deleteSyncState)]
    pub async fn delete_sync_state(&self, source_type: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::delete_sync_state(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = deleteItemsBySource)]
    pub async fn delete_items_by_source(&self, source_type: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::delete_items_by_source(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = clearContacts)]
    pub async fn clear_contacts(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::clear_contacts(db).await?)
    }

    #[wasm_bindgen(js_name = clearItemsSyncContacts)]
    pub async fn clear_items_sync_contacts(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::clear_items_sync_contacts(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsCountBySource)]
    pub async fn get_items_count_by_source(&self, source_type: &str) -> Result<i64, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_items_count_by_source(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = getSyncState)]
    pub async fn get_sync_state(&self, source_type: &str) -> Result<Option<SyncStateRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_sync_state(db, source_type).await?)
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
        Ok(storage::sync::upsert_sync_state(db, source_type, history_id, last_sync_at as i64, total_items as i64, oldest_page_token)
            .await?)
    }

    #[wasm_bindgen(js_name = insertItemsBatch)]
    pub async fn insert_items_batch(&self, rows: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::insert_items_batch(db, rows).await?)
    }

    #[wasm_bindgen(js_name = insertSyncStateBatch)]
    pub async fn insert_sync_state_batch(&self, rows: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::insert_sync_state_batch(db, rows).await?)
    }

    #[wasm_bindgen(js_name = insertContactsBatch)]
    pub async fn insert_contacts_batch(&self, rows: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::insert_contacts_batch(db, rows).await?)
    }

    #[wasm_bindgen(js_name = deleteItemsByIds)]
    pub async fn delete_items_by_ids(&self, ids: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::delete_items_by_ids(db, ids).await?)
    }

    #[wasm_bindgen(js_name = getContactByEmail)]
    pub async fn get_contact_by_email(&self, email: &str) -> Result<Option<ContactRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_contact_by_email(db, email).await?)
    }

    #[wasm_bindgen(js_name = upsertContact)]
    pub async fn upsert_contact(&self, email: &str, name: &str, first_seen: f64, last_seen: f64) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::upsert_contact(db, email, name, first_seen as i64, last_seen as i64).await?)
    }

    #[wasm_bindgen(js_name = getPlugins)]
    pub async fn get_plugins(&self) -> Result<Vec<PluginSummary>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::catalog::get_plugins(db).await?)
    }

    #[wasm_bindgen(js_name = getPluginRegistry)]
    pub fn get_plugin_registry(&self) -> Result<Vec<PluginDefinition>, JsValue> {
        Ok(plugins::get_plugin_registry())
    }

    #[wasm_bindgen(js_name = getAvailableActions)]
    pub fn get_available_actions(&self, source: &str) -> Result<Vec<ActionMetadata>, JsValue> {
        Ok(plugins::get_available_actions(plugins::PluginId::from_source(source)))
    }

    #[wasm_bindgen(js_name = getRequiredScopes)]
    pub fn get_required_scopes(&self, action_id: &str, source: &str) -> Result<Vec<String>, JsValue> {
        Ok(plugins::get_required_scopes(action_id, plugins::PluginId::from_source(source)))
    }

    #[wasm_bindgen(js_name = resolvePluginId)]
    pub fn resolve_plugin_id(&self, source: &str) -> String {
        plugins::resolve_plugin_id(source)
    }

    #[wasm_bindgen(js_name = getPluginsForPrompt)]
    pub fn get_plugins_for_prompt(&self) -> Result<Vec<PluginForPrompt>, JsValue> {
        Ok(plugins::get_plugins_for_prompt())
    }

    #[wasm_bindgen(js_name = executePipeline)]
    pub async fn execute_pipeline(
        &self,
        actions: JsValue,
        event: JsValue,
        access_token: String,
        on_progress: Option<Function>,
        config: Option<JsValue>,
    ) -> Result<PipelineResult, JsValue> {
        let actions: Vec<ActionInput> = serde_wasm_bindgen::from_value(actions)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let event: EventInput = serde_wasm_bindgen::from_value(event)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let config: Option<serde_json::Value> = match config {
            Some(v) if !v.is_null() && !v.is_undefined() => {
                Some(serde_wasm_bindgen::from_value(v).map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?)
            }
            _ => None,
        };
        Ok(plugins::execute_pipeline(actions, event, access_token, on_progress, config).await?)
    }

    #[wasm_bindgen(js_name = executePipelineBatch)]
    pub async fn execute_pipeline_batch(
        &self,
        actions: JsValue,
        events: JsValue,
        access_token: String,
        on_progress: Option<Function>,
        config: Option<JsValue>,
    ) -> Result<PipelineBatchResult, JsValue> {
        let actions: Vec<ActionInput> = serde_wasm_bindgen::from_value(actions)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let events: Vec<EventInput> = serde_wasm_bindgen::from_value(events)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let config: Option<serde_json::Value> = match config {
            Some(v) if !v.is_null() && !v.is_undefined() => {
                Some(serde_wasm_bindgen::from_value(v).map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?)
            }
            _ => None,
        };
        Ok(plugins::execute_pipeline_batch(actions, events, access_token, on_progress, config).await?)
    }

    #[wasm_bindgen(js_name = getRules)]
    pub async fn get_rules(&self) -> Result<Vec<RuleView>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::get_rules(db).await?)
    }

    #[wasm_bindgen(js_name = getRule)]
    pub async fn get_rule(&self, id: &str) -> Result<Option<RuleView>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::get_rule(db, id).await?)
    }

    #[wasm_bindgen(js_name = saveRule)]
    pub async fn save_rule(&self, payload: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let v: RuleSavePayload = serde_wasm_bindgen::from_value(payload)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        Ok(storage::rules::save_rule(db, v).await?)
    }

    #[wasm_bindgen(js_name = deleteRule)]
    pub async fn delete_rule(&self, id: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::delete_rule(db, id).await?)
    }

    #[wasm_bindgen(js_name = getEvents)]
    pub async fn get_events(&self, limit: u32, offset: u32) -> Result<Vec<EventRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::get_events(db, limit, offset).await?)
    }

    #[wasm_bindgen(js_name = updateEventStatus)]
    pub async fn update_event_status(&self, id: &str, status: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::update_event_status(db, id, status).await?)
    }

    #[wasm_bindgen(js_name = clearEvents)]
    pub async fn clear_events(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::clear_events(db).await?)
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
        Ok(storage::rules::insert_event(
            db, id,
            content.as_deref(), subject.as_deref(), sender.as_deref(),
            timestamp as i64,
            status.as_deref(), event_type.as_deref(), event_category.as_deref(),
            source_name.as_deref(), rule_id.as_deref(),
            actions_taken.as_deref(), output.as_deref(),
        )
        .await?)
    }

    #[wasm_bindgen(js_name = getNewestSourceId)]
    pub async fn get_newest_source_id(&self, source_type: &str) -> Result<Option<String>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_newest_source_id(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = getItemById)]
    pub async fn get_item_by_id(&self, id: &str) -> Result<Option<ItemRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_item_by_id(db, id).await?)
    }

    #[wasm_bindgen(js_name = getItemsGmailByDateDesc)]
    pub async fn get_items_gmail_by_date_desc(&self, limit: u32) -> Result<Vec<ItemRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_items_gmail_by_date_desc(db, limit).await?)
    }

    #[wasm_bindgen(js_name = getItemsBySource)]
    pub async fn get_items_by_source(&self, source_type: &str, limit: u32, offset: u32) -> Result<Vec<ItemRow>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::sync::get_items_by_source(db, source_type, limit, offset).await?)
    }

    #[wasm_bindgen(js_name = getEmailClassifications)]
    pub async fn get_email_classifications(&self, action_filter: Option<String>, limit: Option<u32>) -> Result<Vec<ClassificationRow>, JsValue> {
        let db = self.rexie_db.db();
        let filter = action_filter.as_deref();
        Ok(storage::classifications::get_classifications(db, filter, limit).await?)
    }

    #[wasm_bindgen(js_name = updateEmailClassificationStatus)]
    pub async fn update_email_classification_status(&self, email_id: &str, status: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::classifications::update_classification_status(db, email_id, status).await?)
    }

    #[wasm_bindgen(js_name = clearEmailClassifications)]
    pub async fn clear_email_classifications(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::classifications::clear_classifications(db).await?)
    }

    #[wasm_bindgen(js_name = deleteEmailClassification)]
    pub async fn delete_email_classification(&self, email_id: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::classifications::delete_classification(db, email_id).await?)
    }

    #[wasm_bindgen(js_name = deleteEmailClassificationsByAction)]
    pub async fn delete_email_classifications_by_action(&self, action: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::classifications::delete_classifications_by_action(db, action).await?)
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
        Ok(storage::classifications::put_classification(
            db, email_id,
            action.as_deref(), category.as_deref(), reason.as_deref(),
            summary.as_deref(), tags.as_deref(),
            subject.as_deref(), from.as_deref(),
            date.map(|f| f as i64), scanned_at.map(|f| f as i64),
            status.as_deref(),
        )
        .await?)
    }

    // -----------------------------------------------------------------------
    // LLM: model catalog and streaming chat
    // -----------------------------------------------------------------------

    /// Get all cloud API model definitions
    #[wasm_bindgen(js_name = getApiModels)]
    pub fn get_api_models(&self) -> Result<Vec<ApiModel>, JsValue> {
        Ok(llm::models::get_api_models())
    }

    /// Get a single model by ID
    #[wasm_bindgen(js_name = getApiModelInfo)]
    pub fn get_api_model_info(&self, model_id: &str) -> Result<Option<ApiModel>, JsValue> {
        Ok(llm::models::get_api_model_info(model_id))
    }

    /// Test API connection for a provider
    #[wasm_bindgen(js_name = testApiConnection)]
    pub async fn test_api_connection(&self, provider: &str, api_key: &str) -> Result<bool, JsValue> {
        Ok(llm::client::test_api_connection(provider, api_key).await?)
    }

    /// Stream chat completion from a cloud API provider.
    /// `on_token` receives TokenPayload JSON objects during streaming.
    #[wasm_bindgen(js_name = streamChat)]
    pub async fn stream_chat(
        &self,
        provider: &str,
        model_name: &str,
        messages: JsValue,
        options: JsValue,
        on_token: &Function,
    ) -> Result<(), JsValue> {
        let msgs: Vec<llm::client::ChatMessage> = serde_wasm_bindgen::from_value(messages)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
        let opts: llm::client::StreamOptions = serde_wasm_bindgen::from_value(options)
            .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;

        // Fetch API key from IndexedDB settings
        let db = self.rexie_db.db();
        let key_name = format!("{provider}ApiKey");
        let api_key = storage::schema::get_setting(db, &key_name)
            .await?
            .ok_or_else(|| JsValue::from_str(
                &format!("No API key configured for {provider}. Please check your settings."),
            ))?;

        Ok(llm::client::stream_api_chat(provider, model_name, &api_key, msgs, opts, on_token).await?)
    }
}
