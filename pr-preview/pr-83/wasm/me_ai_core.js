/* @ts-self-types="./me_ai_core.d.ts" */

export class ActionMetadata {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ActionMetadata.prototype);
        obj.__wbg_ptr = ptr;
        ActionMetadataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof ActionMetadata)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ActionMetadataFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_actionmetadata_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get actionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_actionmetadata_actionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_actionmetadata_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_actionmetadata_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string[]}
     */
    get requiredScopes() {
        const ret = wasm.__wbg_get_actionmetadata_requiredScopes(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} arg0
     */
    set actionId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionmetadata_actionId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionmetadata_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionmetadata_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string[]} arg0
     */
    set requiredScopes(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionmetadata_requiredScopes(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) ActionMetadata.prototype[Symbol.dispose] = ActionMetadata.prototype.free;

export class ActionRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ActionRow.prototype);
        obj.__wbg_ptr = ptr;
        ActionRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ActionRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_actionrow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_actionrow_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_actionrow_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionrow_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionrow_name(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) ActionRow.prototype[Symbol.dispose] = ActionRow.prototype.free;

/**
 * AI backend selection.
 * @enum {0 | 1 | 2}
 */
export const AiBackend = Object.freeze({
    WebGpu: 0, "0": "WebGpu",
    Ollama: 1, "1": "Ollama",
    Cloud: 2, "2": "Cloud",
});

export class ApiModel {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ApiModel.prototype);
        obj.__wbg_ptr = ptr;
        ApiModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ApiModelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_apimodel_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get contextWindow() {
        const ret = wasm.__wbg_get_apimodel_contextWindow(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_apimodel_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get displayName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_apimodel_displayName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_apimodel_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get maxEmailTokens() {
        const ret = wasm.__wbg_get_apimodel_maxEmailTokens(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_apimodel_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get provider() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_apimodel_provider(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get reasoningEffort() {
        const ret = wasm.__wbg_get_apimodel_reasoningEffort(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {boolean}
     */
    get recommendedForEmailProcessing() {
        const ret = wasm.__wbg_get_apimodel_recommendedForEmailProcessing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} arg0
     */
    set contextWindow(arg0) {
        wasm.__wbg_set_apimodel_contextWindow(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_apimodel_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set displayName(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_apimodel_displayName(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_apimodel_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set maxEmailTokens(arg0) {
        wasm.__wbg_set_apimodel_maxEmailTokens(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_apimodel_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set provider(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_apimodel_provider(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set reasoningEffort(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_apimodel_reasoningEffort(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set recommendedForEmailProcessing(arg0) {
        wasm.__wbg_set_apimodel_recommendedForEmailProcessing(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) ApiModel.prototype[Symbol.dispose] = ApiModel.prototype.free;

export class AuditLogEntryParsed {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AuditLogEntryParsed.prototype);
        obj.__wbg_ptr = ptr;
        AuditLogEntryParsedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof AuditLogEntryParsed)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AuditLogEntryParsedFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_auditlogentryparsed_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get emailId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogentryparsed_emailId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get error() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogentryparsed_error(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get eventType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogentryparsed_eventType(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get executedAt() {
        const ret = wasm.__wbg_get_auditlogentryparsed_executedAt(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get from() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogentryparsed_from(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogentryparsed_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {AuditLogStep[]}
     */
    get steps() {
        const ret = wasm.__wbg_get_auditlogentryparsed_steps(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    get subject() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogentryparsed_subject(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get success() {
        const ret = wasm.__wbg_get_auditlogentryparsed_success(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {string} arg0
     */
    set emailId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_emailId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set error(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_error(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set eventType(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_eventType(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set executedAt(arg0) {
        wasm.__wbg_set_auditlogentryparsed_executedAt(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set from(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {AuditLogStep[]} arg0
     */
    set steps(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_steps(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set subject(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogentryparsed_subject(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set success(arg0) {
        wasm.__wbg_set_auditlogentryparsed_success(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) AuditLogEntryParsed.prototype[Symbol.dispose] = AuditLogEntryParsed.prototype.free;

export class AuditLogRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AuditLogRow.prototype);
        obj.__wbg_ptr = ptr;
        AuditLogRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof AuditLogRow)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AuditLogRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_auditlogrow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get emailId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_emailId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get error() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_error(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get eventType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_eventType(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get executedAt() {
        const ret = wasm.__wbg_get_auditlogrow_executedAt(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get from() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_from(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get steps() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_steps(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get subject() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogrow_subject(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get success() {
        const ret = wasm.__wbg_get_auditlogrow_success(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {string} arg0
     */
    set emailId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_emailId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set error(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_error(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set eventType(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_eventType(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set executedAt(arg0) {
        wasm.__wbg_set_auditlogrow_executedAt(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set from(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set steps(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_steps(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set subject(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogrow_subject(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set success(arg0) {
        wasm.__wbg_set_auditlogrow_success(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) AuditLogRow.prototype[Symbol.dispose] = AuditLogRow.prototype.free;

/**
 * One step in an audit log entry after JSON parse (`steps` blob).
 */
export class AuditLogStep {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AuditLogStep.prototype);
        obj.__wbg_ptr = ptr;
        AuditLogStepFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof AuditLogStep)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AuditLogStepFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_auditlogstep_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get actionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogstep_actionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get actionName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogstep_actionName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get commandId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogstep_commandId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogstep_message(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get pluginId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_auditlogstep_pluginId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get success() {
        const ret = wasm.__wbg_get_auditlogstep_success(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {string} arg0
     */
    set actionId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogstep_actionId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set actionName(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogstep_actionName(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set commandId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogstep_commandId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set message(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogstep_message(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set pluginId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_auditlogstep_pluginId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set success(arg0) {
        wasm.__wbg_set_auditlogstep_success(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) AuditLogStep.prototype[Symbol.dispose] = AuditLogStep.prototype.free;

export class AuditStats {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AuditStats.prototype);
        obj.__wbg_ptr = ptr;
        AuditStatsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AuditStatsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_auditstats_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get completed() {
        const ret = wasm.__wbg_get_auditstats_completed(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get failed() {
        const ret = wasm.__wbg_get_auditstats_failed(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set completed(arg0) {
        wasm.__wbg_set_auditstats_completed(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set failed(arg0) {
        wasm.__wbg_set_auditstats_failed(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) AuditStats.prototype[Symbol.dispose] = AuditStats.prototype.free;

export class ClassificationRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ClassificationRow.prototype);
        obj.__wbg_ptr = ptr;
        ClassificationRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ClassificationRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_classificationrow_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get action() {
        const ret = wasm.__wbg_get_classificationrow_action(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get category() {
        const ret = wasm.__wbg_get_classificationrow_category(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {bigint | undefined}
     */
    get date() {
        const ret = wasm.__wbg_get_classificationrow_date(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string}
     */
    get emailId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_classificationrow_emailId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get from() {
        const ret = wasm.__wbg_get_classificationrow_from(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get reason() {
        const ret = wasm.__wbg_get_classificationrow_reason(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {bigint | undefined}
     */
    get scannedAt() {
        const ret = wasm.__wbg_get_classificationrow_scannedAt(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string | undefined}
     */
    get status() {
        const ret = wasm.__wbg_get_classificationrow_status(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get subject() {
        const ret = wasm.__wbg_get_classificationrow_subject(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get summary() {
        const ret = wasm.__wbg_get_classificationrow_summary(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get tags() {
        const ret = wasm.__wbg_get_classificationrow_tags(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set action(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_action(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set category(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_category(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set date(arg0) {
        wasm.__wbg_set_classificationrow_date(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string} arg0
     */
    set emailId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_emailId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set from(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set reason(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_reason(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set scannedAt(arg0) {
        wasm.__wbg_set_classificationrow_scannedAt(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set status(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_status(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set subject(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_subject(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set summary(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_summary(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set tags(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_classificationrow_tags(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) ClassificationRow.prototype[Symbol.dispose] = ClassificationRow.prototype.free;

export class ContactRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContactRow.prototype);
        obj.__wbg_ptr = ptr;
        ContactRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContactRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contactrow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get email() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_contactrow_email(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get firstSeen() {
        const ret = wasm.__wbg_get_contactrow_firstSeen(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    get lastSeen() {
        const ret = wasm.__wbg_get_contactrow_lastSeen(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_contactrow_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set email(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_contactrow_email(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set firstSeen(arg0) {
        wasm.__wbg_set_contactrow_firstSeen(this.__wbg_ptr, arg0);
    }
    /**
     * @param {bigint} arg0
     */
    set lastSeen(arg0) {
        wasm.__wbg_set_contactrow_lastSeen(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_contactrow_name(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) ContactRow.prototype[Symbol.dispose] = ContactRow.prototype.free;

export class EventCategoryRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EventCategoryRow.prototype);
        obj.__wbg_ptr = ptr;
        EventCategoryRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventCategoryRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eventcategoryrow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategoryrow_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategoryrow_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get policy() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategoryrow_policy(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get priority() {
        const ret = wasm.__wbg_get_eventcategoryrow_priority(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategoryrow_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategoryrow_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set policy(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategoryrow_policy(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set priority(arg0) {
        wasm.__wbg_set_eventcategoryrow_priority(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) EventCategoryRow.prototype[Symbol.dispose] = EventCategoryRow.prototype.free;

/**
 * Static tier definition returned by `getEventCategoryTiers`.
 */
export class EventCategoryTier {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EventCategoryTier.prototype);
        obj.__wbg_ptr = ptr;
        EventCategoryTierFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventCategoryTierFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eventcategorytier_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get autoExecute() {
        const ret = wasm.__wbg_get_eventcategorytier_autoExecute(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get color() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategorytier_color(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategorytier_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategorytier_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventcategorytier_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get requiresApproval() {
        const ret = wasm.__wbg_get_eventcategorytier_requiresApproval(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set autoExecute(arg0) {
        wasm.__wbg_set_eventcategorytier_autoExecute(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set color(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategorytier_color(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategorytier_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategorytier_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventcategorytier_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set requiresApproval(arg0) {
        wasm.__wbg_set_eventcategorytier_requiresApproval(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) EventCategoryTier.prototype[Symbol.dispose] = EventCategoryTier.prototype.free;

export class EventRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EventRow.prototype);
        obj.__wbg_ptr = ptr;
        EventRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eventrow_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get actions_taken() {
        const ret = wasm.__wbg_get_eventrow_actions_taken(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get content() {
        const ret = wasm.__wbg_get_eventrow_content(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get event_category() {
        const ret = wasm.__wbg_get_eventrow_event_category(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get event_type() {
        const ret = wasm.__wbg_get_eventrow_event_type(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get id() {
        const ret = wasm.__wbg_get_eventrow_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get output() {
        const ret = wasm.__wbg_get_eventrow_output(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get rule_id() {
        const ret = wasm.__wbg_get_eventrow_rule_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get sender() {
        const ret = wasm.__wbg_get_eventrow_sender(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get source_name() {
        const ret = wasm.__wbg_get_eventrow_source_name(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get status() {
        const ret = wasm.__wbg_get_eventrow_status(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get subject() {
        const ret = wasm.__wbg_get_eventrow_subject(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {bigint | undefined}
     */
    get timestamp() {
        const ret = wasm.__wbg_get_eventrow_timestamp(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {string | null} [arg0]
     */
    set actions_taken(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_actions_taken(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set content(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_content(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set event_category(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_event_category(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set event_type(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_event_type(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set id(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set output(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_output(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set rule_id(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_rule_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set sender(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_sender(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set source_name(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_source_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set status(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_status(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set subject(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventrow_subject(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set timestamp(arg0) {
        wasm.__wbg_set_eventrow_timestamp(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
}
if (Symbol.dispose) EventRow.prototype[Symbol.dispose] = EventRow.prototype.free;

export class EventTypeRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EventTypeRow.prototype);
        obj.__wbg_ptr = ptr;
        EventTypeRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventTypeRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eventtyperow_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get auto_created() {
        const ret = wasm.__wbg_get_eventtyperow_auto_created(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    get category_name() {
        const ret = wasm.__wbg_get_eventtyperow_category_name(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventtyperow_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_eventtyperow_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {boolean} arg0
     */
    set auto_created(arg0) {
        wasm.__wbg_set_eventtyperow_auto_created(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set category_name(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventtyperow_category_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventtyperow_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventtyperow_name(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) EventTypeRow.prototype[Symbol.dispose] = EventTypeRow.prototype.free;

export class GetAuditLogParsedResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GetAuditLogParsedResult.prototype);
        obj.__wbg_ptr = ptr;
        GetAuditLogParsedResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GetAuditLogParsedResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_getauditlogparsedresult_free(ptr, 0);
    }
    /**
     * @returns {AuditLogEntryParsed[]}
     */
    get entries() {
        const ret = wasm.__wbg_get_getauditlogparsedresult_entries(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {bigint}
     */
    get total() {
        const ret = wasm.__wbg_get_getauditlogparsedresult_total(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {AuditLogEntryParsed[]} arg0
     */
    set entries(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_getauditlogparsedresult_entries(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set total(arg0) {
        wasm.__wbg_set_getauditlogparsedresult_total(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) GetAuditLogParsedResult.prototype[Symbol.dispose] = GetAuditLogParsedResult.prototype.free;

export class GetAuditLogResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GetAuditLogResult.prototype);
        obj.__wbg_ptr = ptr;
        GetAuditLogResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GetAuditLogResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_getauditlogresult_free(ptr, 0);
    }
    /**
     * @returns {AuditLogRow[]}
     */
    get entries() {
        const ret = wasm.__wbg_get_getauditlogresult_entries(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {bigint}
     */
    get total() {
        const ret = wasm.__wbg_get_getauditlogresult_total(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {AuditLogRow[]} arg0
     */
    set entries(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_getauditlogresult_entries(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set total(arg0) {
        wasm.__wbg_set_getauditlogresult_total(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) GetAuditLogResult.prototype[Symbol.dispose] = GetAuditLogResult.prototype.free;

/**
 * Paginated stored emails from `get_stored_emails_filtered`.
 */
export class GetStoredEmailsResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GetStoredEmailsResult.prototype);
        obj.__wbg_ptr = ptr;
        GetStoredEmailsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GetStoredEmailsResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_getstoredemailsresult_free(ptr, 0);
    }
    /**
     * @returns {StoredItem[]}
     */
    get items() {
        const ret = wasm.__wbg_get_getstoredemailsresult_items(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {bigint}
     */
    get total() {
        const ret = wasm.__wbg_get_getstoredemailsresult_total(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {StoredItem[]} arg0
     */
    set items(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_getstoredemailsresult_items(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set total(arg0) {
        wasm.__wbg_set_getstoredemailsresult_total(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) GetStoredEmailsResult.prototype[Symbol.dispose] = GetStoredEmailsResult.prototype.free;

/**
 * Gmail profile (from Google People API).
 */
export class GmailProfile {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GmailProfile.prototype);
        obj.__wbg_ptr = ptr;
        GmailProfileFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GmailProfileFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gmailprofile_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get emailAddress() {
        const ret = wasm.gmailprofile_emailAddress(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    constructor() {
        const ret = wasm.gmailprofile_new();
        this.__wbg_ptr = ret >>> 0;
        GmailProfileFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} v
     */
    set emailAddress(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.gmailprofile_set_emailAddress(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) GmailProfile.prototype[Symbol.dispose] = GmailProfile.prototype.free;

/**
 * Google OAuth 2.0 access token.
 */
export class GoogleToken {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GoogleToken.prototype);
        obj.__wbg_ptr = ptr;
        GoogleTokenFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GoogleTokenFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_googletoken_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get accessToken() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.googletoken_accessToken(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get expiresAt() {
        const ret = wasm.googletoken_expiresAt(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} access_token
     * @param {number} expires_at
     */
    constructor(access_token, expires_at) {
        const ptr0 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.googletoken_new(ptr0, len0, expires_at);
        this.__wbg_ptr = ret >>> 0;
        GoogleTokenFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} v
     */
    set accessToken(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.googletoken_set_accessToken(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} v
     */
    set expiresAt(v) {
        wasm.googletoken_set_expiresAt(this.__wbg_ptr, v);
    }
}
if (Symbol.dispose) GoogleToken.prototype[Symbol.dispose] = GoogleToken.prototype.free;

export class IntoUnderlyingByteSource {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @returns {ReadableStreamType}
     */
    get type() {
        const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
        return __wbindgen_enum_ReadableStreamType[ret];
    }
}
if (Symbol.dispose) IntoUnderlyingByteSource.prototype[Symbol.dispose] = IntoUnderlyingByteSource.prototype.free;

export class IntoUnderlyingSink {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
}
if (Symbol.dispose) IntoUnderlyingSink.prototype[Symbol.dispose] = IntoUnderlyingSink.prototype.free;

export class IntoUnderlyingSource {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
}
if (Symbol.dispose) IntoUnderlyingSource.prototype[Symbol.dispose] = IntoUnderlyingSource.prototype.free;

export class ItemRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ItemRow.prototype);
        obj.__wbg_ptr = ptr;
        ItemRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ItemRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_itemrow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get body() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_body(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get cc() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_cc(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get date() {
        const ret = wasm.__wbg_get_itemrow_date(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string}
     */
    get from() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_from(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get htmlBody() {
        const ret = wasm.__wbg_get_itemrow_htmlBody(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get inReplyTo() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_inReplyTo(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get labels() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_labels(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get messageId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_messageId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get raw() {
        const ret = wasm.__wbg_get_itemrow_raw(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string}
     */
    get references() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_references(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get snippet() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_snippet(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get sourceId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_sourceId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get sourceType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_sourceType(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get subject() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_subject(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get syncedAt() {
        const ret = wasm.__wbg_get_itemrow_syncedAt(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string}
     */
    get threadKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_threadKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get to() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_to(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_itemrow_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Parse `labels` / `raw` JSON strings into UI-facing fields (replaces TS `normaliseRow`).
     * @returns {StoredItem}
     */
    toStoredItem() {
        const ret = wasm.itemrow_toStoredItem(this.__wbg_ptr);
        return StoredItem.__wrap(ret);
    }
    /**
     * @param {string} arg0
     */
    set body(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_body(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set cc(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_cc(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set date(arg0) {
        wasm.__wbg_set_itemrow_date(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string} arg0
     */
    set from(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set htmlBody(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_htmlBody(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set inReplyTo(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_inReplyTo(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set labels(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_labels(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set messageId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_messageId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set raw(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_raw(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set references(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_references(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set snippet(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_snippet(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set sourceId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_sourceId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set sourceType(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_sourceType(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set subject(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_subject(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set syncedAt(arg0) {
        wasm.__wbg_set_itemrow_syncedAt(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string} arg0
     */
    set threadKey(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_threadKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set to(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_to(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set type(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_itemrow_type(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) ItemRow.prototype[Symbol.dispose] = ItemRow.prototype.free;

export class LabelRef {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LabelRef.prototype);
        obj.__wbg_ptr = ptr;
        LabelRefFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof LabelRef)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LabelRefFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_labelref_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_labelref_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_labelref_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_labelref_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_labelref_name(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) LabelRef.prototype[Symbol.dispose] = LabelRef.prototype.free;

/**
 * Core instance. Rexie is built once at init (meta-secret WasmRepo pattern).
 */
export class MeAiCore {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MeAiCore.prototype);
        obj.__wbg_ptr = ptr;
        MeAiCoreFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MeAiCoreFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_meaicore_free(ptr, 0);
    }
    /**
     * CSS color for an action name.
     * @param {string} action
     * @returns {string}
     */
    actionColor(action) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(action, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_actionColor(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Build rich email context string for LLM when user asks about emails.
     * @param {string} user_query
     * @returns {Promise<string>}
     */
    buildEmailContext(user_query) {
        const ptr0 = passStringToWasm0(user_query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_buildEmailContext(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Build compact LLM context string. Returns empty string if no data.
     * @returns {Promise<string>}
     */
    buildLlmContext() {
        const ret = wasm.meaicore_buildLlmContext(this.__wbg_ptr);
        return ret;
    }
    /**
     * Build the LLM classification system prompt.
     * `plugin_names`: comma-separated list of active plugin names (e.g. "Gmail, Twitter/X")
     * @param {string} plugin_names
     * @returns {string}
     */
    buildSystemPrompt(plugin_names) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(plugin_names, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_buildSystemPrompt(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Convert category tier ("NOISE") to lowercase name ("noise").
     * @param {string} tier
     * @returns {string}
     */
    categoryTierToName(tier) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(tier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_categoryTierToName(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {Promise<void>}
     */
    clearAllData() {
        const ret = wasm.meaicore_clearAllData(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearAuditLog() {
        const ret = wasm.meaicore_clearAuditLog(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearChatSessions() {
        const ret = wasm.meaicore_clearChatSessions(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearContacts() {
        const ret = wasm.meaicore_clearContacts(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearEmailClassifications() {
        const ret = wasm.meaicore_clearEmailClassifications(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} type_name
     * @returns {Promise<void>}
     */
    clearEventTypeCategory(type_name) {
        const ptr0 = passStringToWasm0(type_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_clearEventTypeCategory(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearEvents() {
        const ret = wasm.meaicore_clearEvents(this.__wbg_ptr);
        return ret;
    }
    /**
     * Clear all local Gmail data (items, sync state, contacts).
     * @returns {Promise<void>}
     */
    clearGmailData() {
        const ret = wasm.meaicore_clearGmailData(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearGoogleToken() {
        const ret = wasm.meaicore_clearGoogleToken(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearItemsSyncContacts() {
        const ret = wasm.meaicore_clearItemsSyncContacts(this.__wbg_ptr);
        return ret;
    }
    /**
     * Clear all local Twitter data (items + sync state).
     * @returns {Promise<void>}
     */
    clearTwitterData() {
        const ret = wasm.meaicore_clearTwitterData(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    clearTwitterToken() {
        const ret = wasm.meaicore_clearTwitterToken(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} now
     * @returns {ChatSessionRecord}
     */
    createChatSession(now) {
        const ret = wasm.meaicore_createChatSession(this.__wbg_ptr, now);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {CreateRulePayload} payload
     * @returns {Promise<string>}
     */
    createRule(payload) {
        const ret = wasm.meaicore_createRule(this.__wbg_ptr, payload);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    createSchemaAndMigrations() {
        const ret = wasm.meaicore_createSchemaAndMigrations(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    defaultOllamaBaseUrl() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.meaicore_defaultOllamaBaseUrl(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} email_id
     * @returns {Promise<void>}
     */
    deleteEmailClassification(email_id) {
        const ptr0 = passStringToWasm0(email_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteEmailClassification(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} action
     * @returns {Promise<void>}
     */
    deleteEmailClassificationsByAction(action) {
        const ptr0 = passStringToWasm0(action, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteEmailClassificationsByAction(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} type_name
     * @returns {Promise<void>}
     */
    deleteEventType(type_name) {
        const ptr0 = passStringToWasm0(type_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteEventType(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string[]} ids
     * @returns {Promise<void>}
     */
    deleteItemsByIds(ids) {
        const ptr0 = passArrayJsValueToWasm0(ids, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteItemsByIds(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} source_type
     * @returns {Promise<void>}
     */
    deleteItemsBySource(source_type) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteItemsBySource(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    deleteRule(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteRule(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} source_type
     * @returns {Promise<void>}
     */
    deleteSyncState(source_type) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_deleteSyncState(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Parse an email `date` from JS to epoch ms (`0` if missing or unparseable). Used before `emailToMarkdown` / exports.
     * @param {any} date
     * @returns {number}
     */
    emailDateToEpochMs(date) {
        const ret = wasm.meaicore_emailDateToEpochMs(this.__wbg_ptr, date);
        return ret;
    }
    /**
     * `MessageForMarkdown`-shaped object → markdown (same rules as the former `markdown-export.ts` helper).
     * @param {any} message
     * @returns {string}
     */
    emailMessageToMarkdown(message) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.meaicore_emailMessageToMarkdown(this.__wbg_ptr, message);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Convert an email to Markdown with a metadata header table (`date_ms`: epoch ms, 0 = unknown).
     * @param {string} subject
     * @param {string} from
     * @param {string} to
     * @param {number} date_ms
     * @param {string | null} [body]
     * @param {string | null} [html_body]
     * @returns {string}
     */
    emailToMarkdown(subject, from, to, date_ms, body, html_body) {
        let deferred6_0;
        let deferred6_1;
        try {
            const ptr0 = passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(from, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            var ptr3 = isLikeNone(body) ? 0 : passStringToWasm0(body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len3 = WASM_VECTOR_LEN;
            var ptr4 = isLikeNone(html_body) ? 0 : passStringToWasm0(html_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len4 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_emailToMarkdown(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, date_ms, ptr3, len3, ptr4, len4);
            deferred6_0 = ret[0];
            deferred6_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred6_0, deferred6_1, 1);
        }
    }
    /**
     * @param {ActionInput[]} actions
     * @param {EventInput} event
     * @param {string} access_token
     * @param {Function | null} [on_progress]
     * @param {any | null} [config]
     * @returns {Promise<PipelineResult>}
     */
    executePipeline(actions, event, access_token, on_progress, config) {
        const ptr0 = passArrayJsValueToWasm0(actions, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_executePipeline(this.__wbg_ptr, ptr0, len0, event, ptr1, len1, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress), isLikeNone(config) ? 0 : addToExternrefTable0(config));
        return ret;
    }
    /**
     * @param {ActionInput[]} actions
     * @param {EventInput[]} events
     * @param {string} access_token
     * @param {Function | null} [on_progress]
     * @param {any | null} [config]
     * @returns {Promise<PipelineBatchResult>}
     */
    executePipelineBatch(actions, events, access_token, on_progress, config) {
        const ptr0 = passArrayJsValueToWasm0(actions, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(events, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_executePipelineBatch(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress), isLikeNone(config) ? 0 : addToExternrefTable0(config));
        return ret;
    }
    /**
     * Safe export filename from subject + JS date value (same parsing as [`Self::email_date_to_epoch_ms_js`]).
     * @param {string} subject
     * @param {any} date
     * @param {string} ext
     * @returns {string}
     */
    exportEmailFilename(subject, date, ext) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(ext, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_exportEmailFilename(this.__wbg_ptr, ptr0, len0, date, ptr1, len1);
            deferred3_0 = ret[0];
            deferred3_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Safe `.md` (or other) filename from `subject` + `date` on a message-like object.
     * @param {any} message
     * @param {string} ext
     * @returns {string}
     */
    exportEmailMessageFilename(message, ext) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(ext, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_exportEmailMessageFilename(this.__wbg_ptr, message, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} subject
     * @param {number} date_ms
     * @param {string} ext
     * @returns {string}
     */
    exportFilename(subject, date_ms, ext) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(ext, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_exportFilename(this.__wbg_ptr, ptr0, len0, date_ms, ptr1, len1);
            deferred3_0 = ret[0];
            deferred3_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @param {string} from_str
     * @returns {string}
     */
    extractName(from_str) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(from_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_extractName(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} event_type
     * @param {string} event_category
     * @returns {Promise<RuleView[]>}
     */
    findMatchingRules(event_type, event_category) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(event_category, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_findMatchingRules(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {bigint} bytes
     * @returns {string}
     */
    formatBytes(bytes) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.meaicore_formatBytes(this.__wbg_ptr, bytes);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {bigint} bytes
     * @returns {string}
     */
    formatBytesPrecise(bytes) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.meaicore_formatBytesPrecise(this.__wbg_ptr, bytes);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} ms
     * @returns {string}
     */
    formatDisplayDateEnUs(ms) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.meaicore_formatDisplayDateEnUs(this.__wbg_ptr, ms);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Format an email `date` field from JS (`string | number | bigint | null | undefined`) for UI lists/detail.
     * @param {any} date
     * @returns {string}
     */
    formatEmailDisplayDate(date) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.meaicore_formatEmailDisplayDate(this.__wbg_ptr, date);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Format an email as an LLM prompt.
     * @param {string} subject
     * @param {string} from
     * @param {string} to
     * @param {number} date_ms
     * @param {string} labels
     * @param {string} body
     * @returns {string}
     */
    formatEmailPrompt(subject, from, to, date_ms, labels, body) {
        let deferred6_0;
        let deferred6_1;
        try {
            const ptr0 = passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(from, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            const ptr3 = passStringToWasm0(labels, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len3 = WASM_VECTOR_LEN;
            const ptr4 = passStringToWasm0(body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len4 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_formatEmailPrompt(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, date_ms, ptr3, len3, ptr4, len4);
            deferred6_0 = ret[0];
            deferred6_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred6_0, deferred6_1, 1);
        }
    }
    /**
     * @returns {Promise<ActionRow[]>}
     */
    getActions() {
        const ret = wasm.meaicore_getActions(this.__wbg_ptr);
        return ret;
    }
    /**
     * Pipeline actions formatted for the UI (`Action` list).
     * @param {string} event_type
     * @returns {Promise<PipelineActionDisplay[]>}
     */
    getActionsForEventDisplay(event_type) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getActionsForEventDisplay(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * All known event type names (from eventTypes store + classifications).
     * @returns {Promise<string[]>}
     */
    getAllEventTypes() {
        const ret = wasm.meaicore_getAllEventTypes(this.__wbg_ptr);
        return ret;
    }
    /**
     * Read the stored API key for a cloud provider (`openai` | `anthropic` | `google` | `xai`), if any.
     * @param {string} provider
     * @returns {Promise<string | undefined>}
     */
    getApiKeyForProvider(provider) {
        const ptr0 = passStringToWasm0(provider, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getApiKeyForProvider(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get a single model by ID
     * @param {string} model_id
     * @returns {ApiModel | undefined}
     */
    getApiModelInfo(model_id) {
        const ptr0 = passStringToWasm0(model_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getApiModelInfo(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : ApiModel.__wrap(ret[0]);
    }
    /**
     * Get all cloud API model definitions
     * @returns {ApiModel[]}
     */
    getApiModels() {
        const ret = wasm.meaicore_getApiModels(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} limit
     * @param {number} offset
     * @param {boolean} failures_only
     * @returns {Promise<GetAuditLogResult>}
     */
    getAuditLog(limit, offset, failures_only) {
        const ret = wasm.meaicore_getAuditLog(this.__wbg_ptr, limit, offset, failures_only);
        return ret;
    }
    /**
     * Audit log with `steps` pre-parsed from JSON string to array.
     * @param {number} limit
     * @param {number} offset
     * @param {boolean} failures_only
     * @returns {Promise<GetAuditLogParsedResult>}
     */
    getAuditLogParsed(limit, offset, failures_only) {
        const ret = wasm.meaicore_getAuditLogParsed(this.__wbg_ptr, limit, offset, failures_only);
        return ret;
    }
    /**
     * @returns {Promise<AuditStats>}
     */
    getAuditStats() {
        const ret = wasm.meaicore_getAuditStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} source
     * @returns {ActionMetadata[]}
     */
    getAvailableActions(source) {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getAvailableActions(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * Look up the category tier for an event type.
     * @param {string} event_type
     * @returns {Promise<string>}
     */
    getCategoryForEventType(event_type) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getCategoryForEventType(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} category_name
     * @returns {Promise<PipelineActionRow[]>}
     */
    getCategoryPipelineActions(category_name) {
        const ptr0 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getCategoryPipelineActions(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<CategoryPipelineView[]>}
     */
    getCategoryPipelines() {
        const ret = wasm.meaicore_getCategoryPipelines(this.__wbg_ptr);
        return ret;
    }
    /**
     * Count classifications by action.
     * @returns {Promise<ClassificationCounts>}
     */
    getClassificationCounts() {
        const ret = wasm.meaicore_getClassificationCounts(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get classifications grouped by action, optionally filtered to pending/escalated only.
     * @param {boolean} pending_only
     * @returns {Promise<ClassificationsByCategory>}
     */
    getClassificationsByCategory(pending_only) {
        const ret = wasm.meaicore_getClassificationsByCategory(this.__wbg_ptr, pending_only);
        return ret;
    }
    /**
     * @param {string} email
     * @returns {Promise<ContactRow | undefined>}
     */
    getContactByEmail(email) {
        const ptr0 = passStringToWasm0(email, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getContactByEmail(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<bigint>}
     */
    getContactsCount() {
        const ret = wasm.meaicore_getContactsCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Compact data summary for the LLM system prompt. Returns empty string if no data.
     * @returns {Promise<string>}
     */
    getDataSummary() {
        const ret = wasm.meaicore_getDataSummary(this.__wbg_ptr);
        return ret;
    }
    /**
     * Detailed markdown summary for LLM email context.
     * @returns {Promise<string>}
     */
    getDetailedSummary() {
        const ret = wasm.meaicore_getDetailedSummary(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [action_filter]
     * @param {number | null} [limit]
     * @returns {Promise<ClassificationRow[]>}
     */
    getEmailClassifications(action_filter, limit) {
        var ptr0 = isLikeNone(action_filter) ? 0 : passStringToWasm0(action_filter, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getEmailClassifications(this.__wbg_ptr, ptr0, len0, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0);
        return ret;
    }
    /**
     * @returns {Promise<bigint>}
     */
    getEmailClassificationsCount() {
        const ret = wasm.meaicore_getEmailClassificationsCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<EventCategoryRow[]>}
     */
    getEventCategories() {
        const ret = wasm.meaicore_getEventCategories(this.__wbg_ptr);
        return ret;
    }
    /**
     * Static category rows keyed by lowercase name (`noise`, `info`, `critical`).
     * @returns {any}
     */
    getEventCategoriesStatic() {
        const ret = wasm.meaicore_getEventCategoriesStatic(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} category_name
     * @returns {Promise<string | undefined>}
     */
    getEventCategoryPolicy(category_name) {
        const ptr0 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getEventCategoryPolicy(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Static tier copy for dashboard (NOISE / INFO / CRITICAL).
     * @returns {any}
     */
    getEventCategoryTierDefinitions() {
        const ret = wasm.meaicore_getEventCategoryTierDefinitions(this.__wbg_ptr);
        return ret;
    }
    /**
     * Static 3-tier definitions: NOISE / INFO / CRITICAL.
     * @returns {EventCategoryTier[]}
     */
    getEventCategoryTiers() {
        const ret = wasm.meaicore_getEventCategoryTiers(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Promise<EventStatsResult>}
     */
    getEventStats() {
        const ret = wasm.meaicore_getEventStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} type_name
     * @returns {Promise<string | undefined>}
     */
    getEventTypeCategory(type_name) {
        const ptr0 = passStringToWasm0(type_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getEventTypeCategory(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<EventTypeRow[]>}
     */
    getEventTypes() {
        const ret = wasm.meaicore_getEventTypes(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise<EventRow[]>}
     */
    getEvents(limit, offset) {
        const ret = wasm.meaicore_getEvents(this.__wbg_ptr, limit, offset);
        return ret;
    }
    /**
     * @param {string} message_json
     * @param {string} header_name
     * @returns {string}
     */
    getGmailHeader(message_json, header_name) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(message_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(header_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_getGmailHeader(this.__wbg_ptr, ptr0, len0, ptr1, len1);
            deferred3_0 = ret[0];
            deferred3_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @param {string} token
     * @param {string} message_id
     * @param {string} format
     * @returns {Promise<any>}
     */
    getGmailMessage(token, message_id, format) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getGmailMessage(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string[]} message_ids
     * @param {number} batch_size
     * @returns {Promise<any>}
     */
    getGmailMessagesBatch(token, message_ids, batch_size) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(message_ids, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getGmailMessagesBatch(this.__wbg_ptr, ptr0, len0, ptr1, len1, batch_size);
        return ret;
    }
    /**
     * @param {string} token
     * @returns {Promise<any>}
     */
    getGmailProfile(token) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getGmailProfile(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get Gmail sync status.
     * @returns {Promise<SyncStatus>}
     */
    getGmailSyncStatus() {
        const ret = wasm.meaicore_getGmailSyncStatus(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<GoogleToken | undefined>}
     */
    getGoogleToken() {
        const ret = wasm.meaicore_getGoogleToken(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<number>}
     */
    getGoogleTokenTTL() {
        const ret = wasm.meaicore_getGoogleTokenTTL(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} id
     * @returns {Promise<ItemRow | undefined>}
     */
    getItemById(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getItemById(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} source_type
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise<ItemRow[]>}
     */
    getItemsBySource(source_type, limit, offset) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getItemsBySource(this.__wbg_ptr, ptr0, len0, limit, offset);
        return ret;
    }
    /**
     * @returns {Promise<bigint>}
     */
    getItemsCount() {
        const ret = wasm.meaicore_getItemsCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} source_type
     * @returns {Promise<bigint>}
     */
    getItemsCountBySource(source_type) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getItemsCountBySource(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<bigint>}
     */
    getItemsCountGmail() {
        const ret = wasm.meaicore_getItemsCountGmail(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<bigint | undefined>}
     */
    getItemsDateMax() {
        const ret = wasm.meaicore_getItemsDateMax(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<bigint | undefined>}
     */
    getItemsDateMin() {
        const ret = wasm.meaicore_getItemsDateMin(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} limit
     * @returns {Promise<ItemRow[]>}
     */
    getItemsGmailByDateDesc(limit) {
        const ret = wasm.meaicore_getItemsGmailByDateDesc(this.__wbg_ptr, limit);
        return ret;
    }
    /**
     * @param {string} source_type
     * @returns {Promise<string | undefined>}
     */
    getNewestSourceId(source_type) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getNewestSourceId(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {OllamaModelGroup[]}
     */
    getOllamaModelGroups() {
        const ret = wasm.meaicore_getOllamaModelGroups(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} model_name
     * @returns {OllamaModel | undefined}
     */
    getOllamaModelInfo(model_name) {
        const ptr0 = passStringToWasm0(model_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getOllamaModelInfo(this.__wbg_ptr, ptr0, len0);
        return ret === 0 ? undefined : OllamaModel.__wrap(ret);
    }
    /**
     * @returns {OllamaModel[]}
     */
    getOllamaModels() {
        const ret = wasm.meaicore_getOllamaModels(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {OnnxModelGroup[]}
     */
    getOnnxModelGroups() {
        const ret = wasm.meaicore_getOnnxModelGroups(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} model_id
     * @returns {OnnxModel | undefined}
     */
    getOnnxModelInfo(model_id) {
        const ptr0 = passStringToWasm0(model_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getOnnxModelInfo(this.__wbg_ptr, ptr0, len0);
        return ret === 0 ? undefined : OnnxModel.__wrap(ret);
    }
    /**
     * @returns {OnnxModel[]}
     */
    getOnnxModels() {
        const ret = wasm.meaicore_getOnnxModels(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} limit
     * @returns {Promise<PendingApprovalView[]>}
     */
    getPendingApprovals(limit) {
        const ret = wasm.meaicore_getPendingApprovals(this.__wbg_ptr, limit);
        return ret;
    }
    /**
     * @param {string} category_name
     * @returns {Promise<number>}
     */
    getPendingCountByCategory(category_name) {
        const ptr0 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getPendingCountByCategory(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} category_name
     * @param {number} limit
     * @returns {Promise<PendingItemByCategoryResult[]>}
     */
    getPendingItemsByCategory(category_name, limit) {
        const ptr0 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getPendingItemsByCategory(this.__wbg_ptr, ptr0, len0, limit);
        return ret;
    }
    /**
     * @param {string} event_type
     * @returns {Promise<PipelineForEventResult | undefined>}
     */
    getPipelineForEventResolved(event_type) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getPipelineForEventResolved(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {PluginDefinition[]}
     */
    getPluginRegistry() {
        const ret = wasm.meaicore_getPluginRegistry(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Promise<PluginSummary[]>}
     */
    getPlugins() {
        const ret = wasm.meaicore_getPlugins(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {PluginForPrompt[]}
     */
    getPluginsForPrompt() {
        const ret = wasm.meaicore_getPluginsForPrompt(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Recent emails formatted for LLM context.
     * @param {number} limit
     * @returns {Promise<string>}
     */
    getRecentEmailsContext(limit) {
        const ret = wasm.meaicore_getRecentEmailsContext(this.__wbg_ptr, limit);
        return ret;
    }
    /**
     * @returns {OllamaModel[]}
     */
    getRecommendedOllamaModels() {
        const ret = wasm.meaicore_getRecommendedOllamaModels(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} action_id
     * @param {string} source
     * @returns {string[]}
     */
    getRequiredScopes(action_id, source) {
        const ptr0 = passStringToWasm0(action_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getRequiredScopes(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v3;
    }
    /**
     * @returns {Promise<string>}
     */
    getResolvedOllamaUrl() {
        const ret = wasm.meaicore_getResolvedOllamaUrl(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} id
     * @returns {Promise<RuleView | undefined>}
     */
    getRule(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getRule(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<RuleView[]>}
     */
    getRules() {
        const ret = wasm.meaicore_getRules(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<SourceRow[]>}
     */
    getSources() {
        const ret = wasm.meaicore_getSources(this.__wbg_ptr);
        return ret;
    }
    /**
     * Fetch stored Gmail emails with optional text search filtering and
     * normalized fields (labels as array, raw as object).
     * @param {string | null | undefined} query
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise<GetStoredEmailsResult>}
     */
    getStoredEmailsFiltered(query, limit, offset) {
        var ptr0 = isLikeNone(query) ? 0 : passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getStoredEmailsFiltered(this.__wbg_ptr, ptr0, len0, limit, offset);
        return ret;
    }
    /**
     * @param {string} source_type
     * @returns {Promise<SyncStateRow | undefined>}
     */
    getSyncState(source_type) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getSyncState(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} table
     * @returns {Promise<bigint>}
     */
    getTableCount(table) {
        const ptr0 = passStringToWasm0(table, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getTableCount(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} token
     * @returns {Promise<any>}
     */
    getTwitterMe(token) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getTwitterMe(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {number} max_results
     * @param {string | null} [pagination_token]
     * @returns {Promise<any>}
     */
    getTwitterMentions(token, user_id, max_results, pagination_token) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(pagination_token) ? 0 : passStringToWasm0(pagination_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getTwitterMentions(this.__wbg_ptr, ptr0, len0, ptr1, len1, max_results, ptr2, len2);
        return ret;
    }
    /**
     * Get Twitter sync status.
     * @returns {Promise<SyncStatus>}
     */
    getTwitterSyncStatus() {
        const ret = wasm.meaicore_getTwitterSyncStatus(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {number} max_results
     * @param {string | null} [pagination_token]
     * @returns {Promise<any>}
     */
    getTwitterTimeline(token, user_id, max_results, pagination_token) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(pagination_token) ? 0 : passStringToWasm0(pagination_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getTwitterTimeline(this.__wbg_ptr, ptr0, len0, ptr1, len1, max_results, ptr2, len2);
        return ret;
    }
    /**
     * @returns {Promise<TwitterToken | undefined>}
     */
    getTwitterToken() {
        const ret = wasm.meaicore_getTwitterToken(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<TwitterToken | undefined>}
     */
    getTwitterTokenRaw() {
        const ret = wasm.meaicore_getTwitterTokenRaw(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    getTwitterTweet(token, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getTwitterTweet(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} type_name
     * @returns {Promise<PipelineActionRow[]>}
     */
    getTypePipelineActions(type_name) {
        const ptr0 = passStringToWasm0(type_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_getTypePipelineActions(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Convert an HTML string to Markdown. Returns `None` if the result is empty.
     * @param {string} html
     * @returns {string | undefined}
     */
    htmlToMarkdownBody(html) {
        const ptr0 = passStringToWasm0(html, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_htmlToMarkdownBody(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * Import chat sessions from a JSON snapshot string into IndexedDB.
     * @param {string} json
     * @returns {Promise<void>}
     */
    importChatSessionsFromJson(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_importChatSessionsFromJson(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} from_str
     * @returns {string}
     */
    initial(from_str) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(from_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_initial(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {ContactInput[]} rows
     * @returns {Promise<void>}
     */
    insertContactsBatch(rows) {
        const ptr0 = passArrayJsValueToWasm0(rows, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_insertContactsBatch(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} id
     * @param {string | null | undefined} content
     * @param {string | null | undefined} subject
     * @param {string | null | undefined} sender
     * @param {number} timestamp
     * @param {string | null} [status]
     * @param {string | null} [event_type]
     * @param {string | null} [event_category]
     * @param {string | null} [source_name]
     * @param {string | null} [rule_id]
     * @param {string | null} [actions_taken]
     * @param {string | null} [output]
     * @returns {Promise<void>}
     */
    insertEvent(id, content, subject, sender, timestamp, status, event_type, event_category, source_name, rule_id, actions_taken, output) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(content) ? 0 : passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(subject) ? 0 : passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(sender) ? 0 : passStringToWasm0(sender, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ptr4 = isLikeNone(status) ? 0 : passStringToWasm0(status, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len4 = WASM_VECTOR_LEN;
        var ptr5 = isLikeNone(event_type) ? 0 : passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len5 = WASM_VECTOR_LEN;
        var ptr6 = isLikeNone(event_category) ? 0 : passStringToWasm0(event_category, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len6 = WASM_VECTOR_LEN;
        var ptr7 = isLikeNone(source_name) ? 0 : passStringToWasm0(source_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len7 = WASM_VECTOR_LEN;
        var ptr8 = isLikeNone(rule_id) ? 0 : passStringToWasm0(rule_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len8 = WASM_VECTOR_LEN;
        var ptr9 = isLikeNone(actions_taken) ? 0 : passStringToWasm0(actions_taken, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len9 = WASM_VECTOR_LEN;
        var ptr10 = isLikeNone(output) ? 0 : passStringToWasm0(output, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len10 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_insertEvent(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, timestamp, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10);
        return ret;
    }
    /**
     * @param {ItemInput[]} rows
     * @returns {Promise<void>}
     */
    insertItemsBatch(rows) {
        const ptr0 = passArrayJsValueToWasm0(rows, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_insertItemsBatch(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {SyncStateInput[]} rows
     * @returns {Promise<void>}
     */
    insertSyncStateBatch(rows) {
        const ptr0 = passArrayJsValueToWasm0(rows, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_insertSyncStateBatch(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Promise<boolean>}
     */
    isGoogleTokenValid() {
        const ret = wasm.meaicore_isGoogleTokenValid(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} start_history_id
     * @param {string | null | undefined} page_token
     * @param {number} max_results
     * @returns {Promise<any>}
     */
    listGmailHistory(token, start_history_id, page_token, max_results) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(start_history_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(page_token) ? 0 : passStringToWasm0(page_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_listGmailHistory(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, max_results);
        return ret;
    }
    /**
     * @param {string} token
     * @param {number} max_results
     * @param {string | null} [page_token]
     * @param {string | null} [q]
     * @returns {Promise<any>}
     */
    listGmailMessages(token, max_results, page_token, q) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(page_token) ? 0 : passStringToWasm0(page_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(q) ? 0 : passStringToWasm0(q, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_listGmailMessages(this.__wbg_ptr, ptr0, len0, max_results, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} url
     * @returns {Promise<OllamaModelTag[]>}
     */
    listOllamaModels(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_listOllamaModels(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Load chat sessions from IndexedDB (`settings` key `me_ai_chat_sessions_v1`).
     * @returns {Promise<ChatSessionsLoadResult>}
     */
    loadChatSessions() {
        const ret = wasm.meaicore_loadChatSessions(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<SettingValue>}
     */
    loadSettings() {
        const ret = wasm.meaicore_loadSettings(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} id
     * @param {string} email_id
     * @param {string} subject
     * @param {string} from
     * @param {string} event_type
     * @param {number} executed_at
     * @param {boolean} success
     * @param {string} error
     * @param {string} steps_json
     * @returns {Promise<void>}
     */
    logAuditExecution(id, email_id, subject, from, event_type, executed_at, success, error, steps_json) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(email_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(from, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passStringToWasm0(error, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len5 = WASM_VECTOR_LEN;
        const ptr6 = passStringToWasm0(steps_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len6 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_logAuditExecution(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, executed_at, success, ptr5, len5, ptr6, len6);
        return ret;
    }
    /**
     * Build Rexie once. Call after WASM module is loaded. Returns core instance.
     */
    constructor() {
        const ret = wasm.meaicore_new();
        return ret;
    }
    /**
     * Normalize a raw category string to NOISE / INFO / CRITICAL.
     * @param {string} raw
     * @returns {string}
     */
    normalizeCategory(raw) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(raw, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_normalizeCategory(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} message
     * @param {number} status
     * @returns {ParsedApiError}
     */
    parseApiError(message, status) {
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_parseApiError(this.__wbg_ptr, ptr0, len0, status);
        return ParsedApiError.__wrap(ret);
    }
    /**
     * Parse an LLM classification response. Returns None if invalid.
     * @param {string} response
     * @returns {TriageClassification | undefined}
     */
    parseClassification(response) {
        const ptr0 = passStringToWasm0(response, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_parseClassification(this.__wbg_ptr, ptr0, len0);
        return ret === 0 ? undefined : TriageClassification.__wrap(ret);
    }
    /**
     * @param {string} message_json
     * @returns {string}
     */
    parseGmailBody(message_json) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(message_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_parseGmailBody(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} message_json
     * @returns {string | undefined}
     */
    parseGmailHtmlBody(message_json) {
        const ptr0 = passStringToWasm0(message_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_parseGmailHtmlBody(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {bigint} loaded
     * @param {bigint} total
     * @returns {number}
     */
    progressPct(loaded, total) {
        const ret = wasm.meaicore_progressPct(this.__wbg_ptr, loaded, total);
        return ret;
    }
    /**
     * @param {ClassificationDoc} doc
     * @returns {Promise<void>}
     */
    putEmailClassification(doc) {
        const ret = wasm.meaicore_putEmailClassification(this.__wbg_ptr, doc);
        return ret;
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    removeSetting(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_removeSetting(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} event_type
     * @param {EventInput[]} events
     * @param {boolean} approved
     * @param {Function | null} [on_progress]
     * @returns {Promise<ResolveBatchResult>}
     */
    resolveAndExecuteBatch(event_type, events, approved, on_progress) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(events, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_resolveAndExecuteBatch(this.__wbg_ptr, ptr0, len0, ptr1, len1, approved, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress));
        return ret;
    }
    /**
     * @param {EventInput} event
     * @param {boolean} approved
     * @param {ActionOverrideInput[] | null} [actions_override]
     * @param {Function | null} [on_progress]
     * @returns {Promise<ResolveExecuteResult>}
     */
    resolveAndExecutePipeline(event, approved, actions_override, on_progress) {
        var ptr0 = isLikeNone(actions_override) ? 0 : passArrayJsValueToWasm0(actions_override, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_resolveAndExecutePipeline(this.__wbg_ptr, event, approved, ptr0, len0, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress));
        return ret;
    }
    /**
     * @param {string} source
     * @returns {string}
     */
    resolvePluginId(source) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_resolvePluginId(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string | null | undefined} active_chat_id
     * @param {ChatSessionRecord[]} sessions
     * @returns {Promise<void>}
     */
    saveChatSessions(active_chat_id, sessions) {
        var ptr0 = isLikeNone(active_chat_id) ? 0 : passStringToWasm0(active_chat_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(sessions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_saveChatSessions(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} access_token
     * @param {number} expires_in
     * @returns {Promise<void>}
     */
    saveGoogleToken(access_token, expires_in) {
        const ptr0 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_saveGoogleToken(this.__wbg_ptr, ptr0, len0, expires_in);
        return ret;
    }
    /**
     * @param {RuleSavePayload} payload
     * @returns {Promise<void>}
     */
    saveRule(payload) {
        const ret = wasm.meaicore_saveRule(this.__wbg_ptr, payload);
        return ret;
    }
    /**
     * @param {SettingValue} sv
     * @returns {Promise<void>}
     */
    saveSettings(sv) {
        _assertClass(sv, SettingValue);
        var ptr0 = sv.__destroy_into_raw();
        const ret = wasm.meaicore_saveSettings(this.__wbg_ptr, ptr0);
        return ret;
    }
    /**
     * @param {string} verifier
     * @param {string} state
     * @returns {Promise<void>}
     */
    saveTwitterPkcePending(verifier, state) {
        const ptr0 = passStringToWasm0(verifier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(state, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_saveTwitterPkcePending(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} access_token
     * @param {string | null | undefined} refresh_token
     * @param {number} expires_in
     * @returns {Promise<void>}
     */
    saveTwitterToken(access_token, refresh_token, expires_in) {
        const ptr0 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(refresh_token) ? 0 : passStringToWasm0(refresh_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_saveTwitterToken(this.__wbg_ptr, ptr0, len0, ptr1, len1, expires_in);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} query
     * @param {number} max_results
     * @returns {Promise<any>}
     */
    searchTwitterRecentTweets(token, query, max_results) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_searchTwitterRecentTweets(this.__wbg_ptr, ptr0, len0, ptr1, len1, max_results);
        return ret;
    }
    /**
     * Seed event type from LLM classification (normalize + upsert).
     * @param {string} event_type
     * @param {string} category
     * @returns {Promise<void>}
     */
    seedEventTypeFromLLM(event_type, category) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(category, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_seedEventTypeFromLLM(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} url
     * @returns {Promise<void>}
     */
    setOllamaUrl(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_setOllamaUrl(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} name
     * @param {boolean} enabled
     * @returns {Promise<void>}
     */
    setPluginEnabled(name, enabled) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_setPluginEnabled(this.__wbg_ptr, ptr0, len0, enabled);
        return ret;
    }
    /**
     * @param {string} id
     * @param {boolean} enabled
     * @returns {Promise<void>}
     */
    setRuleEnabled(id, enabled) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_setRuleEnabled(this.__wbg_ptr, ptr0, len0, enabled);
        return ret;
    }
    /**
     * @param {string} name
     * @param {boolean} enabled
     * @returns {Promise<void>}
     */
    setSourceEnabled(name, enabled) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_setSourceEnabled(this.__wbg_ptr, ptr0, len0, enabled);
        return ret;
    }
    /**
     * @param {number} date_ms
     * @returns {string | undefined}
     */
    shortDate(date_ms) {
        const ret = wasm.meaicore_shortDate(this.__wbg_ptr, date_ms);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} subject
     * @returns {string}
     */
    slugify(subject) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(subject, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_slugify(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Stream chat completion from a cloud API provider.
     * `on_token` receives TokenPayload JSON objects during streaming.
     * @param {string} provider
     * @param {string} model_name
     * @param {ChatMessage[]} messages
     * @param {StreamOptions} options
     * @param {Function} on_token
     * @returns {Promise<void>}
     */
    streamChat(provider, model_name, messages, options, on_token) {
        const ptr0 = passStringToWasm0(provider, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(model_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayJsValueToWasm0(messages, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_streamChat(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, options, on_token);
        return ret;
    }
    /**
     * `options` and `messages` are plain JS objects/arrays (`StreamOllamaOptions`, `OllamaChatMessage[]`).
     * @param {string} model_name
     * @param {any} messages
     * @param {any} options
     * @param {Function} on_token
     * @param {string} url
     * @returns {Promise<string>}
     */
    streamOllamaChat(model_name, messages, options, on_token, url) {
        const ptr0 = passStringToWasm0(model_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_streamOllamaChat(this.__wbg_ptr, ptr0, len0, messages, options, on_token, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} s
     * @returns {number}
     */
    stringToHue(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_stringToHue(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
     * @param {string} email_id
     * @param {boolean} delete_item
     * @returns {Promise<void>}
     */
    syncAfterAuditExecution(email_id, delete_item) {
        const ptr0 = passStringToWasm0(email_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_syncAfterAuditExecution(this.__wbg_ptr, ptr0, len0, delete_item);
        return ret;
    }
    /**
     * Full or incremental Gmail sync.
     * @param {string} token
     * @param {number} limit
     * @param {Function | null} [on_progress]
     * @param {AbortSignal | null} [signal]
     * @returns {Promise<SyncResult>}
     */
    syncGmail(token, limit, on_progress, signal) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_syncGmail(this.__wbg_ptr, ptr0, len0, limit, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress), isLikeNone(signal) ? 0 : addToExternrefTable0(signal));
        return ret;
    }
    /**
     * Continue downloading older Gmail messages.
     * @param {string} token
     * @param {number} limit
     * @param {Function | null} [on_progress]
     * @param {AbortSignal | null} [signal]
     * @returns {Promise<SyncResult>}
     */
    syncGmailMore(token, limit, on_progress, signal) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_syncGmailMore(this.__wbg_ptr, ptr0, len0, limit, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress), isLikeNone(signal) ? 0 : addToExternrefTable0(signal));
        return ret;
    }
    /**
     * Full or incremental Twitter sync.
     * @param {string} token
     * @param {number} limit
     * @param {Function | null} [on_progress]
     * @param {AbortSignal | null} [signal]
     * @returns {Promise<SyncResult>}
     */
    syncTwitter(token, limit, on_progress, signal) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_syncTwitter(this.__wbg_ptr, ptr0, len0, limit, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress), isLikeNone(signal) ? 0 : addToExternrefTable0(signal));
        return ret;
    }
    /**
     * Continue fetching older tweets.
     * @param {string} token
     * @param {number} limit
     * @param {Function | null} [on_progress]
     * @param {AbortSignal | null} [signal]
     * @returns {Promise<SyncResult>}
     */
    syncTwitterMore(token, limit, on_progress, signal) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_syncTwitterMore(this.__wbg_ptr, ptr0, len0, limit, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress), isLikeNone(signal) ? 0 : addToExternrefTable0(signal));
        return ret;
    }
    /**
     * CSS color for a tag name.
     * @param {string} tag
     * @returns {string}
     */
    tagColor(tag) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_tagColor(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {Promise<TwitterPkcePending | undefined>}
     */
    takeTwitterPkcePending() {
        const ret = wasm.meaicore_takeTwitterPkcePending(this.__wbg_ptr);
        return ret;
    }
    /**
     * Test API connection for a provider
     * @param {string} provider
     * @param {string} api_key
     * @returns {Promise<boolean>}
     */
    testApiConnection(provider, api_key) {
        const ptr0 = passStringToWasm0(provider, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(api_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_testApiConnection(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} url
     * @returns {Promise<OllamaConnectionResult>}
     */
    testOllamaConnection(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_testOllamaConnection(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} s
     * @param {number} max_len
     * @returns {string}
     */
    truncate(s, max_len) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.meaicore_truncate(this.__wbg_ptr, ptr0, len0, max_len);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} token
     * @param {string} source_user_id
     * @param {string} target_user_id
     * @returns {Promise<any>}
     */
    twitterBlockUser(token, source_user_id, target_user_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(source_user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(target_user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterBlockUser(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    twitterBookmark(token, user_id, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterBookmark(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    twitterLike(token, user_id, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterLike(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} source_user_id
     * @param {string} target_user_id
     * @returns {Promise<any>}
     */
    twitterMuteUser(token, source_user_id, target_user_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(source_user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(target_user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterMuteUser(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * PKCE step: verifier, state, and Twitter authorize URL. Call `saveTwitterPkcePending` before redirect.
     * @param {string} client_id
     * @param {string} redirect_uri
     * @returns {TwitterOAuthLoginStart}
     */
    twitterOAuthBeginLogin(client_id, redirect_uri) {
        const ptr0 = passStringToWasm0(client_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(redirect_uri, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterOAuthBeginLogin(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return TwitterOAuthLoginStart.__wrap(ret[0]);
    }
    /**
     * Exchange the OAuth `code` for tokens and persist them.
     * @param {string} client_id
     * @param {string} redirect_uri
     * @param {string} code
     * @param {string} code_verifier
     * @returns {Promise<TwitterOAuthTokens>}
     */
    twitterOAuthExchangeCode(client_id, redirect_uri, code, code_verifier) {
        const ptr0 = passStringToWasm0(client_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(redirect_uri, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(code_verifier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterOAuthExchangeCode(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return ret;
    }
    /**
     * Revoke token at Twitter (best effort) and clear local Twitter token.
     * @returns {Promise<void>}
     */
    twitterOAuthRevoke() {
        const ret = wasm.meaicore_twitterOAuthRevoke(this.__wbg_ptr);
        return ret;
    }
    /**
     * Valid access token from storage, or refresh using stored refresh token and Twitter client id from settings.
     * Returns a plain object `{ accessToken, refreshToken? }` or `null`.
     * @returns {Promise<any>}
     */
    twitterOAuthSession() {
        const ret = wasm.meaicore_twitterOAuthSession(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    twitterRemoveBookmark(token, user_id, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterRemoveBookmark(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    twitterRetweet(token, user_id, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterRetweet(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    twitterUnlike(token, user_id, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterUnlike(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} token
     * @param {string} user_id
     * @param {string} tweet_id
     * @returns {Promise<any>}
     */
    twitterUnretweet(token, user_id, tweet_id) {
        const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(tweet_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_twitterUnretweet(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * @param {string} category_name
     * @param {PipelineActionInput[]} actions
     * @returns {Promise<void>}
     */
    updateCategoryPipeline(category_name, actions) {
        const ptr0 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(actions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_updateCategoryPipeline(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} category_name
     * @param {string} policy
     * @returns {Promise<void>}
     */
    updateCategoryPolicy(category_name, policy) {
        const ptr0 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(policy, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_updateCategoryPolicy(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} email_id
     * @param {string} status
     * @returns {Promise<void>}
     */
    updateEmailClassificationStatus(email_id, status) {
        const ptr0 = passStringToWasm0(email_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(status, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_updateEmailClassificationStatus(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} id
     * @param {string} status
     * @returns {Promise<void>}
     */
    updateEventStatus(id, status) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(status, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_updateEventStatus(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} type_name
     * @param {string} category_name
     * @returns {Promise<void>}
     */
    updateEventTypeCategory(type_name, category_name) {
        const ptr0 = passStringToWasm0(type_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_updateEventTypeCategory(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} id
     * @param {RuleUpdateInput} updates
     * @returns {Promise<void>}
     */
    updateRule(id, updates) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_updateRule(this.__wbg_ptr, ptr0, len0, updates);
        return ret;
    }
    /**
     * @param {string} email
     * @param {string} name
     * @param {number} first_seen
     * @param {number} last_seen
     * @returns {Promise<void>}
     */
    upsertContact(email, name, first_seen, last_seen) {
        const ptr0 = passStringToWasm0(email, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_upsertContact(this.__wbg_ptr, ptr0, len0, ptr1, len1, first_seen, last_seen);
        return ret;
    }
    /**
     * @param {string} name
     * @param {string} label
     * @param {string} category_name
     * @param {boolean} auto_created
     * @returns {Promise<void>}
     */
    upsertEventType(name, label, category_name, auto_created) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(label, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(category_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_upsertEventType(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, auto_created);
        return ret;
    }
    /**
     * @param {string} source_type
     * @param {string} history_id
     * @param {number} last_sync_at
     * @param {number} total_items
     * @param {string} oldest_page_token
     * @returns {Promise<void>}
     */
    upsertSyncState(source_type, history_id, last_sync_at, total_items, oldest_page_token) {
        const ptr0 = passStringToWasm0(source_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(history_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(oldest_page_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.meaicore_upsertSyncState(this.__wbg_ptr, ptr0, len0, ptr1, len1, last_sync_at, total_items, ptr2, len2);
        return ret;
    }
}
if (Symbol.dispose) MeAiCore.prototype[Symbol.dispose] = MeAiCore.prototype.free;

export class OllamaConnectionResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OllamaConnectionResult.prototype);
        obj.__wbg_ptr = ptr;
        OllamaConnectionResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OllamaConnectionResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ollamaconnectionresult_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get connected() {
        const ret = wasm.__wbg_get_ollamaconnectionresult_connected(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get corsError() {
        const ret = wasm.__wbg_get_ollamaconnectionresult_corsError(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get error() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamaconnectionresult_error(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamaconnectionresult_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {boolean} arg0
     */
    set connected(arg0) {
        wasm.__wbg_set_ollamaconnectionresult_connected(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set corsError(arg0) {
        wasm.__wbg_set_ollamaconnectionresult_corsError(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set error(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamaconnectionresult_error(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamaconnectionresult_version(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) OllamaConnectionResult.prototype[Symbol.dispose] = OllamaConnectionResult.prototype.free;

/**
 * Browser-side Ollama adapter: owns model/status and emits the same events the old TS engine did.
 */
export class OllamaLlmEngine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OllamaLlmEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ollamallmengine_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get backend() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ollamallmengine_backend(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Test Ollama using settings-derived URL from `core`.
     * @param {MeAiCore} core
     * @returns {Promise<void>}
     */
    check(core) {
        _assertClass(core, MeAiCore);
        const ret = wasm.ollamallmengine_check(this.__wbg_ptr, core.__wbg_ptr);
        return ret;
    }
    /**
     * @param {MeAiCore} core
     * @param {any} messages
     * @param {any} options
     * @returns {Promise<void>}
     */
    generate(core, messages, options) {
        _assertClass(core, MeAiCore);
        const ret = wasm.ollamallmengine_generate(this.__wbg_ptr, core.__wbg_ptr, messages, options);
        return ret;
    }
    interrupt() {
        wasm.ollamallmengine_interrupt(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    get isGenerating() {
        const ret = wasm.ollamallmengine_isGenerating(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get isReady() {
        const ret = wasm.ollamallmengine_isReady(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {MeAiCore} core
     * @param {string} model_name
     * @returns {Promise<void>}
     */
    loadModel(core, model_name) {
        _assertClass(core, MeAiCore);
        const ptr0 = passStringToWasm0(model_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ollamallmengine_loadModel(this.__wbg_ptr, core.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get modelId() {
        const ret = wasm.ollamallmengine_modelId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    constructor() {
        const ret = wasm.ollamallmengine_new();
        this.__wbg_ptr = ret >>> 0;
        OllamaLlmEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    reset() {
        wasm.ollamallmengine_reset(this.__wbg_ptr);
    }
    /**
     * Receives [`EngineMessage`]-shaped plain objects (same as legacy `ollama-engine.ts`).
     * @param {any} cb
     */
    setOnMessage(cb) {
        wasm.ollamallmengine_setOnMessage(this.__wbg_ptr, cb);
    }
    /**
     * @returns {string}
     */
    get status() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ollamallmengine_status(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    terminate() {
        wasm.ollamallmengine_terminate(this.__wbg_ptr);
    }
}
if (Symbol.dispose) OllamaLlmEngine.prototype[Symbol.dispose] = OllamaLlmEngine.prototype.free;

export class OllamaModel {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OllamaModel.prototype);
        obj.__wbg_ptr = ptr;
        OllamaModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof OllamaModel)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OllamaModelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ollamamodel_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get contextWindow() {
        const ret = wasm.__wbg_get_ollamamodel_contextWindow(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodel_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get displayName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodel_displayName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get maxEmailTokens() {
        const ret = wasm.__wbg_get_ollamamodel_maxEmailTokens(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodel_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get params() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodel_params(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get recommendedForEmailProcessing() {
        const ret = wasm.__wbg_get_ollamamodel_recommendedForEmailProcessing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get recommended() {
        const ret = wasm.__wbg_get_ollamamodel_recommended(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string[]}
     */
    get tags() {
        const ret = wasm.ollamamodel_tags(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} arg0
     */
    set contextWindow(arg0) {
        wasm.__wbg_set_ollamamodel_contextWindow(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodel_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set displayName(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodel_displayName(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set maxEmailTokens(arg0) {
        wasm.__wbg_set_ollamamodel_maxEmailTokens(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodel_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set params(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodel_params(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set recommendedForEmailProcessing(arg0) {
        wasm.__wbg_set_ollamamodel_recommendedForEmailProcessing(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set recommended(arg0) {
        wasm.__wbg_set_ollamamodel_recommended(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) OllamaModel.prototype[Symbol.dispose] = OllamaModel.prototype.free;

export class OllamaModelGroup {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OllamaModelGroup.prototype);
        obj.__wbg_ptr = ptr;
        OllamaModelGroupFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OllamaModelGroupFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ollamamodelgroup_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodelgroup_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {OllamaModel[]}
     */
    get models() {
        const ret = wasm.__wbg_get_ollamamodelgroup_models(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodelgroup_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {OllamaModel[]} arg0
     */
    set models(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodelgroup_models(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) OllamaModelGroup.prototype[Symbol.dispose] = OllamaModelGroup.prototype.free;

export class OllamaModelTag {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OllamaModelTag.prototype);
        obj.__wbg_ptr = ptr;
        OllamaModelTagFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OllamaModelTagFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ollamamodeltag_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get modifiedAt() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodeltag_modifiedAt(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ollamamodeltag_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get size() {
        const ret = wasm.__wbg_get_ollamamodeltag_size(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {string} arg0
     */
    set modifiedAt(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodeltag_modifiedAt(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ollamamodeltag_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set size(arg0) {
        wasm.__wbg_set_ollamamodeltag_size(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) OllamaModelTag.prototype[Symbol.dispose] = OllamaModelTag.prototype.free;

export class OnnxModel {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OnnxModel.prototype);
        obj.__wbg_ptr = ptr;
        OnnxModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof OnnxModel)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OnnxModelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_onnxmodel_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get contextWindow() {
        const ret = wasm.__wbg_get_onnxmodel_contextWindow(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_onnxmodel_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get gpuWarning() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_onnxmodel_gpuWarning(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_onnxmodel_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get isExperimental() {
        const ret = wasm.__wbg_get_onnxmodel_isExperimental(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get maxEmailTokens() {
        const ret = wasm.__wbg_get_onnxmodel_maxEmailTokens(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_onnxmodel_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get recommendedForEmailProcessing() {
        const ret = wasm.__wbg_get_onnxmodel_recommendedForEmailProcessing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get size() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_onnxmodel_size(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} arg0
     */
    set contextWindow(arg0) {
        wasm.__wbg_set_onnxmodel_contextWindow(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodel_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set gpuWarning(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodel_gpuWarning(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodel_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set isExperimental(arg0) {
        wasm.__wbg_set_onnxmodel_isExperimental(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set maxEmailTokens(arg0) {
        wasm.__wbg_set_onnxmodel_maxEmailTokens(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodel_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set recommendedForEmailProcessing(arg0) {
        wasm.__wbg_set_onnxmodel_recommendedForEmailProcessing(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set size(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodel_size(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) OnnxModel.prototype[Symbol.dispose] = OnnxModel.prototype.free;

export class OnnxModelGroup {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OnnxModelGroup.prototype);
        obj.__wbg_ptr = ptr;
        OnnxModelGroupFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OnnxModelGroupFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_onnxmodelgroup_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_onnxmodelgroup_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {OnnxModel[]}
     */
    get models() {
        const ret = wasm.__wbg_get_onnxmodelgroup_models(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodelgroup_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {OnnxModel[]} arg0
     */
    set models(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_onnxmodelgroup_models(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) OnnxModelGroup.prototype[Symbol.dispose] = OnnxModelGroup.prototype.free;

export class ParsedApiError {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ParsedApiError.prototype);
        obj.__wbg_ptr = ptr;
        ParsedApiErrorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParsedApiErrorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parsedapierror_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get action() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_parsedapierror_action(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_parsedapierror_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get fix() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_parsedapierror_fix(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get link_label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_parsedapierror_link_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get link_url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_parsedapierror_link_url(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get title() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_parsedapierror_title(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set action(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_parsedapierror_action(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_parsedapierror_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set fix(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_parsedapierror_fix(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set link_label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_parsedapierror_link_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set link_url(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_parsedapierror_link_url(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set title(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_parsedapierror_title(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) ParsedApiError.prototype[Symbol.dispose] = ParsedApiError.prototype.free;

/**
 * UI `Action` row built from a resolved pipeline (replaces TS `getActionsForEvent` mapping).
 */
export class PipelineActionDisplay {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PipelineActionDisplay.prototype);
        obj.__wbg_ptr = ptr;
        PipelineActionDisplayFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PipelineActionDisplayFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pipelineactiondisplay_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get commandId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactiondisplay_commandId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactiondisplay_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactiondisplay_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactiondisplay_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get pluginId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactiondisplay_pluginId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set commandId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactiondisplay_commandId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactiondisplay_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactiondisplay_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactiondisplay_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set pluginId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactiondisplay_pluginId(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PipelineActionDisplay.prototype[Symbol.dispose] = PipelineActionDisplay.prototype.free;

export class PipelineActionRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PipelineActionRow.prototype);
        obj.__wbg_ptr = ptr;
        PipelineActionRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PipelineActionRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pipelineactionrow_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get action_idx() {
        const ret = wasm.__wbg_get_pipelineactionrow_action_idx(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get command_id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactionrow_command_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get plugin_id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pipelineactionrow_plugin_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {bigint} arg0
     */
    set action_idx(arg0) {
        wasm.__wbg_set_pipelineactionrow_action_idx(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set command_id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactionrow_command_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set plugin_id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pipelineactionrow_plugin_id(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PipelineActionRow.prototype[Symbol.dispose] = PipelineActionRow.prototype.free;

export class PluginActionRef {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PluginActionRef.prototype);
        obj.__wbg_ptr = ptr;
        PluginActionRefFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof PluginActionRef)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PluginActionRefFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pluginactionref_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get actionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pluginactionref_actionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set actionId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginactionref_actionId(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PluginActionRef.prototype[Symbol.dispose] = PluginActionRef.prototype.free;

export class PluginDefinition {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PluginDefinition.prototype);
        obj.__wbg_ptr = ptr;
        PluginDefinitionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PluginDefinitionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_plugindefinition_free(ptr, 0);
    }
    /**
     * @returns {ActionMetadata[]}
     */
    get actions() {
        const ret = wasm.__wbg_get_plugindefinition_actions(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    get pluginId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_plugindefinition_pluginId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get pluginName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_plugindefinition_pluginName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {ActionMetadata[]} arg0
     */
    set actions(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_plugindefinition_actions(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set pluginId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_plugindefinition_pluginId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set pluginName(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_plugindefinition_pluginName(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PluginDefinition.prototype[Symbol.dispose] = PluginDefinition.prototype.free;

export class PluginForPrompt {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PluginForPrompt.prototype);
        obj.__wbg_ptr = ptr;
        PluginForPromptFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PluginForPromptFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pluginforprompt_free(ptr, 0);
    }
    /**
     * @returns {PluginActionRef[]}
     */
    get actions() {
        const ret = wasm.__wbg_get_pluginforprompt_actions(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    get pluginName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pluginforprompt_pluginName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get plugin_id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pluginforprompt_plugin_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {PluginActionRef[]} arg0
     */
    set actions(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginforprompt_actions(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set pluginName(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginforprompt_pluginName(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set plugin_id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginforprompt_plugin_id(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PluginForPrompt.prototype[Symbol.dispose] = PluginForPrompt.prototype.free;

export class PluginSummary {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PluginSummary.prototype);
        obj.__wbg_ptr = ptr;
        PluginSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PluginSummaryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pluginsummary_free(ptr, 0);
    }
    /**
     * @returns {LabelRef[]}
     */
    get actions() {
        const ret = wasm.__wbg_get_pluginsummary_actions(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {boolean}
     */
    get enabled() {
        const ret = wasm.__wbg_get_pluginsummary_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pluginsummary_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pluginsummary_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {LabelRef[]}
     */
    get sources() {
        const ret = wasm.__wbg_get_pluginsummary_sources(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pluginsummary_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {LabelRef[]} arg0
     */
    set actions(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginsummary_actions(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set enabled(arg0) {
        wasm.__wbg_set_pluginsummary_enabled(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginsummary_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginsummary_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {LabelRef[]} arg0
     */
    set sources(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginsummary_sources(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_pluginsummary_version(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PluginSummary.prototype[Symbol.dispose] = PluginSummary.prototype.free;

export class RuleActionView {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RuleActionView.prototype);
        obj.__wbg_ptr = ptr;
        RuleActionViewFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof RuleActionView)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RuleActionViewFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ruleactionview_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get commandId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruleactionview_commandId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruleactionview_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get icon() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruleactionview_icon(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruleactionview_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruleactionview_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get pluginId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruleactionview_pluginId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set commandId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleactionview_commandId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleactionview_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set icon(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleactionview_icon(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleactionview_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleactionview_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set pluginId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleactionview_pluginId(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) RuleActionView.prototype[Symbol.dispose] = RuleActionView.prototype.free;

export class RuleTriggerView {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RuleTriggerView.prototype);
        obj.__wbg_ptr = ptr;
        RuleTriggerViewFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof RuleTriggerView)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RuleTriggerViewFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ruletriggerview_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruletriggerview_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Exposed as `type` in JS (matching original serde rename).
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_ruletriggerview_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruletriggerview_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Exposed as `type` in JS (matching original serde rename).
     * @param {string} arg0
     */
    set type(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruletriggerview_type(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) RuleTriggerView.prototype[Symbol.dispose] = RuleTriggerView.prototype.free;

export class RuleView {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RuleView.prototype);
        obj.__wbg_ptr = ptr;
        RuleViewFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RuleViewFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ruleview_free(ptr, 0);
    }
    /**
     * @returns {RuleActionView[]}
     */
    get actions() {
        const ret = wasm.__wbg_get_ruleview_actions(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {bigint | undefined}
     */
    get created_at() {
        const ret = wasm.__wbg_get_ruleview_created_at(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string | undefined}
     */
    get description() {
        const ret = wasm.__wbg_get_ruleview_description(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {boolean}
     */
    get enabled() {
        const ret = wasm.__wbg_get_ruleview_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    get id() {
        const ret = wasm.__wbg_get_ruleview_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get name() {
        const ret = wasm.__wbg_get_ruleview_name(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get policy() {
        const ret = wasm.__wbg_get_ruleview_policy(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {bigint}
     */
    get priority() {
        const ret = wasm.__wbg_get_ruleview_priority(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {RuleTriggerView[]}
     */
    get triggers() {
        const ret = wasm.__wbg_get_ruleview_triggers(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {RuleActionView[]} arg0
     */
    set actions(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleview_actions(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set created_at(arg0) {
        wasm.__wbg_set_ruleview_created_at(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set description(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleview_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set enabled(arg0) {
        wasm.__wbg_set_ruleview_enabled(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set id(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleview_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set name(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleview_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set policy(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleview_policy(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set priority(arg0) {
        wasm.__wbg_set_ruleview_priority(this.__wbg_ptr, arg0);
    }
    /**
     * @param {RuleTriggerView[]} arg0
     */
    set triggers(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_ruleview_triggers(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) RuleView.prototype[Symbol.dispose] = RuleView.prototype.free;

/**
 * Scan history summary stats.
 */
export class ScanHistory {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScanHistory.prototype);
        obj.__wbg_ptr = ptr;
        ScanHistoryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScanHistoryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scanhistory_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get classified() {
        const ret = wasm.__wbg_get_scanhistory_classified(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get errors() {
        const ret = wasm.__wbg_get_scanhistory_errors(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get timestamp() {
        const ret = wasm.__wbg_get_scanhistory_timestamp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get total() {
        const ret = wasm.__wbg_get_scanhistory_total(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} timestamp
     * @param {number} classified
     * @param {number} errors
     * @param {number} total
     */
    constructor(timestamp, classified, errors, total) {
        const ret = wasm.scanhistory_new(timestamp, classified, errors, total);
        this.__wbg_ptr = ret >>> 0;
        ScanHistoryFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} arg0
     */
    set classified(arg0) {
        wasm.__wbg_set_scanhistory_classified(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set errors(arg0) {
        wasm.__wbg_set_scanhistory_errors(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set timestamp(arg0) {
        wasm.__wbg_set_scanhistory_timestamp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set total(arg0) {
        wasm.__wbg_set_scanhistory_total(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) ScanHistory.prototype[Symbol.dispose] = ScanHistory.prototype.free;

/**
 * All app settings in one typed struct.
 * Load with `core.loadSettings()`, save with `core.saveSettings(sv)`.
 * Only non-None fields are written to IndexedDB on save.
 */
export class SettingValue {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SettingValue.prototype);
        obj.__wbg_ptr = ptr;
        SettingValueFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SettingValueFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_settingvalue_free(ptr, 0);
    }
    /**
     * @returns {AiBackend | undefined}
     */
    get aiBackend() {
        const ret = wasm.settingvalue_aiBackend(this.__wbg_ptr);
        return ret === 3 ? undefined : ret;
    }
    /**
     * @returns {string | undefined}
     */
    get anthropicApiKey() {
        const ret = wasm.settingvalue_anthropicApiKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {boolean | undefined}
     */
    get debugLogging() {
        const ret = wasm.settingvalue_debugLogging(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {boolean | undefined}
     */
    get doSample() {
        const ret = wasm.settingvalue_doSample(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {boolean | undefined}
     */
    get enableThinking() {
        const ret = wasm.settingvalue_enableThinking(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {GmailProfile | undefined}
     */
    get gmailProfile() {
        const ret = wasm.settingvalue_gmailProfile(this.__wbg_ptr);
        return ret === 0 ? undefined : GmailProfile.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get googleApiKey() {
        const ret = wasm.settingvalue_googleApiKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get googleClientId() {
        const ret = wasm.settingvalue_googleClientId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {GoogleToken | undefined}
     */
    get googleToken() {
        const ret = wasm.settingvalue_googleToken(this.__wbg_ptr);
        return ret === 0 ? undefined : GoogleToken.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get loadDevice() {
        const ret = wasm.settingvalue_loadDevice(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get loadDtype() {
        const ret = wasm.settingvalue_loadDtype(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {number | undefined}
     */
    get maxTokens() {
        const ret = wasm.settingvalue_maxTokens(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    constructor() {
        const ret = wasm.settingvalue_new();
        this.__wbg_ptr = ret >>> 0;
        SettingValueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string | undefined}
     */
    get ollamaUrl() {
        const ret = wasm.settingvalue_ollamaUrl(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get openaiApiKey() {
        const ret = wasm.settingvalue_openaiApiKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {number | undefined}
     */
    get repetitionPenalty() {
        const ret = wasm.settingvalue_repetitionPenalty(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {ScanHistory | undefined}
     */
    get scanHistory() {
        const ret = wasm.settingvalue_scanHistory(this.__wbg_ptr);
        return ret === 0 ? undefined : ScanHistory.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get selectedModel() {
        const ret = wasm.settingvalue_selectedModel(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {AiBackend} v
     */
    set aiBackend(v) {
        wasm.settingvalue_set_aiBackend(this.__wbg_ptr, v);
    }
    /**
     * @param {string} v
     */
    set anthropicApiKey(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_anthropicApiKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} v
     */
    set debugLogging(v) {
        wasm.settingvalue_set_debugLogging(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set doSample(v) {
        wasm.settingvalue_set_doSample(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set enableThinking(v) {
        wasm.settingvalue_set_enableThinking(this.__wbg_ptr, v);
    }
    /**
     * @param {GmailProfile} p
     */
    set gmailProfile(p) {
        _assertClass(p, GmailProfile);
        var ptr0 = p.__destroy_into_raw();
        wasm.settingvalue_set_gmailProfile(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} v
     */
    set googleApiKey(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_googleApiKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} v
     */
    set googleClientId(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_googleClientId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {GoogleToken} t
     */
    set googleToken(t) {
        _assertClass(t, GoogleToken);
        var ptr0 = t.__destroy_into_raw();
        wasm.settingvalue_set_googleToken(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} v
     */
    set loadDevice(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_loadDevice(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} v
     */
    set loadDtype(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_loadDtype(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} v
     */
    set maxTokens(v) {
        wasm.settingvalue_set_maxTokens(this.__wbg_ptr, v);
    }
    /**
     * @param {string} v
     */
    set ollamaUrl(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_ollamaUrl(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} v
     */
    set openaiApiKey(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_openaiApiKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} v
     */
    set repetitionPenalty(v) {
        wasm.settingvalue_set_repetitionPenalty(this.__wbg_ptr, v);
    }
    /**
     * @param {ScanHistory} h
     */
    set scanHistory(h) {
        _assertClass(h, ScanHistory);
        var ptr0 = h.__destroy_into_raw();
        wasm.settingvalue_set_scanHistory(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} v
     */
    set selectedModel(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_selectedModel(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} v
     */
    set temperature(v) {
        wasm.settingvalue_set_temperature(this.__wbg_ptr, v);
    }
    /**
     * @param {string} v
     */
    set twitterClientId(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_twitterClientId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {TwitterProfile} p
     */
    set twitterProfile(p) {
        _assertClass(p, TwitterProfile);
        var ptr0 = p.__destroy_into_raw();
        wasm.settingvalue_set_twitterProfile(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {TwitterToken} t
     */
    set twitterToken(t) {
        _assertClass(t, TwitterToken);
        var ptr0 = t.__destroy_into_raw();
        wasm.settingvalue_set_twitterToken(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} v
     */
    set xaiApiKey(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.settingvalue_set_xaiApiKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number | undefined}
     */
    get temperature() {
        const ret = wasm.settingvalue_temperature(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string | undefined}
     */
    get twitterClientId() {
        const ret = wasm.settingvalue_twitterClientId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {TwitterProfile | undefined}
     */
    get twitterProfile() {
        const ret = wasm.settingvalue_twitterProfile(this.__wbg_ptr);
        return ret === 0 ? undefined : TwitterProfile.__wrap(ret);
    }
    /**
     * @returns {TwitterToken | undefined}
     */
    get twitterToken() {
        const ret = wasm.settingvalue_twitterToken(this.__wbg_ptr);
        return ret === 0 ? undefined : TwitterToken.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get xaiApiKey() {
        const ret = wasm.settingvalue_xaiApiKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}
if (Symbol.dispose) SettingValue.prototype[Symbol.dispose] = SettingValue.prototype.free;

export class SourceRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SourceRow.prototype);
        obj.__wbg_ptr = ptr;
        SourceRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SourceRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sourcerow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get api() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_sourcerow_api(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get enabled() {
        const ret = wasm.__wbg_get_sourcerow_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get label() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_sourcerow_label(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_sourcerow_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get platform() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_sourcerow_platform(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set api(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_sourcerow_api(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set enabled(arg0) {
        wasm.__wbg_set_sourcerow_enabled(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set label(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_sourcerow_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_sourcerow_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set platform(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_sourcerow_platform(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) SourceRow.prototype[Symbol.dispose] = SourceRow.prototype.free;

/**
 * Stored item with parsed `labels` and `raw` for the JS boundary (matches former `normaliseRow` output).
 */
export class StoredItem {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StoredItem.prototype);
        obj.__wbg_ptr = ptr;
        StoredItemFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof StoredItem)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StoredItemFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_storeditem_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get body() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_body(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get cc() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_cc(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get date() {
        const ret = wasm.__wbg_get_storeditem_date(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string}
     */
    get from() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_from(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get htmlBody() {
        const ret = wasm.__wbg_get_storeditem_htmlBody(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get inReplyTo() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_inReplyTo(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string[]}
     */
    get labels() {
        const ret = wasm.__wbg_get_storeditem_labels(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    get messageId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_messageId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Original Gmail/API JSON; dynamic shape — `JsValue` is the correct wasm boundary type.
     * @returns {any}
     */
    get raw() {
        const ret = wasm.__wbg_get_storeditem_raw(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get references() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_references(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get snippet() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_snippet(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get sourceId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_sourceId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get sourceType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_sourceType(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get subject() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_subject(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get syncedAt() {
        const ret = wasm.__wbg_get_storeditem_syncedAt(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string}
     */
    get threadKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_threadKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get to() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_to(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_storeditem_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set body(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_body(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set cc(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_cc(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set date(arg0) {
        wasm.__wbg_set_storeditem_date(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string} arg0
     */
    set from(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set htmlBody(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_htmlBody(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set inReplyTo(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_inReplyTo(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string[]} arg0
     */
    set labels(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_labels(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set messageId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_messageId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Original Gmail/API JSON; dynamic shape — `JsValue` is the correct wasm boundary type.
     * @param {any} arg0
     */
    set raw(arg0) {
        wasm.__wbg_set_storeditem_raw(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set references(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_references(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set snippet(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_snippet(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set sourceId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_sourceId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set sourceType(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_sourceType(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set subject(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_subject(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set syncedAt(arg0) {
        wasm.__wbg_set_storeditem_syncedAt(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string} arg0
     */
    set threadKey(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_threadKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set to(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_to(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set type(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_storeditem_type(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) StoredItem.prototype[Symbol.dispose] = StoredItem.prototype.free;

/**
 * Result of a sync operation (WASM-typed boundary).
 */
export class SyncResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SyncResult.prototype);
        obj.__wbg_ptr = ptr;
        SyncResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SyncResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_syncresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get added() {
        const ret = wasm.__wbg_get_syncresult_added(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number | undefined}
     */
    get deleted() {
        const ret = wasm.__wbg_get_syncresult_deleted(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number}
     */
    get errors() {
        const ret = wasm.__wbg_get_syncresult_errors(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set added(arg0) {
        wasm.__wbg_set_syncresult_added(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number | null} [arg0]
     */
    set deleted(arg0) {
        wasm.__wbg_set_syncresult_deleted(this.__wbg_ptr, isLikeNone(arg0) ? 0x100000001 : (arg0) >>> 0);
    }
    /**
     * @param {number} arg0
     */
    set errors(arg0) {
        wasm.__wbg_set_syncresult_errors(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SyncResult.prototype[Symbol.dispose] = SyncResult.prototype.free;

export class SyncStateRow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SyncStateRow.prototype);
        obj.__wbg_ptr = ptr;
        SyncStateRowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SyncStateRowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_syncstaterow_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get historyId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_syncstaterow_historyId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get lastSyncAt() {
        const ret = wasm.__wbg_get_syncstaterow_lastSyncAt(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {string}
     */
    get oldestPageToken() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_syncstaterow_oldestPageToken(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get sourceType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_syncstaterow_sourceType(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get totalItems() {
        const ret = wasm.__wbg_get_syncstaterow_totalItems(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} arg0
     */
    set historyId(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_syncstaterow_historyId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set lastSyncAt(arg0) {
        wasm.__wbg_set_syncstaterow_lastSyncAt(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {string} arg0
     */
    set oldestPageToken(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_syncstaterow_oldestPageToken(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set sourceType(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_syncstaterow_sourceType(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint} arg0
     */
    set totalItems(arg0) {
        wasm.__wbg_set_syncstaterow_totalItems(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SyncStateRow.prototype[Symbol.dispose] = SyncStateRow.prototype.free;

/**
 * Status of a sync source (WASM-typed boundary).
 */
export class SyncStatus {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SyncStatus.prototype);
        obj.__wbg_ptr = ptr;
        SyncStatusFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SyncStatusFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_syncstatus_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get hasMore() {
        const ret = wasm.__wbg_get_syncstatus_hasMore(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    get historyId() {
        const ret = wasm.__wbg_get_syncstatus_historyId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {bigint | undefined}
     */
    get lastSyncAt() {
        const ret = wasm.__wbg_get_syncstatus_lastSyncAt(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @returns {boolean}
     */
    get synced() {
        const ret = wasm.__wbg_get_syncstatus_synced(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {bigint}
     */
    get totalItems() {
        const ret = wasm.__wbg_get_syncstatus_totalItems(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean} arg0
     */
    set hasMore(arg0) {
        wasm.__wbg_set_syncstatus_hasMore(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set historyId(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_syncstatus_historyId(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {bigint | null} [arg0]
     */
    set lastSyncAt(arg0) {
        wasm.__wbg_set_syncstatus_lastSyncAt(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set synced(arg0) {
        wasm.__wbg_set_syncstatus_synced(this.__wbg_ptr, arg0);
    }
    /**
     * @param {bigint} arg0
     */
    set totalItems(arg0) {
        wasm.__wbg_set_syncstatus_totalItems(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SyncStatus.prototype[Symbol.dispose] = SyncStatus.prototype.free;

export class TriageClassification {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TriageClassification.prototype);
        obj.__wbg_ptr = ptr;
        TriageClassificationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TriageClassificationFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_triageclassification_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get action() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_triageclassification_action(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get categoryTier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_triageclassification_categoryTier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get category() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_triageclassification_category(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get reason() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_triageclassification_reason(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get summary() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_triageclassification_summary(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get tags() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_triageclassification_tags(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set action(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_triageclassification_action(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set categoryTier(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_triageclassification_categoryTier(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set category(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_triageclassification_category(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set reason(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_triageclassification_reason(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set summary(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_triageclassification_summary(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set tags(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_triageclassification_tags(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Parsed tag list (empty if `tags` JSON is invalid).
     * @returns {string[]}
     */
    get tagsArray() {
        const ret = wasm.triageclassification_tagsArray(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) TriageClassification.prototype[Symbol.dispose] = TriageClassification.prototype.free;

/**
 * Return value for [`begin_login`] (browser redirects to `authorize_url`).
 */
export class TwitterOAuthLoginStart {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TwitterOAuthLoginStart.prototype);
        obj.__wbg_ptr = ptr;
        TwitterOAuthLoginStartFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TwitterOAuthLoginStartFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_twitteroauthloginstart_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get authorizeUrl() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_twitteroauthloginstart_authorizeUrl(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_twitteroauthloginstart_state(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get verifier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_twitteroauthloginstart_verifier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set authorizeUrl(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitteroauthloginstart_authorizeUrl(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set state(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitteroauthloginstart_state(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set verifier(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitteroauthloginstart_verifier(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) TwitterOAuthLoginStart.prototype[Symbol.dispose] = TwitterOAuthLoginStart.prototype.free;

/**
 * Tokens after exchange or for UI use (mirrors prior `twitter-auth.ts` shape).
 */
export class TwitterOAuthTokens {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TwitterOAuthTokens.prototype);
        obj.__wbg_ptr = ptr;
        TwitterOAuthTokensFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TwitterOAuthTokensFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_twitteroauthtokens_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get accessToken() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_twitteroauthtokens_accessToken(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get refreshToken() {
        const ret = wasm.__wbg_get_twitteroauthtokens_refreshToken(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} arg0
     */
    set accessToken(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitteroauthtokens_accessToken(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string | null} [arg0]
     */
    set refreshToken(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitteroauthtokens_refreshToken(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) TwitterOAuthTokens.prototype[Symbol.dispose] = TwitterOAuthTokens.prototype.free;

/**
 * Ephemeral PKCE verifier + state read once after Twitter OAuth redirect (stored in `settings` store).
 */
export class TwitterPkcePending {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TwitterPkcePending.prototype);
        obj.__wbg_ptr = ptr;
        TwitterPkcePendingFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TwitterPkcePendingFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_twitterpkcepending_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_twitterpkcepending_state(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get verifier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_twitterpkcepending_verifier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set state(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitterpkcepending_state(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set verifier(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_twitterpkcepending_verifier(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) TwitterPkcePending.prototype[Symbol.dispose] = TwitterPkcePending.prototype.free;

/**
 * Twitter/X user profile (common fields from Twitter API v2).
 */
export class TwitterProfile {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TwitterProfile.prototype);
        obj.__wbg_ptr = ptr;
        TwitterProfileFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TwitterProfileFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_twitterprofile_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get id() {
        const ret = wasm.twitterprofile_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    get name() {
        const ret = wasm.twitterprofile_name(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    constructor() {
        const ret = wasm.twitterprofile_new();
        this.__wbg_ptr = ret >>> 0;
        TwitterProfileFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} v
     */
    set id(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.twitterprofile_set_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} v
     */
    set name(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.twitterprofile_set_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} v
     */
    set username(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.twitterprofile_set_username(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get username() {
        const ret = wasm.twitterprofile_username(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}
if (Symbol.dispose) TwitterProfile.prototype[Symbol.dispose] = TwitterProfile.prototype.free;

/**
 * Twitter/X OAuth 2.0 PKCE token.
 */
export class TwitterToken {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TwitterToken.prototype);
        obj.__wbg_ptr = ptr;
        TwitterTokenFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TwitterTokenFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_twittertoken_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get accessToken() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.twittertoken_accessToken(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get expiresAt() {
        const ret = wasm.twittertoken_expiresAt(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} access_token
     * @param {number} expires_at
     */
    constructor(access_token, expires_at) {
        const ptr0 = passStringToWasm0(access_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.twittertoken_new(ptr0, len0, expires_at);
        this.__wbg_ptr = ret >>> 0;
        TwitterTokenFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string | undefined}
     */
    get refreshToken() {
        const ret = wasm.twittertoken_refreshToken(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} v
     */
    set accessToken(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.twittertoken_set_accessToken(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} v
     */
    set expiresAt(v) {
        wasm.twittertoken_set_expiresAt(this.__wbg_ptr, v);
    }
    /**
     * @param {string} v
     */
    set refreshToken(v) {
        const ptr0 = passStringToWasm0(v, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.twittertoken_set_refreshToken(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) TwitterToken.prototype[Symbol.dispose] = TwitterToken.prototype.free;

/**
 * @param {string} messages_json
 * @returns {string | undefined}
 */
export function fallbackChatTitleFromMessagesJson(messages_json) {
    const ptr0 = passStringToWasm0(messages_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fallbackChatTitleFromMessagesJson(ptr0, len0);
    let v2;
    if (ret[0] !== 0) {
        v2 = getStringFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    }
    return v2;
}

/**
 * @param {string} content
 * @returns {string | undefined}
 */
export function fallbackChatTitleFromUserContent(content) {
    const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fallbackChatTitleFromUserContent(ptr0, len0);
    let v2;
    if (ret[0] !== 0) {
        v2 = getStringFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    }
    return v2;
}

/**
 * @param {string} messages_json
 * @returns {string | undefined}
 */
export function firstUserMessageContentForTitle(messages_json) {
    const ptr0 = passStringToWasm0(messages_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.firstUserMessageContentForTitle(ptr0, len0);
    let v2;
    if (ret[0] !== 0) {
        v2 = getStringFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    }
    return v2;
}

/**
 * @param {string} prefix
 * @returns {string}
 */
export function makeChatEntityId(prefix) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.makeChatEntityId(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {any} msg
 * @param {number} fallback_time
 * @returns {any}
 */
export function normalizeChatMessage(msg, fallback_time) {
    const ret = wasm.normalizeChatMessage(msg, fallback_time);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} raw
 * @param {string} messages_json
 * @returns {string}
 */
export function normalizeGeneratedChatTitle(raw, messages_json) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(raw, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(messages_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.normalizeGeneratedChatTitle(ptr0, len0, ptr1, len1);
        deferred3_0 = ret[0];
        deferred3_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} json
 * @returns {ChatSessionsSnapshot}
 */
export function parseChatSessionsSnapshotJson(json) {
    const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.parseChatSessionsSnapshotJson(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} messages_json
 * @returns {string}
 */
export function sessionSubtitleFromMessagesJson(messages_json) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(messages_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sessionSubtitleFromMessagesJson(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_2e59b1b37a9a34c3: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_Number_e6ffdb596c888833: function(arg0) {
            const ret = Number(arg0);
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_bigint_get_as_i64_2c5082002e4826e2: function(arg0, arg1) {
            const v = arg1;
            const ret = typeof(v) === 'bigint' ? v : undefined;
            getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_boolean_get_a86c216575a75c30: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_dd5d2d07ce9e6c57: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_4bd7a57e54337366: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_bigint_6c98f7e945dacdde: function(arg0) {
            const ret = typeof(arg0) === 'bigint';
            return ret;
        },
        __wbg___wbindgen_is_function_49868bde5eb1e745: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_344c8750a8525473: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_object_40c5a80572e8f9d3: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_b29b5c5a8065ba1a: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_c0cca72b82b86f4d: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_jsval_eq_7d430e744a913d26: function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        },
        __wbg___wbindgen_jsval_loose_eq_3a72ae764d46d944: function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        },
        __wbg___wbindgen_number_get_7579aab02a8a620c: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_914df97fcfa788f2: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_81fc77679af83bc6: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_3c3b4f651835fbcb: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_abort_5ee4083ce26e0b01: function(arg0) {
            arg0.abort();
        },
        __wbg_abort_7a67cb8f9383baa1: function(arg0, arg1) {
            arg0.abort(arg1);
        },
        __wbg_aborted_e3b09fa8485b2eaf: function(arg0) {
            const ret = arg0.aborted;
            return ret;
        },
        __wbg_actionmetadata_new: function(arg0) {
            const ret = ActionMetadata.__wrap(arg0);
            return ret;
        },
        __wbg_actionmetadata_unwrap: function(arg0) {
            const ret = ActionMetadata.__unwrap(arg0);
            return ret;
        },
        __wbg_actionrow_new: function(arg0) {
            const ret = ActionRow.__wrap(arg0);
            return ret;
        },
        __wbg_advance_161f51053e7b3a41: function() { return handleError(function (arg0, arg1) {
            arg0.advance(arg1 >>> 0);
        }, arguments); },
        __wbg_apimodel_new: function(arg0) {
            const ret = ApiModel.__wrap(arg0);
            return ret;
        },
        __wbg_append_29fe4ab6f2c88ba2: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.append(getStringFromWasm0(arg1, arg2), arg3);
        }, arguments); },
        __wbg_append_4aa39f0c1ef8161e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_append_59da1e75d76c3126: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.append(getStringFromWasm0(arg1, arg2), arg3, getStringFromWasm0(arg4, arg5));
        }, arguments); },
        __wbg_append_c015600138ae60bb: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_arrayBuffer_dae084a298aa5fe0: function() { return handleError(function (arg0) {
            const ret = arg0.arrayBuffer();
            return ret;
        }, arguments); },
        __wbg_auditlogentryparsed_new: function(arg0) {
            const ret = AuditLogEntryParsed.__wrap(arg0);
            return ret;
        },
        __wbg_auditlogentryparsed_unwrap: function(arg0) {
            const ret = AuditLogEntryParsed.__unwrap(arg0);
            return ret;
        },
        __wbg_auditlogrow_new: function(arg0) {
            const ret = AuditLogRow.__wrap(arg0);
            return ret;
        },
        __wbg_auditlogrow_unwrap: function(arg0) {
            const ret = AuditLogRow.__unwrap(arg0);
            return ret;
        },
        __wbg_auditlogstep_new: function(arg0) {
            const ret = AuditLogStep.__wrap(arg0);
            return ret;
        },
        __wbg_auditlogstep_unwrap: function(arg0) {
            const ret = AuditLogStep.__unwrap(arg0);
            return ret;
        },
        __wbg_auditstats_new: function(arg0) {
            const ret = AuditStats.__wrap(arg0);
            return ret;
        },
        __wbg_body_9a25d64338506fbe: function(arg0) {
            const ret = arg0.body;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_buffer_a77cc90da4bdb503: function(arg0) {
            const ret = arg0.buffer;
            return ret;
        },
        __wbg_byobRequest_41018d4f78e8364a: function(arg0) {
            const ret = arg0.byobRequest;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_byteLength_f5c761c4472de41b: function(arg0) {
            const ret = arg0.byteLength;
            return ret;
        },
        __wbg_byteOffset_7cd0c9f7e573845c: function(arg0) {
            const ret = arg0.byteOffset;
            return ret;
        },
        __wbg_call_7f2987183bb62793: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_call_d578befcc3145dee: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_cancel_8314206ca10b9605: function(arg0) {
            const ret = arg0.cancel();
            return ret;
        },
        __wbg_catch_32d296b856e661d9: function(arg0, arg1) {
            const ret = arg0.catch(arg1);
            return ret;
        },
        __wbg_classificationrow_new: function(arg0) {
            const ret = ClassificationRow.__wrap(arg0);
            return ret;
        },
        __wbg_clearTimeout_6b8d9a38b9263d65: function(arg0) {
            const ret = clearTimeout(arg0);
            return ret;
        },
        __wbg_clear_973335ff78e5473c: function() { return handleError(function (arg0) {
            const ret = arg0.clear();
            return ret;
        }, arguments); },
        __wbg_close_040c0e5be6c74f11: function(arg0) {
            arg0.close();
        },
        __wbg_close_9998ebb2f4515c42: function() { return handleError(function (arg0) {
            arg0.close();
        }, arguments); },
        __wbg_close_a7c33e895baeb773: function() { return handleError(function (arg0) {
            arg0.close();
        }, arguments); },
        __wbg_contactrow_new: function(arg0) {
            const ret = ContactRow.__wrap(arg0);
            return ret;
        },
        __wbg_continue_33780bb54847c9c4: function() { return handleError(function (arg0, arg1) {
            arg0.continue(arg1);
        }, arguments); },
        __wbg_continue_5d0cea5632bb62b2: function() { return handleError(function (arg0) {
            arg0.continue();
        }, arguments); },
        __wbg_count_4d9182533caba8fd: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.count(arg1);
            return ret;
        }, arguments); },
        __wbg_count_5f8d0eb4564ee6ee: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.count(arg1);
            return ret;
        }, arguments); },
        __wbg_count_b844140e9d84ce98: function() { return handleError(function (arg0) {
            const ret = arg0.count();
            return ret;
        }, arguments); },
        __wbg_count_ece45ec41020c7f2: function() { return handleError(function (arg0) {
            const ret = arg0.count();
            return ret;
        }, arguments); },
        __wbg_createIndex_3b7d978a2177a0cf: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_createIndex_8ec3ed69d78d89ea: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3);
            return ret;
        }, arguments); },
        __wbg_createObjectStore_6e567b25160be2fa: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2), arg3);
            return ret;
        }, arguments); },
        __wbg_crypto_38df2bab126b63dc: function(arg0) {
            const ret = arg0.crypto;
            return ret;
        },
        __wbg_deleteIndex_af52038711dd78b2: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.deleteIndex(getStringFromWasm0(arg1, arg2));
        }, arguments); },
        __wbg_deleteObjectStore_42c1e82fe6d8a028: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.deleteObjectStore(getStringFromWasm0(arg1, arg2));
        }, arguments); },
        __wbg_delete_fc24bd7dfa57938e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.delete(arg1);
            return ret;
        }, arguments); },
        __wbg_done_547d467e97529006: function(arg0) {
            const ret = arg0.done;
            return ret;
        },
        __wbg_enqueue_bb06efec8458a81a: function() { return handleError(function (arg0, arg1) {
            arg0.enqueue(arg1);
        }, arguments); },
        __wbg_entries_616b1a459b85be0b: function(arg0) {
            const ret = Object.entries(arg0);
            return ret;
        },
        __wbg_error_58469b8474e13592: function() { return handleError(function (arg0) {
            const ret = arg0.error;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_error_c57846662bf0e748: function(arg0) {
            const ret = arg0.error;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_eventcategoryrow_new: function(arg0) {
            const ret = EventCategoryRow.__wrap(arg0);
            return ret;
        },
        __wbg_eventcategorytier_new: function(arg0) {
            const ret = EventCategoryTier.__wrap(arg0);
            return ret;
        },
        __wbg_eventrow_new: function(arg0) {
            const ret = EventRow.__wrap(arg0);
            return ret;
        },
        __wbg_eventtyperow_new: function(arg0) {
            const ret = EventTypeRow.__wrap(arg0);
            return ret;
        },
        __wbg_fetch_1a731e18c5e21884: function(arg0, arg1) {
            const ret = arg0.fetch(arg1);
            return ret;
        },
        __wbg_fetch_9dad4fe911207b37: function(arg0) {
            const ret = fetch(arg0);
            return ret;
        },
        __wbg_getAll_0d772ddb77a3abf6: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getAll(arg1, arg2 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getAll_12c7165a892e239a: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getAll(arg1, arg2 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getAll_19e833a015c08d39: function() { return handleError(function (arg0) {
            const ret = arg0.getAll();
            return ret;
        }, arguments); },
        __wbg_getAll_638ea4edf8f7a6a7: function() { return handleError(function (arg0) {
            const ret = arg0.getAll();
            return ret;
        }, arguments); },
        __wbg_getAll_93336699ea033b51: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getAll(arg1);
            return ret;
        }, arguments); },
        __wbg_getAll_9bcad41e5d64c7db: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getAll(arg1);
            return ret;
        }, arguments); },
        __wbg_getRandomValues_c44a50d8cfdaebeb: function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments); },
        __wbg_getReader_b4b1868fbca77dbe: function() { return handleError(function (arg0) {
            const ret = arg0.getReader();
            return ret;
        }, arguments); },
        __wbg_get_4848e350b40afc16: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_560cb483e5c0133e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.get(arg1);
            return ret;
        }, arguments); },
        __wbg_get_dba5fa38b6597b3f: function(arg0, arg1, arg2) {
            const ret = arg1[arg2 >>> 0];
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_get_done_46f064515323cd59: function(arg0) {
            const ret = arg0.done;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg_get_ed0642c4b9d31ddf: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_f96702c6245e4ef9: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_unchecked_7d7babe32e9e6a54: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_value_28b7deb73d356d88: function(arg0) {
            const ret = arg0.value;
            return ret;
        },
        __wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
            const ret = arg0[arg1];
            return ret;
        },
        __wbg_getauditlogparsedresult_new: function(arg0) {
            const ret = GetAuditLogParsedResult.__wrap(arg0);
            return ret;
        },
        __wbg_getauditlogresult_new: function(arg0) {
            const ret = GetAuditLogResult.__wrap(arg0);
            return ret;
        },
        __wbg_getstoredemailsresult_new: function(arg0) {
            const ret = GetStoredEmailsResult.__wrap(arg0);
            return ret;
        },
        __wbg_googletoken_new: function(arg0) {
            const ret = GoogleToken.__wrap(arg0);
            return ret;
        },
        __wbg_has_3ec5c22db2e5237a: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.has(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_headers_e08dcb5aa09b9a63: function(arg0) {
            const ret = arg0.headers;
            return ret;
        },
        __wbg_hostname_a42f31a9081ac639: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.hostname;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_indexNames_82c4167bffa4c333: function(arg0) {
            const ret = arg0.indexNames;
            return ret;
        },
        __wbg_index_ce5a38731ba42f0d: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.index(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_instanceof_ArrayBuffer_ff7c1337a5e3b33a: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbCursorWithValue_5ece76174155fcb4: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBCursorWithValue;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbDatabase_0af111edb4be95f4: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBDatabase;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbFactory_7c303c3d8528cef3: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBFactory;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbOpenDbRequest_92df356941adf31e: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBOpenDBRequest;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbRequest_fc5918c726448f04: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBRequest;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbTransaction_de69712ce07dde97: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBTransaction;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Map_a10a2795ef4bfe97: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Map;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Response_06795eab66cc4036: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Uint8Array_4b8da683deb25d72: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Window_c0fee4c064502536: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_isArray_db61795ad004c139: function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        },
        __wbg_isSafeInteger_ea83862ba994770c: function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        },
        __wbg_itemrow_new: function(arg0) {
            const ret = ItemRow.__wrap(arg0);
            return ret;
        },
        __wbg_iterator_de403ef31815a3e6: function() {
            const ret = Symbol.iterator;
            return ret;
        },
        __wbg_keyPath_137bba25d08d22b9: function() { return handleError(function (arg0) {
            const ret = arg0.keyPath;
            return ret;
        }, arguments); },
        __wbg_key_dca96029ad629531: function() { return handleError(function (arg0) {
            const ret = arg0.key;
            return ret;
        }, arguments); },
        __wbg_labelref_new: function(arg0) {
            const ret = LabelRef.__wrap(arg0);
            return ret;
        },
        __wbg_labelref_unwrap: function(arg0) {
            const ret = LabelRef.__unwrap(arg0);
            return ret;
        },
        __wbg_length_0c32cb8543c8e4c8: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_3804262ff442a7a3: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_6e821edde497a532: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_location_91b3fdbca3c76d9e: function(arg0) {
            const ret = arg0.location;
            return ret;
        },
        __wbg_meaicore_new: function(arg0) {
            const ret = MeAiCore.__wrap(arg0);
            return ret;
        },
        __wbg_msCrypto_bd5a034af96bcba6: function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        },
        __wbg_multiEntry_9d4ec9fa9fa5a9d5: function(arg0) {
            const ret = arg0.multiEntry;
            return ret;
        },
        __wbg_new_3a112826a89cb962: function() { return handleError(function () {
            const ret = new Headers();
            return ret;
        }, arguments); },
        __wbg_new_4f9fafbb3909af72: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_56a7f7f78a9437aa: function() { return handleError(function () {
            const ret = new FormData();
            return ret;
        }, arguments); },
        __wbg_new_99cabae501c0a8a0: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_9abbf7148481485e: function() { return handleError(function () {
            const ret = new AbortController();
            return ret;
        }, arguments); },
        __wbg_new_a560378ea1240b14: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_e3b04b4d53d1b593: function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_f3c9df4f38f3f798: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_from_slice_2580ff33d0d10520: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_typed_14d7cc391ce53d2c: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen__convert__closures_____invoke__h8717c02c493ac132(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_new_with_byte_offset_and_length_6bfc75833d6170c8: function(arg0, arg1, arg2) {
            const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
            return ret;
        },
        __wbg_new_with_length_9cedd08484b73942: function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        },
        __wbg_new_with_str_and_init_f663b6d334baa878: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
            return ret;
        }, arguments); },
        __wbg_new_with_u8_array_sequence_and_options_0ea871c78d13a6d8: function() { return handleError(function (arg0, arg1) {
            const ret = new Blob(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_next_01132ed6134b8ef5: function(arg0) {
            const ret = arg0.next;
            return ret;
        },
        __wbg_next_b3713ec761a9dbfd: function() { return handleError(function (arg0) {
            const ret = arg0.next();
            return ret;
        }, arguments); },
        __wbg_node_84ea875411254db1: function(arg0) {
            const ret = arg0.node;
            return ret;
        },
        __wbg_now_2c44418ca0623664: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_now_88621c9c9a4f3ffc: function() {
            const ret = Date.now();
            return ret;
        },
        __wbg_objectStoreNames_990d8e55c661828b: function(arg0) {
            const ret = arg0.objectStoreNames;
            return ret;
        },
        __wbg_objectStore_3d4cade4416cd432: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_ollamaconnectionresult_new: function(arg0) {
            const ret = OllamaConnectionResult.__wrap(arg0);
            return ret;
        },
        __wbg_ollamamodel_new: function(arg0) {
            const ret = OllamaModel.__wrap(arg0);
            return ret;
        },
        __wbg_ollamamodel_unwrap: function(arg0) {
            const ret = OllamaModel.__unwrap(arg0);
            return ret;
        },
        __wbg_ollamamodelgroup_new: function(arg0) {
            const ret = OllamaModelGroup.__wrap(arg0);
            return ret;
        },
        __wbg_ollamamodeltag_new: function(arg0) {
            const ret = OllamaModelTag.__wrap(arg0);
            return ret;
        },
        __wbg_only_a0a8c5e9c00d5ffe: function() { return handleError(function (arg0) {
            const ret = IDBKeyRange.only(arg0);
            return ret;
        }, arguments); },
        __wbg_onnxmodel_new: function(arg0) {
            const ret = OnnxModel.__wrap(arg0);
            return ret;
        },
        __wbg_onnxmodel_unwrap: function(arg0) {
            const ret = OnnxModel.__unwrap(arg0);
            return ret;
        },
        __wbg_onnxmodelgroup_new: function(arg0) {
            const ret = OnnxModelGroup.__wrap(arg0);
            return ret;
        },
        __wbg_openCursor_8c13615ee9abe0be: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.openCursor(arg1, __wbindgen_enum_IdbCursorDirection[arg2]);
            return ret;
        }, arguments); },
        __wbg_openCursor_da880fbfa4778131: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.openCursor(arg1);
            return ret;
        }, arguments); },
        __wbg_openCursor_dba106f29c3613c4: function() { return handleError(function (arg0) {
            const ret = arg0.openCursor();
            return ret;
        }, arguments); },
        __wbg_open_254d9b392262d9ef: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.open(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_open_ac04ec9d75d0eeaf: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
            return ret;
        }, arguments); },
        __wbg_parse_71237dc6234c8d7f: function(arg0, arg1) {
            const ret = Date.parse(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_performance_5ed3f6a3bbe36d0d: function(arg0) {
            const ret = arg0.performance;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_pipelineactiondisplay_new: function(arg0) {
            const ret = PipelineActionDisplay.__wrap(arg0);
            return ret;
        },
        __wbg_pipelineactionrow_new: function(arg0) {
            const ret = PipelineActionRow.__wrap(arg0);
            return ret;
        },
        __wbg_pluginactionref_new: function(arg0) {
            const ret = PluginActionRef.__wrap(arg0);
            return ret;
        },
        __wbg_pluginactionref_unwrap: function(arg0) {
            const ret = PluginActionRef.__unwrap(arg0);
            return ret;
        },
        __wbg_plugindefinition_new: function(arg0) {
            const ret = PluginDefinition.__wrap(arg0);
            return ret;
        },
        __wbg_pluginforprompt_new: function(arg0) {
            const ret = PluginForPrompt.__wrap(arg0);
            return ret;
        },
        __wbg_pluginsummary_new: function(arg0) {
            const ret = PluginSummary.__wrap(arg0);
            return ret;
        },
        __wbg_process_44c7a14e11e9f69e: function(arg0) {
            const ret = arg0.process;
            return ret;
        },
        __wbg_prototypesetcall_3e05eb9545565046: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_push_6bdbc990be5ac37b: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_put_015a7e88e46a2502: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.put(arg1);
            return ret;
        }, arguments); },
        __wbg_put_4485a4012273f7ef: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.put(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_queueMicrotask_abaf92f0bd4e80a4: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queueMicrotask_df5a6dac26d818f3: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_randomFillSync_6c25eac9869eb53c: function() { return handleError(function (arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments); },
        __wbg_read_316bf844c93a6ccc: function(arg0) {
            const ret = arg0.read();
            return ret;
        },
        __wbg_releaseLock_b12f7593852f4c01: function(arg0) {
            arg0.releaseLock();
        },
        __wbg_request_e114ae47c8953a51: function(arg0) {
            const ret = arg0.request;
            return ret;
        },
        __wbg_require_b4edbdcf3e2a1ef0: function() { return handleError(function () {
            const ret = module.require;
            return ret;
        }, arguments); },
        __wbg_resolve_0a79de24e9d2267b: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_respond_87b5b47cbc9ee0b7: function() { return handleError(function (arg0, arg1) {
            arg0.respond(arg1 >>> 0);
        }, arguments); },
        __wbg_result_452c1006fc727317: function() { return handleError(function (arg0) {
            const ret = arg0.result;
            return ret;
        }, arguments); },
        __wbg_ruleactionview_new: function(arg0) {
            const ret = RuleActionView.__wrap(arg0);
            return ret;
        },
        __wbg_ruleactionview_unwrap: function(arg0) {
            const ret = RuleActionView.__unwrap(arg0);
            return ret;
        },
        __wbg_ruletriggerview_new: function(arg0) {
            const ret = RuleTriggerView.__wrap(arg0);
            return ret;
        },
        __wbg_ruletriggerview_unwrap: function(arg0) {
            const ret = RuleTriggerView.__unwrap(arg0);
            return ret;
        },
        __wbg_ruleview_new: function(arg0) {
            const ret = RuleView.__wrap(arg0);
            return ret;
        },
        __wbg_setTimeout_f757f00851f76c42: function(arg0, arg1) {
            const ret = setTimeout(arg0, arg1);
            return ret;
        },
        __wbg_set_08463b1df38a7e29: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_16a9c1a07b3d38ec: function(arg0, arg1, arg2) {
            arg0.set(getArrayU8FromWasm0(arg1, arg2));
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_6c60b2e8ad0e9383: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_set_auto_increment_37227907cc70bd30: function(arg0, arg1) {
            arg0.autoIncrement = arg1 !== 0;
        },
        __wbg_set_body_a304d09cb50cefbe: function(arg0, arg1) {
            arg0.body = arg1;
        },
        __wbg_set_cache_cc687e2b96e9608c: function(arg0, arg1) {
            arg0.cache = __wbindgen_enum_RequestCache[arg1];
        },
        __wbg_set_credentials_7693e63055f5e838: function(arg0, arg1) {
            arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
        },
        __wbg_set_headers_6ab1105e542834e2: function(arg0, arg1) {
            arg0.headers = arg1;
        },
        __wbg_set_key_path_6edd6ee0e8d75af3: function(arg0, arg1) {
            arg0.keyPath = arg1;
        },
        __wbg_set_method_1971272fe557e972: function(arg0, arg1, arg2) {
            arg0.method = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_mode_d1b643087602281a: function(arg0, arg1) {
            arg0.mode = __wbindgen_enum_RequestMode[arg1];
        },
        __wbg_set_multi_entry_791aace5b9c7b692: function(arg0, arg1) {
            arg0.multiEntry = arg1 !== 0;
        },
        __wbg_set_name_87619993a0cec565: function(arg0, arg1, arg2) {
            arg0.name = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_onabort_6b6df7a41aa97c23: function(arg0, arg1) {
            arg0.onabort = arg1;
        },
        __wbg_set_oncomplete_20fb27150b4ee0d4: function(arg0, arg1) {
            arg0.oncomplete = arg1;
        },
        __wbg_set_onerror_2b7dfa4e6dea4159: function(arg0, arg1) {
            arg0.onerror = arg1;
        },
        __wbg_set_onerror_3c4b5087146b11b6: function(arg0, arg1) {
            arg0.onerror = arg1;
        },
        __wbg_set_onsuccess_f7e5b5cbed5008b1: function(arg0, arg1) {
            arg0.onsuccess = arg1;
        },
        __wbg_set_onupgradeneeded_d7e8e03a1999bf5d: function(arg0, arg1) {
            arg0.onupgradeneeded = arg1;
        },
        __wbg_set_onversionchange_f7822a34e73e2769: function(arg0, arg1) {
            arg0.onversionchange = arg1;
        },
        __wbg_set_signal_8564a226c5c6853c: function(arg0, arg1) {
            arg0.signal = arg1;
        },
        __wbg_set_type_ef754f25329c9096: function(arg0, arg1, arg2) {
            arg0.type = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_unique_e8b9acd5c7c23d7a: function(arg0, arg1) {
            arg0.unique = arg1 !== 0;
        },
        __wbg_settingvalue_new: function(arg0) {
            const ret = SettingValue.__wrap(arg0);
            return ret;
        },
        __wbg_signal_9172c3282bfba2f5: function(arg0) {
            const ret = arg0.signal;
            return ret;
        },
        __wbg_sourcerow_new: function(arg0) {
            const ret = SourceRow.__wrap(arg0);
            return ret;
        },
        __wbg_static_accessor_GLOBAL_THIS_a1248013d790bf5f: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_f2e0f995a21329ff: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_24f78b6d23f286ea: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_59fd959c540fe405: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_status_44ecb0ac1da253f4: function(arg0) {
            const ret = arg0.status;
            return ret;
        },
        __wbg_storeditem_new: function(arg0) {
            const ret = StoredItem.__wrap(arg0);
            return ret;
        },
        __wbg_storeditem_unwrap: function(arg0) {
            const ret = StoredItem.__unwrap(arg0);
            return ret;
        },
        __wbg_stringify_a2c39d991e1bf91d: function() { return handleError(function (arg0) {
            const ret = JSON.stringify(arg0);
            return ret;
        }, arguments); },
        __wbg_subarray_0f98d3fb634508ad: function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        },
        __wbg_syncresult_new: function(arg0) {
            const ret = SyncResult.__wrap(arg0);
            return ret;
        },
        __wbg_syncstaterow_new: function(arg0) {
            const ret = SyncStateRow.__wrap(arg0);
            return ret;
        },
        __wbg_syncstatus_new: function(arg0) {
            const ret = SyncStatus.__wrap(arg0);
            return ret;
        },
        __wbg_target_732d56b173b7e87c: function(arg0) {
            const ret = arg0.target;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_text_43bdfba45e602cf9: function() { return handleError(function (arg0) {
            const ret = arg0.text();
            return ret;
        }, arguments); },
        __wbg_then_00eed3ac0b8e82cb: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_a0c8db0381c8994c: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_timeOrigin_d154221f183b11dc: function(arg0) {
            const ret = arg0.timeOrigin;
            return ret;
        },
        __wbg_toString_891d991e862e1d44: function(arg0) {
            const ret = arg0.toString();
            return ret;
        },
        __wbg_transaction_904b9a3920efb0b5: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.transaction(arg1, __wbindgen_enum_IdbTransactionMode[arg2]);
            return ret;
        }, arguments); },
        __wbg_transaction_9c41d998bb80d12a: function(arg0) {
            const ret = arg0.transaction;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_twitteroauthtokens_new: function(arg0) {
            const ret = TwitterOAuthTokens.__wrap(arg0);
            return ret;
        },
        __wbg_twitterpkcepending_new: function(arg0) {
            const ret = TwitterPkcePending.__wrap(arg0);
            return ret;
        },
        __wbg_twittertoken_new: function(arg0) {
            const ret = TwitterToken.__wrap(arg0);
            return ret;
        },
        __wbg_unique_ae0d9cc0f38a6784: function(arg0) {
            const ret = arg0.unique;
            return ret;
        },
        __wbg_url_95d8a83d33709572: function(arg0, arg1) {
            const ret = arg1.url;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_value_7f6052747ccf940f: function(arg0) {
            const ret = arg0.value;
            return ret;
        },
        __wbg_value_80885804084976f6: function() { return handleError(function (arg0) {
            const ret = arg0.value;
            return ret;
        }, arguments); },
        __wbg_versions_276b2795b1c6a219: function(arg0) {
            const ret = arg0.versions;
            return ret;
        },
        __wbg_view_066479053a371038: function(arg0) {
            const ret = arg0.view;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_warn_2b0a27f629a4bb1e: function(arg0) {
            console.warn(arg0);
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 1277, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h854880fd3e96ac07);
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 1524, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h8f3c5c7ac28fec1b);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("Event")], shim_idx: 1479, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__hc204ba8f82217bf4);
            return ret;
        },
        __wbindgen_cast_0000000000000004: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("IDBVersionChangeEvent")], shim_idx: 9, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h4bbfcc5484e3a01b);
            return ret;
        },
        __wbindgen_cast_0000000000000005: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 1240, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h891a7f3f3f60251d);
            return ret;
        },
        __wbindgen_cast_0000000000000006: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000007: function(arg0) {
            // Cast intrinsic for `I64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000008: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000009: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_000000000000000a: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_cast_000000000000000b: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("ActionRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_000000000000000c: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("CategoryPipelineView")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_000000000000000d: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("ClassificationRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_000000000000000e: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("EventCategoryRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_000000000000000f: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("EventRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000010: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("EventTypeRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000011: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("ItemRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000012: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("OllamaModelTag")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000013: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("PendingApprovalView")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000014: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("PendingItemByCategoryResult")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000015: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("PipelineActionDisplay")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000016: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("PipelineActionRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000017: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("PluginSummary")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000018: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("RuleView")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_0000000000000019: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("SourceRow")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_cast_000000000000001a: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
            wasm.__wbindgen_free(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(NamedExternref("string")) -> Externref`.
            const ret = v0;
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./me_ai_core_bg.js": import0,
    };
}

function wasm_bindgen__convert__closures_____invoke__h891a7f3f3f60251d(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h891a7f3f3f60251d(arg0, arg1);
}

function wasm_bindgen__convert__closures_____invoke__h854880fd3e96ac07(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__h854880fd3e96ac07(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hc204ba8f82217bf4(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__hc204ba8f82217bf4(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h4bbfcc5484e3a01b(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__h4bbfcc5484e3a01b(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h8f3c5c7ac28fec1b(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen__convert__closures_____invoke__h8f3c5c7ac28fec1b(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen__convert__closures_____invoke__h8717c02c493ac132(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures_____invoke__h8717c02c493ac132(arg0, arg1, arg2, arg3);
}


const __wbindgen_enum_IdbCursorDirection = ["next", "nextunique", "prev", "prevunique"];


const __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];


const __wbindgen_enum_ReadableStreamType = ["bytes"];


const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];


const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];


const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];
const ActionMetadataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_actionmetadata_free(ptr >>> 0, 1));
const ActionRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_actionrow_free(ptr >>> 0, 1));
const ApiModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_apimodel_free(ptr >>> 0, 1));
const AuditLogEntryParsedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_auditlogentryparsed_free(ptr >>> 0, 1));
const AuditLogRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_auditlogrow_free(ptr >>> 0, 1));
const AuditLogStepFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_auditlogstep_free(ptr >>> 0, 1));
const AuditStatsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_auditstats_free(ptr >>> 0, 1));
const ClassificationRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_classificationrow_free(ptr >>> 0, 1));
const ContactRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contactrow_free(ptr >>> 0, 1));
const EventCategoryRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eventcategoryrow_free(ptr >>> 0, 1));
const EventCategoryTierFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eventcategorytier_free(ptr >>> 0, 1));
const EventRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eventrow_free(ptr >>> 0, 1));
const EventTypeRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eventtyperow_free(ptr >>> 0, 1));
const GetAuditLogParsedResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_getauditlogparsedresult_free(ptr >>> 0, 1));
const GetAuditLogResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_getauditlogresult_free(ptr >>> 0, 1));
const GetStoredEmailsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_getstoredemailsresult_free(ptr >>> 0, 1));
const GmailProfileFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_gmailprofile_free(ptr >>> 0, 1));
const GoogleTokenFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_googletoken_free(ptr >>> 0, 1));
const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));
const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));
const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));
const ItemRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_itemrow_free(ptr >>> 0, 1));
const LabelRefFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_labelref_free(ptr >>> 0, 1));
const MeAiCoreFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_meaicore_free(ptr >>> 0, 1));
const OllamaConnectionResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ollamaconnectionresult_free(ptr >>> 0, 1));
const OllamaLlmEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ollamallmengine_free(ptr >>> 0, 1));
const OllamaModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ollamamodel_free(ptr >>> 0, 1));
const OllamaModelGroupFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ollamamodelgroup_free(ptr >>> 0, 1));
const OllamaModelTagFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ollamamodeltag_free(ptr >>> 0, 1));
const OnnxModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_onnxmodel_free(ptr >>> 0, 1));
const OnnxModelGroupFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_onnxmodelgroup_free(ptr >>> 0, 1));
const ParsedApiErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_parsedapierror_free(ptr >>> 0, 1));
const PipelineActionDisplayFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pipelineactiondisplay_free(ptr >>> 0, 1));
const PipelineActionRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pipelineactionrow_free(ptr >>> 0, 1));
const PluginActionRefFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pluginactionref_free(ptr >>> 0, 1));
const PluginDefinitionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_plugindefinition_free(ptr >>> 0, 1));
const PluginForPromptFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pluginforprompt_free(ptr >>> 0, 1));
const PluginSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pluginsummary_free(ptr >>> 0, 1));
const RuleActionViewFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ruleactionview_free(ptr >>> 0, 1));
const RuleTriggerViewFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ruletriggerview_free(ptr >>> 0, 1));
const RuleViewFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ruleview_free(ptr >>> 0, 1));
const ScanHistoryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scanhistory_free(ptr >>> 0, 1));
const SettingValueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_settingvalue_free(ptr >>> 0, 1));
const SourceRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sourcerow_free(ptr >>> 0, 1));
const StoredItemFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_storeditem_free(ptr >>> 0, 1));
const SyncResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_syncresult_free(ptr >>> 0, 1));
const SyncStateRowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_syncstaterow_free(ptr >>> 0, 1));
const SyncStatusFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_syncstatus_free(ptr >>> 0, 1));
const TriageClassificationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_triageclassification_free(ptr >>> 0, 1));
const TwitterOAuthLoginStartFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_twitteroauthloginstart_free(ptr >>> 0, 1));
const TwitterOAuthTokensFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_twitteroauthtokens_free(ptr >>> 0, 1));
const TwitterPkcePendingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_twitterpkcepending_free(ptr >>> 0, 1));
const TwitterProfileFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_twitterprofile_free(ptr >>> 0, 1));
const TwitterTokenFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_twittertoken_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('me_ai_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
