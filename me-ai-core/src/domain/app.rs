//! Schema init, seed data, settings, table count, clear. All via Rexie.

use serde::{Deserialize, Serialize};

use crate::db::{store, DbRef};
use crate::error::CoreError;

/// Run schema (open Rexie DB) and seed data. RexieDb is built once at init.
pub async fn create_schema_and_migrations(db: DbRef<'_>) -> Result<(), CoreError> {
    seed_signal_map(db).await?;
    Ok(())
}

#[derive(Serialize, Deserialize)]
struct SmEventTypeRow {
    name: String,
    label: Option<String>,
    #[serde(rename = "category_name")]
    category_name: Option<String>,
    #[serde(rename = "auto_created")]
    auto_created: Option<bool>,
}

#[derive(Serialize, Deserialize)]
struct SmEventCategoryRow {
    name: String,
    label: Option<String>,
    priority: Option<i64>,
    policy: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct SmSourceRow {
    name: String,
    label: Option<String>,
    platform: Option<String>,
    api: Option<String>,
    enabled: Option<bool>,
}

#[derive(Serialize, Deserialize)]
struct SmActionRow {
    name: String,
    label: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct SmPluginRow {
    name: String,
    label: Option<String>,
    version: Option<String>,
    enabled: Option<bool>,
}

#[derive(Serialize, Deserialize)]
struct SmPluginActionRow {
    id: String,
    #[serde(rename = "plugin_name")]
    plugin_name: String,
    #[serde(rename = "action_name")]
    action_name: String,
}

#[derive(Serialize, Deserialize)]
struct SmPluginSourceRow {
    id: String,
    #[serde(rename = "plugin_name")]
    plugin_name: String,
    #[serde(rename = "source_name")]
    source_name: String,
}

#[derive(Serialize, Deserialize)]
struct SmCategoryPipelineRow {
    id: String,
    #[serde(rename = "category_name")]
    category_name: String,
    #[serde(rename = "action_idx")]
    action_idx: i64,
    #[serde(rename = "plugin_id")]
    plugin_id: String,
    #[serde(rename = "command_id")]
    command_id: String,
}

async fn seed_signal_map(db: DbRef<'_>) -> Result<(), CoreError> {
    let n = db.store_count(store::SM_EVENT_TYPES, None).await?;
    if n > 0 {
        return Ok(());
    }

    let event_types = [
        ("ad", "Advertisement", "noise", false),
        ("newsletter", "Newsletter", "noise", false),
        ("personal_message", "Personal Message", "critical", false),
        ("work_email", "Work Email", "critical", false),
        ("instagram_post", "Instagram Post", "info", false),
        ("youtube_video", "YouTube Video", "info", false),
        ("security_alert", "Security Alert", "critical", false),
        ("invoice", "Invoice", "critical", false),
        ("social_mention", "Social Mention", "info", false),
        ("startup_notification", "Startup Notification", "info", false),
        ("tweet", "Tweet", "info", false),
        ("retweet", "Retweet", "noise", false),
        ("twitter_mention", "Twitter Mention", "info", false),
        ("twitter_thread", "Twitter Thread", "info", false),
    ];
    let rows: Vec<SmEventTypeRow> = event_types
        .iter()
        .map(|(name, label, cat, auto)| SmEventTypeRow {
            name: name.to_string(),
            label: Some(label.to_string()),
            category_name: Some(cat.to_string()),
            auto_created: Some(*auto),
        })
        .collect();
    db.store_put_all(store::SM_EVENT_TYPES, &rows).await?;

    let categories = [
        ("noise", "Noise", 1, "auto"),
        ("info", "Info", 2, "auto"),
        ("critical", "Critical", 3, "manual"),
    ];
    let cat_rows: Vec<SmEventCategoryRow> = categories
        .iter()
        .map(|(name, label, pri, policy)| SmEventCategoryRow {
            name: name.to_string(),
            label: Some(label.to_string()),
            priority: Some(*pri),
            policy: Some(policy.to_string()),
        })
        .collect();
    db.store_put_all(store::SM_EVENT_CATEGORIES, &cat_rows).await?;

    let sources = [
        ("gmail", "Gmail", "email", "gmail_api_v1", true),
        ("telegram", "Telegram", "messenger", "telegram_bot_api", false),
        ("instagram", "Instagram", "social", "instagram_graph_api", false),
        ("youtube", "YouTube", "video", "youtube_data_api_v3", false),
        ("slack", "Slack", "messenger", "slack_web_api", false),
        ("twitter", "Twitter/X", "social", "twitter_api_v2", true),
    ];
    let src_rows: Vec<SmSourceRow> = sources
        .iter()
        .map(|(name, label, platform, api, enabled)| SmSourceRow {
            name: name.to_string(),
            label: Some(label.to_string()),
            platform: Some(platform.to_string()),
            api: Some(api.to_string()),
            enabled: Some(*enabled),
        })
        .collect();
    db.store_put_all(store::SM_SOURCES, &src_rows).await?;

    let actions = [
        ("delete", "Delete"),
        ("archive", "Archive"),
        ("mark_read", "Mark as Read"),
        ("reply", "Reply"),
        ("forward", "Forward"),
        ("summarize", "Summarize"),
        ("notify_user", "Notify User"),
        ("tag", "Tag"),
        ("escalate", "Escalate"),
        ("unsubscribe", "Unsubscribe"),
    ];
    let act_rows: Vec<SmActionRow> = actions
        .iter()
        .map(|(name, label)| SmActionRow {
            name: name.to_string(),
            label: Some(label.to_string()),
        })
        .collect();
    db.store_put_all(store::SM_ACTIONS, &act_rows).await?;

    let plugins = [
        ("gmail_plugin", "Gmail", "2.1.0", true),
        ("twitter_plugin", "Twitter/X", "1.0.0", true),
        ("telegram_plugin", "Telegram", "3.0.1", false),
        ("instagram_plugin", "Instagram", "1.3.0", false),
        ("ai_summarizer", "AI Summarizer", "1.0.0", true),
        ("notifier", "Notifier", "1.1.0", true),
        ("ai_classifier", "AI Classifier", "2.0.0", true),
    ];
    let plug_rows: Vec<SmPluginRow> = plugins
        .iter()
        .map(|(name, label, version, enabled)| SmPluginRow {
            name: name.to_string(),
            label: Some(label.to_string()),
            version: Some(version.to_string()),
            enabled: Some(*enabled),
        })
        .collect();
    db.store_put_all(store::SM_PLUGINS, &plug_rows).await?;

    let plugin_actions = [
        ("gmail_plugin", "delete"),
        ("gmail_plugin", "archive"),
        ("gmail_plugin", "reply"),
        ("gmail_plugin", "mark_read"),
        ("gmail_plugin", "forward"),
        ("gmail_plugin", "unsubscribe"),
        ("telegram_plugin", "reply"),
        ("telegram_plugin", "forward"),
        ("telegram_plugin", "notify_user"),
        ("instagram_plugin", "reply"),
        ("instagram_plugin", "tag"),
        ("ai_summarizer", "summarize"),
        ("notifier", "notify_user"),
        ("notifier", "escalate"),
    ];
    for (pn, an) in plugin_actions {
        let id = format!("{}|{}", pn, an);
        let row = SmPluginActionRow {
            id: id.clone(),
            plugin_name: pn.to_string(),
            action_name: an.to_string(),
        };
        db.store_put(store::SM_PLUGIN_ACTIONS, &row, Some(&id)).await?;
    }

    let plugin_sources = [
        ("gmail_plugin", "gmail"),
        ("twitter_plugin", "twitter"),
        ("telegram_plugin", "telegram"),
        ("instagram_plugin", "instagram"),
    ];
    for (pn, sn) in plugin_sources {
        let id = format!("{}|{}", pn, sn);
        let row = SmPluginSourceRow {
            id: id.clone(),
            plugin_name: pn.to_string(),
            source_name: sn.to_string(),
        };
        db.store_put(store::SM_PLUGIN_SOURCES, &row, Some(&id)).await?;
    }

    let category_pipeline = [
        ("noise", 0, "gmail", "trash"),
        ("info", 0, "gmail", "mark_read"),
        ("info", 1, "gmail", "archive"),
    ];
    for (cat, idx, plugin, cmd) in category_pipeline {
        let id = format!("{}|{}", cat, idx);
        let row = SmCategoryPipelineRow {
            id: id.clone(),
            category_name: cat.to_string(),
            action_idx: idx,
            plugin_id: plugin.to_string(),
            command_id: cmd.to_string(),
        };
        db.store_put(store::SM_CATEGORY_PIPELINE, &row, Some(&id)).await?;
    }

    Ok(())
}

const ALLOWED_TABLES: &[&str] = &[
    "sm_rules",
    "sm_rule_triggers",
    "sm_rule_commands",
    "sm_events",
    "items",
    "emailClassifications",
    "contacts",
    "settings",
];

fn table_to_store(table: &str) -> Option<&'static str> {
    match table {
        "sm_rules" => Some(store::SM_RULES),
        "sm_rule_triggers" => Some(store::SM_RULE_TRIGGERS),
        "sm_rule_commands" => Some(store::SM_RULE_COMMANDS),
        "sm_events" => Some(store::SM_EVENTS),
        "items" => Some(store::ITEMS),
        "emailClassifications" => Some(store::EMAIL_CLASSIFICATIONS),
        "contacts" => Some(store::CONTACTS),
        "settings" => Some(store::SETTINGS),
        _ => None,
    }
}

pub async fn get_table_count(db: DbRef<'_>, table: &str) -> Result<i64, CoreError> {
    let Some(store_name) = table_to_store(table) else {
        return Ok(0);
    };
    let n = db.store_count(store_name, None).await?;
    Ok(n as i64)
}

pub async fn clear_all_data(db: DbRef<'_>) -> Result<(), CoreError> {
    db.store_clear(store::SM_EVENTS).await?;
    db.store_clear(store::SM_RULE_COMMANDS).await?;
    db.store_clear(store::SM_RULE_TRIGGERS).await?;
    db.store_clear(store::SM_RULE_POLICIES).await?;
    db.store_clear(store::SM_RULES).await?;
    db.store_clear(store::ITEMS).await?;
    db.store_clear(store::EMAIL_CLASSIFICATIONS).await?;
    db.store_clear(store::CONTACTS).await?;
    db.store_clear(store::SYNC_STATE).await?;
    db.store_clear(store::SETTINGS).await?;
    db.store_clear(store::AUDIT_LOG).await?;
    Ok(())
}

#[derive(Serialize, Deserialize)]
pub struct SettingRow {
    pub key: Option<String>,
    pub value: Option<String>,
}

pub async fn get_setting(db: DbRef<'_>, key: &str) -> Result<Option<String>, CoreError> {
    let opt: Option<SettingRow> = db.store_get(store::SETTINGS, key).await?;
    Ok(opt.and_then(|r| r.value))
}

#[derive(Serialize, Deserialize)]
struct SettingDoc {
    key: String,
    value: String,
}

pub async fn set_setting(db: DbRef<'_>, key: &str, value: &str) -> Result<(), CoreError> {
    let doc = SettingDoc {
        key: key.to_string(),
        value: value.to_string(),
    };
    db.store_put(store::SETTINGS, &doc, Some(key)).await
}

pub async fn remove_setting(db: DbRef<'_>, key: &str) -> Result<(), CoreError> {
    db.store_delete(store::SETTINGS, key).await
}
