//! Static event-tier / category metadata for the UI (formerly hard-coded in `core.ts`).

use wasm_bindgen::JsValue;

pub(crate) fn get_event_category_tier_definitions() -> JsValue {
    let tiers = serde_json::json!({
        "NOISE": {
            "id": "NOISE",
            "label": "Noise",
            "description": "Unimportant messages that can be safely deleted automatically.",
            "autoExecute": true,
            "requiresApproval": false,
            "color": "#6b7280"
        },
        "INFO": {
            "id": "INFO",
            "label": "Info",
            "description": "Useful but not urgent — will be silently archived.",
            "autoExecute": true,
            "requiresApproval": false,
            "color": "#3b82f6"
        },
        "CRITICAL": {
            "id": "CRITICAL",
            "label": "Critical",
            "description": "Requires attention. User must review before any action runs.",
            "autoExecute": false,
            "requiresApproval": true,
            "color": "#ef4444"
        }
    });
    serde_wasm_bindgen::to_value(&tiers).unwrap_or(JsValue::NULL)
}

pub(crate) fn get_event_categories_static() -> JsValue {
    let cats = serde_json::json!({
        "noise": { "name": "noise", "label": "Noise", "priority": 1, "color": "#6b7280", "policy": "auto" },
        "info": { "name": "info", "label": "Info", "priority": 2, "color": "#3b82f6", "policy": "auto" },
        "critical": { "name": "critical", "label": "Critical", "priority": 3, "color": "#ef4444", "policy": "manual" }
    });
    serde_wasm_bindgen::to_value(&cats).unwrap_or(JsValue::NULL)
}
