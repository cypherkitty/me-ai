/**
 * Thin wrapper around the Gmail REST API.
 * All functions take an OAuth access_token as the first argument.
 * No SDK needed — just fetch() with Bearer token.
 */

const BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

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

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function api<T = unknown>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string; errors?: Array<{ reason?: string }> };
    };
    const message = body.error?.message || `Gmail API error: ${res.status}`;
    const code = body.error?.errors?.[0]?.reason;
    throw new GmailApiError(message, res.status, code);
  }
  return res.json() as Promise<T>;
}

export function getProfile(token: string): Promise<Record<string, unknown>> {
  return api(token, "/profile");
}

export interface ListMessagesOptions {
  maxResults?: number;
  pageToken?: string;
  q?: string;
}

export function listMessages(
  token: string,
  { maxResults = 20, pageToken, q }: ListMessagesOptions = {}
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  params.set("maxResults", String(maxResults));
  if (pageToken) params.set("pageToken", pageToken);
  if (q) params.set("q", q);
  return api(token, `/messages?${params}`);
}

export function getMessage(
  token: string,
  messageId: string,
  format: string = "full"
): Promise<Record<string, unknown>> {
  return api(token, `/messages/${messageId}?format=${format}`);
}

export async function getMessagesBatch(
  token: string,
  messageIds: string[],
  batchSize: number = 8
): Promise<Record<string, unknown>[]> {
  const results: Record<string, unknown>[] = [];
  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const fetched = await Promise.all(
      batch.map((id) => getMessage(token, id))
    );
    results.push(...fetched);
  }
  return results;
}

export interface ListHistoryOptions {
  startHistoryId: string;
  pageToken?: string;
  maxResults?: number;
}

export function listHistory(
  token: string,
  { startHistoryId, pageToken, maxResults = 500 }: ListHistoryOptions
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  params.set("startHistoryId", startHistoryId);
  params.set("maxResults", String(maxResults));
  params.append("historyTypes", "messageAdded");
  params.append("historyTypes", "messageDeleted");
  if (pageToken) params.set("pageToken", pageToken);
  return api(token, `/history?${params}`);
}

export function getHeader(
  message: Record<string, unknown>,
  name: string
): string {
  const headers = (message?.payload as Record<string, unknown>)?.headers as Array<{ name: string; value: string }> | undefined || [];
  const lower = name.toLowerCase();
  const h = headers.find((x) => x.name.toLowerCase() === lower);
  return h?.value || "";
}

function decodeBase64Url(data: string): string {
  let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface Part {
  mimeType?: string;
  body?: { data?: string };
  parts?: Part[];
}

function findPart(parts: Part[], mimeType: string): Part | undefined {
  for (const part of parts) {
    if (part.mimeType === mimeType) return part;
    if (part.parts) {
      const found = findPart(part.parts, mimeType);
      if (found) return found;
    }
  }
  return undefined;
}

function stripHtml(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    for (const el of doc.querySelectorAll("style, script")) el.remove();
    return (doc.body?.textContent || "").replace(/\s+/g, " ").trim();
  } catch {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
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

export function getBody(message: Record<string, unknown>): string {
  const payload = message?.payload as Record<string, unknown> | undefined;
  if (!payload) return "";

  const body = payload.body as { data?: string } | undefined;
  if (body?.data) return decodeBase64Url(body.data);

  const parts = (payload.parts as Part[] | undefined) || [];
  const plain = findPart(parts, "text/plain");
  if (plain?.body?.data) return decodeBase64Url(plain.body.data);

  const html = findPart(parts, "text/html");
  if (html?.body?.data) return stripHtml(decodeBase64Url(html.body.data));

  return "(no body)";
}

export function getHtmlBody(message: Record<string, unknown>): string | null {
  const payload = message?.payload as Record<string, unknown> | undefined;
  if (!payload) return null;

  if (payload.mimeType === "text/html") {
    const body = payload.body as { data?: string } | undefined;
    if (body?.data) return decodeBase64Url(body.data);
  }

  const parts = (payload.parts as Part[] | undefined) || [];
  const html = findPart(parts, "text/html");
  if (html?.body?.data) return decodeBase64Url(html.body.data);

  return null;
}
