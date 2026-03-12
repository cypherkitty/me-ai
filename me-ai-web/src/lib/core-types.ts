/**
 * Type for the me-ai-core WASM module (wasm-pack --target web).
 * default = init(WASM), then init(adapter) and named exports are the Rust API.
 */

export interface CoreModule {
  /** Load and instantiate the WASM module (wasm-pack default export). Call once before init(). */
  default: (wasmSource?: RequestInfo | URL | Response | BufferSource | WebAssembly.Module) => Promise<void>;
  /** Set the JS DB adapter so Rust can run SQL via query/exec. Call after default(). */
  init: (adapter: { query: (sql: string, params: unknown[]) => Promise<Record<string, unknown>[]>; exec: (sql: string, params: unknown[]) => Promise<void> }) => void;

  getEventTypes: () => Promise<unknown>;
  getEventCategories: () => Promise<unknown>;
  getSources: () => Promise<unknown>;
  getActions: () => Promise<unknown>;
  getItemsCountGmail: () => Promise<unknown>;
  getContactsCount: () => Promise<unknown>;
  getItemsDateMin: () => Promise<unknown>;
  getItemsDateMax: () => Promise<unknown>;
  getEmailClassificationsCount: () => Promise<unknown>;
  createSchemaAndMigrations: () => Promise<void>;
  getItemsCount: () => Promise<number>;
  getTableCount: (table: string) => Promise<number>;
  clearAllData: () => Promise<void>;
  getSetting: (key: string) => Promise<string | null | undefined>;
  setSetting: (key: string, value: string) => Promise<void>;
  removeSetting: (key: string) => Promise<void>;

  logAuditExecution: (id: string, emailId: string, subject: string, from: string, eventType: string, executedAt: number, success: boolean, error: string, stepsJson: string) => Promise<void>;
  syncAfterAuditExecution: (emailId: string, deleteItem: boolean) => Promise<void>;
  getAuditLog: (limit: number, offset: number, failuresOnly: boolean) => Promise<{ entries: unknown[]; total: number }>;
  clearAuditLog: () => Promise<void>;

  deleteSyncState: (sourceType: string) => Promise<void>;
  deleteItemsBySource: (sourceType: string) => Promise<void>;
  clearItemsSyncContacts: () => Promise<void>;
  getItemsCountBySource: (sourceType: string) => Promise<number>;
  getSyncState: (sourceType: string) => Promise<Record<string, unknown> | null>;
  upsertSyncState: (sourceType: string, historyId: string, lastSyncAt: number, totalItems: number, oldestPageToken: string) => Promise<void>;
  insertItemsBatch: (rows: unknown[]) => Promise<void>;
  insertSyncStateBatch: (rows: unknown[]) => Promise<void>;
  insertContactsBatch: (rows: unknown[]) => Promise<void>;
  deleteItemsByIds: (ids: string[]) => Promise<void>;
  getContactByEmail: (email: string) => Promise<Record<string, unknown> | null>;
  upsertContact: (email: string, name: string, firstSeen: number, lastSeen: number) => Promise<void>;
  getNewestSourceId: (sourceType: string) => Promise<string | null>;
}
