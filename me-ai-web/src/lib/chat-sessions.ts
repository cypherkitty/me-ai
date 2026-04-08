import {
  makeChatEntityId,
  fallbackChatTitleFromUserContent,
  firstUserMessageContentForTitle,
  normalizeGeneratedChatTitle,
  sessionSubtitleFromMessagesJson,
} from "me-ai-core";

export interface PersistedChatMessage {
  id?: string;
  role?: string;
  type?: string;
  content?: string;
  createdAt?: number;
  [key: string]: unknown;
}

export interface ChatSessionRecord {
  id: string;
  title: string | null;
  titleStatus: "idle" | "pending" | "ready";
  titleSource?: "model" | "manual" | null;
  createdAt: number;
  updatedAt: number;
  messages: PersistedChatMessage[];
}

interface ChatSessionsSnapshot {
  version: 1;
  activeChatId: string | null;
  sessions: ChatSessionRecord[];
}

const STORAGE_KEY = "me_ai_chat_sessions_v1";

function safeNow(): number {
  return Date.now();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createChatSession(now = safeNow()): ChatSessionRecord {
  return {
    id: makeChatEntityId("chat"),
    title: null,
    titleStatus: "idle",
    titleSource: null,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function normalizeMessage(
  message: PersistedChatMessage,
  fallbackTime = safeNow()
): PersistedChatMessage {
  const createdAt =
    typeof message.createdAt === "number" && Number.isFinite(message.createdAt)
      ? message.createdAt
      : fallbackTime;

  return {
    ...message,
    id:
      typeof message.id === "string" && message.id.length > 0
        ? message.id
        : makeChatEntityId("msg"),
    createdAt,
  };
}

export function normalizeSession(session: unknown, fallbackTime = safeNow()): ChatSessionRecord {
  const raw = isObject(session) ? session : {};
  const createdAt =
    typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt)
      ? raw.createdAt
      : fallbackTime;
  const messages = Array.isArray(raw.messages)
    ? raw.messages.map((msg, index) =>
        normalizeMessage(isObject(msg) ? msg : {}, createdAt + index)
      )
    : [];
  const updatedAt =
    typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt)
      ? raw.updatedAt
      : (messages[messages.length - 1]?.createdAt ?? createdAt);
  const titleStatus =
    raw.titleStatus === "pending" || raw.titleStatus === "ready" || raw.titleStatus === "idle"
      ? raw.titleStatus
      : raw.title
        ? "ready"
        : messages.some((msg) => msg.role === "user")
          ? "pending"
          : "idle";

  return {
    id: typeof raw.id === "string" && raw.id.length > 0 ? raw.id : makeChatEntityId("chat"),
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : null,
    titleStatus,
    titleSource:
      raw.titleSource === "manual" || raw.titleSource === "model" ? raw.titleSource : null,
    createdAt,
    updatedAt,
    messages,
  };
}

export function loadChatSessions(): { activeChatId: string | null; sessions: ChatSessionRecord[] } {
  if (typeof localStorage === "undefined") {
    const session = createChatSession();
    return { activeChatId: session.id, sessions: [session] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const session = createChatSession();
      return { activeChatId: session.id, sessions: [session] };
    }

    const parsed = JSON.parse(raw) as Partial<ChatSessionsSnapshot>;
    const sessions = Array.isArray(parsed.sessions)
      ? parsed.sessions.map((session, index) => normalizeSession(session, safeNow() + index))
      : [];

    if (sessions.length === 0) {
      const session = createChatSession();
      return { activeChatId: session.id, sessions: [session] };
    }

    const activeChatId =
      typeof parsed.activeChatId === "string" &&
      sessions.some((session) => session.id === parsed.activeChatId)
        ? parsed.activeChatId
        : sessions[0].id;

    return { activeChatId, sessions };
  } catch {
    const session = createChatSession();
    return { activeChatId: session.id, sessions: [session] };
  }
}

export function saveChatSessions(activeChatId: string | null, sessions: ChatSessionRecord[]): void {
  if (typeof localStorage === "undefined") return;

  const snapshot: ChatSessionsSnapshot = {
    version: 1,
    activeChatId,
    sessions,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSavedChatSessions(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function fallbackChatTitle(messages: PersistedChatMessage[]): string | null {
  const content = firstUserMessageContentForTitle(JSON.stringify(messages));
  if (content == null) return null;
  return fallbackChatTitleFromUserContent(content) ?? null;
}

export function normalizeGeneratedTitle(raw: string, messages: PersistedChatMessage[]): string {
  return normalizeGeneratedChatTitle(raw, JSON.stringify(messages));
}

export function getSessionSubtitle(messages: PersistedChatMessage[]): string {
  return sessionSubtitleFromMessagesJson(JSON.stringify(messages));
}
