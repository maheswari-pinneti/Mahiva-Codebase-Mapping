import { analyzeParsedFile } from "@mahiva/analyzer";
import { RelationshipType } from "@mahiva/shared";
import type {
  CodeSymbol,
  ImportStatement,
  ParsedSourceFile,
} from "@mahiva/shared";

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface RelationshipResult {
  fileId: string;
  edges: RelationshipEdge[];
  imports: ImportStatement[];
  symbols: CodeSymbol[];
}

export class RelationshipBuilder {
  public build(parsedFile: ParsedSourceFile): RelationshipResult {
    const analysis = analyzeParsedFile(parsedFile);

    const edges: RelationshipEdge[] = [];

    for (const statement of analysis.imports) {
      const importEdge: RelationshipEdge = {
        id: `rel:${parsedFile.fileId}#imports#${statement.moduleSpecifier}`,
        source: parsedFile.fileId,
        target: statement.moduleSpecifier,
        type: RelationshipType.IMPORTS,
        weight: 1,
        metadata: {
          isTypeOnly: statement.isTypeOnly,
          importedSymbols: statement.symbols.map((item) => item.importedName),
        },
      };

      edges.push(importEdge);
    }

    for (const exportedName of analysis.exportedNames) {
      edges.push({
        id: `rel:${parsedFile.fileId}#exports#${exportedName}`,
        source: parsedFile.fileId,
        target: exportedName,
        type: RelationshipType.EXPORTS,
        weight: 1,
      });
    }

    for (const symbol of analysis.symbols) {
      edges.push({
        id: `rel:${parsedFile.fileId}#symbol#${symbol.canonicalName}`,
        source: parsedFile.fileId,
        target: symbol.canonicalName,
        type: RelationshipType.CONTAINS,
        weight: 1,
      });
    }

    return {
      fileId: parsedFile.fileId,
      edges,
      imports: analysis.imports,
      symbols: analysis.symbols,
    };
  }

  public buildMany(parsedFiles: ParsedSourceFile[]): RelationshipResult[] {
    return parsedFiles.map((parsedFile) => this.build(parsedFile));
  }
}

export const defaultRelationshipBuilder = new RelationshipBuilder();

export function buildRelationships(
  parsedFile: ParsedSourceFile,
): RelationshipResult {
  return defaultRelationshipBuilder.build(parsedFile);
}

export function buildRelationshipsForFiles(
  parsedFiles: ParsedSourceFile[],
): RelationshipResult[] {
  return defaultRelationshipBuilder.buildMany(parsedFiles);
}

export const PACKAGE_NAME = "@mahiva/relationships";
