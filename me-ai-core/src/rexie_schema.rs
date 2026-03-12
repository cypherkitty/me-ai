//! Rexie (IndexedDB) schema: one DB with multiple object stores and indexes.
//! Composite-key tables use a single "id" field (e.g. "plugin_name|action_name").

use rexie::{Index, ObjectStore, Rexie};

use crate::error::CoreError;

const DB_NAME: &str = "me-ai";
const DB_VERSION: u32 = 1;

/// Store names (must match builder below).
pub mod store {
    pub const ITEMS: &str = "items";
    pub const SYNC_STATE: &str = "syncState";
    pub const CONTACTS: &str = "contacts";
    pub const SETTINGS: &str = "settings";
    pub const AUDIT_LOG: &str = "auditLog";
    pub const EMAIL_CLASSIFICATIONS: &str = "emailClassifications";
    pub const SM_EVENT_TYPES: &str = "sm_event_types";
    pub const SM_EVENT_CATEGORIES: &str = "sm_event_categories";
    pub const SM_SOURCES: &str = "sm_sources";
    pub const SM_ACTIONS: &str = "sm_actions";
    pub const SM_PLUGINS: &str = "sm_plugins";
    pub const SM_PLUGIN_ACTIONS: &str = "sm_plugin_actions";
    pub const SM_PLUGIN_SOURCES: &str = "sm_plugin_sources";
    pub const SM_CATEGORY_PIPELINE: &str = "sm_category_pipeline";
    pub const SM_TYPE_PIPELINE: &str = "sm_type_pipeline";
    pub const SM_RULES: &str = "sm_rules";
    pub const SM_RULE_TRIGGERS: &str = "sm_rule_triggers";
    pub const SM_RULE_COMMANDS: &str = "sm_rule_commands";
    pub const SM_RULE_POLICIES: &str = "sm_rule_policies";
    pub const SM_EVENTS: &str = "sm_events";
}

async fn build_rexie_impl() -> rexie::Result<Rexie> {
    Rexie::builder(DB_NAME)
        .version(DB_VERSION)
        .add_object_store(
            ObjectStore::new(store::ITEMS)
                .key_path("id")
                .add_index(Index::new("sourceType", "sourceType"))
                .add_index(Index::new("date", "date"))
                .add_index(Index::new("threadKey", "threadKey")),
        )
        .add_object_store(ObjectStore::new(store::SYNC_STATE).key_path("sourceType"))
        .add_object_store(
            ObjectStore::new(store::CONTACTS)
                .key_path("email")
                .add_index(Index::new("lastSeen", "lastSeen")),
        )
        .add_object_store(ObjectStore::new(store::SETTINGS).key_path("key"))
        .add_object_store(
            ObjectStore::new(store::AUDIT_LOG)
                .key_path("id")
                .add_index(Index::new("emailId", "emailId"))
                .add_index(Index::new("executedAt", "executedAt"))
                .add_index(Index::new("success", "success")),
        )
        .add_object_store(
            ObjectStore::new(store::EMAIL_CLASSIFICATIONS)
                .key_path("emailId")
                .add_index(Index::new("action", "action"))
                .add_index(Index::new("category", "category"))
                .add_index(Index::new("status", "status")),
        )
        .add_object_store(
            ObjectStore::new(store::SM_EVENT_TYPES)
                .key_path("name")
                .add_index(Index::new("category_name", "category_name")),
        )
        .add_object_store(ObjectStore::new(store::SM_EVENT_CATEGORIES).key_path("name"))
        .add_object_store(ObjectStore::new(store::SM_SOURCES).key_path("name"))
        .add_object_store(ObjectStore::new(store::SM_ACTIONS).key_path("name"))
        .add_object_store(ObjectStore::new(store::SM_PLUGINS).key_path("name"))
        .add_object_store(
            ObjectStore::new(store::SM_PLUGIN_ACTIONS)
                .key_path("id")
                .add_index(Index::new("plugin_name", "plugin_name"))
                .add_index(Index::new("action_name", "action_name")),
        )
        .add_object_store(
            ObjectStore::new(store::SM_PLUGIN_SOURCES)
                .key_path("id")
                .add_index(Index::new("plugin_name", "plugin_name")),
        )
        .add_object_store(
            ObjectStore::new(store::SM_CATEGORY_PIPELINE)
                .key_path("id")
                .add_index(Index::new("category_name", "category_name")),
        )
        .add_object_store(
            ObjectStore::new(store::SM_TYPE_PIPELINE)
                .key_path("id")
                .add_index(Index::new("type_name", "type_name")),
        )
        .add_object_store(ObjectStore::new(store::SM_RULES).key_path("id"))
        .add_object_store(
            ObjectStore::new(store::SM_RULE_TRIGGERS)
                .key_path("id")
                .add_index(Index::new("rule_id", "rule_id")),
        )
        .add_object_store(
            ObjectStore::new(store::SM_RULE_COMMANDS)
                .key_path("id")
                .add_index(Index::new("rule_id", "rule_id")),
        )
        .add_object_store(ObjectStore::new(store::SM_RULE_POLICIES).key_path("rule_id"))
        .add_object_store(
            ObjectStore::new(store::SM_EVENTS)
                .key_path("id")
                .add_index(Index::new("status", "status"))
                .add_index(Index::new("event_type", "event_type"))
                .add_index(Index::new("source_name", "source_name"))
                .add_index(Index::new("timestamp", "timestamp")),
        )
        .build()
        .await
}

/// Open the Rexie database. IndexedDB open is idempotent for same name/version.
pub async fn get_rexie() -> Result<Rexie, CoreError> {
    build_rexie_impl()
        .await
        .map_err(crate::error::rexie_to_core)
}
