//! Rexie (IndexedDB) access: get/put/delete/count/scan. No SQL, no adapter.
//! Use DbRef for domain logic; RexieDb is built once at init (meta-secret pattern).

use rexie::{Direction, KeyRange, Rexie, TransactionMode};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_wasm_bindgen::from_value;
use wasm_bindgen::JsValue;

use super::rexie_schema::{store, RexieDb};
use crate::error::CoreError;

impl RexieDb {
    /// Reference for domain logic. Rexie is built once; this passes it through.
    pub fn db(&self) -> DbRef<'_> {
        DbRef(&self.rexie)
    }
}

fn rexie_err(e: rexie::Error) -> CoreError {
    crate::error::rexie_to_core(e)
}

fn is_invalid_key_str(key: &str) -> bool {
    let trimmed = key.trim();
    trimmed.is_empty() || trimmed == "null" || trimmed == "undefined"
}

/// Reference to Rexie for domain calls. Pass db.db() from RexieDb.
#[derive(Clone, Copy)]
pub struct DbRef<'a>(pub(crate) &'a Rexie);

impl DbRef<'_> {
    pub async fn store_get<T>(&self, store_name: &str, key: &str) -> Result<Option<T>, CoreError>
    where
        T: serde::de::DeserializeOwned,
    {
        store_get(self.0, store_name, key).await
    }
    pub async fn store_put<V>(&self, store_name: &str, value: &V, key_override: Option<&str>) -> Result<(), CoreError>
    where
        V: Serialize,
    {
        store_put(self.0, store_name, value, key_override).await
    }
    pub async fn store_put_all<V>(&self, store_name: &str, values: &[V]) -> Result<(), CoreError>
    where
        V: Serialize,
    {
        store_put_all(self.0, store_name, values).await
    }
    pub async fn store_delete(&self, store_name: &str, key: &str) -> Result<(), CoreError> {
        store_delete(self.0, store_name, key).await
    }
    pub async fn store_clear(&self, store_name: &str) -> Result<(), CoreError> {
        store_clear(self.0, store_name).await
    }
    pub async fn store_count(&self, store_name: &str, key_range: Option<KeyRange>) -> Result<u32, CoreError> {
        store_count(self.0, store_name, key_range).await
    }
    pub async fn index_count(
        &self,
        store_name: &str,
        index_name: &str,
        key_range: Option<KeyRange>,
    ) -> Result<u32, CoreError> {
        index_count(self.0, store_name, index_name, key_range).await
    }
    pub async fn store_get_all<T>(
        &self,
        store_name: &str,
        key_range: Option<KeyRange>,
        limit: Option<u32>,
    ) -> Result<Vec<T>, CoreError>
    where
        T: serde::de::DeserializeOwned,
    {
        store_get_all(self.0, store_name, key_range, limit).await
    }
    pub async fn index_get_all<T>(
        &self,
        store_name: &str,
        index_name: &str,
        key_range: Option<KeyRange>,
        limit: Option<u32>,
    ) -> Result<Vec<T>, CoreError>
    where
        T: serde::de::DeserializeOwned,
    {
        index_get_all(self.0, store_name, index_name, key_range, limit).await
    }
    pub async fn index_scan<T>(
        &self,
        store_name: &str,
        index_name: &str,
        key_range: Option<KeyRange>,
        limit: Option<u32>,
        offset: Option<u32>,
        direction: Option<Direction>,
    ) -> Result<Vec<T>, CoreError>
    where
        T: serde::de::DeserializeOwned,
    {
        index_scan(self.0, store_name, index_name, key_range, limit, offset, direction).await
    }
}

/// Get one value by key from a store.
pub async fn store_get<T>(rexie: &Rexie, store_name: &str, key: &str) -> Result<Option<T>, CoreError>
where
    T: DeserializeOwned,
{
    if is_invalid_key_str(key) {
        return Ok(None);
    }
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let key_js = JsValue::from_str(key);
    let opt = s.get(key_js).await.map_err(|e| {
        CoreError::Rexie(format!("store_get failed for store '{}' key '{}': {}", store_name, key, e))
    })?;
    tx.done().await.map_err(rexie_err)?;
    let Some(val) = opt else {
        return Ok(None);
    };
    let t = from_value(val).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    Ok(Some(t))
}

/// Put one value. Key is taken from the value (keyPath) or pass key_override for stores that need it.
pub async fn store_put<V>(
    rexie: &Rexie,
    store_name: &str,
    value: &V,
    key_override: Option<&str>,
) -> Result<(), CoreError>
where
    V: Serialize,
{
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let serializer = serde_wasm_bindgen::Serializer::new().serialize_maps_as_objects(true);

    let val_js = if let Some(key) = key_override {
        let mut json_val = serde_json::to_value(value).map_err(|e| CoreError::Serialize(e.to_string()))?;
        if let Some(obj) = json_val.as_object_mut() {
            let key_path = match store_name {
                store::ITEMS
                | store::AUDIT_LOG
                | store::SM_PLUGIN_ACTIONS
                | store::SM_PLUGIN_SOURCES
                | store::SM_CATEGORY_PIPELINE
                | store::SM_TYPE_PIPELINE
                | store::SM_RULES
                | store::SM_RULE_TRIGGERS
                | store::SM_RULE_COMMANDS
                | store::SM_EVENTS => "id",

                store::SM_EVENT_TYPES
                | store::SM_EVENT_CATEGORIES
                | store::SM_SOURCES
                | store::SM_ACTIONS
                | store::SM_PLUGINS => "name",

                store::CONTACTS => "email",
                store::SYNC_STATE => "sourceType",
                store::SETTINGS => "key",
                store::EMAIL_CLASSIFICATIONS => "emailId",
                store::SM_RULE_POLICIES => "rule_id",
                _ => "",
            };

            if !key_path.is_empty() {
                obj.insert(key_path.to_string(), serde_json::Value::String(key.to_string()));
            }
        }
        json_val.serialize(&serializer).map_err(|e| CoreError::Serialize(e.to_string()))?
    } else {
        value.serialize(&serializer).map_err(|e| CoreError::Serialize(e.to_string()))?
    };

    s.put(&val_js, None).await.map_err(|e| {
        let json_str = serde_json::to_string(value).unwrap_or_else(|_| "unknown".to_string());
        let msg = format!("store_put failed for store '{}': {} (obj={})", store_name, e, json_str);
        CoreError::Rexie(msg)
    })?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Put multiple values. Each value must contain its key (keyPath).
pub async fn store_put_all<V>(rexie: &Rexie, store_name: &str, values: &[V]) -> Result<(), CoreError>
where
    V: Serialize,
{
    if values.is_empty() {
        return Ok(());
    }

    let serializer = serde_wasm_bindgen::Serializer::new().serialize_maps_as_objects(true);
    let mut collected: Vec<(JsValue, Option<JsValue>)> = Vec::with_capacity(values.len());
    for v in values {
        let js = v.serialize(&serializer).map_err(|e| CoreError::Serialize(e.to_string()))?;
        collected.push((js, None));
    }

    let debug_json = values.first().and_then(|v| serde_json::to_string(v).ok()).unwrap_or_default();
    let debug_msg = format!("store_put_all: store='{}', first_val={}", store_name, debug_json);
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    s.put_all(collected.into_iter()).await.map_err(|e| {
        CoreError::Rexie(format!("{} -> {}", debug_msg, e))
    })?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Delete one key from a store.
pub async fn store_delete(rexie: &Rexie, store_name: &str, key: &str) -> Result<(), CoreError> {
    if is_invalid_key_str(key) {
        return Ok(());
    }
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    s.delete(JsValue::from_str(key)).await.map_err(|e| {
        CoreError::Rexie(format!("store_delete failed for store '{}' key '{}': {}", store_name, key, e))
    })?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Clear all entries in a store.
pub async fn store_clear(rexie: &Rexie, store_name: &str) -> Result<(), CoreError> {
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    s.clear().await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Count entries in an index (optionally filtered by key range).
pub async fn index_count(
    rexie: &Rexie,
    store_name: &str,
    index_name: &str,
    key_range: Option<KeyRange>,
) -> Result<u32, CoreError> {
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let idx = s.index(index_name).map_err(rexie_err)?;
    let n = idx.count(key_range).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    Ok(n)
}

/// Count entries in a store (optionally filtered by key range).
pub async fn store_count(rexie: &Rexie, store_name: &str, key_range: Option<KeyRange>) -> Result<u32, CoreError> {
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let n = s.count(key_range).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    Ok(n)
}

/// Get all values from a store (optionally with key range and limit).
pub async fn store_get_all<T>(
    rexie: &Rexie,
    store_name: &str,
    key_range: Option<KeyRange>,
    limit: Option<u32>,
) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let vec_js = s.get_all(key_range, limit).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    let mut out = Vec::with_capacity(vec_js.len());
    for val in vec_js {
        let t = from_value(val).map_err(|e| CoreError::Deserialize(e.to_string()))?;
        out.push(t);
    }
    Ok(out)
}

/// Get all values from an index (e.g. by sourceType) with optional key range and limit.
pub async fn index_get_all<T>(
    rexie: &Rexie,
    store_name: &str,
    index_name: &str,
    key_range: Option<KeyRange>,
    limit: Option<u32>,
) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let idx = s.index(index_name).map_err(rexie_err)?;
    let vec_js = idx.get_all(key_range, limit).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    let mut out = Vec::with_capacity(vec_js.len());
    for val in vec_js {
        let t = from_value(val).map_err(|e| CoreError::Deserialize(e.to_string()))?;
        out.push(t);
    }
    Ok(out)
}

/// Scan an index with limit/offset and direction (e.g. auditLog by executedAt DESC).
pub async fn index_scan<T>(
    rexie: &Rexie,
    store_name: &str,
    index_name: &str,
    key_range: Option<KeyRange>,
    limit: Option<u32>,
    offset: Option<u32>,
    direction: Option<Direction>,
) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let idx = s.index(index_name).map_err(rexie_err)?;
    let pairs = idx.scan(key_range, limit, offset, direction).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    let mut out = Vec::with_capacity(pairs.len());
    for (_, val) in pairs {
        let t = from_value(val).map_err(|e| CoreError::Deserialize(e.to_string()))?;
        out.push(t);
    }
    Ok(out)
}

/// Build KeyRange::only(key) for string key.
pub fn key_range_only(key: &str) -> Result<KeyRange, CoreError> {
    if is_invalid_key_str(key) {
        return Err(CoreError::Rexie("failed to create key range: key is empty or invalid".to_string()));
    }
    let k = JsValue::from_str(key);
    KeyRange::only(&k).map_err(|e| {
        CoreError::Rexie(format!("IDBKeyRange.only failed for string key '{}': {}", key, e))
    })
}

/// Build KeyRange::only for boolean key (e.g. index on "success").
#[allow(dead_code)]
pub fn key_range_only_bool(b: bool) -> Result<KeyRange, CoreError> {
    let k = JsValue::from_bool(b);
    KeyRange::only(&k).map_err(|e| {
        CoreError::Rexie(format!(
            "IDBKeyRange.only failed for boolean key '{}' (booleans are often NOT valid IDB keys): {}",
            b, e
        ))
    })
}
