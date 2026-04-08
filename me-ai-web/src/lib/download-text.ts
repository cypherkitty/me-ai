/**
 * Trigger a browser download of text/binary as a file (Blob + object URL).
 */

export function downloadText(
  content: string,
  filename: string,
  mimeType: string = "text/markdown;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
