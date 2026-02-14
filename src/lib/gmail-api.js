/**
 * Thin wrapper around the Gmail REST API.
 * All functions take an OAuth access_token as the first argument.
 * No SDK needed — just fetch() with Bearer token.
 */

const BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function api(token, path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error?.message || `Gmail API error: ${res.status}`
    );
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

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
