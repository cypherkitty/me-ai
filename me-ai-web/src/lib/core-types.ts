/**
 * Type for the me-ai-core WASM module (wasm-pack --target web).
 * default = init(WASM), then init() (no adapter). Persistence is IndexedDB via Rexie in Rust.
 */

export interface CoreModule {
  /** Load and instantiate the WASM module (wasm-pack default export). Call once before init(). */
  default: (wasmSource?: RequestInfo | URL | Response | BufferSource | WebAssembly.Module) => Promise<void>;
  /** No-op init (no adapter). Rexie opens IndexedDB on first use. */
  init: () => void;

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
  getAuditStats: () => Promise<{ completed: number; failed: number }>;

  getCategoryPipelineActions: (categoryName: string) => Promise<Array<{ plugin_id: string; command_id: string; action_idx: number }>>;
  getTypePipelineActions: (typeName: string) => Promise<Array<{ plugin_id: string; command_id: string; action_idx: number }>>;
  getEventTypeCategory: (typeName: string) => Promise<string | null>;
  getEventCategoryPolicy: (categoryName: string) => Promise<string | null>;
  updateCategoryPipeline: (categoryName: string, actions: Array<{ pluginId: string; commandId: string }>) => Promise<void>;
  updateCategoryPolicy: (categoryName: string, policy: string) => Promise<void>;
  updateEventTypeCategory: (typeName: string, categoryName: string) => Promise<void>;
  clearEventTypeCategory: (typeName: string) => Promise<void>;
  deleteEventType: (typeName: string) => Promise<void>;
  setSourceEnabled: (name: string, enabled: boolean) => Promise<void>;
  setPluginEnabled: (name: string, enabled: boolean) => Promise<void>;
  upsertEventType: (name: string, label: string, categoryName: string, autoCreated: boolean) => Promise<void>;

  deleteSyncState: (sourceType: string) => Promise<void>;
  deleteItemsBySource: (sourceType: string) => Promise<void>;
  clearContacts: () => Promise<void>;
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
  getPlugins: () => Promise<unknown[]>;
  getPluginRegistry: () => unknown;
  getAvailableActions: (source: string) => unknown;
  getRequiredScopes: (actionId: string, source: string) => unknown;
  resolvePluginId: (source: string) => string;
  getPluginsForPrompt: () => unknown;
  executePipeline: (
    actions: unknown[],
    event: unknown,
    accessToken: string,
    onProgress?: (progress: unknown) => void,
    config?: unknown
  ) => Promise<unknown>;
  executePipelineBatch: (
    actions: unknown[],
    events: unknown[],
    accessToken: string,
    onProgress?: (progress: unknown) => void,
    config?: unknown
  ) => Promise<unknown>;
  getRules: () => Promise<unknown[]>;
  getRule: (id: string) => Promise<unknown | null>;
  saveRule: (payload: unknown) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  getEvents: (limit: number, offset: number) => Promise<unknown[]>;
  updateEventStatus: (id: string, status: string) => Promise<void>;
  clearEvents: () => Promise<void>;
  insertEvent: (
    id: string,
    content: string | null,
    subject: string | null,
    sender: string | null,
    timestamp: number,
    status: string | null,
    eventType: string | null,
    eventCategory: string | null,
    sourceName: string | null,
    ruleId: string | null,
    actionsTaken: string | null,
    output: string | null
  ) => Promise<void>;

  getItemById: (id: string) => Promise<Record<string, unknown> | null>;
  getEmailClassifications: (actionFilter?: string | null, limit?: number) => Promise<unknown[]>;
  updateEmailClassificationStatus: (emailId: string, status: string) => Promise<void>;
  clearEmailClassifications: () => Promise<void>;
  deleteEmailClassification: (emailId: string) => Promise<void>;
  deleteEmailClassificationsByAction: (action: string) => Promise<void>;
  getApiModels: () => unknown[];
  getApiModelInfo: (modelId: string) => unknown | null;
  testApiConnection: (provider: string, apiKey: string) => Promise<boolean>;
  streamChat: (
    provider: string,
    modelName: string,
    messages: Array<{ role: string; content: string }>,
    options: { temperature?: number; maxTokens?: number; reasoningEffort?: string },
    onToken: (payload: { content: string; done: boolean; inputTokens: number; outputTokens: number }) => void
  ) => Promise<void>;

  getItemsGmailByDateDesc: (limit: number) => Promise<unknown[]>;
  getItemsBySource: (sourceType: string, limit: number, offset: number) => Promise<unknown[]>;
  putEmailClassification: (
    emailId: string,
    action: string | null,
    category: string | null,
    reason: string | null,
    summary: string | null,
    tags: string | null,
    subject: string | null,
    from: string | null,
    date: number | null,
    scannedAt: number | null,
    status: string | null
  ) => Promise<void>;
}
