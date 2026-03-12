//! DB adapter bridge: call JS query/exec from Rust and convert sea-query Values to params.

use js_sys::{Array, Reflect};
use serde::de::DeserializeOwned;
use serde_wasm_bindgen::from_value;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen_futures::JsFuture;

use sea_query::value::Value;

thread_local! {
    static ADAPTER: std::cell::RefCell<Option<JsValue>> = std::cell::RefCell::new(None);
}

/// Set the JS DB adapter (object with `query(sql, params)` and `exec(sql, params)`).
pub fn set_adapter(db: JsValue) {
    ADAPTER.with(|cell| {
        *cell.borrow_mut() = Some(db);
    });
}

/// Get the adapter or return an error JsValue.
fn get_adapter() -> Result<JsValue, JsValue> {
    ADAPTER.with(|cell| {
        cell.borrow()
            .clone()
            .ok_or_else(|| JsValue::from_str("me-ai-core: init() was not called or adapter is missing"))
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

/// Run query(sql, params) via the JS adapter and deserialize rows into Vec<T>.
pub async fn run_query<T>(sql: &str, params: &JsValue) -> Result<Vec<T>, JsValue>
where
    T: DeserializeOwned,
{
    let adapter = get_adapter()?;
    let query_fn = Reflect::get(&adapter, &JsValue::from_str("query"))
        .map_err(|_| JsValue::from_str("adapter.query is not a function"))?;
    let query_fn = query_fn.dyn_ref::<js_sys::Function>().ok_or_else(|| {
        JsValue::from_str("adapter.query is not a function")
    })?;
    let sql_js = JsValue::from_str(sql);
    let promise = query_fn.call2(&adapter, &sql_js, params).map_err(|e| {
        JsValue::from(js_sys::Error::new(&format!("adapter.query failed: {:?}", e)))
    })?;
    let promise = promise.dyn_into::<js_sys::Promise>().map_err(|_| {
        JsValue::from_str("adapter.query did not return a Promise")
    })?;
    let result = JsFuture::from(promise).await.map_err(|e| {
        JsValue::from(js_sys::Error::new(&format!("query await failed: {:?}", e)))
    })?;
    let rows: Vec<T> = from_value(result).map_err(|e| {
        JsValue::from(js_sys::Error::new(&format!("deserialize rows: {:?}", e)))
    })?;
    Ok(rows)
}

/// Run exec(sql, params) via the JS adapter.
pub async fn run_exec(sql: &str, params: &JsValue) -> Result<(), JsValue> {
    let adapter = get_adapter()?;
    let exec_fn = Reflect::get(&adapter, &JsValue::from_str("exec"))
        .map_err(|_| JsValue::from_str("adapter.exec is not a function"))?;
    let exec_fn = exec_fn.dyn_ref::<js_sys::Function>().ok_or_else(|| {
        JsValue::from_str("adapter.exec is not a function")
    })?;
    let sql_js = JsValue::from_str(sql);
    let promise = exec_fn.call2(&adapter, &sql_js, params).map_err(|e| {
        JsValue::from(js_sys::Error::new(&format!("adapter.exec failed: {:?}", e)))
    })?;
    let promise = promise.dyn_into::<js_sys::Promise>().map_err(|_| {
        JsValue::from_str("adapter.exec did not return a Promise")
    })?;
    JsFuture::from(promise).await.map_err(|e| {
        JsValue::from(js_sys::Error::new(&format!("exec await failed: {:?}", e)))
    })?;
    Ok(())
}
