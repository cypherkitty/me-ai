use reqwest::Client;
use serde::Serialize;

use crate::error::CoreError;

#[derive(Clone, Copy, Debug)]
pub(crate) enum HttpMethod {
    Post,
    Delete,
}

fn http_client() -> Client {
    Client::new()
}

pub(crate) async fn fetch_with_body(
    method: HttpMethod,
    url: &str,
    token: &str,
    body: Option<serde_json::Value>,
) -> Result<reqwest::Response, CoreError> {
    let client = http_client();
    let auth = format!("Bearer {}", token);

    let mut req = match method {
        HttpMethod::Post => client.post(url),
        HttpMethod::Delete => client.delete(url),
    };

    req = req.header("Authorization", auth);

    if let Some(body_val) = body {
        req = req
            .header("Content-Type", "application/json")
            .json(&body_val);
    }

    let resp = req.send().await.map_err(|e| CoreError::Plugin(e.to_string()))?;
    Ok(resp)
}

pub(crate) fn serialize_body<T: Serialize>(body: T) -> Result<serde_json::Value, String> {
    serde_json::to_value(body).map_err(|e| format!("Failed to serialize request body: {e}"))
}
