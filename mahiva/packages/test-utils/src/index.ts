import type {
  NormalizedAstNode,
  ParsedSourceFile,
  SourceRange,
} from "@mahiva/shared";
import { Language, SymbolKind } from "@mahiva/shared";

export function createSourceRange(
  startLine = 1,
  startColumn = 1,
  endLine = 1,
  endColumn = 1,
  startOffset = 0,
  endOffset = 0
): SourceRange {
  return {
    start: {
      line: startLine,
      column: startColumn,
      offset: startOffset,
    },
    end: {
      line: endLine,
      column: endColumn,
      offset: endOffset,
    },
  };
}

export function createNormalizedAstNode(
  overrides: Partial<NormalizedAstNode> = {}
): NormalizedAstNode {
  return {
    id: overrides.id ?? "node-1",
    kind: overrides.kind ?? SymbolKind.CLASS,
    name: overrides.name ?? "Node",
    range: overrides.range ?? createSourceRange(),
    children: overrides.children ?? [],
    metadata: overrides.metadata,
    parent: overrides.parent,
  };
}

export function createParsedSourceFile(
  overrides: Partial<ParsedSourceFile> = {}
): ParsedSourceFile {
  return {
    fileId: overrides.fileId ?? "src/index.ts",
    language: overrides.language ?? Language.TYPESCRIPT,
    contentHash: overrides.contentHash ?? "hash",
    rootNode: overrides.rootNode ?? createNormalizedAstNode(),
    rawAst: overrides.rawAst,
    diagnostics: overrides.diagnostics,
  };
}

export const createMockParsedSourceFile = createParsedSourceFile;

export const PACKAGE_NAME = "@mahiva/test-utils";

