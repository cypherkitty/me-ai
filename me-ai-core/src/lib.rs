//! me-ai-core: business logic and IndexedDB persistence via Rexie (WASM).
//!
//! **Architecture: Rust owns all DB access; no JS adapter.**
//! - Persistence is IndexedDB via the Rexie crate. No SQL; stores and indexes only.
//! - TS calls core WASM methods only; no query/exec from the app layer.
//!
//! Error handling: [thiserror](https://docs.rs/thiserror) + [anyhow](https://docs.rs/anyhow) internally;
//! errors are converted to JsValue at the WASM boundary.

mod api;
mod db;
mod integrations;
mod storage;
mod error;
mod formatting;
mod llm;
mod plugins;

use js_sys::Function;
use serde::de::DeserializeOwned;
use wasm_bindgen::prelude::*;

use crate::db::RexieDb;
use crate::error::{to_js as error_to_js, CoreError};

/// Deserialize a JsValue into a Rust type, mapping errors to JsValue.
fn from_js<T: DeserializeOwned>(val: JsValue) -> Result<T, JsValue> {
    serde_wasm_bindgen::from_value(val)
        .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))
}
use crate::llm::models::{ApiModel, OllamaModel, OnnxModel, OnnxModelGroup};
use crate::llm::ollama::{OllamaConnectionResult, OllamaModelTag};
use crate::llm::triage::TriageClassification;
use crate::plugins::{ActionInput, ActionMetadata, ActionOverrideInput, EventInput, PipelineBatchResult, PipelineResult, PluginDefinition, PluginForPrompt};
use crate::formatting::ParsedApiError;
use crate::storage::settings::SettingValue;
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

    #[wasm_bindgen(js_name = loadSettings)]
    pub async fn load_settings(&self) -> Result<SettingValue, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::settings::load_settings(db).await?)
    }

    #[wasm_bindgen(js_name = saveSettings)]
    pub async fn save_settings(&self, sv: SettingValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::settings::save_settings(db, &sv).await?)
    }

    #[wasm_bindgen(js_name = removeSetting)]
    pub async fn remove_setting(&self, key: &str) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::schema::remove_setting(db, key).await?)
    }

    // ── Token accessors ────────────────────────────────────────────────

    #[wasm_bindgen(js_name = getGoogleToken)]
    pub async fn get_google_token(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let token = storage::settings::get_google_token(db)
            .await
            .map_err(|e| error_to_js(&e))?;
        serde_wasm_bindgen::to_value(&token)
            .map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
    }

    #[wasm_bindgen(js_name = saveGoogleToken)]
    pub async fn save_google_token(
        &self,
        access_token: &str,
        expires_in: f64,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let expires_at = js_sys::Date::now() + expires_in * 1000.0;
        storage::settings::save_google_token(db, access_token, expires_at)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearGoogleToken)]
    pub async fn clear_google_token(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        storage::settings::clear_google_token(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = isGoogleTokenValid)]
    pub async fn is_google_token_valid(&self) -> Result<bool, JsValue> {
        let db = self.rexie_db.db();
        storage::settings::is_google_token_valid(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getGoogleTokenTTL)]
    pub async fn get_google_token_ttl(&self) -> Result<f64, JsValue> {
        let db = self.rexie_db.db();
        storage::settings::get_google_token_ttl(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTwitterToken)]
    pub async fn get_twitter_token(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let token = storage::settings::get_twitter_token(db)
            .await
            .map_err(|e| error_to_js(&e))?;
        serde_wasm_bindgen::to_value(&token)
            .map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
    }

    #[wasm_bindgen(js_name = getTwitterTokenRaw)]
    pub async fn get_twitter_token_raw(&self) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let token = storage::settings::get_twitter_token_raw(db)
            .await
            .map_err(|e| error_to_js(&e))?;
        serde_wasm_bindgen::to_value(&token)
            .map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
    }

    #[wasm_bindgen(js_name = saveTwitterToken)]
    pub async fn save_twitter_token(
        &self,
        access_token: &str,
        refresh_token: JsValue,
        expires_in: f64,
    ) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let refresh = if refresh_token.is_null() || refresh_token.is_undefined() {
            None
        } else {
            refresh_token.as_string()
        };
        let expires_at = js_sys::Date::now() + expires_in * 1000.0;
        storage::settings::save_twitter_token(db, access_token, refresh.as_deref(), expires_at)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearTwitterToken)]
    pub async fn clear_twitter_token(&self) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        storage::settings::clear_twitter_token(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[allow(clippy::too_many_arguments)]
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

    #[wasm_bindgen(js_name = getPipelineForEventResolved)]
    pub async fn get_pipeline_for_event_resolved(
        &self,
        event_type: &str,
    ) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let result = plugins::resolution::get_pipeline_for_event(db, event_type)
            .await
            .map_err(|e| error_to_js(&e))?;
        serde_wasm_bindgen::to_value(&result)
            .map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
    }

    #[wasm_bindgen(js_name = updateCategoryPipeline)]
    pub async fn update_category_pipeline(&self, category_name: &str, actions_js: JsValue) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        let actions: Vec<PipelineActionInput> = from_js(actions_js)?;
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
        event: EventInput,
        access_token: String,
        on_progress: Option<Function>,
        config: Option<JsValue>,
    ) -> Result<PipelineResult, JsValue> {
        let actions: Vec<ActionInput> = from_js(actions)?;
        let config: Option<serde_json::Value> = match config {
            Some(v) if !v.is_null() && !v.is_undefined() => Some(from_js(v)?),
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
        let actions: Vec<ActionInput> = from_js(actions)?;
        let events: Vec<EventInput> = from_js(events)?;
        let config: Option<serde_json::Value> = match config {
            Some(v) if !v.is_null() && !v.is_undefined() => Some(from_js(v)?),
            _ => None,
        };
        Ok(plugins::execute_pipeline_batch(actions, events, access_token, on_progress, config).await?)
    }

    #[wasm_bindgen(js_name = resolveAndExecutePipeline)]
    pub async fn resolve_and_execute_pipeline(
        &self,
        event: EventInput,
        approved: bool,
        actions_override: JsValue,
        on_progress: Option<Function>,
    ) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let actions_override: Option<Vec<ActionOverrideInput>> =
            if actions_override.is_null() || actions_override.is_undefined() {
                None
            } else {
                Some(from_js(actions_override)?)
            };
        let result = plugins::resolution::resolve_and_execute_pipeline(
            db,
            event,
            approved,
            actions_override,
            on_progress,
        )
        .await
        .map_err(|e| error_to_js(&e))?;
        serde_wasm_bindgen::to_value(&result)
            .map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
    }

    #[wasm_bindgen(js_name = resolveAndExecuteBatch)]
    pub async fn resolve_and_execute_batch(
        &self,
        event_type: &str,
        events: JsValue,
        approved: bool,
        on_progress: Option<Function>,
    ) -> Result<JsValue, JsValue> {
        let db = self.rexie_db.db();
        let events: Vec<serde_json::Value> = from_js(events)?;
        let result = plugins::resolution::resolve_and_execute_batch(
            db,
            event_type,
            events,
            approved,
            on_progress,
        )
        .await
        .map_err(|e| error_to_js(&e))?;
        serde_wasm_bindgen::to_value(&result)
            .map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
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

    #[wasm_bindgen(js_name = findMatchingRules)]
    pub async fn find_matching_rules(
        &self,
        event_type: &str,
        event_category: &str,
    ) -> Result<Vec<RuleView>, JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::find_matching_rules(db, event_type, event_category).await?)
    }

    #[wasm_bindgen(js_name = saveRule)]
    pub async fn save_rule(&self, payload: RuleSavePayload) -> Result<(), JsValue> {
        let db = self.rexie_db.db();
        Ok(storage::rules::save_rule(db, payload).await?)
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

    #[allow(clippy::too_many_arguments)]
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

    #[allow(clippy::too_many_arguments)]
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

    // ── ONNX model catalog ───────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = getOnnxModels)]
    pub fn get_onnx_models(&self) -> Vec<OnnxModel> {
        llm::models::get_onnx_models()
    }

    #[wasm_bindgen(js_name = getOnnxModelGroups)]
    pub fn get_onnx_model_groups(&self) -> Vec<OnnxModelGroup> {
        llm::models::get_onnx_model_groups()
    }

    #[wasm_bindgen(js_name = getOnnxModelInfo)]
    pub fn get_onnx_model_info(&self, model_id: &str) -> Option<OnnxModel> {
        llm::models::get_onnx_model_info(model_id)
    }

    // ── Ollama model catalog ─────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = getOllamaModels)]
    pub fn get_ollama_models(&self) -> Vec<OllamaModel> {
        llm::models::get_ollama_models()
    }

    #[wasm_bindgen(js_name = getOllamaModelInfo)]
    pub fn get_ollama_model_info(&self, model_name: &str) -> Option<OllamaModel> {
        llm::models::get_ollama_model_info(model_name)
    }

    #[wasm_bindgen(js_name = getRecommendedOllamaModels)]
    pub fn get_recommended_ollama_models(&self) -> Vec<OllamaModel> {
        llm::models::get_recommended_ollama_models()
    }

    // ── Ollama HTTP client ───────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = testOllamaConnection)]
    pub async fn test_ollama_connection(&self, url: &str) -> Result<OllamaConnectionResult, JsValue> {
        Ok(llm::ollama::test_ollama_connection(url).await?)
    }

    #[wasm_bindgen(js_name = listOllamaModels)]
    pub async fn list_ollama_models(&self, url: &str) -> Result<Vec<OllamaModelTag>, JsValue> {
        Ok(llm::ollama::list_ollama_models(url).await?)
    }

    // ── Formatting utilities ─────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = formatBytes)]
    pub fn format_bytes(&self, bytes: u64) -> String {
        formatting::format_bytes(bytes)
    }

    #[wasm_bindgen(js_name = formatBytesPrecise)]
    pub fn format_bytes_precise(&self, bytes: u64) -> String {
        formatting::format_bytes_precise(bytes)
    }

    #[wasm_bindgen(js_name = progressPct)]
    pub fn progress_pct(&self, loaded: u64, total: u64) -> f64 {
        formatting::progress_pct(loaded, total)
    }

    #[wasm_bindgen(js_name = truncate)]
    pub fn truncate(&self, s: &str, max_len: u32) -> String {
        formatting::truncate(s, max_len as usize)
    }

    #[wasm_bindgen(js_name = stringToHue)]
    pub fn string_to_hue(&self, s: &str) -> u32 {
        formatting::string_to_hue(s)
    }

    #[wasm_bindgen(js_name = extractName)]
    pub fn extract_name(&self, from_str: &str) -> String {
        formatting::extract_name(from_str)
    }

    #[wasm_bindgen(js_name = initial)]
    pub fn initial(&self, from_str: &str) -> String {
        formatting::initial(from_str)
    }

    #[wasm_bindgen(js_name = slugify)]
    pub fn slugify(&self, subject: &str) -> String {
        formatting::slugify(subject)
    }

    #[wasm_bindgen(js_name = shortDate)]
    pub fn short_date(&self, date_ms: f64) -> String {
        formatting::short_date(date_ms as i64)
    }

    #[wasm_bindgen(js_name = exportFilename)]
    pub fn export_filename(&self, subject: &str, date_ms: f64, ext: &str) -> String {
        formatting::export_filename(subject, date_ms as i64, ext)
    }

    // ── Triage ───────────────────────────────────────────────────────────────────

    /// Build the LLM classification system prompt.
    /// `plugin_names`: comma-separated list of active plugin names (e.g. "Gmail, Twitter/X")
    #[wasm_bindgen(js_name = buildSystemPrompt)]
    pub fn build_system_prompt(&self, plugin_names: &str) -> String {
        llm::triage::build_system_prompt(plugin_names)
    }

    /// Parse an LLM classification response. Returns None if invalid.
    #[wasm_bindgen(js_name = parseClassification)]
    pub fn parse_classification(&self, response: &str) -> Option<TriageClassification> {
        llm::triage::parse_classification(response)
    }

    /// Format an email as an LLM prompt.
    #[wasm_bindgen(js_name = formatEmailPrompt)]
    pub fn format_email_prompt(
        &self,
        subject: &str,
        from: &str,
        to: &str,
        date_ms: f64,
        labels: &str,
        body: &str,
    ) -> String {
        llm::triage::format_email_prompt(subject, from, to, date_ms as i64, labels, body)
    }

    /// CSS color for an action name.
    #[wasm_bindgen(js_name = actionColor)]
    pub fn action_color(&self, action: &str) -> String {
        llm::triage::action_color(action)
    }

    /// CSS color for a tag name.
    #[wasm_bindgen(js_name = tagColor)]
    pub fn tag_color(&self, tag: &str) -> String {
        llm::triage::tag_color(tag)
    }

    // ── Data queries for LLM context ─────────────────────────────────────────────

    /// Compact data summary for the LLM system prompt. Returns empty string if no data.
    #[wasm_bindgen(js_name = getDataSummary)]
    pub async fn get_data_summary(&self) -> Result<String, JsValue> {
        let db = self.rexie_db.db();
        let total_emails = storage::items::get_items_count_gmail(db).await.unwrap_or(0);
        if total_emails == 0 { return Ok(String::new()); }
        let total_contacts = storage::items::get_contacts_count(db).await.unwrap_or(0);
        let mut lines = vec![format!("Stored data: {} emails, {} contacts.", total_emails, total_contacts)];
        let min = storage::items::get_items_date_min(db).await.unwrap_or(None);
        let max = storage::items::get_items_date_max(db).await.unwrap_or(None);
        if let (Some(oldest), Some(newest)) = (min, max) {
            let from = formatting::short_date(oldest);
            let to = formatting::short_date(newest);
            lines.push(format!("Date range: {} to {}.", from, to));
        }
        Ok(lines.join(" "))
    }

    /// Detailed markdown summary for LLM email context.
    #[wasm_bindgen(js_name = getDetailedSummary)]
    pub async fn get_detailed_summary(&self) -> Result<String, JsValue> {
        let db = self.rexie_db.db();
        let total_emails = storage::items::get_items_count_gmail(db).await.unwrap_or(0);
        if total_emails == 0 { return Ok("No emails stored locally.".to_string()); }
        let total_contacts = storage::items::get_contacts_count(db).await.unwrap_or(0);
        let mut parts = vec![
            "## Data Summary".to_string(),
            format!("- **Emails:** {}", total_emails),
            format!("- **Contacts:** {}", total_contacts),
        ];
        let min = storage::items::get_items_date_min(db).await.unwrap_or(None);
        let max = storage::items::get_items_date_max(db).await.unwrap_or(None);
        if let (Some(oldest), Some(newest)) = (min, max) {
            parts.push(format!("- **Date range:** {} — {}", formatting::short_date(oldest), formatting::short_date(newest)));
        }
        Ok(parts.join("\n"))
    }

    /// Recent emails formatted for LLM context.
    #[wasm_bindgen(js_name = getRecentEmailsContext)]
    pub async fn get_recent_emails_context(&self, limit: u32) -> Result<String, JsValue> {
        let db = self.rexie_db.db();
        let items = storage::sync::get_items_gmail_by_date_desc(db, limit).await?;
        if items.is_empty() { return Ok("No emails stored locally.".to_string()); }
        let parts: Vec<String> = items.iter().map(format_item_for_llm).collect();
        Ok(parts.join("\n\n---\n\n"))
    }

    /// Build compact LLM context string. Returns empty string if no data.
    #[wasm_bindgen(js_name = buildLlmContext)]
    pub async fn build_llm_context(&self) -> Result<String, JsValue> {
        let summary = self.get_data_summary().await?;
        if summary.is_empty() { return Ok(String::new()); }
        let mut parts = vec![
            "You have access to the user's locally stored data.".to_string(),
            summary,
            "The user can ask you about their emails. If they do, you can see recent emails and search results that will be provided.".to_string(),
        ];
        // Check pending actions
        let db = self.rexie_db.db();
        let pending_count = storage::classifications::count_pending_classifications(db).await.unwrap_or(0);
        if pending_count > 0 {
            parts.push(format!("Pending emails awaiting manual execution: {} total.", pending_count));
            parts.push("If the user asks you to execute or handle a pending category, append [EXECUTE:CATEGORY:EVENT_TYPE] to the end of your response.".to_string());
            parts.push("If the user asks to SEE or MANAGE their events/emails/noise, append [SHOW:DASHBOARD] to the end of your response to spawn a visual dashboard for them.".to_string());
        }
        Ok(parts.join(" "))
    }

    /// Build rich email context string for LLM when user asks about emails.
    #[wasm_bindgen(js_name = buildEmailContext)]
    pub async fn build_email_context(&self, user_query: Option<String>) -> Result<String, JsValue> {
        let detailed = self.get_detailed_summary().await?;
        let mut parts = vec![detailed];

        let db = self.rexie_db.db();
        let pending_count = storage::classifications::count_pending_classifications(db).await.unwrap_or(0);
        if pending_count > 0 {
            parts.extend([
                String::new(),
                "## Pending Actions (Triage)".to_string(),
                format!("The user has {} emails awaiting manual execution.", pending_count),
                String::new(),
                "## AI Control Actions".to_string(),
                "If the user asks you to execute, process, or handle pending emails by category, you MUST output a special command tag at the very end of your response: [EXECUTE:CATEGORY:EVENT_TYPE]".to_string(),
                "If the user asks to SEE, MANAGE, or REVIEW their events/noise/emails visually, output this tag at the very end of your response: [SHOW:DASHBOARD]".to_string(),
                "Only output these tags if the user explicitly requests or confirms the action.".to_string(),
            ]);
        }

        let email_section = if let Some(q) = user_query.filter(|q| !q.is_empty()) {
            let items = storage::sync::get_items_gmail_by_date_desc(db, 50).await?;
            let q_lower = q.to_lowercase();
            let matched: Vec<String> = items.iter()
                .filter(|item| {
                    item.subject.to_lowercase().contains(&q_lower)
                        || item.from.to_lowercase().contains(&q_lower)
                        || item.to.to_lowercase().contains(&q_lower)
                        || item.snippet.to_lowercase().contains(&q_lower)
                        || item.body.to_lowercase().contains(&q_lower)
                })
                .take(5)
                .map(format_item_for_llm)
                .collect();
            if matched.is_empty() {
                "No matching emails found.".to_string()
            } else {
                format!("\n## Relevant Emails\n{}", matched.join("\n\n---\n\n"))
            }
        } else {
            let items = storage::sync::get_items_gmail_by_date_desc(db, 5).await?;
            if items.is_empty() {
                "\n## Recent Emails\nNo emails stored locally.".to_string()
            } else {
                let formatted: Vec<String> = items.iter().map(format_item_for_llm).collect();
                format!("\n## Recent Emails\n{}", formatted.join("\n\n---\n\n"))
            }
        };
        parts.push(email_section);
        Ok(parts.join("\n"))
    }

    // ── Gmail API ────────────────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = getGmailProfile)]
    pub async fn get_gmail_profile(&self, token: &str) -> Result<JsValue, JsValue> {
        api::gmail::get_profile(token).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = listGmailMessages)]
    pub async fn list_gmail_messages(&self, token: &str, max_results: u32, page_token: Option<String>, q: Option<String>) -> Result<JsValue, JsValue> {
        api::gmail::list_messages(token, max_results, page_token.as_deref(), q.as_deref()).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getGmailMessage)]
    pub async fn get_gmail_message(&self, token: &str, message_id: &str, format: &str) -> Result<JsValue, JsValue> {
        api::gmail::get_message(token, message_id, format).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getGmailMessagesBatch)]
    pub async fn get_gmail_messages_batch(&self, token: &str, message_ids: Vec<String>, batch_size: u32) -> Result<JsValue, JsValue> {
        api::gmail::get_messages_batch(token, message_ids, batch_size).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = listGmailHistory)]
    pub async fn list_gmail_history(&self, token: &str, start_history_id: &str, page_token: Option<String>, max_results: u32) -> Result<JsValue, JsValue> {
        api::gmail::list_history(token, start_history_id, page_token.as_deref(), max_results).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = parseGmailBody)]
    pub fn parse_gmail_body(&self, message_json: &str) -> String {
        api::gmail::parse_gmail_body(message_json)
    }

    #[wasm_bindgen(js_name = parseGmailHtmlBody)]
    pub fn parse_gmail_html_body(&self, message_json: &str) -> Option<String> {
        api::gmail::parse_gmail_html_body(message_json)
    }

    #[wasm_bindgen(js_name = getGmailHeader)]
    pub fn get_gmail_header(&self, message_json: &str, header_name: &str) -> String {
        api::gmail::get_gmail_header(message_json, header_name)
    }

    // ── Twitter API ──────────────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = getTwitterMe)]
    pub async fn get_twitter_me(&self, token: &str) -> Result<JsValue, JsValue> {
        api::twitter::get_me(token).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTwitterTimeline)]
    pub async fn get_twitter_timeline(&self, token: &str, user_id: &str, max_results: u32, pagination_token: Option<String>) -> Result<JsValue, JsValue> {
        api::twitter::get_user_timeline(token, user_id, max_results, pagination_token.as_deref()).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTwitterMentions)]
    pub async fn get_twitter_mentions(&self, token: &str, user_id: &str, max_results: u32, pagination_token: Option<String>) -> Result<JsValue, JsValue> {
        api::twitter::get_user_mentions(token, user_id, max_results, pagination_token.as_deref()).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = searchTwitterRecentTweets)]
    pub async fn search_twitter_recent_tweets(&self, token: &str, query: &str, max_results: u32) -> Result<JsValue, JsValue> {
        api::twitter::search_recent_tweets(token, query, max_results).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTwitterTweet)]
    pub async fn get_twitter_tweet(&self, token: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::get_tweet(token, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterLike)]
    pub async fn twitter_like(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::like_tweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterUnlike)]
    pub async fn twitter_unlike(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::unlike_tweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterRetweet)]
    pub async fn twitter_retweet(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::retweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterUnretweet)]
    pub async fn twitter_unretweet(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::unretweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterBookmark)]
    pub async fn twitter_bookmark(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::bookmark_tweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterRemoveBookmark)]
    pub async fn twitter_remove_bookmark(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::remove_bookmark(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterMuteUser)]
    pub async fn twitter_mute_user(&self, token: &str, source_user_id: &str, target_user_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::mute_user(token, source_user_id, target_user_id).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = twitterBlockUser)]
    pub async fn twitter_block_user(&self, token: &str, source_user_id: &str, target_user_id: &str) -> Result<JsValue, JsValue> {
        api::twitter::block_user(token, source_user_id, target_user_id).await.map_err(|e| error_to_js(&e))
    }

    // ── Error parsing ────────────────────────────────────────────────────────────

    #[wasm_bindgen(js_name = parseApiError)]
    pub fn parse_api_error(&self, message: &str, status: u32) -> ParsedApiError {
        formatting::parse_api_error(message, status)
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
        let api_key_raw = storage::schema::get_setting(db, &key_name)
            .await?
            .ok_or_else(|| JsValue::from_str(
                &format!("No API key configured for {provider}. Please check your settings."),
            ))?;
        let api_key = serde_json::from_str::<String>(&api_key_raw).unwrap_or(api_key_raw);

        Ok(llm::client::stream_api_chat(provider, model_name, &api_key, msgs, opts, on_token).await?)
    }
}

fn format_item_for_llm(item: &crate::storage::sync::ItemRow) -> String {
    let date = if let Some(d) = item.date {
        if d > 0 { crate::formatting::short_date(d) } else { "Unknown date".to_string() }
    } else {
        "Unknown date".to_string()
    };
    let body = crate::formatting::truncate(&item.body, 500);
    [
        format!("**Subject:** {}", item.subject),
        format!("**From:** {}", item.from),
        format!("**To:** {}", item.to),
        format!("**Date:** {}", date),
        String::new(),
        body,
    ].join("\n")
}
