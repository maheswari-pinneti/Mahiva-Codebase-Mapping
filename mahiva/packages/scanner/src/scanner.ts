import path from "node:path";
import createIgnore, { type Ignore } from "ignore";
import { NodeFileSystem, normalizePath } from "@mahiva/filesystem";
import { FileDescriptor, Language } from "@mahiva/shared";
import { MahivaConfig } from "@mahiva/config";
import { isBinaryFile } from "./binary.js";
import { detectLanguage, isTestFile } from "./classifier.js";

// Ensure callable function reference regardless of CJS/ESM interop
const getIgnoreInstance = (): Ignore => {
  const fn =
    (createIgnore as unknown as { default?: () => Ignore }).default ??
    createIgnore;
  return (fn as unknown as () => Ignore)();
};

export interface ScanSummary {
  repositoryRoot: string;
  totalFilesDiscovered: number;
  byLanguage: Record<Language, number>;
  files: FileDescriptor[];
  durationMs: number;
}

export class CodebaseScanner {
  private fileSystem: NodeFileSystem;

  constructor(fileSystem?: NodeFileSystem) {
    this.fileSystem = fileSystem ?? new NodeFileSystem();
  }

  public async scan(config: MahivaConfig): Promise<ScanSummary> {
    const startTime = Date.now();
    const rootPath = path.resolve(config.root);
    const gitignoreFilter = await this.buildGitignoreFilter(rootPath);
    const cbmignoreFilter = await this.buildCbmignoreFilter(rootPath);

    const configIgnore = getIgnoreInstance();
    configIgnore.add(config.exclude);

    const files: FileDescriptor[] = [];

    const languageCounts = Object.values(Language).reduce<
      Record<Language, number>
    >(
      (acc, lang) => {
        acc[lang] = 0;
        return acc;
      },
      {} as Record<Language, number>,
    );

    for await (const entry of this.fileSystem.walk(rootPath, {
      recursive: true,
      followSymlinks: config.followSymlinks,
      skip: (relPath: string) => {
        if (!relPath) return false;
        if (relPath.startsWith(".git") || relPath.startsWith("node_modules")) {
          return true;
        }
        return (
          configIgnore.ignores(relPath) ||
          gitignoreFilter.ignores(relPath) ||
          cbmignoreFilter.ignores(relPath)
        );
      },
    })) {
      if (!entry.stats.isFile) continue;

      const relPath = entry.relativePath;

      if (
        gitignoreFilter.ignores(relPath) ||
        configIgnore.ignores(relPath) ||
        cbmignoreFilter.ignores(relPath)
      ) {
        continue;
      }

      const sizeKb = entry.stats.size / 1024;
      if (sizeKb > config.maxFileSizeKb) {
        continue;
      }

      if (await isBinaryFile(entry.path)) {
        continue;
      }

      const lang = detectLanguage(entry.path);

      if (config.languages.length > 0 && !config.languages.includes(lang)) {
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
        sizeBytes: entry.stats.size,
        contentHash: hash,
        isTestFile: isTestFile(relPath),
        isIgnored: false,
      };

      files.push(descriptor);
      languageCounts[lang] = (languageCounts[lang] ?? 0) + 1;
    }

    return {
      repositoryRoot: rootPath,
      totalFilesDiscovered: files.length,
      byLanguage: languageCounts,
      files,
      durationMs: Date.now() - startTime,
    };
  }

  private async buildGitignoreFilter(rootPath: string): Promise<Ignore> {
    return this.buildIgnoreFilter(rootPath, ".gitignore");
  }

  private async buildCbmignoreFilter(rootPath: string): Promise<Ignore> {
    return this.buildIgnoreFilter(rootPath, ".cbmignore");
  }

  private async buildIgnoreFilter(
    rootPath: string,
    filename: string,
  ): Promise<Ignore> {
    const ig = getIgnoreInstance();
    const ignorePath = path.join(rootPath, filename);

    if (await this.fileSystem.exists(ignorePath)) {
      try {
        const content = await this.fileSystem.readFile(ignorePath);
        ig.add(content);
      } catch {
        // Skip unreadable ignore file
      }
    }
    return ig;
  }
}
