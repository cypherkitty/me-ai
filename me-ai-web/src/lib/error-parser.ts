import { GmailApiError } from "./core.js";
import { getCore } from "./store/core-store.js";
import type { ParsedError } from "./core.js";

/**
 * Parses raw errors into user-friendly structured guidance.
 * Delegates to the Rust core's parseApiError function.
 * Accepts both Error objects (preferred) and plain strings.
 */
export function parseError(rawError: Error | string | null | undefined): ParsedError {
  const err =
    typeof rawError === "object" && rawError !== null ? rawError : null;
  const msg = (err as Error)?.message || String(rawError || "");
  const status = err instanceof GmailApiError ? err.status : 0;

  const result = getCore().parseApiError(msg, status);

  return {
    title: result.title,
    description: result.description,
    fix: result.fix || null,
    link: result.link_url ? { url: result.link_url, label: result.link_label } : undefined,
    action: result.action || undefined,
  };
}
