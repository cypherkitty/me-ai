//! DB adapter bridge: Rust builds SQL (sea-query) and passes it to JS for execution.
//! - Adapter state + single call_adapter(method, args) helper.
//! - Params converted via Serde (Param type) to JS array; no large value_to_js match.
//! - PreparedQuery + run; run_query/run_exec are thin wrappers.

use js_sys::{Array, Reflect};
use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_wasm_bindgen::{from_value, to_value};
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen_futures::JsFuture;

use sea_query::value::Value;

use crate::error::CoreError;

// --- Adapter state ---

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

/// Call adapter method with args and return the resolved JsValue (single place for Reflect/apply/Promise/await).
async fn call_adapter(method: &str, args: &[JsValue]) -> Result<JsValue, CoreError> {
    let adapter = get_adapter()?;
    let method_js = JsValue::from_str(method);
    let fn_val = Reflect::get(&adapter, &method_js).map_err(|_| {
        if method == "query" {
            CoreError::AdapterQueryMissing
        } else {
            CoreError::AdapterExecMissing
        }
    })?;
    let args_array = Array::new();
    for a in args {
        args_array.push(a);
    }
    let promise = Reflect::apply(
        fn_val.unchecked_ref::<js_sys::Function>(),
        &adapter,
        &args_array,
    )
    .map_err(|e| {
        if method == "query" {
            CoreError::QueryCall(format!("{e:?}"))
        } else {
            CoreError::ExecCall(format!("{e:?}"))
        }
    })?;
    let promise = promise.dyn_into::<js_sys::Promise>().map_err(|_| {
        if method == "query" {
            CoreError::AdapterQueryNotPromise
        } else {
            CoreError::AdapterExecNotPromise
        }
    })?;
    let result = JsFuture::from(promise)
        .await
        .map_err(|e| {
            if method == "query" {
                CoreError::QueryAwait(format!("{e:?}"))
            } else {
                CoreError::ExecAwait(format!("{e:?}"))
            }
        })?;
    Ok(result)
}

// --- Serde-based param conversion (replaces large value_to_js match) ---

#[derive(Serialize)]
#[serde(untagged)]
enum ParamValue {
    Int(i64),
    Float(f64),
    Str(String),
    Bool(bool),
}

/// One parameter for the adapter (serializes to number/string/bool/null in JS).
type Param = Option<ParamValue>;

fn value_to_param(v: &Value) -> Param {
    use sea_query::value::Value;
    match v {
        Value::Bool(Some(b)) => Some(ParamValue::Bool(*b)),
        Value::Bool(None) => None,
        Value::TinyInt(Some(n)) => Some(ParamValue::Int(*n as i64)),
        Value::TinyInt(None) => None,
        Value::SmallInt(Some(n)) => Some(ParamValue::Int(*n as i64)),
        Value::SmallInt(None) => None,
        Value::Int(Some(n)) => Some(ParamValue::Int((*n).into())),
        Value::Int(None) => None,
        Value::BigInt(Some(n)) => Some(ParamValue::Float(*n as f64)),
        Value::BigInt(None) => None,
        Value::Float(Some(n)) => Some(ParamValue::Float((*n).into())),
        Value::Float(None) => None,
        Value::Double(Some(n)) => Some(ParamValue::Float(*n)),
        Value::Double(None) => None,
        Value::String(Some(s)) => Some(ParamValue::Str(s.as_ref().to_string())),
        Value::String(None) => None,
        Value::Char(Some(c)) => Some(ParamValue::Str(c.to_string())),
        Value::Char(None) => None,
        _ => None,
    }
}

/// Convert sea-query Values to a JS array for the adapter (Serde-based).
fn values_to_js_array(values: &sea_query::Values) -> Result<JsValue, CoreError> {
    let params: Vec<Param> = values.0.iter().map(value_to_param).collect();
    to_value(&params).map_err(|e| CoreError::Serialize(e.to_string()))
}

// --- PreparedQuery + run ---

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
        let params_js = values_to_js_array(&self.params)?;
        run_query::<T>(&self.sql, &params_js).await
    }
}

/// Run query(sql, params) via the JS adapter and deserialize rows into Vec<T>.
pub async fn run_query<T>(sql: &str, params: &JsValue) -> Result<Vec<T>, CoreError>
where
    T: DeserializeOwned,
{
    let args = [JsValue::from_str(sql), params.clone()];
    let result = call_adapter("query", &args).await?;
    let rows: Vec<T> = from_value(result).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    Ok(rows)
}

/// Run exec(sql, params) via the JS adapter. Reserved for future INSERT/UPDATE/DELETE.
#[allow(dead_code)]
pub async fn run_exec(sql: &str, params: &JsValue) -> Result<(), CoreError> {
    let args = [JsValue::from_str(sql), params.clone()];
    call_adapter("exec", &args).await?;
    Ok(())
}
