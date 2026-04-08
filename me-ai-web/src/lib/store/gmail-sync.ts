/**
 * Gmail sync — thin wrapper over me-ai-core WASM methods.
 * All orchestration logic lives in Rust (sync/gmail.rs).
 */

import { getCore } from "./core-store.js";
import type { SyncProgress } from "$lib/types";

export interface GmailSyncStatus {
  synced: boolean;
  totalItems: number;
  lastSyncAt: number | null;
  hasMore: boolean;
  historyId?: string;
}

interface SyncGmailOptions {
  limit?: number;
  onProgress?: (p: SyncProgress) => void;
  signal?: AbortSignal;
}

export async function syncGmail(
  token: string,
  { limit = 50, onProgress, signal }: SyncGmailOptions = {}
) {
  return getCore().syncGmail(token, limit, onProgress, signal);
}

export async function syncGmailMore(
  token: string,
  { limit = 50, onProgress, signal }: SyncGmailOptions = {}
) {
  return getCore().syncGmailMore(token, limit, onProgress, signal);
}

export async function clearGmailData(): Promise<void> {
  await getCore().clearGmailData();
}

export async function getGmailSyncStatus(): Promise<GmailSyncStatus> {
  return (await getCore().getGmailSyncStatus()) as GmailSyncStatus;
}
