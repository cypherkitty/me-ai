//! Static table/column identifiers (sea-query Iden). Copy types, no clone needed.

use sea_query::Iden;

#[derive(Debug, Clone, Copy, Iden)]
pub(super) enum SmEventTypes {
    Table,
    Name,
    Label,
}

#[derive(Debug, Clone, Copy, Iden)]
pub(super) enum SmEventCategories {
    Table,
    Name,
    Label,
    Priority,
}

#[derive(Debug, Clone, Copy, Iden)]
pub(super) enum SmSources {
    Table,
    Name,
    Label,
    Platform,
    Api,
    Enabled,
}

#[derive(Debug, Clone, Copy, Iden)]
pub(super) enum SmActions {
    Table,
    Name,
    Label,
}

#[derive(Debug, Clone, Copy, Iden)]
pub(super) enum Items {
    Table,
    #[iden = "sourceType"]
    SourceType,
    Date,
}

#[derive(Debug, Clone, Copy, Iden)]
pub(super) enum Contacts {
    Table,
}

#[derive(Debug, Clone, Copy, Iden)]
#[iden = "emailClassifications"]
pub(super) enum EmailClassifications {
    Table,
}
