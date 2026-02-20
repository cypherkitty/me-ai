/**
 * Gmail Plugin
 *
 * Executes actions on Gmail messages using the Gmail API.
 * Supports: mark read/unread, star, trash, delete, apply labels, etc.
 */

import { BasePlugin } from "./base-plugin.js";

const BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

/**
 * Gmail API labels (system labels)
 */
export const GMAIL_LABELS = {
  INBOX: "INBOX",
  UNREAD: "UNREAD",
  STARRED: "STARRED",
  SPAM: "SPAM",
  TRASH: "TRASH",
  SENT: "SENT",
  DRAFT: "DRAFT",
  IMPORTANT: "IMPORTANT",
};

/**
 * Helper to make authenticated Gmail API requests.
 */
async function gmailApi(token, method, path, body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}${path}`, options);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.error?.message || `Gmail API error: ${res.status}`;
    throw new Error(message);
  }

  // Some endpoints return empty response (204)
  if (res.status === 204) {
    return { success: true };
  }

  return res.json();
}

/**
 * Gmail Plugin implementation.
 */
class GmailPlugin extends BasePlugin {
  constructor() {
    super("gmail", "Gmail");
    this.registerAllHandlers();
  }

  registerAllHandlers() {
    // Mark as read
    this.registerHandler({
      actionId: "mark_read",
      name: "Mark as Read",
      description: "Remove the UNREAD label",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          removeLabelIds: [GMAIL_LABELS.UNREAD],
        });

        return { success: true, message: "Marked message as read", data: { messageId } };
      },
    });

    // Mark as unread
    this.registerHandler({
      actionId: "mark_unread",
      name: "Mark as Unread",
      description: "Add the UNREAD label",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          addLabelIds: [GMAIL_LABELS.UNREAD],
        });

        return { success: true, message: "Marked message as unread", data: { messageId } };
      },
    });

    // Star message
    this.registerHandler({
      actionId: "star",
      name: "Star",
      description: "Add the STARRED label",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          addLabelIds: [GMAIL_LABELS.STARRED],
        });

        return { success: true, message: "Starred message", data: { messageId } };
      },
    });

    // Unstar message
    this.registerHandler({
      actionId: "unstar",
      name: "Unstar",
      description: "Remove the STARRED label",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          removeLabelIds: [GMAIL_LABELS.STARRED],
        });

        return { success: true, message: "Unstarred message", data: { messageId } };
      },
    });

    // Move to trash
    this.registerHandler({
      actionId: "trash",
      name: "Move to Trash",
      description: "Move message to trash (recoverable for 30 days)",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/trash`);

        return { success: true, message: "Moved message to trash", data: { messageId } };
      },
    });

    // Permanently delete
    this.registerHandler({
      actionId: "delete",
      name: "Delete Permanently",
      description: "Permanently delete message (cannot be recovered)",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "DELETE", `/messages/${messageId}`);

        return { success: true, message: "Permanently deleted message", data: { messageId } };
      },
    });

    // Move to spam
    this.registerHandler({
      actionId: "mark_spam",
      name: "Mark as Spam",
      description: "Move message to spam folder",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          addLabelIds: [GMAIL_LABELS.SPAM],
          removeLabelIds: [GMAIL_LABELS.INBOX],
        });

        return { success: true, message: "Marked message as spam", data: { messageId } };
      },
    });

    // Archive (remove from inbox)
    this.registerHandler({
      actionId: "archive",
      name: "Archive",
      description: "Remove from inbox (keeps message, removes INBOX label)",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          removeLabelIds: [GMAIL_LABELS.INBOX],
        });

        return { success: true, message: "Archived message", data: { messageId } };
      },
    });

    // Apply custom label
    this.registerHandler({
      actionId: "apply_label",
      name: "Apply Label",
      description: "Apply a custom label to the message",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        const labelId = ctx.config?.labelId;
        if (!messageId) throw new Error("No message ID provided");
        if (!labelId) throw new Error("No label ID provided in config");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          addLabelIds: [labelId],
        });

        return { success: true, message: `Applied label: ${labelId}`, data: { messageId, labelId } };
      },
    });

    // Remove label
    this.registerHandler({
      actionId: "remove_label",
      name: "Remove Label",
      description: "Remove a label from the message",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        const labelId = ctx.config?.labelId;
        if (!messageId) throw new Error("No message ID provided");
        if (!labelId) throw new Error("No label ID provided in config");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          removeLabelIds: [labelId],
        });

        return { success: true, message: `Removed label: ${labelId}`, data: { messageId, labelId } };
      },
    });

    // Mark as important
    this.registerHandler({
      actionId: "mark_important",
      name: "Mark as Important",
      description: "Add the IMPORTANT label",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          addLabelIds: [GMAIL_LABELS.IMPORTANT],
        });

        return { success: true, message: "Marked as important", data: { messageId } };
      },
    });

    // Mark as not important
    this.registerHandler({
      actionId: "mark_not_important",
      name: "Mark as Not Important",
      description: "Remove the IMPORTANT label",
      requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      execute: async (ctx) => {
        const messageId = ctx.event.data.emailId || ctx.event.data.id;
        if (!messageId) throw new Error("No message ID provided");

        await gmailApi(ctx.accessToken, "POST", `/messages/${messageId}/modify`, {
          removeLabelIds: [GMAIL_LABELS.IMPORTANT],
        });

        return { success: true, message: "Marked as not important", data: { messageId } };
      },
    });
  }

  /**
   * Batch modify multiple messages.
   * Uses Gmail's batchModify endpoint (up to 1000 messages).
   */
  async batchModify(accessToken, messageIds, addLabelIds = [], removeLabelIds = []) {
    if (messageIds.length === 0) return { success: true, message: "No messages to modify" };
    if (messageIds.length > 1000) throw new Error("Batch modify supports maximum 1000 messages at once");

    await gmailApi(accessToken, "POST", "/messages/batchModify", {
      ids: messageIds,
      addLabelIds,
      removeLabelIds,
    });

    return { success: true, message: `Modified ${messageIds.length} messages`, data: { count: messageIds.length } };
  }

  /**
   * Batch delete multiple messages.
   * Uses Gmail's batchDelete endpoint (up to 1000 messages).
   */
  async batchDelete(accessToken, messageIds) {
    if (messageIds.length === 0) return { success: true, message: "No messages to delete" };
    if (messageIds.length > 1000) throw new Error("Batch delete supports maximum 1000 messages at once");

    await gmailApi(accessToken, "POST", "/messages/batchDelete", { ids: messageIds });

    return { success: true, message: `Deleted ${messageIds.length} messages`, data: { count: messageIds.length } };
  }
}

// Export singleton instance
export const gmailPlugin = new GmailPlugin();
