/**
 * Thin wrapper around the Gmail REST API.
 * All functions take an OAuth access_token as the first argument.
 * No SDK needed — just fetch() with Bearer token.
 */

const BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

/**
 * Typed error for Gmail API failures.
 * Carries the HTTP status code so callers can match on it
 * instead of fragile string matching on error messages.
 */
export class GmailApiError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} status - HTTP status code (e.g. 401, 404, 429)
   * @param {string} [code] - Optional error code from the API response body
   */
  constructor(message, status, code) {
    super(message);
    this.name = "GmailApiError";
    this.status = status;
    this.code = code || null;
  }
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function api(token, path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.error?.message || `Gmail API error: ${res.status}`;
    const code = body.error?.errors?.[0]?.reason || undefined;
    throw new GmailApiError(message, res.status, code);
  }
  return res.json();
}

// ── Public API ──────────────────────────────────────────────────────

/** Get user profile: emailAddress, messagesTotal, threadsTotal, historyId */
export function getProfile(token) {
  return api(token, "/profile");
}

/**
 * List message IDs (with optional search query).
 * Returns { messages: [{id, threadId}], nextPageToken, resultSizeEstimate }
 */
export function listMessages(token, { maxResults = 20, pageToken, q } = {}) {
  const params = new URLSearchParams();
  params.set("maxResults", String(maxResults));
  if (pageToken) params.set("pageToken", pageToken);
  if (q) params.set("q", q);
  return api(token, `/messages?${params}`);
}

/**
 * Get a single message by ID (format: full | metadata | minimal).
 * Returns the full Message resource.
 */
export function getMessage(token, messageId, format = "full") {
  return api(token, `/messages/${messageId}?format=${format}`);
}

/**
 * Fetch full details for an array of message IDs, in parallel batches.
 * Returns an array of Message resources in the same order.
 */
export async function getMessagesBatch(token, messageIds, batchSize = 8) {
  const results = [];
  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const fetched = await Promise.all(
      batch.map((id) => getMessage(token, id))
    );
    results.push(...fetched);
  }
  return results;
}

/**
 * List history events since a given historyId.
 * Used for incremental sync — returns added/deleted messages since last sync.
 * Returns { history: [...], historyId, nextPageToken }
 */
export function listHistory(
  token,
  { startHistoryId, pageToken, maxResults = 500 } = {}
) {
  const params = new URLSearchParams();
  params.set("startHistoryId", startHistoryId);
  params.set("maxResults", String(maxResults));
  // Gmail API requires historyTypes as repeated params, not comma-separated
  params.append("historyTypes", "messageAdded");
  params.append("historyTypes", "messageDeleted");
  if (pageToken) params.set("pageToken", pageToken);
  return api(token, `/history?${params}`);
}

// ── Helpers for parsing Gmail Message objects ───────────────────────

/** Extract a header value by name (case-insensitive) */
export function getHeader(message, name) {
  const headers = message?.payload?.headers || [];
  const lower = name.toLowerCase();
  const h = headers.find((h) => h.name.toLowerCase() === lower);
  return h?.value || "";
}

/** Decode base64url-encoded string to UTF-8 text */
function decodeBase64Url(data) {
  let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  // Restore padding — Gmail payloads are commonly unpadded base64url
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Extract the text body from a Message resource.
 * Prefers text/plain, falls back to text/html (stripped of tags).
 */
export function getBody(message) {
  const payload = message?.payload;
  if (!payload) return "";

  // Simple (non-multipart) message
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Multipart: find the best text part
  const parts = payload.parts || [];
  const plain = findPart(parts, "text/plain");
  if (plain?.body?.data) return decodeBase64Url(plain.body.data);

  const html = findPart(parts, "text/html");
  if (html?.body?.data) {
    const raw = decodeBase64Url(html.body.data);
    return stripHtml(raw);
  }

  return "(no body)";
}

/**
 * Extract raw HTML body from a Message resource.
 * Returns the HTML string if available, or null if only plain text.
 */
export function getHtmlBody(message) {
  const payload = message?.payload;
  if (!payload) return null;

  // Simple (non-multipart) message — check if it's HTML
  if (payload.mimeType === "text/html" && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Multipart: find HTML part
  const parts = payload.parts || [];
  const html = findPart(parts, "text/html");
  if (html?.body?.data) return decodeBase64Url(html.body.data);

  return null;
}

function findPart(parts, mimeType) {
  for (const part of parts) {
    if (part.mimeType === mimeType) return part;
    if (part.parts) {
      const found = findPart(part.parts, mimeType);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Convert HTML to readable plain text.
 * Uses the browser's DOMParser to correctly decode ALL HTML entities
 * (named like &amp; &quot; and numeric like &#x27; &#39;).
 */
function stripHtml(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Remove <style> and <script> content before extracting text
    for (const el of doc.querySelectorAll("style, script")) el.remove();
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  } catch {
    // Fallback: basic regex strip if DOMParser is unavailable (e.g. worker)
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }
}
