/**
 * Lightweight debug logger.
 *
 * OFF by default. Enable in the browser console:
 *   localStorage.setItem("debug", "true")
 *
 * Disable:
 *   localStorage.removeItem("debug")
 *
 * Then reload the page.
 */

const enabled = typeof localStorage !== "undefined" && localStorage.getItem("debug") === "true";

export function debug(...args) {
  if (enabled) console.log("[debug]", ...args);
}

/**
 * Svelte lifecycle helper. Call inside onMount:
 *   onMount(() => mountLog("ComponentName"));
 *
 * Logs mount and returns a destroy callback that logs unmount.
 */
export function mountLog(name) {
  debug(`[MOUNT] ${name}`);
  return () => debug(`[DESTROY] ${name}`);
}
