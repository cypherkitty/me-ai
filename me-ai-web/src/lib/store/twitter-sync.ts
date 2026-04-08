/**
 * Twitter sync — thin wrapper over me-ai-core WASM methods.
 * All orchestration logic lives in Rust (sync/twitter.rs).
 */

import { getCore } from "./core-store.js";
import type { SyncProgress } from "$lib/types";

export interface TwitterSyncStatus {
  synced: boolean;
  totalItems: number;
  lastSyncAt: number | null;
  hasMore: boolean;
}

interface SyncTwitterOptions {
  limit?: number;
  onProgress?: (p: SyncProgress) => void;
  signal?: AbortSignal;
}

export async function syncTwitter(
  token: string,
  { limit = 50, onProgress, signal }: SyncTwitterOptions = {}
) {
  return getCore().syncTwitter(token, limit, onProgress, signal);
}

export async function syncTwitterMore(
  token: string,
  { limit = 50, onProgress, signal }: SyncTwitterOptions = {}
) {
  return getCore().syncTwitterMore(token, limit, onProgress, signal);
}

export async function clearTwitterData(): Promise<void> {
  await getCore().clearTwitterData();
}

export async function getTwitterSyncStatus(): Promise<TwitterSyncStatus> {
  return (await getCore().getTwitterSyncStatus()) as TwitterSyncStatus;
}
