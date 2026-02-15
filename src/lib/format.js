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
