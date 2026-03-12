//! Items and contacts queries for the query layer (counts, date range, recent items).
//! Built with sea-query, executed via JS adapter.

use serde::{Deserialize, Serialize};
use sea_query::{Alias, Expr, Order, Query, SqliteQueryBuilder};

use crate::db::PreparedQuery;
use crate::error::CoreError;
use crate::schema::{Contacts, EmailClassifications, Items};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CountRow {
    pub cnt: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DateRow {
    pub date: Option<i64>,
}

/// SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'.
fn select_items_count_gmail() -> PreparedQuery {
    let stmt = Query::select()
        .expr_as(Expr::cust("COUNT(*)"), Alias::new("cnt"))
        .from(Items::Table)
        .and_where(Expr::col((Items::Table, Items::SourceType)).eq("gmail"))
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// SELECT COUNT(*) AS cnt FROM contacts.
fn select_contacts_count() -> PreparedQuery {
    let stmt = Query::select()
        .expr_as(Expr::cust("COUNT(*)"), Alias::new("cnt"))
        .from(Contacts::Table)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// SELECT COUNT(*) AS cnt FROM emailClassifications.
fn select_email_classifications_count() -> PreparedQuery {
    let stmt = Query::select()
        .expr_as(Expr::cust("COUNT(*)"), Alias::new("cnt"))
        .from(EmailClassifications::Table)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// SELECT date FROM items WHERE sourceType = 'gmail' ORDER BY date ASC LIMIT 1.
fn select_items_date_min() -> PreparedQuery {
    let stmt = Query::select()
        .column((Items::Table, Items::Date))
        .from(Items::Table)
        .and_where(Expr::col((Items::Table, Items::SourceType)).eq("gmail"))
        .order_by(Items::Date, Order::Asc)
        .limit(1)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// SELECT date FROM items WHERE sourceType = 'gmail' ORDER BY date DESC LIMIT 1.
fn select_items_date_max() -> PreparedQuery {
    let stmt = Query::select()
        .column((Items::Table, Items::Date))
        .from(Items::Table)
        .and_where(Expr::col((Items::Table, Items::SourceType)).eq("gmail"))
        .order_by(Items::Date, Order::Desc)
        .limit(1)
        .to_owned();
    stmt.build(SqliteQueryBuilder).into()
}

/// Count of items with sourceType = 'gmail'.
pub async fn get_items_count_gmail() -> Result<i64, CoreError> {
    let rows = select_items_count_gmail().run::<CountRow>().await?;
    Ok(rows.first().and_then(|r| r.cnt).unwrap_or(0))
}

/// Count of contacts.
pub async fn get_contacts_count() -> Result<i64, CoreError> {
    let rows = select_contacts_count().run::<CountRow>().await?;
    Ok(rows.first().and_then(|r| r.cnt).unwrap_or(0))
}

/// Count of email classifications.
pub async fn get_email_classifications_count() -> Result<i64, CoreError> {
    let rows = select_email_classifications_count().run::<CountRow>().await?;
    Ok(rows.first().and_then(|r| r.cnt).unwrap_or(0))
}

/// Oldest date among gmail items (single row, date column).
pub async fn get_items_date_min() -> Result<Option<i64>, CoreError> {
    let rows = select_items_date_min().run::<DateRow>().await?;
    Ok(rows.into_iter().next().and_then(|r| r.date))
}

/// Newest date among gmail items (single row, date column).
pub async fn get_items_date_max() -> Result<Option<i64>, CoreError> {
    let rows = select_items_date_max().run::<DateRow>().await?;
    Ok(rows.into_iter().next().and_then(|r| r.date))
}
