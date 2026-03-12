//! Event types and categories (sea-query + run_query).

use serde::{Deserialize, Serialize};
use sea_query::{Order, Query, SqliteQueryBuilder};

use crate::db::PreparedQuery;
use crate::error::CoreError;
use crate::schema::{SmEventCategories, SmEventTypes};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventTypeRow {
    pub name: String,
    pub label: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventCategoryRow {
    pub name: String,
    pub label: Option<String>,
    pub priority: Option<i64>,
}

/// SELECT name, label FROM sm_event_types ORDER BY name.
fn select_event_types() -> PreparedQuery {
    let stmt = Query::select()
        .columns([
            (SmEventTypes::Table, SmEventTypes::Name),
            (SmEventTypes::Table, SmEventTypes::Label),
        ])
        .from(SmEventTypes::Table)
        .order_by(SmEventTypes::Name, Order::Asc)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// SELECT name, label, priority FROM sm_event_categories ORDER BY priority.
fn select_event_categories() -> PreparedQuery {
    let stmt = Query::select()
        .columns([
            (SmEventCategories::Table, SmEventCategories::Name),
            (SmEventCategories::Table, SmEventCategories::Label),
            (SmEventCategories::Table, SmEventCategories::Priority),
        ])
        .from(SmEventCategories::Table)
        .order_by(SmEventCategories::Priority, Order::Asc)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// Fetch event types from the DB (requires init() with adapter first).
pub async fn get_event_types() -> Result<Vec<EventTypeRow>, CoreError> {
    select_event_types().run().await
}

/// Fetch event categories from the DB (requires init() with adapter first).
pub async fn get_event_categories() -> Result<Vec<EventCategoryRow>, CoreError> {
    select_event_categories().run().await
}
