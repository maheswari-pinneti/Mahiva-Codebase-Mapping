import { Language, SymbolKind, Visibility } from "./enums.js";

export interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}

export interface SourceRange {
  start: SourceLocation;
  end: SourceLocation;
}

export interface Repository {
  id: string;
  name: string;
  rootPath: string;
  defaultBranch?: string;
  headCommit?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FileDescriptor {
  id: string;
  repositoryId: string;
  relativePath: string;
  absolutePath: string;
  name: string;
  extension: string;
  language: Language;
  sizeBytes: number;
  contentHash: string;
  isTestFile: boolean;
  isIgnored: boolean;
}

export interface CodeSymbol {
  id: string;
  fileId: string;
  name: string;
  canonicalName: string;
  kind: SymbolKind;
  range: SourceRange;
  signature?: string;
  visibility: Visibility;
  isExported: boolean;
  isAsync: boolean;
  parentId?: string;
}

export interface ImportStatement {
  id: string;
  fileId: string;
  moduleSpecifier: string;
  resolvedFileId?: string;
  isTypeOnly: boolean;
  isExternal: boolean;
  symbols: {
    importedName: string;
    alias?: string;
  }[];
  range: SourceRange;
}

export interface ExportStatement {
  id: string;
  fileId: string;
  symbolId?: string;
  exportedName: string;
  isDefault: boolean;
  isTypeOnly: boolean;
  range: SourceRange;
}

export interface ScanRun {
  id: string;
  repositoryId: string;
  startedAt: number;
  completedAt?: number;
  status: "in_progress" | "completed" | "failed";
  filesDiscovered: number;
  filesProcessed: number;
  symbolsExtracted: number;
  relationshipsFound: number;
  errorMessage?: string;
}
