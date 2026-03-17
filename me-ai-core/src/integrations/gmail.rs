//! Gmail API TypeScript interface definitions.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const GMAIL_TYPES: &'static str = r#"
export interface ListMessagesOptions {
    maxResults?: number;
    pageToken?: string;
    q?: string;
}

export interface ListHistoryOptions {
    startHistoryId: string;
    pageToken?: string;
    maxResults?: number;
}
"#;
