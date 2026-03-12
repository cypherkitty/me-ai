/**
 * DB adapter for me-ai-core (Rust WASM).
 * Execution-only: no SQL here. Pass this object to core.init(adapter).
 * The Rust side calls adapter.query(sql, params) and adapter.exec(sql, params).
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
