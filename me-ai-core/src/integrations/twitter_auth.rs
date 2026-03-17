//! Twitter Auth TypeScript interface definitions.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const TWITTER_AUTH_TYPES: &'static str = r#"
export interface TwitterTokenData {
    access_token: string;
    refresh_token?: string;
    expires_at: number;
}
"#;
