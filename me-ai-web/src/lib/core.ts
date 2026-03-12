/**
 * me-ai-core (Rust WASM) — wasm-pack style: import init + exports from the pkg, call init once.
 * No getCore(); use the exported WASM functions directly after initCore() has run.
 */

import initDefault, {
  init as wasmInit,
  createSchemaAndMigrations,
  getTableCount,
  clearAllData,
} from "me-ai-core";

export {
  getEventTypes,
  getEventCategories,
  getSources,
  getActions,
  getItemsCountGmail,
  getContactsCount,
  getItemsDateMin,
  getItemsDateMax,
  getEmailClassificationsCount,
  getSetting,
  setSetting,
  removeSetting,
  getTableCount,
  clearAllData,
  getAuditLog,
  getAuditStats,
  clearAuditLog,
  logAuditExecution,
  syncAfterAuditExecution,
  getCategoryPipelineActions,
  getTypePipelineActions,
  getEventTypeCategory,
  getEventCategoryPolicy,
  updateCategoryPipeline,
  updateCategoryPolicy,
  updateEventTypeCategory,
  clearEventTypeCategory,
  deleteEventType,
  setSourceEnabled,
  setPluginEnabled,
  upsertEventType,
  deleteSyncState,
  deleteItemsBySource,
  clearContacts,
  clearItemsSyncContacts,
  getItemsCountBySource,
  getSyncState,
  upsertSyncState,
  insertItemsBatch,
  insertSyncStateBatch,
  insertContactsBatch,
  deleteItemsByIds,
  getContactByEmail,
  upsertContact,
  getNewestSourceId,
  getPlugins,
  getRules,
  getRule,
  saveRule,
  deleteRule,
  getEvents,
  updateEventStatus,
  clearEvents,
  insertEvent,
  getItemById,
  getItemsGmailByDateDesc,
  getItemsBySource,
  getEmailClassifications,
  updateEmailClassificationStatus,
  clearEmailClassifications,
  deleteEmailClassification,
  deleteEmailClassificationsByAction,
  putEmailClassification,
} from "me-ai-core";

let coreInitFailed = false;

/**
 * Initialize the core: load WASM (default export), call init(), then createSchemaAndMigrations().
 * Call once at app startup. After this, use the exported WASM functions directly.
 * We pass the WASM URL explicitly so it loads from /wasm/ (served by Vite middleware and static copy).
 */
export async function initCore(): Promise<void> {
  try {
    const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
    const wasmUrl = `${base}wasm/me_ai_core_bg.wasm`;
    await initDefault({ module_or_path: wasmUrl });
    wasmInit();
    await createSchemaAndMigrations();
  } catch (e) {
    coreInitFailed = true;
    throw e;
  }
}

/**
 * True if core init has already failed (e.g. IndexedDB unavailable). For UI/guards only.
 */
export function isCoreInitFailed(): boolean {
  return coreInitFailed;
}

export async function getStorageStats(): Promise<{
  supported: boolean;
  usageBytes: number;
  tables: Record<string, number>;
}> {
  const tables: Record<string, number> = {};
  for (const tbl of [
    "sm_rules",
    "sm_rule_triggers",
    "sm_rule_commands",
    "sm_events",
    "items",
    "emailClassifications",
    "contacts",
    "settings",
  ]) {
    try {
      tables[tbl] = Number(await getTableCount(tbl)) ?? 0;
    } catch {
      tables[tbl] = 0;
    }
  }
  let usageBytes = 0;
  const supported =
    typeof navigator !== "undefined" &&
    "storage" in navigator &&
    "estimate" in navigator.storage;
  if (supported) {
    try {
      const est = await navigator.storage.estimate();
      usageBytes = est.usage ?? 0;
    } catch {
      /* ignore */
    }
  }
  return { supported, usageBytes, tables };
}

/** @deprecated Use getStorageStats. */
export async function getOpfsStats(): Promise<{
  supported: boolean;
  fileBytes: number;
  tables: Record<string, number>;
}> {
  const s = await getStorageStats();
  return { supported: s.supported, fileBytes: s.usageBytes, tables: s.tables };
}

export async function clearAllDataAndCheckpoint(): Promise<void> {
  await clearAllData();
}
