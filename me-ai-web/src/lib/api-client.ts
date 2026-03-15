/**
 * Cloud API client — DEPRECATED.
 *
 * Streaming and connection testing have moved to Rust WASM core.
 * This module is retained only for the ApiProvider type re-export
 * (now canonical in api-engine.ts) and getApiKey helper.
 */

import { getSetting } from "./store/settings.js";

export type ApiProvider = "openai" | "anthropic" | "google" | "xai";

/**
 * Get the API key for a specific provider from settings.
 */
export async function getApiKey(provider: ApiProvider): Promise<string | null> {
  return await getSetting<string>(`${provider}ApiKey`);
}
