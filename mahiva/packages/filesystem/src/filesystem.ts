import { promises as fs } from "node:fs";
import path from "node:path";
import { FileStats, IFileSystem, WalkEntry, WalkOptions } from "./types.js";
import { computeFileHash, normalizePath } from "./utils.js";

export class NodeFileSystem implements IFileSystem {
  public normalizePath(rawPath: string): string {
    return normalizePath(rawPath);
  }

  public async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  public async readFile(targetPath: string): Promise<string> {
    return fs.readFile(targetPath, "utf-8");
  }

  public async readBuffer(targetPath: string): Promise<Buffer> {
    return fs.readFile(targetPath);
  }

  public async writeFile(
    targetPath: string,
    content: string | Buffer,
  ): Promise<void> {
    const dir = path.dirname(targetPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(targetPath, content);
  }

  public async stat(targetPath: string): Promise<FileStats> {
    const rawStats = await fs.stat(targetPath);
    return {
      size: rawStats.size,
      createdAt: rawStats.birthtimeMs,
      modifiedAt: rawStats.mtimeMs,
      isFile: rawStats.isFile(),
      isDirectory: rawStats.isDirectory(),
      isSymbolicLink: rawStats.isSymbolicLink(),
    };
  }

  public async computeHash(targetPath: string): Promise<string> {
    return computeFileHash(targetPath);
  }

  public async *walk(
    rootDir: string,
    options: WalkOptions = {},
  ): AsyncIterable<WalkEntry> {
    const normalizedRoot = this.normalizePath(path.resolve(rootDir));
    const maxDepth = options.maxDepth ?? Number.POSITIVE_INFINITY;
    const followSymlinks = options.followSymlinks ?? false;

    async function* recurse(
      currentDir: string,
      currentDepth: number,
      ancestorRealDirs: Set<string>,
    ): AsyncIterable<WalkEntry> {
      if (currentDepth > maxDepth) return;

      let entries: import("node:fs").Dirent[];
      try {
        entries = await fs.readdir(currentDir, { withFileTypes: true });
      } catch {
        return;
      }

      const currentRealDir = await fs
        .realpath(currentDir)
        .catch(() => currentDir);
      const nextAncestorRealDirs = new Set(ancestorRealDirs);
      nextAncestorRealDirs.add(currentRealDir);

      for (const entry of entries) {
        const fullPath = normalizePath(path.join(currentDir, entry.name));
        const relativePath = normalizePath(
          path.relative(normalizedRoot, fullPath),
        );

        let rawStats: import("node:fs").Stats | undefined;
        let isSymbolicLink = false;

        try {
          const lstat = await fs.lstat(fullPath);
          isSymbolicLink = lstat.isSymbolicLink();
          rawStats = await fs.stat(fullPath);
        } catch {
          continue;
        }

        const isDirectory = rawStats.isDirectory();

        if (options.skip && options.skip(relativePath, isDirectory)) {
          continue;
        }

        const stats: FileStats = {
          size: rawStats.size,
          createdAt: rawStats.birthtimeMs,
          modifiedAt: rawStats.mtimeMs,
          isFile: rawStats.isFile(),
          isDirectory,
          isSymbolicLink,
        };

        yield {
          path: fullPath,
          relativePath,
          name: entry.name,
          stats,
        };

        if (!isDirectory || !(options.recursive ?? true)) {
          continue;
        }

        if (isSymbolicLink && !followSymlinks) {
          continue;
        }

        const targetRealPath = await fs
          .realpath(fullPath)
          .catch(() => fullPath);
        if (nextAncestorRealDirs.has(targetRealPath)) {
          continue;
        }

        yield* recurse(fullPath, currentDepth + 1, nextAncestorRealDirs);
      }
    }

    yield* recurse(normalizedRoot, 1, new Set<string>());
  }
}

export const defaultFileSystem = new NodeFileSystem();
