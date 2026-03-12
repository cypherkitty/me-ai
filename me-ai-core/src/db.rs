//! Rexie (IndexedDB) access: get/put/delete/count/scan. No SQL, no adapter.

use rexie::{Direction, KeyRange, TransactionMode};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_wasm_bindgen::{from_value, to_value};
use wasm_bindgen::JsValue;

use crate::error::CoreError;
pub use crate::rexie_schema::get_rexie;

fn rexie_err(e: rexie::Error) -> CoreError {
    CoreError::Rexie(e.to_string())
}

/// Get one value by key from a store.
pub async fn store_get<T>(store_name: &str, key: &str) -> Result<Option<T>, CoreError>
where
    T: DeserializeOwned,
{
    let rexie = get_rexie().await?;
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let key_js = JsValue::from_str(key);
    let opt = s.get(key_js).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    let Some(val) = opt else {
        return Ok(None);
    };
    let t = from_value(val).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    Ok(Some(t))
}

/// Put one value. Key is taken from the value (keyPath) or pass key_override for stores that need it.
pub async fn store_put<V>(store_name: &str, value: &V, key_override: Option<&str>) -> Result<(), CoreError>
where
    V: Serialize,
{
    let rexie = get_rexie().await?;
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let val_js = to_value(value).map_err(|e| CoreError::Serialize(e.to_string()))?;
    let key_js = key_override.map(JsValue::from_str);
    s.put(&val_js, key_js.as_ref()).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Put multiple values. Each value must contain its key (keyPath).
pub async fn store_put_all<V>(store_name: &str, values: &[V]) -> Result<(), CoreError>
where
    V: Serialize,
{
    if values.is_empty() {
        return Ok(());
    }
    let mut collected: Vec<(JsValue, Option<JsValue>)> = Vec::with_capacity(values.len());
    for v in values {
        let js = to_value(v).map_err(|e| CoreError::Serialize(e.to_string()))?;
        collected.push((js, None));
    }
    let rexie = get_rexie().await?;
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    s.put_all(collected.into_iter()).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Delete one key from a store.
pub async fn store_delete(store_name: &str, key: &str) -> Result<(), CoreError> {
    let rexie = get_rexie().await?;
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    s.delete(JsValue::from_str(key)).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    Ok(())
}

/// Clear all entries in a store.
pub async fn store_clear(store_name: &str) -> Result<(), CoreError> {
    let rexie = get_rexie().await?;
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
    store_name: &str,
    index_name: &str,
    key_range: Option<KeyRange>,
) -> Result<u32, CoreError> {
    let rexie = get_rexie().await?;
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
pub async fn store_count(store_name: &str, key_range: Option<KeyRange>) -> Result<u32, CoreError> {
    let rexie = get_rexie().await?;
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
    store_name: &str,
    key_range: Option<KeyRange>,
    limit: Option<u32>,
) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let rexie = get_rexie().await?;
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
    store_name: &str,
    index_name: &str,
    key_range: Option<KeyRange>,
    limit: Option<u32>,
) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let rexie = get_rexie().await?;
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

/// Scan store with limit/offset and direction (for pagination).
pub async fn store_scan<T>(
    store_name: &str,
    key_range: Option<KeyRange>,
    limit: Option<u32>,
    offset: Option<u32>,
    direction: Option<Direction>,
) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let rexie = get_rexie().await?;
    let tx = rexie
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(rexie_err)?;
    let s = tx.store(store_name).map_err(rexie_err)?;
    let pairs = s.scan(key_range, limit, offset, direction).await.map_err(rexie_err)?;
    tx.done().await.map_err(rexie_err)?;
    let mut out = Vec::with_capacity(pairs.len());
    for (_, val) in pairs {
        let t = from_value(val).map_err(|e| CoreError::Deserialize(e.to_string()))?;
        out.push(t);
    }
    Ok(out)
}

/// Scan an index with limit/offset and direction (e.g. auditLog by executedAt DESC).
pub async fn index_scan<T>(
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
    let rexie = get_rexie().await?;
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
    let k = JsValue::from_str(key);
    KeyRange::only(&k).map_err(|e| CoreError::Rexie(e.to_string()))
}

/// Build KeyRange::only for boolean key (e.g. index on "success").
pub fn key_range_only_bool(b: bool) -> Result<KeyRange, CoreError> {
    let k = JsValue::from_bool(b);
    KeyRange::only(&k).map_err(|e| CoreError::Rexie(e.to_string()))
}
