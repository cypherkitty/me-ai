/**
 * Thin wrapper around the Gmail REST API — delegates all HTTP to me-ai-core (Rust/WASM).
 */

import { getCore } from "./store/core-store.js";

function requireCore() {
  return getCore();
}

export class GmailApiError extends Error {
  status: number;
  code: string | null;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "GmailApiError";
    this.status = status;
    this.code = code ?? null;
  }
}

interface ListMessagesOptions {
  maxResults?: number;
  pageToken?: string;
  q?: string;
}

interface ListHistoryOptions {
  startHistoryId: string;
  pageToken?: string;
  maxResults?: number;
}

export function getProfile(token: string): Promise<Record<string, unknown>> {
  return requireCore().getGmailProfile(token) as unknown as Promise<Record<string, unknown>>;
}

export function listMessages(
  token: string,
  { maxResults = 20, pageToken, q }: ListMessagesOptions = {}
): Promise<Record<string, unknown>> {
  return requireCore().listGmailMessages(token, maxResults, pageToken ?? null, q ?? null) as unknown as Promise<Record<string, unknown>>;
}

export function getMessage(
  token: string,
  messageId: string,
  format: string = "full"
): Promise<Record<string, unknown>> {
  return requireCore().getGmailMessage(token, messageId, format) as unknown as Promise<Record<string, unknown>>;
}

export function listHistory(
  token: string,
  { startHistoryId, pageToken, maxResults = 500 }: ListHistoryOptions
): Promise<Record<string, unknown>> {
  return requireCore().listGmailHistory(token, startHistoryId, pageToken ?? null, maxResults) as unknown as Promise<Record<string, unknown>>;
}

export function getHeader(
  message: Record<string, unknown>,
  name: string
): string {
  return requireCore().getGmailHeader(JSON.stringify(message), name);
}

export function getBody(message: Record<string, unknown>): string {
  return requireCore().parseGmailBody(JSON.stringify(message));
}

export function getHtmlBody(message: Record<string, unknown>): string | null {
  return requireCore().parseGmailHtmlBody(JSON.stringify(message)) ?? null;
}
