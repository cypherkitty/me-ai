//! Persistence layer: Rexie schema, store names, and DB access primitives.

mod access;
mod rexie_schema;

pub use access::{key_range_only, DbRef};
pub use rexie_schema::{store, RexieDb};
