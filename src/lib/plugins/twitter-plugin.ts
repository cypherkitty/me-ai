/**
 * Twitter/X Plugin
 *
 * Executes actions on tweets using the Twitter API v2.
 * Supports: like, retweet, bookmark, mute author, block author.
 */

import { BasePlugin } from "./base-plugin.js";
import {
  likeTweet,
  unlikeTweet,
  retweet,
  unretweet,
  bookmarkTweet,
  removeBookmark,
  muteUser,
  blockUser,
} from "../twitter-api.js";
import type { PluginContext } from "$lib/types";

/**
 * Twitter Plugin implementation.
 */
export class TwitterPlugin extends BasePlugin {
  constructor() {
    super("twitter", "Twitter/X");
    this.registerAllHandlers();
  }

  /** Extract tweet ID from context (removes "twitter:" prefix if present). */
  extractTweetId(ctx: PluginContext): string {
    const data = ctx?.event?.data as { sourceId?: string; id?: string } | undefined;
    const id = data?.sourceId ?? data?.id ?? "";
    return String(id).replace(/^twitter:/, "");
  }

  /** Get the authenticated user's ID from context config. */
  getUserId(ctx: PluginContext): string {
    const config = ctx?.config as { userId?: string; twitterUserId?: string } | undefined;
    return config?.userId ?? config?.twitterUserId ?? "";
  }

  registerAllHandlers(): void {
    this.registerHandler({
      actionId: "twitter:like",
      name: "Like Tweet",
      description: "Like a tweet",
      requiredScopes: ["like.write"],
      async execute(ctx) {
        const tweetId = this.extractTweetId(ctx);
        const userId = this.getUserId(ctx);
        if (!tweetId || !userId) return { success: false, message: "Missing tweet ID or user ID" };
        await likeTweet(ctx.accessToken, userId, tweetId);
        return { success: true, message: `Liked tweet ${tweetId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:unlike",
      name: "Unlike Tweet",
      description: "Remove like from a tweet",
      requiredScopes: ["like.write"],
      async execute(ctx) {
        const tweetId = this.extractTweetId(ctx);
        const userId = this.getUserId(ctx);
        if (!tweetId || !userId) return { success: false, message: "Missing tweet ID or user ID" };
        await unlikeTweet(ctx.accessToken, userId, tweetId);
        return { success: true, message: `Unliked tweet ${tweetId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:retweet",
      name: "Retweet",
      description: "Retweet a tweet",
      requiredScopes: ["tweet.write"],
      async execute(ctx) {
        const tweetId = this.extractTweetId(ctx);
        const userId = this.getUserId(ctx);
        if (!tweetId || !userId) return { success: false, message: "Missing tweet ID or user ID" };
        await retweet(ctx.accessToken, userId, tweetId);
        return { success: true, message: `Retweeted tweet ${tweetId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:unretweet",
      name: "Undo Retweet",
      description: "Undo a retweet",
      requiredScopes: ["tweet.write"],
      async execute(ctx) {
        const tweetId = this.extractTweetId(ctx);
        const userId = this.getUserId(ctx);
        if (!tweetId || !userId) return { success: false, message: "Missing tweet ID or user ID" };
        await unretweet(ctx.accessToken, userId, tweetId);
        return { success: true, message: `Undid retweet of ${tweetId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:bookmark",
      name: "Bookmark Tweet",
      description: "Bookmark a tweet for later",
      requiredScopes: ["bookmark.write"],
      async execute(ctx) {
        const tweetId = this.extractTweetId(ctx);
        const userId = this.getUserId(ctx);
        if (!tweetId || !userId) return { success: false, message: "Missing tweet ID or user ID" };
        await bookmarkTweet(ctx.accessToken, userId, tweetId);
        return { success: true, message: `Bookmarked tweet ${tweetId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:remove_bookmark",
      name: "Remove Bookmark",
      description: "Remove a tweet bookmark",
      requiredScopes: ["bookmark.write"],
      async execute(ctx) {
        const tweetId = this.extractTweetId(ctx);
        const userId = this.getUserId(ctx);
        if (!tweetId || !userId) return { success: false, message: "Missing tweet ID or user ID" };
        await removeBookmark(ctx.accessToken, userId, tweetId);
        return { success: true, message: `Removed bookmark from ${tweetId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:mute_author",
      name: "Mute Author",
      description: "Mute the author of a tweet",
      requiredScopes: ["users.read"],
      async execute(ctx) {
        const data = ctx?.event?.data as { raw?: string } | undefined;
        const authorId = data?.raw ? (JSON.parse(data.raw) as { author_id?: string })?.author_id : null;
        const userId = this.getUserId(ctx);
        if (!authorId || !userId) return { success: false, message: "Missing author ID or user ID" };
        await muteUser(ctx.accessToken, userId, authorId);
        return { success: true, message: `Muted user ${authorId}` };
      },
    });

    this.registerHandler({
      actionId: "twitter:block_author",
      name: "Block Author",
      description: "Block the author of a tweet",
      requiredScopes: ["users.read"],
      async execute(ctx) {
        const data = ctx?.event?.data as { raw?: string } | undefined;
        const authorId = data?.raw ? (JSON.parse(data.raw) as { author_id?: string })?.author_id : null;
        const userId = this.getUserId(ctx);
        if (!authorId || !userId) return { success: false, message: "Missing author ID or user ID" };
        await blockUser(ctx.accessToken, userId, authorId);
        return { success: true, message: `Blocked user ${authorId}` };
      },
    });
  }
}

export const twitterPlugin = new TwitterPlugin();
