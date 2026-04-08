/**
 * Shared primitives for Gmail and Twitter sync adapters.
 *
 * Both adapters need the same sync-state persistence, abort check, and
 * bulk-upsert logic. Keeping a single implementation here prevents the two
 * files from drifting apart in error-handling behaviour.
 */

import { getCore } from "./core-store.js";
import { toJson } from "./db.js";
import type { SyncState, StoredItem } from "$lib/types";

// ── Sync state ───────────────────────────────────────────────────────

export async function getSyncState(sourceType: string): Promise<SyncState | null> {
  const r = await getCore().getSyncState(sourceType);
  if (r == null) return null;
  const row = r as unknown as Record<string, unknown>;
  return {
    sourceType: row.sourceType as string,
    historyId: row.historyId as string,
    lastSyncAt: row.lastSyncAt != null ? Number(row.lastSyncAt) : null,
    totalItems: row.totalItems != null ? Number(row.totalItems) : 0,
    oldestPageToken: (row.oldestPageToken as string) ?? "",
  };
}

export async function writeSyncState({
  sourceType,
  historyId,
  lastSyncAt,
  totalItems,
  oldestPageToken,
}: SyncState): Promise<void> {
  await getCore().upsertSyncState(
    sourceType,
    historyId,
    lastSyncAt ?? 0,
    totalItems,
    oldestPageToken ?? ""
  );
}

// ── Bulk upsert ──────────────────────────────────────────────────────

export async function bulkUpsertItems(items: StoredItem[]): Promise<void> {
  if (!items.length) return;
  const rows = items.map((item) => ({
    id: item.id,
    sourceType: item.sourceType,
    sourceId: item.sourceId ?? undefined,
    threadKey: item.threadKey ?? undefined,
    type: item.type ?? undefined,
    from: item.from ?? undefined,
    to: item.to ?? undefined,
    cc: item.cc ?? undefined,
    subject: item.subject ?? undefined,
    snippet: item.snippet ?? undefined,
    body: item.body ?? undefined,
    htmlBody: item.htmlBody ?? undefined,
    date: item.date ?? undefined,
    labels: toJson(item.labels),
    messageId: item.messageId ?? undefined,
    inReplyTo: item.inReplyTo ?? undefined,
    references: item.references ?? undefined,
    raw: toJson(item.raw),
    syncedAt: item.syncedAt ?? undefined,
  }));
  await getCore().insertItemsBatch(rows);
}

// ── Abort guard ──────────────────────────────────────────────────────

export function throwIfAborted(signal?: AbortSignal, message = "Sync was cancelled"): void {
  if (signal?.aborted) throw new DOMException(message, "AbortError");
}
