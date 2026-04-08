/**
 * Twitter sync — thin wrapper over me-ai-core WASM methods.
 * All orchestration logic lives in Rust (sync/twitter.rs).
 */

import { getCore } from "./core-store.js";
import type { SyncProgress, SyncStatus } from "$lib/types";

export type TwitterSyncStatus = SyncStatus;

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
  return getCore().getTwitterSyncStatus();
}
