//! DB adapter bridge: Rust builds SQL (sea-query) and passes it to JS for execution.
//! - Rust calls `adapter.query(sql, params)` or `adapter.exec(sql, params)` with built (sql, params).
//! - JS is thin: it only runs the given SQL and returns results; it does not construct SQL.

use js_sys::{Array, Reflect};
use serde::de::DeserializeOwned;
use serde_wasm_bindgen::from_value;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen_futures::JsFuture;

use sea_query::value::Value;

use crate::error::CoreError;

thread_local! {
    static ADAPTER: std::cell::RefCell<Option<JsValue>> = std::cell::RefCell::new(None);
}

/// Set the JS DB adapter (object with `query(sql, params)` and `exec(sql, params)`).
pub fn set_adapter(db: JsValue) {
    ADAPTER.with(|cell| {
        *cell.borrow_mut() = Some(db);
    });
}

fn get_adapter() -> Result<JsValue, CoreError> {
    ADAPTER.with(|cell| {
        cell.borrow()
            .clone()
            .ok_or(CoreError::AdapterNotSet)
    })
}

/// Convert a single sea_query Value to JsValue for the params array.
fn value_to_js(v: &Value) -> JsValue {
    use sea_query::value::Value;
    match v {
        Value::Bool(Some(b)) => JsValue::from(*b),
        Value::Bool(None) => JsValue::NULL,
        Value::TinyInt(Some(n)) => JsValue::from(*n),
        Value::TinyInt(None) => JsValue::NULL,
        Value::SmallInt(Some(n)) => JsValue::from(*n),
        Value::SmallInt(None) => JsValue::NULL,
        Value::Int(Some(n)) => JsValue::from(*n),
        Value::Int(None) => JsValue::NULL,
        Value::BigInt(Some(n)) => JsValue::from(*n as f64),
        Value::BigInt(None) => JsValue::NULL,
        Value::Float(Some(n)) => JsValue::from(*n),
        Value::Float(None) => JsValue::NULL,
        Value::Double(Some(n)) => JsValue::from(*n),
        Value::Double(None) => JsValue::NULL,
        Value::String(Some(s)) => JsValue::from(s.as_ref().as_str()),
        Value::String(None) => JsValue::NULL,
        Value::Char(Some(c)) => JsValue::from(c.to_string()),
        Value::Char(None) => JsValue::NULL,
        _ => JsValue::NULL,
    }
}

/// Convert sea-query Values (ordered vec) to a JS array for the adapter's params.
pub fn values_to_js_array(values: &sea_query::Values) -> JsValue {
    let arr = Array::new();
    for v in values.0.iter() {
        arr.push(&value_to_js(v));
    }
    arr.into()
}

/// A built query (SQL + params), ready to run via the adapter.
#[derive(Clone)]
pub struct PreparedQuery {
    pub sql: String,
    pub params: sea_query::Values,
}

impl From<(String, sea_query::Values)> for PreparedQuery {
    fn from((sql, params): (String, sea_query::Values)) -> Self {
        Self { sql, params }
    }
}

impl PreparedQuery {
    /// Run this query and deserialize rows into `Vec<T>`.
    pub async fn run<T>(&self) -> Result<Vec<T>, CoreError>
    where
        T: DeserializeOwned,
    {
        let params = values_to_js_array(&self.params);
        run_query::<T>(&self.sql, &params).await
    }
}

/// Run query(sql, params) via the JS adapter and deserialize rows into Vec<T>.
pub async fn run_query<T>(sql: &str, params: &JsValue) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let adapter = get_adapter()?;
    let query_fn = Reflect::get(&adapter, &JsValue::from_str("query"))
        .map_err(|_| CoreError::AdapterQueryMissing)?;
    let query_fn = query_fn
        .dyn_ref::<js_sys::Function>()
        .ok_or(CoreError::AdapterQueryMissing)?;
    let sql_js = JsValue::from_str(sql);
    let promise = query_fn
        .call2(&adapter, &sql_js, params)
        .map_err(|e| CoreError::QueryCall(format!("{e:?}")))?;
    let promise = promise
        .dyn_into::<js_sys::Promise>()
        .map_err(|_| CoreError::AdapterQueryNotPromise)?;
    let result = JsFuture::from(promise)
        .await
        .map_err(|e| CoreError::QueryAwait(format!("{e:?}")))?;
    let rows: Vec<T> = from_value(result)
        .map_err(|e| CoreError::Deserialize(e.to_string()))?;
    Ok(rows)
}

/// Run exec(sql, params) via the JS adapter. Reserved for future INSERT/UPDATE/DELETE.
#[allow(dead_code)]
pub async fn run_exec(sql: &str, params: &JsValue) -> Result<(), CoreError> {
    let adapter = get_adapter()?;
    let exec_fn = Reflect::get(&adapter, &JsValue::from_str("exec"))
        .map_err(|_| CoreError::AdapterExecMissing)?;
    let exec_fn = exec_fn
        .dyn_ref::<js_sys::Function>()
        .ok_or(CoreError::AdapterExecMissing)?;
    let sql_js = JsValue::from_str(sql);
    let promise = exec_fn
        .call2(&adapter, &sql_js, params)
        .map_err(|e| CoreError::ExecCall(format!("{e:?}")))?;
    let promise = promise
        .dyn_into::<js_sys::Promise>()
        .map_err(|_| CoreError::AdapterExecNotPromise)?;
    JsFuture::from(promise)
        .await
        .map_err(|e| CoreError::ExecAwait(format!("{e:?}")))?;
    Ok(())
}
