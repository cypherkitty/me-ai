/**
 * Lightweight debug logger.
 *
 * OFF by default. Enable via IndexedDB settings (`debugLogging: true` on `SettingValue`, then `saveSettings`), or call `setDebugLoggingEnabled(true)` from the console after core init.
 *
 * `refreshDebugFromSettings()` runs after `initCore()` in `main.ts`.
 */

import { getCore } from "./store/core-store.js";

let debugLoggingEnabled = false;

export async function refreshDebugFromSettings(): Promise<void> {
  try {
    const sv = await getCore().loadSettings();
    debugLoggingEnabled = sv.debugLogging === true;
  } catch {
    debugLoggingEnabled = false;
  }
}

/**
 * For tests or console: override without persisting.
 * @public
 */
export function setDebugLoggingEnabled(v: boolean): void {
  debugLoggingEnabled = v;
}

function debug(...args: unknown[]): void {
  if (debugLoggingEnabled) console.log("[debug]", ...args);
}

/**
 * Svelte lifecycle helper. Call inside onMount:
 *   onMount(() => mountLog("ComponentName"));
 *
 * Logs mount and returns a destroy callback that logs unmount.
 */
export function mountLog(name: string): () => void {
  debug(`[MOUNT] ${name}`);
  return () => debug(`[DESTROY] ${name}`);
}
