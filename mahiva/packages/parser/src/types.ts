import { Language, ParsedSourceFile, SourceRange } from "@mahiva/shared";

/**
 * Common parse options passed to any parser engine.
 */
export interface ParseOptions {
  filePath: string;
  sourceText: string;
  language: Language;
  contentHash?: string;
  extractComments?: boolean;
}

/**
 * Standardized syntax diagnostic.
 */
export interface ParseDiagnostic {
  message: string;
  range: SourceRange;
  severity: "warning" | "error";
}

/**
 * Abstract interface implemented by all parser engines.
 */
export interface IParserEngine {
  readonly engineName: string;
  supports(language: Language): boolean;
  parse(options: ParseOptions): Promise<ParsedSourceFile>;
}
