/** Format bytes with 1 decimal (e.g. "1.1 GB") */
export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
}

/** Format bytes with 2 decimals for MB/GB (e.g. "1.07 GB") */
export function formatBytesPrecise(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const decimals = i >= 2 ? 2 : i >= 1 ? 1 : 0;
  return value.toFixed(decimals) + " " + sizes[i];
}

/** Calculate progress percentage, returns null if total is unknown */
export function progressPct(loaded, total) {
  if (!total || total <= 0) return null;
  return Math.min(100, (loaded / total) * 100);
}

/** Truncate a string to maxLen characters, appending "..." if truncated */
export function truncate(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

/** Generate a stable hue (0-360) from a string via simple hash */
export function stringToHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}
