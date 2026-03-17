//! Google Auth TypeScript interface definitions.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const GOOGLE_AUTH_TYPES: &'static str = r#"
export interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    error?: string;
    error_description?: string;
}
"#;
