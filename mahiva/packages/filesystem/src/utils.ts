import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import path from "node:path";

/**
 * Normalizes any OS path to uniform POSIX style with forward slashes.
 */
export function normalizePath(rawPath: string): string {
  if (!rawPath) return "";
  const resolved = path.normalize(rawPath);
  return resolved.replace(/\\/g, "/");
}

/**
 * Computes a streaming SHA-256 hash of a file on disk.
 */
export function computeFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (error) => reject(error));
  });
}
