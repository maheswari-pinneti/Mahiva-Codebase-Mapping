export interface FileStats {
  size: number;
  createdAt: number;
  modifiedAt: number;
  isFile: boolean;
  isDirectory: boolean;
  isSymbolicLink: boolean;
}

export interface WalkEntry {
  path: string; // Absolute normalized path
  relativePath: string; // Relative normalized path to root
  name: string; // File or directory name
  stats: FileStats;
}

export interface WalkOptions {
  recursive?: boolean;
  followSymlinks?: boolean;
  maxDepth?: number;
  skip?: (entryPath: string, isDirectory: boolean) => boolean;
}

export interface IFileSystem {
  exists(path: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
  readBuffer(path: string): Promise<Buffer>;
  writeFile(path: string, content: string | Buffer): Promise<void>;
  stat(path: string): Promise<FileStats>;
  computeHash(path: string): Promise<string>;
  normalizePath(rawPath: string): string;
  walk(rootDir: string, options?: WalkOptions): AsyncIterable<WalkEntry>;
}
