//! OAuth helpers (browser-oriented flows; navigation stays in JS).

use wasm_bindgen::prelude::*;

pub mod twitter;

#[wasm_bindgen(typescript_custom_section)]
const TWITTER_TOKEN_DATA_TS: &'static str = r#"
export interface TwitterTokenData {
    access_token: string;
    refresh_token?: string;
    expires_at: number;
}
"#;
