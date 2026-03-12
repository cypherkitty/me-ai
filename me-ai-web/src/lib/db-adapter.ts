/**
 * DB adapter for me-ai-core (Rust WASM). JS is thin: execution-only.
 * Rust builds all SQL and passes (sql, params) here. We just run them and return results.
 * Pass this object to core.init(adapter).
 */

import { query, exec } from "./store/db.js";

export function createDbAdapter(): {
  query(sql: string, params: unknown[]): Promise<Record<string, unknown>[]>;
  exec(sql: string, params: unknown[]): Promise<void>;
} {
  return {
    async query(sql: string, params: unknown[]) {
      const p = Array.isArray(params) ? params : Array.from(params as ArrayLike<unknown>);
      return query(sql, p);
    },
    async exec(sql: string, params: unknown[]) {
      const p = Array.isArray(params) ? params : Array.from(params as ArrayLike<unknown>);
      return exec(sql, p);
    },
  };
}
