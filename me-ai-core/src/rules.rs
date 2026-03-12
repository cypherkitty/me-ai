//! Rule-related seed data queries (sources, actions). Built with sea-query, run via JS adapter.

use serde::{Deserialize, Serialize};
use sea_query::{Order, Query, SqliteQueryBuilder};

use crate::db::PreparedQuery;
use crate::error::CoreError;
use crate::schema::{SmActions, SmSources};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SourceRow {
    pub name: String,
    pub label: Option<String>,
    pub platform: Option<String>,
    pub api: Option<String>,
    pub enabled: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ActionRow {
    pub name: String,
    pub label: Option<String>,
}

/// SELECT name, label, platform, api, enabled FROM sm_sources ORDER BY name.
fn select_sources() -> PreparedQuery {
    let stmt = Query::select()
        .columns([
            (SmSources::Table, SmSources::Name),
            (SmSources::Table, SmSources::Label),
            (SmSources::Table, SmSources::Platform),
            (SmSources::Table, SmSources::Api),
            (SmSources::Table, SmSources::Enabled),
        ])
        .from(SmSources::Table)
        .order_by(SmSources::Name, Order::Asc)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// SELECT name, label FROM sm_actions ORDER BY name.
fn select_actions() -> PreparedQuery {
    let stmt = Query::select()
        .columns([
            (SmActions::Table, SmActions::Name),
            (SmActions::Table, SmActions::Label),
        ])
        .from(SmActions::Table)
        .order_by(SmActions::Name, Order::Asc)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// Fetch sources from the DB (requires init() with adapter first).
pub async fn get_sources() -> Result<Vec<SourceRow>, CoreError> {
    select_sources().run().await
}

/// Fetch actions from the DB (requires init() with adapter first).
pub async fn get_actions() -> Result<Vec<ActionRow>, CoreError> {
    select_actions().run().await
}
