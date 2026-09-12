import { Language, SymbolKind } from "../domain/enums.js";
import { SourceRange } from "../domain/entities.js";

export interface NormalizedAstNode {
  id: string;
  kind: SymbolKind | "root" | "call_expression" | "import_clause" | "export_clause";
  name: string;
  range: SourceRange;
  parent?: string;
  children: NormalizedAstNode[];
  metadata?: Record<string, unknown>;
}

export interface ParsedSourceFile {
  fileId: string;
  language: Language;
  contentHash: string;
  rootNode: NormalizedAstNode;
  rawAst?: unknown;
  diagnostics?: {
    message: string;
    range: SourceRange;
    severity: "warning" | "error";
  }[];
}
