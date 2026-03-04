/**
 * Twitter/X Plugin
 *
 * Executes actions on tweets using the Twitter API v2.
 * Supports: like, retweet, bookmark, mute author, block author.
 */

import { BasePlugin } from "./base-plugin.js";
import {
    likeTweet, unlikeTweet,
    retweet, unretweet,
    bookmarkTweet, removeBookmark,
    muteUser, blockUser,
} from "../twitter-api.js";

/**
 * Twitter Plugin implementation.
 */
export class TwitterPlugin extends BasePlugin {
    constructor() {
        super("twitter", "Twitter/X");
        this.registerAllHandlers();
    }

    /**
     * Extract tweet ID from context (removes "twitter:" prefix if present).
     */
    extractTweetId(ctx) {
        const id = ctx?.event?.data?.sourceId || ctx?.event?.data?.id || "";
        return String(id).replace(/^twitter:/, "");
    }

    /**
     * Get the authenticated user's ID from context config.
     */
    getUserId(ctx) {
        return ctx?.config?.userId || ctx?.config?.twitterUserId || "";
    }

    registerAllHandlers() {
        // ── Like ──────────────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:like",
            name: "Like Tweet",
            description: "Like a tweet",
            requiredScopes: ["like.write"],
            async execute(ctx) {
                const tweetId = this.extractTweetId?.(ctx) || ctx?.event?.data?.sourceId?.replace(/^twitter:/, "");
                const userId = ctx?.config?.userId;
                if (!tweetId || !userId) {
                    return { success: false, message: "Missing tweet ID or user ID" };
                }
                await likeTweet(ctx.accessToken, userId, tweetId);
                return { success: true, message: `Liked tweet ${tweetId}` };
            },
        });

        // ── Unlike ────────────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:unlike",
            name: "Unlike Tweet",
            description: "Remove like from a tweet",
            requiredScopes: ["like.write"],
            async execute(ctx) {
                const tweetId = ctx?.event?.data?.sourceId?.replace(/^twitter:/, "");
                const userId = ctx?.config?.userId;
                if (!tweetId || !userId) {
                    return { success: false, message: "Missing tweet ID or user ID" };
                }
                await unlikeTweet(ctx.accessToken, userId, tweetId);
                return { success: true, message: `Unliked tweet ${tweetId}` };
            },
        });

        // ── Retweet ───────────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:retweet",
            name: "Retweet",
            description: "Retweet a tweet",
            requiredScopes: ["tweet.write"],
            async execute(ctx) {
                const tweetId = ctx?.event?.data?.sourceId?.replace(/^twitter:/, "");
                const userId = ctx?.config?.userId;
                if (!tweetId || !userId) {
                    return { success: false, message: "Missing tweet ID or user ID" };
                }
                await retweet(ctx.accessToken, userId, tweetId);
                return { success: true, message: `Retweeted tweet ${tweetId}` };
            },
        });

        // ── Undo Retweet ──────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:unretweet",
            name: "Undo Retweet",
            description: "Undo a retweet",
            requiredScopes: ["tweet.write"],
            async execute(ctx) {
                const tweetId = ctx?.event?.data?.sourceId?.replace(/^twitter:/, "");
                const userId = ctx?.config?.userId;
                if (!tweetId || !userId) {
                    return { success: false, message: "Missing tweet ID or user ID" };
                }
                await unretweet(ctx.accessToken, userId, tweetId);
                return { success: true, message: `Undid retweet of ${tweetId}` };
            },
        });

        // ── Bookmark ──────────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:bookmark",
            name: "Bookmark Tweet",
            description: "Bookmark a tweet for later",
            requiredScopes: ["bookmark.write"],
            async execute(ctx) {
                const tweetId = ctx?.event?.data?.sourceId?.replace(/^twitter:/, "");
                const userId = ctx?.config?.userId;
                if (!tweetId || !userId) {
                    return { success: false, message: "Missing tweet ID or user ID" };
                }
                await bookmarkTweet(ctx.accessToken, userId, tweetId);
                return { success: true, message: `Bookmarked tweet ${tweetId}` };
            },
        });

        // ── Remove Bookmark ───────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:remove_bookmark",
            name: "Remove Bookmark",
            description: "Remove a tweet bookmark",
            requiredScopes: ["bookmark.write"],
            async execute(ctx) {
                const tweetId = ctx?.event?.data?.sourceId?.replace(/^twitter:/, "");
                const userId = ctx?.config?.userId;
                if (!tweetId || !userId) {
                    return { success: false, message: "Missing tweet ID or user ID" };
                }
                await removeBookmark(ctx.accessToken, userId, tweetId);
                return { success: true, message: `Removed bookmark from ${tweetId}` };
            },
        });

        // ── Mute Author ───────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:mute_author",
            name: "Mute Author",
            description: "Mute the author of a tweet",
            requiredScopes: ["users.read"],
            async execute(ctx) {
                const authorId = ctx?.event?.data?.raw
                    ? JSON.parse(ctx.event.data.raw)?.author_id
                    : null;
                const userId = ctx?.config?.userId;
                if (!authorId || !userId) {
                    return { success: false, message: "Missing author ID or user ID" };
                }
                await muteUser(ctx.accessToken, userId, authorId);
                return { success: true, message: `Muted user ${authorId}` };
            },
        });

        // ── Block Author ──────────────────────────────────────────────
        this.registerHandler({
            actionId: "twitter:block_author",
            name: "Block Author",
            description: "Block the author of a tweet",
            requiredScopes: ["users.read"],
            async execute(ctx) {
                const authorId = ctx?.event?.data?.raw
                    ? JSON.parse(ctx.event.data.raw)?.author_id
                    : null;
                const userId = ctx?.config?.userId;
                if (!authorId || !userId) {
                    return { success: false, message: "Missing author ID or user ID" };
                }
                await blockUser(ctx.accessToken, userId, authorId);
                return { success: true, message: `Blocked user ${authorId}` };
            },
        });
    }
}

// Export singleton instance
export const twitterPlugin = new TwitterPlugin();
