import path from "node:path";
import createIgnore, { type Ignore } from "ignore";

import { NodeFileSystem, normalizePath } from "@mahiva/filesystem";
import { FileDescriptor, Language } from "@mahiva/shared";
import { MahivaConfig } from "@mahiva/config";

import { isBinaryFile } from "./binary.js";
import { detectLanguage, isTestFile } from "./classifier.js";
import { isDefaultIgnoredPath } from "./ignore.js";
import type { ScanStatistics, ScanSummary } from "./types.js";

const getIgnoreInstance = (): Ignore => {
  const fn =
    (createIgnore as unknown as { default?: () => Ignore }).default ??
    createIgnore;

  return (fn as unknown as () => Ignore)();
};

export class CodebaseScanner {
  private fileSystem: NodeFileSystem;

  constructor(fileSystem?: NodeFileSystem) {
    this.fileSystem = fileSystem ?? new NodeFileSystem();
  }

  public async scan(config: MahivaConfig): Promise<ScanSummary> {
    const startTime = Date.now();
    const rootPath = path.resolve(config.root);

    const gitignoreFilter = await this.buildGitignoreFilter(rootPath);

    const configIgnore = getIgnoreInstance();
    configIgnore.add(config.exclude);

    const files: FileDescriptor[] = [];

    const languageCounts = this.createLanguageCounts();
    const extensionCounts: Record<string, number> = {};

    const statistics: ScanStatistics = {
      totalFiles: 0,
      totalDirectories: 0,
      totalBytes: 0,
      ignoredFiles: 0,
      ignoredDirectories: 0,
      binaryFiles: 0,
      oversizedFiles: 0,
      byLanguage: languageCounts,
      byExtension: extensionCounts,
    };

    for await (const entry of this.fileSystem.walk(rootPath, {
      recursive: true,
      followSymlinks: config.followSymlinks,
      skip: (relPath: string) => {
        if (!relPath) {
          return false;
        }

        const normalizedPath = relPath.replace(/\\/g, "/");

        if (
          normalizedPath.startsWith(".git") ||
          normalizedPath.startsWith("node_modules")
        ) {
          statistics.ignoredDirectories += 1;
          return true;
        }

        if (isDefaultIgnoredPath(normalizedPath)) {
          statistics.ignoredDirectories += 1;
          return true;
        }

        if (
          configIgnore.ignores(normalizedPath) ||
          gitignoreFilter.ignores(normalizedPath)
        ) {
          statistics.ignoredDirectories += 1;
          return true;
        }

        return false;
      },
    })) {
      if (!entry.stats.isFile) {
        statistics.totalDirectories += 1;
        continue;
      }

      statistics.totalFiles += 1;

      const relPath = entry.relativePath;

      if (
        isDefaultIgnoredPath(relPath) ||
        gitignoreFilter.ignores(relPath) ||
        configIgnore.ignores(relPath)
      ) {
        statistics.ignoredFiles += 1;
        continue;
      }

      const sizeBytes = entry.stats.size;
      const sizeKb = sizeBytes / 1024;

      if (sizeKb > config.maxFileSizeKb) {
        statistics.oversizedFiles += 1;
        continue;
      }

      if (await isBinaryFile(entry.path)) {
        statistics.binaryFiles += 1;
        continue;
      }

      const lang = detectLanguage(entry.path);

      if (config.languages.length > 0 && !config.languages.includes(lang)) {
        statistics.ignoredFiles += 1;
        continue;
      }

      const hash = await this.fileSystem.computeHash(entry.path);
      const ext = path.extname(entry.name).toLowerCase();

      const descriptor: FileDescriptor = {
        id: `file:${hash.slice(0, 16)}:${normalizePath(relPath)}`,
        repositoryId: config.name,
        relativePath: relPath,
        absolutePath: entry.path,
        name: entry.name,
        extension: ext,
        language: lang,
        sizeBytes,
        contentHash: hash,
        isTestFile: isTestFile(relPath),
        isIgnored: false,
      };

      files.push(descriptor);

      languageCounts[lang] = (languageCounts[lang] ?? 0) + 1;

      if (ext) {
        extensionCounts[ext] = (extensionCounts[ext] ?? 0) + 1;
      }

      statistics.totalBytes += sizeBytes;
    }

    return {
      repositoryRoot: rootPath,
      totalFilesDiscovered: files.length,
      totalDirectories: statistics.totalDirectories,
      byLanguage: languageCounts,
      byExtension: extensionCounts,
      files,
      statistics,
      durationMs: Date.now() - startTime,
    };
  }

  private createLanguageCounts(): Record<Language, number> {
    return Object.values(Language).reduce<Record<Language, number>>(
      (accumulator, language) => {
        accumulator[language] = 0;
        return accumulator;
      },
      {} as Record<Language, number>,
    );
  }

  private async buildGitignoreFilter(rootPath: string): Promise<Ignore> {
    const ignore = getIgnoreInstance();
    const gitignorePath = path.join(rootPath, ".gitignore");

    if (await this.fileSystem.exists(gitignorePath)) {
      try {
        const content = await this.fileSystem.readFile(gitignorePath);
        ignore.add(content);
      } catch {
        // Ignore unreadable .gitignore files.
      }
    }

    return ignore;
  }
}

export type { ScanSummary };
