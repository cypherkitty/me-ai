//! me-ai-core: business logic and `IndexedDB` persistence via Rexie (WASM).
//!
//! **Architecture: Rust owns all DB access; no JS adapter.**
//! - Persistence is `IndexedDB` via the Rexie crate. No SQL; stores and indexes only.
//! - TS calls core WASM methods only; no query/exec from the app layer.
//!
//! Error handling: [thiserror](https://docs.rs/thiserror) + [anyhow](https://docs.rs/anyhow) internally;
//! errors are converted to [`JsValue`](wasm_bindgen::JsValue) at the WASM boundary.

mod api;
mod db;
mod integrations;
mod storage;
mod sync;
mod error;
mod formatting;
mod chat_session;
pub use chat_session::{
    ChatSessionRecord, ChatSessionsLoadResult, ChatSessionsSnapshot, ChatTitleSource, ChatTitleStatus,
    PersistedChatMessage,
};
mod event_ui;
mod llm;
mod oauth;
mod plugins;
mod time_util;

use js_sys::Function;
use wasm_bindgen::prelude::*;
use web_sys::AbortSignal;

use crate::db::RexieDb;
use crate::error::{to_js as error_to_js, CoreError};
use crate::llm::models::{ApiModel, OllamaModel, OllamaModelGroup, OnnxModel, OnnxModelGroup};
use crate::llm::ollama::{OllamaConnectionResult, OllamaModelTag};
use crate::llm::triage::TriageClassification;
use crate::plugins::{ActionInput, ActionMetadata, ActionOverrideInput, EventInput, PipelineBatchResult, PipelineResult, PluginDefinition, PluginForPrompt};
use crate::plugins::resolution::{
    PipelineActionDisplay, PipelineForEventResult, ResolveBatchResult, ResolveExecuteResult,
};
use crate::formatting::ParsedApiError;
use crate::storage::aggregations::{CategoryPipelineView, EventStatsResult, PendingApprovalView, PendingItemByCategoryResult};
use crate::oauth::twitter::{TwitterOAuthLoginStart, TwitterOAuthTokens};
use crate::storage::settings::{GoogleToken, SettingValue, TwitterPkcePending, TwitterToken};
use crate::storage::audit::{AuditStats, GetAuditLogParsedResult, GetAuditLogResult};
use crate::storage::catalog::{ActionRow, PluginSummary, SourceRow};
use crate::storage::classifications::{ClassificationRow, ClassificationDoc, ClassificationsByCategory, ClassificationCounts};
use crate::storage::events::{EventCategoryRow, EventCategoryTier, EventTypeRow};
use crate::storage::pipelines::{PipelineActionInput, PipelineActionRow};
use crate::storage::rules::{CreateRulePayload, EventRow, RuleSavePayload, RuleUpdateInput, RuleView};
use crate::storage::sync::{
    ContactRow, ContactInput, GetStoredEmailsResult, ItemInput, ItemRow, SyncStateInput, SyncStateRow,
};
use crate::sync::{SyncResult, SyncStatus};

pub use llm::ollama_engine::OllamaLlmEngine;

/// Core instance. Rexie is built once at init (meta-secret WasmRepo pattern).
#[wasm_bindgen(js_name = MeAiCore)]
pub struct MeAiCore {
    rexie_db: RexieDb,
}

impl MeAiCore {
    pub(crate) fn rexie_db(&self) -> &RexieDb {
        &self.rexie_db
    }
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
        let db = &self.rexie_db;
        Ok(storage::events::get_event_types(db).await?)
    }

    #[wasm_bindgen(js_name = getEventCategories)]
    pub async fn get_event_categories(&self) -> Result<Vec<EventCategoryRow>, JsValue> {
        let db = &self.rexie_db;
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
        let db = &self.rexie_db;
        Ok(storage::events::upsert_event_type(db, name, label, category_name, auto_created).await?)
    }

    /// Static 3-tier definitions: NOISE / INFO / CRITICAL.
    #[wasm_bindgen(js_name = getEventCategoryTiers)]
    pub fn get_event_category_tiers(&self) -> Vec<EventCategoryTier> {
        storage::events::get_event_category_tiers()
    }

    /// Seed event type from LLM classification (normalize + upsert).
    #[wasm_bindgen(js_name = seedEventTypeFromLLM)]
    pub async fn seed_event_type_from_llm(&self, event_type: &str, category: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::events::seed_event_type_from_llm(db, event_type, category).await?)
    }

    /// All known event type names (from eventTypes store + classifications).
    #[wasm_bindgen(js_name = getAllEventTypes)]
    pub async fn get_all_event_types(&self) -> Result<Vec<String>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::events::get_all_event_types(db).await?)
    }

    /// Static tier copy for dashboard (NOISE / INFO / CRITICAL).
    #[wasm_bindgen(js_name = getEventCategoryTierDefinitions)]
    pub fn get_event_category_tier_definitions(&self) -> JsValue {
        event_ui::get_event_category_tier_definitions()
    }

    /// Static category rows keyed by lowercase name (`noise`, `info`, `critical`).
    #[wasm_bindgen(js_name = getEventCategoriesStatic)]
    pub fn get_event_categories_static(&self) -> JsValue {
        event_ui::get_event_categories_static()
    }

    /// Look up the category tier for an event type.
    #[wasm_bindgen(js_name = getCategoryForEventType)]
    pub async fn get_category_for_event_type(&self, event_type: &str) -> Result<String, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::events::get_category_for_event_type(db, event_type).await?)
    }

    /// Normalize a raw category string to NOISE / INFO / CRITICAL.
    #[wasm_bindgen(js_name = normalizeCategory)]
    pub fn normalize_category(&self, raw: &str) -> String {
        storage::events::normalize_category(raw).to_string()
    }

    #[wasm_bindgen(js_name = getSources)]
    pub async fn get_sources(&self) -> Result<Vec<SourceRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::catalog::get_sources(db).await?)
    }

    #[wasm_bindgen(js_name = getActions)]
    pub async fn get_actions(&self) -> Result<Vec<ActionRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::catalog::get_actions(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsCount)]
    pub async fn get_items_count(&self) -> Result<i64, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_items_count(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsCountGmail)]
    pub async fn get_items_count_gmail(&self) -> Result<i64, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_items_count_gmail(db).await?)
    }

    #[wasm_bindgen(js_name = getContactsCount)]
    pub async fn get_contacts_count(&self) -> Result<i64, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_contacts_count(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsDateMin)]
    pub async fn get_items_date_min(&self) -> Result<Option<i64>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_items_date_min(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsDateMax)]
    pub async fn get_items_date_max(&self) -> Result<Option<i64>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_items_date_max(db).await?)
    }

    #[wasm_bindgen(js_name = getEmailClassificationsCount)]
    pub async fn get_email_classifications_count(&self) -> Result<i64, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_email_classifications_count(db).await?)
    }

    #[wasm_bindgen(js_name = createSchemaAndMigrations)]
    pub async fn create_schema_and_migrations(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::schema::create_schema_and_migrations(db).await?)
    }

    #[wasm_bindgen(js_name = getTableCount)]
    pub async fn get_table_count(&self, table: &str) -> Result<i64, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::schema::get_table_count(db, table).await?)
    }

    #[wasm_bindgen(js_name = clearAllData)]
    pub async fn clear_all_data(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::schema::clear_all_data(db).await?)
    }

    /// Load chat sessions from IndexedDB (`settings` key `me_ai_chat_sessions_v1`).
    #[wasm_bindgen(js_name = loadChatSessions)]
    pub async fn load_chat_sessions_store(&self) -> Result<ChatSessionsLoadResult, JsValue> {
        let db = &self.rexie_db;
        chat_session::load_chat_sessions(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = saveChatSessions)]
    pub async fn save_chat_sessions_js(
        &self,
        active_chat_id: Option<String>,
        sessions: Vec<ChatSessionRecord>,
    ) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        chat_session::save_chat_sessions(db, active_chat_id, sessions.as_slice())
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearChatSessions)]
    pub async fn clear_chat_sessions_js(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        chat_session::clear_chat_sessions(db).await.map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = createChatSession)]
    pub fn create_chat_session_wasm(&self, now: f64) -> Result<ChatSessionRecord, JsValue> {
        chat_session::create_chat_session(now).map_err(|e| error_to_js(&e))
    }

    /// Import chat sessions from a JSON snapshot string into IndexedDB.
    #[wasm_bindgen(js_name = importChatSessionsFromJson)]
    pub async fn import_chat_sessions_from_json_js(&self, json: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        chat_session::import_chat_sessions_from_json(db, json)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = loadSettings)]
    pub async fn load_settings(&self) -> Result<SettingValue, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::settings::load_settings(db).await?)
    }

    #[wasm_bindgen(js_name = saveSettings)]
    pub async fn save_settings(&self, sv: SettingValue) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::settings::save_settings(db, &sv).await?)
    }

    #[wasm_bindgen(js_name = removeSetting)]
    pub async fn remove_setting(&self, key: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::schema::remove_setting(db, key).await?)
    }

    // ── Token accessors ────────────────────────────────────────────────

    #[wasm_bindgen(js_name = getGoogleToken)]
    pub async fn get_google_token(&self) -> Result<Option<GoogleToken>, JsValue> {
        let db = &self.rexie_db;
        storage::settings::get_google_token(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = saveGoogleToken)]
    pub async fn save_google_token(
        &self,
        access_token: &str,
        expires_in: f64,
    ) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        let expires_at = time_util::now_ms() as f64 + expires_in * 1000.0;
        storage::settings::save_google_token(db, access_token, expires_at)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearGoogleToken)]
    pub async fn clear_google_token(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        storage::settings::clear_google_token(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = isGoogleTokenValid)]
    pub async fn is_google_token_valid(&self) -> Result<bool, JsValue> {
        let db = &self.rexie_db;
        storage::settings::is_google_token_valid(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getGoogleTokenTTL)]
    pub async fn get_google_token_ttl(&self) -> Result<f64, JsValue> {
        let db = &self.rexie_db;
        storage::settings::get_google_token_ttl(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTwitterToken)]
    pub async fn get_twitter_token(&self) -> Result<Option<TwitterToken>, JsValue> {
        let db = &self.rexie_db;
        storage::settings::get_twitter_token(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getTwitterTokenRaw)]
    pub async fn get_twitter_token_raw(&self) -> Result<Option<TwitterToken>, JsValue> {
        let db = &self.rexie_db;
        storage::settings::get_twitter_token_raw(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = saveTwitterToken)]
    pub async fn save_twitter_token(
        &self,
        access_token: &str,
        refresh_token: Option<String>,
        expires_in: f64,
    ) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        let expires_at = time_util::now_ms() as f64 + expires_in * 1000.0;
        storage::settings::save_twitter_token(db, access_token, refresh_token.as_deref(), expires_at)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = clearTwitterToken)]
    pub async fn clear_twitter_token(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        storage::settings::clear_twitter_token(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// PKCE step: verifier, state, and Twitter authorize URL. Call `saveTwitterPkcePending` before redirect.
    #[wasm_bindgen(js_name = twitterOAuthBeginLogin)]
    pub fn twitter_oauth_begin_login(
        &self,
        client_id: &str,
        redirect_uri: &str,
    ) -> Result<TwitterOAuthLoginStart, JsValue> {
        oauth::twitter::begin_login(client_id, redirect_uri).map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = saveTwitterPkcePending)]
    pub async fn save_twitter_pkce_pending_js(&self, verifier: &str, state: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        storage::settings::save_twitter_pkce_pending(db, verifier, state)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = takeTwitterPkcePending)]
    pub async fn take_twitter_pkce_pending_js(&self) -> Result<Option<TwitterPkcePending>, JsValue> {
        let db = &self.rexie_db;
        storage::settings::take_twitter_pkce_pending(db).await.map_err(|e| error_to_js(&e))
    }

    /// Exchange the OAuth `code` for tokens and persist them.
    #[wasm_bindgen(js_name = twitterOAuthExchangeCode)]
    pub async fn twitter_oauth_exchange_code(
        &self,
        client_id: &str,
        redirect_uri: &str,
        code: &str,
        code_verifier: &str,
    ) -> Result<TwitterOAuthTokens, JsValue> {
        let db = &self.rexie_db;
        let (access, refresh, exp_secs) = oauth::twitter::exchange_authorization_code(
            client_id,
            redirect_uri,
            code,
            code_verifier,
        )
        .await
        .map_err(|e| error_to_js(&e))?;
        let expires_at = crate::time_util::now_ms() as f64 + exp_secs * 1000.0;
        storage::settings::save_twitter_token(db, &access, refresh.as_deref(), expires_at)
            .await
            .map_err(|e| error_to_js(&e))?;
        Ok(TwitterOAuthTokens {
            access_token: access,
            refresh_token: refresh,
        })
    }

    /// Valid access token from storage, or refresh using stored refresh token and Twitter client id from settings.
    /// Returns a plain object `{ accessToken, refreshToken? }` or `null`.
    #[wasm_bindgen(js_name = twitterOAuthSession)]
    pub async fn twitter_oauth_session(&self) -> Result<JsValue, JsValue> {
        #[derive(serde::Serialize)]
        #[serde(rename_all = "camelCase")]
        struct Dto {
            access_token: String,
            #[serde(skip_serializing_if = "Option::is_none")]
            refresh_token: Option<String>,
        }

        let db = &self.rexie_db;
        if let Some(t) =
            storage::settings::get_twitter_token(db).await.map_err(|e| error_to_js(&e))?
        {
            let dto = Dto {
                access_token: t.access_token(),
                refresh_token: t.refresh_token(),
            };
            return serde_wasm_bindgen::to_value(&dto).map_err(|e| JsValue::from_str(&e.to_string()));
        }

        let sv = storage::settings::load_settings(db).await.map_err(|e| error_to_js(&e))?;
        let Some(cid) = sv.twitter_client_id() else {
            return Ok(JsValue::NULL);
        };
        let raw = storage::settings::get_twitter_token_raw(db)
            .await
            .map_err(|e| error_to_js(&e))?;
        let Some(refresh) = raw.as_ref().and_then(|t| t.refresh_token().filter(|s| !s.is_empty()))
        else {
            return Ok(JsValue::NULL);
        };

        let (access, refr, exp_secs) = match oauth::twitter::refresh_with_refresh_token(&cid, &refresh).await {
            Ok(x) => x,
            Err(_) => {
                let _ = storage::settings::clear_twitter_token(db).await;
                return Ok(JsValue::NULL);
            }
        };
        let expires_at = crate::time_util::now_ms() as f64 + exp_secs * 1000.0;
        storage::settings::save_twitter_token(db, &access, refr.as_deref(), expires_at)
            .await
            .map_err(|e| error_to_js(&e))?;

        let t = storage::settings::get_twitter_token(db)
            .await
            .map_err(|e| error_to_js(&e))?;
        let Some(tok) = t else {
            return Ok(JsValue::NULL);
        };
        let dto = Dto {
            access_token: tok.access_token(),
            refresh_token: tok.refresh_token(),
        };
        serde_wasm_bindgen::to_value(&dto).map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Revoke token at Twitter (best effort) and clear local Twitter token.
    #[wasm_bindgen(js_name = twitterOAuthRevoke)]
    pub async fn twitter_oauth_revoke(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        let sv = storage::settings::load_settings(db).await.map_err(|e| error_to_js(&e))?;
        if let Some(cid) = sv.twitter_client_id() {
            if let Some(tok) =
                storage::settings::get_twitter_token_raw(db).await.map_err(|e| error_to_js(&e))?
            {
                let _ = oauth::twitter::revoke_access_token(&cid, &tok.access_token()).await;
            }
        }
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
        let db = &self.rexie_db;
        Ok(storage::audit::log_execution(
            db, id, email_id, subject, from, event_type,
            executed_at as i64, success, error, steps_json,
        )
        .await?)
    }

    #[wasm_bindgen(js_name = syncAfterAuditExecution)]
    pub async fn sync_after_audit_execution(&self, email_id: &str, delete_item: bool) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::audit::sync_after_execution(db, email_id, delete_item).await?)
    }

    #[wasm_bindgen(js_name = getAuditLog)]
    pub async fn get_audit_log(&self, limit: u32, offset: u32, failures_only: bool) -> Result<GetAuditLogResult, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::audit::get_audit_log(db, limit as i64, offset as i64, failures_only).await?)
    }

    /// Audit log with `steps` pre-parsed from JSON string to array.
    #[wasm_bindgen(js_name = getAuditLogParsed)]
    pub async fn get_audit_log_parsed(
        &self,
        limit: u32,
        offset: u32,
        failures_only: bool,
    ) -> Result<GetAuditLogParsedResult, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::audit::get_audit_log_parsed(db, limit as i64, offset as i64, failures_only).await?)
    }

    #[wasm_bindgen(js_name = clearAuditLog)]
    pub async fn clear_audit_log(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::audit::clear_audit_log(db).await?)
    }

    #[wasm_bindgen(js_name = getAuditStats)]
    pub async fn get_audit_stats(&self) -> Result<AuditStats, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::audit::get_audit_stats(db).await?)
    }

    #[wasm_bindgen(js_name = getCategoryPipelineActions)]
    pub async fn get_category_pipeline_actions(&self, category_name: &str) -> Result<Vec<PipelineActionRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::get_category_pipeline_actions(db, category_name).await?)
    }

    #[wasm_bindgen(js_name = getTypePipelineActions)]
    pub async fn get_type_pipeline_actions(&self, type_name: &str) -> Result<Vec<PipelineActionRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::get_type_pipeline_actions(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = getEventTypeCategory)]
    pub async fn get_event_type_category(&self, type_name: &str) -> Result<Option<String>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::get_event_type_category(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = getEventCategoryPolicy)]
    pub async fn get_event_category_policy(&self, category_name: &str) -> Result<Option<String>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::get_event_category_policy(db, category_name).await?)
    }

    #[wasm_bindgen(js_name = getPipelineForEventResolved)]
    pub async fn get_pipeline_for_event_resolved(
        &self,
        event_type: &str,
    ) -> Result<Option<PipelineForEventResult>, JsValue> {
        let db = &self.rexie_db;
        plugins::resolution::get_pipeline_for_event(db, event_type)
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Pipeline actions formatted for the UI (`Action` list).
    #[wasm_bindgen(js_name = getActionsForEventDisplay)]
    pub async fn get_actions_for_event_display(&self, event_type: &str) -> Result<Vec<PipelineActionDisplay>, JsValue> {
        let db = &self.rexie_db;
        let p = plugins::resolution::get_pipeline_for_event(db, event_type)
            .await
            .map_err(|e| error_to_js(&e))?;
        Ok(match p {
            Some(r) => plugins::resolution::pipeline_actions_to_display(&r.actions),
            None => Vec::new(),
        })
    }

    #[wasm_bindgen(js_name = updateCategoryPipeline)]
    pub async fn update_category_pipeline(&self, category_name: &str, actions: Vec<PipelineActionInput>) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        let pairs: Vec<(String, String)> = actions
            .into_iter()
            .map(|a| (a.plugin_id, a.command_id))
            .collect();
        Ok(storage::pipelines::update_category_pipeline(db, category_name, &pairs).await?)
    }

    #[wasm_bindgen(js_name = updateCategoryPolicy)]
    pub async fn update_category_policy(&self, category_name: &str, policy: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::update_category_policy(db, category_name, policy).await?)
    }

    #[wasm_bindgen(js_name = updateEventTypeCategory)]
    pub async fn update_event_type_category(&self, type_name: &str, category_name: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::update_event_type_category(db, type_name, category_name).await?)
    }

    #[wasm_bindgen(js_name = clearEventTypeCategory)]
    pub async fn clear_event_type_category(&self, type_name: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::clear_event_type_category(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = deleteEventType)]
    pub async fn delete_event_type(&self, type_name: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::delete_event_type(db, type_name).await?)
    }

    #[wasm_bindgen(js_name = setSourceEnabled)]
    pub async fn set_source_enabled(&self, name: &str, enabled: bool) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::set_source_enabled(db, name, enabled).await?)
    }

    #[wasm_bindgen(js_name = setPluginEnabled)]
    pub async fn set_plugin_enabled(&self, name: &str, enabled: bool) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::pipelines::set_plugin_enabled(db, name, enabled).await?)
    }

    #[wasm_bindgen(js_name = deleteSyncState)]
    pub async fn delete_sync_state(&self, source_type: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::delete_sync_state(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = deleteItemsBySource)]
    pub async fn delete_items_by_source(&self, source_type: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::delete_items_by_source(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = clearContacts)]
    pub async fn clear_contacts(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::clear_contacts(db).await?)
    }

    #[wasm_bindgen(js_name = clearItemsSyncContacts)]
    pub async fn clear_items_sync_contacts(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::clear_items_sync_contacts(db).await?)
    }

    #[wasm_bindgen(js_name = getItemsCountBySource)]
    pub async fn get_items_count_by_source(&self, source_type: &str) -> Result<i64, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::get_items_count_by_source(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = getSyncState)]
    pub async fn get_sync_state(&self, source_type: &str) -> Result<Option<SyncStateRow>, JsValue> {
        let db = &self.rexie_db;
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
        let db = &self.rexie_db;
        Ok(storage::sync::upsert_sync_state(db, source_type, history_id, last_sync_at as i64, total_items as i64, oldest_page_token)
            .await?)
    }

    #[wasm_bindgen(js_name = insertItemsBatch)]
    pub async fn insert_items_batch(&self, rows: Vec<ItemInput>) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::insert_items_batch(db, rows).await?)
    }

    #[wasm_bindgen(js_name = insertSyncStateBatch)]
    pub async fn insert_sync_state_batch(&self, rows: Vec<SyncStateInput>) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::insert_sync_state_batch(db, rows).await?)
    }

    #[wasm_bindgen(js_name = insertContactsBatch)]
    pub async fn insert_contacts_batch(&self, rows: Vec<ContactInput>) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::insert_contacts_batch(db, rows).await?)
    }

    #[wasm_bindgen(js_name = deleteItemsByIds)]
    pub async fn delete_items_by_ids(&self, ids: Vec<String>) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::delete_items_by_ids(db, ids).await?)
    }

    #[wasm_bindgen(js_name = getContactByEmail)]
    pub async fn get_contact_by_email(&self, email: &str) -> Result<Option<ContactRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::get_contact_by_email(db, email).await?)
    }

    #[wasm_bindgen(js_name = upsertContact)]
    pub async fn upsert_contact(&self, email: &str, name: &str, first_seen: f64, last_seen: f64) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::upsert_contact(db, email, name, first_seen as i64, last_seen as i64).await?)
    }

    #[wasm_bindgen(js_name = getPlugins)]
    pub async fn get_plugins(&self) -> Result<Vec<PluginSummary>, JsValue> {
        let db = &self.rexie_db;
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
        actions: Vec<ActionInput>,
        event: EventInput,
        access_token: String,
        on_progress: Option<Function>,
        config: Option<JsValue>,
    ) -> Result<PipelineResult, JsValue> {
        let config = parse_optional_config(config)?;
        Ok(plugins::execute_pipeline(actions, event, access_token, on_progress, config).await?)
    }

    #[wasm_bindgen(js_name = executePipelineBatch)]
    pub async fn execute_pipeline_batch(
        &self,
        actions: Vec<ActionInput>,
        events: Vec<EventInput>,
        access_token: String,
        on_progress: Option<Function>,
        config: Option<JsValue>,
    ) -> Result<PipelineBatchResult, JsValue> {
        let config = parse_optional_config(config)?;
        Ok(plugins::execute_pipeline_batch(actions, events, access_token, on_progress, config).await?)
    }

    #[wasm_bindgen(js_name = resolveAndExecutePipeline)]
    pub async fn resolve_and_execute_pipeline(
        &self,
        event: EventInput,
        approved: bool,
        actions_override: Option<Vec<ActionOverrideInput>>,
        on_progress: Option<Function>,
    ) -> Result<ResolveExecuteResult, JsValue> {
        let db = &self.rexie_db;
        plugins::resolution::resolve_and_execute_pipeline(
            db,
            event,
            approved,
            actions_override,
            on_progress,
        )
        .await
        .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = resolveAndExecuteBatch)]
    pub async fn resolve_and_execute_batch(
        &self,
        event_type: &str,
        events: Vec<EventInput>,
        approved: bool,
        on_progress: Option<Function>,
    ) -> Result<ResolveBatchResult, JsValue> {
        let db = &self.rexie_db;
        plugins::resolution::resolve_and_execute_batch(
            db,
            event_type,
            events,
            approved,
            on_progress,
        )
        .await
        .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getRules)]
    pub async fn get_rules(&self) -> Result<Vec<RuleView>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::get_rules(db).await?)
    }

    #[wasm_bindgen(js_name = getRule)]
    pub async fn get_rule(&self, id: &str) -> Result<Option<RuleView>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::get_rule(db, id).await?)
    }

    #[wasm_bindgen(js_name = findMatchingRules)]
    pub async fn find_matching_rules(
        &self,
        event_type: &str,
        event_category: &str,
    ) -> Result<Vec<RuleView>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::find_matching_rules(db, event_type, event_category).await?)
    }

    #[wasm_bindgen(js_name = saveRule)]
    pub async fn save_rule(&self, payload: RuleSavePayload) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::save_rule(db, payload).await?)
    }

    #[wasm_bindgen(js_name = deleteRule)]
    pub async fn delete_rule(&self, id: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::delete_rule(db, id).await?)
    }

    #[wasm_bindgen(js_name = createRule)]
    pub async fn create_rule(&self, payload: CreateRulePayload) -> Result<String, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::create_rule(db, payload).await?)
    }

    #[wasm_bindgen(js_name = updateRule)]
    pub async fn update_rule(&self, id: &str, updates: RuleUpdateInput) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::update_rule(db, id, updates).await?)
    }

    #[wasm_bindgen(js_name = setRuleEnabled)]
    pub async fn set_rule_enabled(&self, id: &str, enabled: bool) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::set_rule_enabled(db, id, enabled).await?)
    }

    #[wasm_bindgen(js_name = getEventStats)]
    pub async fn get_event_stats(&self) -> Result<EventStatsResult, JsValue> {
        let db = &self.rexie_db;
        storage::aggregations::get_event_stats(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getPendingApprovals)]
    pub async fn get_pending_approvals(&self, limit: u32) -> Result<Vec<PendingApprovalView>, JsValue> {
        let db = &self.rexie_db;
        storage::aggregations::get_pending_approvals(db, limit as usize)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getPendingCountByCategory)]
    pub async fn get_pending_count_by_category(&self, category_name: &str) -> Result<u32, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::aggregations::get_pending_count_by_category(db, category_name).await?)
    }

    #[wasm_bindgen(js_name = getPendingItemsByCategory)]
    pub async fn get_pending_items_by_category(
        &self,
        category_name: &str,
        limit: u32,
    ) -> Result<Vec<PendingItemByCategoryResult>, JsValue> {
        let db = &self.rexie_db;
        storage::aggregations::get_pending_items_by_category(db, category_name, limit as usize)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getCategoryPipelines)]
    pub async fn get_category_pipelines(&self) -> Result<Vec<CategoryPipelineView>, JsValue> {
        let db = &self.rexie_db;
        storage::aggregations::get_category_pipelines(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = getEvents)]
    pub async fn get_events(&self, limit: u32, offset: u32) -> Result<Vec<EventRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::get_events(db, limit, offset).await?)
    }

    #[wasm_bindgen(js_name = updateEventStatus)]
    pub async fn update_event_status(&self, id: &str, status: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::rules::update_event_status(db, id, status).await?)
    }

    #[wasm_bindgen(js_name = clearEvents)]
    pub async fn clear_events(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
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
        let db = &self.rexie_db;
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
        let db = &self.rexie_db;
        Ok(storage::sync::get_newest_source_id(db, source_type).await?)
    }

    #[wasm_bindgen(js_name = getItemById)]
    pub async fn get_item_by_id(&self, id: &str) -> Result<Option<ItemRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::get_item_by_id(db, id).await?)
    }

    #[wasm_bindgen(js_name = getItemsGmailByDateDesc)]
    pub async fn get_items_gmail_by_date_desc(&self, limit: u32) -> Result<Vec<ItemRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::get_items_gmail_by_date_desc(db, limit).await?)
    }

    /// Fetch stored Gmail emails with optional text search filtering and
    /// normalized fields (labels as array, raw as object).
    #[wasm_bindgen(js_name = getStoredEmailsFiltered)]
    pub async fn get_stored_emails_filtered(
        &self,
        query: Option<String>,
        limit: u32,
        offset: u32,
    ) -> Result<GetStoredEmailsResult, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::items::get_stored_emails_filtered(db, query.as_deref(), limit, offset).await?)
    }

    #[wasm_bindgen(js_name = getItemsBySource)]
    pub async fn get_items_by_source(&self, source_type: &str, limit: u32, offset: u32) -> Result<Vec<ItemRow>, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::sync::get_items_by_source(db, source_type, limit, offset).await?)
    }

    #[wasm_bindgen(js_name = getEmailClassifications)]
    pub async fn get_email_classifications(&self, action_filter: Option<String>, limit: Option<u32>) -> Result<Vec<ClassificationRow>, JsValue> {
        let db = &self.rexie_db;
        let filter = action_filter.as_deref();
        Ok(storage::classifications::get_classifications(db, filter, limit).await?)
    }

    #[wasm_bindgen(js_name = updateEmailClassificationStatus)]
    pub async fn update_email_classification_status(&self, email_id: &str, status: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::update_classification_status(db, email_id, status).await?)
    }

    #[wasm_bindgen(js_name = clearEmailClassifications)]
    pub async fn clear_email_classifications(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::clear_classifications(db).await?)
    }

    #[wasm_bindgen(js_name = deleteEmailClassification)]
    pub async fn delete_email_classification(&self, email_id: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::delete_classification(db, email_id).await?)
    }

    #[wasm_bindgen(js_name = deleteEmailClassificationsByAction)]
    pub async fn delete_email_classifications_by_action(&self, action: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::delete_classifications_by_action(db, action).await?)
    }

    #[wasm_bindgen(js_name = putEmailClassification)]
    pub async fn put_email_classification(
        &self,
        doc: ClassificationDoc,
    ) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::put_classification(db, doc).await?)
    }

    // ── Classification aggregations ──────────────────────────────────────────

    /// Get classifications grouped by action, optionally filtered to pending/escalated only.
    #[wasm_bindgen(js_name = getClassificationsByCategory)]
    pub async fn get_classifications_by_category(
        &self,
        pending_only: bool,
    ) -> Result<ClassificationsByCategory, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::get_classifications_by_category(db, pending_only).await?)
    }

    /// Count classifications by action.
    #[wasm_bindgen(js_name = getClassificationCounts)]
    pub async fn get_classification_counts(&self) -> Result<ClassificationCounts, JsValue> {
        let db = &self.rexie_db;
        Ok(storage::classifications::get_classification_counts(db).await?)
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

    #[wasm_bindgen(js_name = getOllamaModelGroups)]
    pub fn get_ollama_model_groups(&self) -> Vec<OllamaModelGroup> {
        llm::models::get_ollama_model_groups()
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

    #[wasm_bindgen(js_name = defaultOllamaBaseUrl)]
    pub fn default_ollama_base_url(&self) -> String {
        llm::ollama::default_ollama_base_url()
    }

    #[wasm_bindgen(js_name = getResolvedOllamaUrl)]
    pub async fn get_resolved_ollama_url(&self) -> Result<String, JsValue> {
        llm::ollama::resolved_ollama_url(self.rexie_db())
            .await
            .map_err(|e| error_to_js(&e))
    }

    #[wasm_bindgen(js_name = setOllamaUrl)]
    pub async fn set_ollama_url(&self, url: &str) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        let mut sv = storage::settings::load_settings(db).await.map_err(|e| error_to_js(&e))?;
        sv.set_ollama_url(url.to_string());
        storage::settings::save_settings(db, &sv).await.map_err(|e| error_to_js(&e))
    }

    /// `options` and `messages` are plain JS objects/arrays (`StreamOllamaOptions`, `OllamaChatMessage[]`).
    #[wasm_bindgen(js_name = streamOllamaChat)]
    pub async fn stream_ollama_chat(
        &self,
        model_name: &str,
        messages: JsValue,
        options: JsValue,
        on_token: &Function,
        url: &str,
    ) -> Result<String, JsValue> {
        Ok(llm::ollama::stream_ollama_chat(url, model_name, messages, options, on_token).await?)
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
    pub fn short_date(&self, date_ms: f64) -> Option<String> {
        formatting::short_date(date_ms as i64)
    }

    #[wasm_bindgen(js_name = formatDisplayDateEnUs)]
    pub fn format_display_date_en_us(&self, ms: f64) -> String {
        crate::time_util::format_display_datetime_en_us_utc(ms as i64)
    }

    /// Format an email `date` field from JS (`string | number | bigint | null | undefined`) for UI lists/detail.
    #[wasm_bindgen(js_name = formatEmailDisplayDate)]
    pub fn format_email_display_date(&self, date: JsValue) -> String {
        formatting::format_email_display_date(&date)
    }

    /// Parse an email `date` from JS to epoch ms (`0` if missing or unparseable). Used before `emailToMarkdown` / exports.
    #[wasm_bindgen(js_name = emailDateToEpochMs)]
    pub fn email_date_to_epoch_ms_js(&self, date: JsValue) -> f64 {
        formatting::email_date_to_epoch_ms(&date)
    }

    #[wasm_bindgen(js_name = exportFilename)]
    pub fn export_filename(&self, subject: &str, date_ms: f64, ext: &str) -> String {
        formatting::export_filename(subject, date_ms as i64, ext)
    }

    /// Safe export filename from subject + JS date value (same parsing as [`Self::email_date_to_epoch_ms_js`]).
    #[wasm_bindgen(js_name = exportEmailFilename)]
    pub fn export_email_filename(&self, subject: &str, date: JsValue, ext: &str) -> String {
        formatting::export_email_filename_from_js(subject, &date, ext)
    }

    /// Convert an email to Markdown with a metadata header table (`date_ms`: epoch ms, 0 = unknown).
    #[wasm_bindgen(js_name = emailToMarkdown)]
    pub fn email_to_markdown(
        &self,
        subject: &str,
        from: &str,
        to: &str,
        date_ms: f64,
        body: Option<String>,
        html_body: Option<String>,
    ) -> String {
        formatting::markdown::email_to_markdown(
            subject,
            from,
            to,
            date_ms as i64,
            body.as_deref(),
            html_body.as_deref(),
        )
    }

    /// Convert an HTML string to Markdown. Returns `None` if the result is empty.
    #[wasm_bindgen(js_name = htmlToMarkdownBody)]
    pub fn html_to_markdown_body(&self, html: &str) -> Option<String> {
        formatting::markdown::html_to_markdown_body(html)
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

    /// Convert category tier ("NOISE") to lowercase name ("noise").
    #[wasm_bindgen(js_name = categoryTierToName)]
    pub fn category_tier_to_name(&self, tier: &str) -> String {
        llm::triage::category_tier_to_name(tier)
    }

    // ── Data queries for LLM context ─────────────────────────────────────────────

    /// Compact data summary for the LLM system prompt. Returns empty string if no data.
    #[wasm_bindgen(js_name = getDataSummary)]
    pub async fn get_data_summary(&self) -> Result<String, JsValue> {
        let db = &self.rexie_db;
        let total_emails = storage::items::get_items_count_gmail(db).await.map_err(|e| error_to_js(&e))?;
        if total_emails == 0 { return Ok(String::new()); }
        let total_contacts = storage::items::get_contacts_count(db).await.map_err(|e| error_to_js(&e))?;
        let mut lines = vec![format!("Stored data: {} emails, {} contacts.", total_emails, total_contacts)];
        let min = storage::items::get_items_date_min(db).await.map_err(|e| error_to_js(&e))?;
        let max = storage::items::get_items_date_max(db).await.map_err(|e| error_to_js(&e))?;
        if let (Some(oldest), Some(newest)) = (min, max) {
            if let (Some(from), Some(to)) = (formatting::short_date(oldest), formatting::short_date(newest)) {
                lines.push(format!("Date range: {} to {}.", from, to));
            }
        }
        Ok(lines.join(" "))
    }

    /// Detailed markdown summary for LLM email context.
    #[wasm_bindgen(js_name = getDetailedSummary)]
    pub async fn get_detailed_summary(&self) -> Result<String, JsValue> {
        let db = &self.rexie_db;
        let total_emails = storage::items::get_items_count_gmail(db).await.map_err(|e| error_to_js(&e))?;
        if total_emails == 0 { return Ok("No emails stored locally.".to_string()); }
        let total_contacts = storage::items::get_contacts_count(db).await.map_err(|e| error_to_js(&e))?;
        let mut parts = vec![
            "## Data Summary".to_string(),
            format!("- **Emails:** {}", total_emails),
            format!("- **Contacts:** {}", total_contacts),
        ];
        let min = storage::items::get_items_date_min(db).await.map_err(|e| error_to_js(&e))?;
        let max = storage::items::get_items_date_max(db).await.map_err(|e| error_to_js(&e))?;
        if let (Some(oldest), Some(newest)) = (min, max) {
            if let (Some(from), Some(to)) = (formatting::short_date(oldest), formatting::short_date(newest)) {
                parts.push(format!("- **Date range:** {} — {}", from, to));
            }
        }
        Ok(parts.join("\n"))
    }

    /// Recent emails formatted for LLM context.
    #[wasm_bindgen(js_name = getRecentEmailsContext)]
    pub async fn get_recent_emails_context(&self, limit: u32) -> Result<String, JsValue> {
        let db = &self.rexie_db;
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
        let db = &self.rexie_db;
        let pending_count = storage::classifications::count_pending_classifications(db).await.map_err(|e| error_to_js(&e))?;
        if pending_count > 0 {
            parts.push(format!("Pending emails awaiting manual execution: {} total.", pending_count));
            parts.push("If the user asks you to execute or handle a pending category, append [EXECUTE:CATEGORY:EVENT_TYPE] to the end of your response.".to_string());
            parts.push("If the user asks to SEE or MANAGE their events/emails/noise, append [SHOW:DASHBOARD] to the end of your response to spawn a visual dashboard for them.".to_string());
        }
        Ok(parts.join(" "))
    }

    /// Build rich email context string for LLM when user asks about emails.
    #[wasm_bindgen(js_name = buildEmailContext)]
    pub async fn build_email_context(&self, user_query: &str) -> Result<String, JsValue> {
        let detailed = self.get_detailed_summary().await?;
        let mut parts = vec![detailed];

        let db = &self.rexie_db;
        let pending_count = storage::classifications::count_pending_classifications(db).await.map_err(|e| error_to_js(&e))?;
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

        let email_section = if !user_query.is_empty() {
            let items = storage::sync::get_items_gmail_by_date_desc(db, 50).await?;
            let q_lower = user_query.to_lowercase();
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
    // Responses are `serde_json::Value` in Rust (`api::gmail`), then bridged to JS
    // as plain JSON objects via `serde_json_value_to_js`.

    #[wasm_bindgen(js_name = getGmailProfile)]
    pub async fn get_gmail_profile(&self, token: &str) -> Result<JsValue, JsValue> {
        let v = api::gmail::get_profile(token).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = listGmailMessages)]
    pub async fn list_gmail_messages(&self, token: &str, max_results: u32, page_token: Option<String>, q: Option<String>) -> Result<JsValue, JsValue> {
        let v = api::gmail::list_messages(token, max_results, page_token.as_deref(), q.as_deref()).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = getGmailMessage)]
    pub async fn get_gmail_message(&self, token: &str, message_id: &str, format: &str) -> Result<JsValue, JsValue> {
        let v = api::gmail::get_message(token, message_id, format).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = getGmailMessagesBatch)]
    pub async fn get_gmail_messages_batch(&self, token: &str, message_ids: Vec<String>, batch_size: u32) -> Result<JsValue, JsValue> {
        let v = api::gmail::get_messages_batch(token, message_ids, batch_size).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = listGmailHistory)]
    pub async fn list_gmail_history(&self, token: &str, start_history_id: &str, page_token: Option<String>, max_results: u32) -> Result<JsValue, JsValue> {
        let v = api::gmail::list_history(token, start_history_id, page_token.as_deref(), max_results).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
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
    // Same pattern as Gmail: typed `serde_json::Value` in `api::twitter`, then bridge.

    #[wasm_bindgen(js_name = getTwitterMe)]
    pub async fn get_twitter_me(&self, token: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::get_me(token).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = getTwitterTimeline)]
    pub async fn get_twitter_timeline(&self, token: &str, user_id: &str, max_results: u32, pagination_token: Option<String>) -> Result<JsValue, JsValue> {
        let v = api::twitter::get_user_timeline(token, user_id, max_results, pagination_token.as_deref()).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = getTwitterMentions)]
    pub async fn get_twitter_mentions(&self, token: &str, user_id: &str, max_results: u32, pagination_token: Option<String>) -> Result<JsValue, JsValue> {
        let v = api::twitter::get_user_mentions(token, user_id, max_results, pagination_token.as_deref()).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = searchTwitterRecentTweets)]
    pub async fn search_twitter_recent_tweets(&self, token: &str, query: &str, max_results: u32) -> Result<JsValue, JsValue> {
        let v = api::twitter::search_recent_tweets(token, query, max_results).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = getTwitterTweet)]
    pub async fn get_twitter_tweet(&self, token: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::get_tweet(token, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterLike)]
    pub async fn twitter_like(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::like_tweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterUnlike)]
    pub async fn twitter_unlike(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::unlike_tweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterRetweet)]
    pub async fn twitter_retweet(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::retweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterUnretweet)]
    pub async fn twitter_unretweet(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::unretweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterBookmark)]
    pub async fn twitter_bookmark(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::bookmark_tweet(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterRemoveBookmark)]
    pub async fn twitter_remove_bookmark(&self, token: &str, user_id: &str, tweet_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::remove_bookmark(token, user_id, tweet_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterMuteUser)]
    pub async fn twitter_mute_user(&self, token: &str, source_user_id: &str, target_user_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::mute_user(token, source_user_id, target_user_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
    }

    #[wasm_bindgen(js_name = twitterBlockUser)]
    pub async fn twitter_block_user(&self, token: &str, source_user_id: &str, target_user_id: &str) -> Result<JsValue, JsValue> {
        let v = api::twitter::block_user(token, source_user_id, target_user_id).await.map_err(|e| error_to_js(&e))?;
        serde_json_value_to_js(v)
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

    /// Read the stored API key for a cloud provider (`openai` | `anthropic` | `google` | `xai`), if any.
    #[wasm_bindgen(js_name = getApiKeyForProvider)]
    pub async fn get_api_key_for_provider(&self, provider: &str) -> Result<Option<String>, JsValue> {
        let db = &self.rexie_db;
        Ok(llm::client::get_stored_api_key_for_provider(db, provider).await?)
    }

    /// Stream chat completion from a cloud API provider.
    /// `on_token` receives TokenPayload JSON objects during streaming.
    #[wasm_bindgen(js_name = streamChat)]
    pub async fn stream_chat(
        &self,
        provider: &str,
        model_name: &str,
        messages: Vec<llm::client::ChatMessage>,
        options: llm::client::StreamOptions,
        on_token: &Function,
    ) -> Result<(), JsValue> {
        let msgs = messages;
        let opts = options;

        let db = &self.rexie_db;
        let api_key = llm::client::require_api_key_for_provider(db, provider)
            .await
            .map_err(|e| error_to_js(&e))?;

        Ok(llm::client::stream_api_chat(provider, model_name, &api_key, msgs, opts, on_token).await?)
    }

    // ── Sync orchestration ──────────────────────────────────────────────────────

    /// Full or incremental Gmail sync.
    #[wasm_bindgen(js_name = syncGmail)]
    pub async fn sync_gmail(
        &self,
        token: &str,
        limit: u32,
        on_progress: Option<Function>,
        signal: Option<AbortSignal>,
    ) -> Result<SyncResult, JsValue> {
        let db = &self.rexie_db;
        sync::gmail::sync_gmail(db, token, limit, &on_progress, signal.as_ref())
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Continue downloading older Gmail messages.
    #[wasm_bindgen(js_name = syncGmailMore)]
    pub async fn sync_gmail_more(
        &self,
        token: &str,
        limit: u32,
        on_progress: Option<Function>,
        signal: Option<AbortSignal>,
    ) -> Result<SyncResult, JsValue> {
        let db = &self.rexie_db;
        sync::gmail::sync_gmail_more(db, token, limit, &on_progress, signal.as_ref())
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Clear all local Gmail data (items, sync state, contacts).
    #[wasm_bindgen(js_name = clearGmailData)]
    pub async fn clear_gmail_data(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        sync::gmail::clear_gmail_data(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Get Gmail sync status.
    #[wasm_bindgen(js_name = getGmailSyncStatus)]
    pub async fn get_gmail_sync_status(&self) -> Result<SyncStatus, JsValue> {
        let db = &self.rexie_db;
        sync::gmail::get_gmail_sync_status(db).await.map_err(|e| error_to_js(&e))
    }

    /// Full or incremental Twitter sync.
    #[wasm_bindgen(js_name = syncTwitter)]
    pub async fn sync_twitter(
        &self,
        token: &str,
        limit: u32,
        on_progress: Option<Function>,
        signal: Option<AbortSignal>,
    ) -> Result<SyncResult, JsValue> {
        let db = &self.rexie_db;
        sync::twitter::sync_twitter(db, token, limit, &on_progress, signal.as_ref())
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Continue fetching older tweets.
    #[wasm_bindgen(js_name = syncTwitterMore)]
    pub async fn sync_twitter_more(
        &self,
        token: &str,
        limit: u32,
        on_progress: Option<Function>,
        signal: Option<AbortSignal>,
    ) -> Result<SyncResult, JsValue> {
        let db = &self.rexie_db;
        sync::twitter::sync_twitter_more(db, token, limit, &on_progress, signal.as_ref())
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Clear all local Twitter data (items + sync state).
    #[wasm_bindgen(js_name = clearTwitterData)]
    pub async fn clear_twitter_data(&self) -> Result<(), JsValue> {
        let db = &self.rexie_db;
        sync::twitter::clear_twitter_data(db)
            .await
            .map_err(|e| error_to_js(&e))
    }

    /// Get Twitter sync status.
    #[wasm_bindgen(js_name = getTwitterSyncStatus)]
    pub async fn get_twitter_sync_status(&self) -> Result<SyncStatus, JsValue> {
        let db = &self.rexie_db;
        sync::twitter::get_twitter_sync_status(db).await.map_err(|e| error_to_js(&e))
    }
}

/// Serialize [`api::ApiJson`] (Gmail/Twitter bodies) for wasm-bindgen consumers.
#[inline]
fn serde_json_value_to_js(v: api::ApiJson) -> Result<JsValue, JsValue> {
    serde_wasm_bindgen::to_value(&v).map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
}

fn parse_optional_config(config: Option<JsValue>) -> Result<Option<serde_json::Value>, JsValue> {
    match config {
        Some(v) if !v.is_null() && !v.is_undefined() => {
            Ok(Some(serde_wasm_bindgen::from_value(v)
                .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?))
        }
        _ => Ok(None),
    }
}

fn format_item_for_llm(item: &crate::storage::sync::ItemRow) -> String {
    let date = item.date
        .and_then(crate::formatting::short_date)
        .unwrap_or_else(|| "Unknown date".to_string());
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
