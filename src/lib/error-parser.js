import { GmailApiError } from "./gmail-api.js";

/**
 * Parses raw errors into user-friendly structured guidance.
 * Accepts both Error objects (preferred) and plain strings.
 * Returns { title, description, fix?, link?, action? }
 *
 * @param {Error|string} rawError
 */
export function parseError(rawError) {
  // Support both Error objects and plain strings
  const err = typeof rawError === "object" && rawError !== null ? rawError : null;
  const msg = err?.message || String(rawError || "");
  const status = err instanceof GmailApiError ? err.status : null;

  // Gmail API not enabled
  if (msg.includes("has not been used in project") || msg.includes("is disabled")) {
    const projectMatch = msg.match(/project\s+(\d+)/);
    const projectId = projectMatch?.[1];
    const enableUrl = projectId
      ? `https://console.developers.google.com/apis/api/gmail.googleapis.com/overview?project=${projectId}`
      : "https://console.cloud.google.com/apis/library/gmail.googleapis.com";
    return {
      title: "Gmail API not enabled",
      description: "The Gmail API needs to be enabled in your Google Cloud project before it can be used.",
      fix: "Click the link below to enable it, then wait ~30 seconds and retry.",
      link: { url: enableUrl, label: "Enable Gmail API" },
    };
  }

  // Invalid / expired token
  if (status === 401 || msg.includes("Invalid Credentials") || msg.includes("invalid_token")) {
    return {
      title: "Session expired",
      description: "Your access token has expired or is invalid.",
      fix: "Sign out and sign in again to get a fresh token.",
      action: "signout",
    };
  }

  // Insufficient scopes
  if (status === 403 || (msg.includes("insufficient") && msg.includes("scope"))) {
    return {
      title: "Insufficient permissions",
      description: "The app doesn't have the required permissions to access Gmail.",
      fix: "Sign out, sign in again, and make sure to grant the Gmail read permission in the consent screen.",
      action: "signout",
    };
  }

  // User denied consent
  if (msg.includes("access_denied") || msg.includes("user_denied")) {
    return {
      title: "Access denied",
      description: "You declined the Gmail permission request.",
      fix: "Click 'Sign in with Google' again and grant the Gmail read-only permission when prompted.",
    };
  }

  // Popup blocked
  if (msg.includes("popup") || msg.includes("blocked")) {
    return {
      title: "Popup blocked",
      description: "The sign-in popup was blocked by your browser.",
      fix: "Allow popups for localhost:5173 in your browser settings, then try again.",
    };
  }

  // Rate limit
  if (status === 429 || msg.includes("Rate Limit") || msg.includes("quota")) {
    return {
      title: "Rate limit exceeded",
      description: "Too many requests to the Gmail API.",
      fix: "Wait a minute and try again.",
    };
  }

  // Network error
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network")) {
    return {
      title: "Network error",
      description: "Could not reach the Gmail API.",
      fix: "Check your internet connection and try again.",
    };
  }

  // Fallback
  return {
    title: "Something went wrong",
    description: msg,
    fix: null,
  };
}
