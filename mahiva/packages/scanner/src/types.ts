import { FileDescriptor, Language } from "@mahiva/shared";

export interface ScanStatistics {
  totalFiles: number;
  totalDirectories: number;
  totalBytes: number;
  ignoredFiles: number;
  ignoredDirectories: number;
  binaryFiles: number;
  oversizedFiles: number;
  byLanguage: Record<Language, number>;
  byExtension: Record<string, number>;
}

export interface ScanSummary {
  repositoryRoot: string;
  totalFilesDiscovered: number;
  totalDirectories: number;
  byLanguage: Record<Language, number>;
  byExtension: Record<string, number>;
  files: FileDescriptor[];
  statistics: ScanStatistics;
  durationMs: number;
}
