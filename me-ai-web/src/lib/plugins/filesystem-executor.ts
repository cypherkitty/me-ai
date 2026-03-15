/**
 * Filesystem plugin — web-side execution via File System Access API.
 * Actions: read_file, write_file, list_dir, create_file, delete_file.
 */

export interface PluginResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

type EventData = Record<string, unknown>;

function getPath(event: { data?: EventData }): string | null {
  const data = event.data ?? {};
  const path = (data.path ?? data.filePath ?? data.file) as string | undefined;
  return path != null ? String(path).trim() : null;
}

function getContent(event: { data?: EventData }): string | null {
  const data = event.data ?? {};
  const content = (data.content ?? data.text ?? data.body) as string | undefined;
  return content != null ? String(content) : null;
}

async function resolveFileHandle(
  dir: FileSystemDirectoryHandle,
  path: string,
  create = false
): Promise<FileSystemFileHandle> {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) {
    throw new Error("Invalid path: must specify a file name");
  }
  let current: FileSystemDirectoryHandle = dir;
  for (let i = 0; i < parts.length - 1; i++) {
    current = await current.getDirectoryHandle(parts[i], { create });
  }
  const fileName = parts[parts.length - 1]!;
  return current.getFileHandle(fileName, { create });
}

async function resolveDirHandle(
  dir: FileSystemDirectoryHandle,
  path: string,
  create = false
): Promise<FileSystemDirectoryHandle> {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return dir;
  let current: FileSystemDirectoryHandle = dir;
  for (const part of parts) {
    current = await current.getDirectoryHandle(part, { create });
  }
  return current;
}

export async function executeFilesystemAction(
  commandId: string,
  event: { data?: EventData; type?: string; source?: string },
  dirHandle: FileSystemDirectoryHandle
): Promise<PluginResult> {
  const normalized = commandId.replace(/^filesystem:/, "").toLowerCase();
  const path = getPath(event);

  try {
    switch (normalized) {
      case "read_file": {
        if (!path) {
          return { success: false, message: "read_file requires path in event.data" };
        }
        const fileHandle = await resolveFileHandle(dirHandle, path, false);
        const file = await fileHandle.getFile();
        const text = await file.text();
        return { success: true, message: "File read", data: { content: text, size: file.size } };
      }

      case "write_file": {
        if (!path) {
          return { success: false, message: "write_file requires path in event.data" };
        }
        const content = getContent(event) ?? "";
        const writeHandle = await resolveFileHandle(dirHandle, path, true);
        const writable = await writeHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return { success: true, message: `Wrote ${content.length} bytes to ${path}` };
      }

      case "list_dir": {
        const targetPath = path ?? ".";
        const targetDir = await resolveDirHandle(dirHandle, targetPath, false);
        const entries: Array<{ name: string; kind: "file" | "directory" }> = [];
        for await (const [name, handle] of (targetDir as unknown) as AsyncIterable<[string, FileSystemHandle]>) {
          entries.push({ name, kind: handle.kind });
        }
        return { success: true, message: `Listed ${entries.length} entries`, data: { entries } };
      }

      case "create_file": {
        if (!path) {
          return { success: false, message: "create_file requires path in event.data" };
        }
        const createContent = getContent(event) ?? "";
        const createHandle = await resolveFileHandle(dirHandle, path, true);
        const createWritable = await createHandle.createWritable();
        await createWritable.write(createContent);
        await createWritable.close();
        return { success: true, message: `Created file ${path}` };
      }

      case "delete_file": {
        if (!path) {
          return { success: false, message: "delete_file requires path in event.data" };
        }
        const parts = path.split("/").filter(Boolean);
        if (parts.length === 0) {
          return { success: false, message: "Invalid path for delete_file" };
        }
        const parentPath = parts.slice(0, -1).join("/");
        const fileName = parts[parts.length - 1]!;
        const parentDir =
          parentPath.length > 0
            ? await resolveDirHandle(dirHandle, parentPath, false)
            : dirHandle;
        await parentDir.removeEntry(fileName, { recursive: false });
        return { success: true, message: `Deleted ${path}` };
      }

      default:
        return { success: false, message: `Unknown filesystem action: ${commandId}` };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg };
  }
}
