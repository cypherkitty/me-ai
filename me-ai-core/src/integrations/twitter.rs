//! Twitter API TypeScript interface definitions.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const TWITTER_TYPES: &'static str = r#"
export interface TwitterUser {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
    public_metrics?: unknown;
}

export interface Tweet {
    id: string;
    text: string;
    author_id?: string;
    created_at?: string;
    public_metrics?: unknown;
    referenced_tweets?: unknown[];
    conversation_id?: string;
}

export interface ApiResponse<T> {
    data?: T;
    includes?: { users?: TwitterUser[] };
    meta?: { next_token?: string; result_count?: number };
}

export interface TimelineOptions {
    maxResults?: number;
    paginationToken?: string;
}

export interface TwitterUserInfo {
    username: string;
    name: string;
}
"#;
