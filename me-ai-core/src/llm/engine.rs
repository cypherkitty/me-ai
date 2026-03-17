//! LLM engine TypeScript interface definitions.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const ENGINE_TYPES: &'static str = r#"
export interface WorkerMessage {
    status: string;
    data?: string;
    modelId?: string | null;
    loaded?: boolean;
    phase?: string;
    output?: string;
    content?: string;
    tps?: number | null;
    numTokens?: number;
    inputTokens?: number;
    file?: string;
    progress?: number;
    name?: string;
    [key: string]: unknown;
}

export interface WorkerHandle {
    postMessage: (msg: object, transfer?: Transferable[]) => void;
    terminate: () => void;
}

export type Listener = (msg: WorkerMessage) => void;
"#;
