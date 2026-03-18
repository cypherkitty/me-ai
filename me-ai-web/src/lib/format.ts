/** Formatting utilities — pure functions delegate to me-ai-core. */
import { getCore } from "./store/core-store.js";

export function formatBytes(bytes: number): string {
  return getCore().formatBytes(BigInt(bytes));
}
export function formatBytesPrecise(bytes: number): string {
  return getCore().formatBytesPrecise(BigInt(bytes));
}
export function progressPct(loaded: number, total: number): number {
  return getCore().progressPct(BigInt(loaded), BigInt(total));
}
export function stringToHue(s: string): number {
  return getCore().stringToHue(s);
}
