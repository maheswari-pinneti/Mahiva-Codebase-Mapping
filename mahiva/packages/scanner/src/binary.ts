import { open } from "node:fs/promises";

/**
 * Inspects the first 8192 bytes of a file.
 * If null bytes (0x00) exist, the file is classified as binary.
 */
export async function isBinaryFile(filePath: string): Promise<boolean> {
  let fileHandle;
  try {
    fileHandle = await open(filePath, "r");
    const buffer = Buffer.alloc(8192);
    const { bytesRead } = await fileHandle.read(buffer, 0, 8192, 0);

    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0x00) {
        return true;
      }
    }
    return false;
  } catch {
    return true; // Unreadable files fail safely as binary
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}
