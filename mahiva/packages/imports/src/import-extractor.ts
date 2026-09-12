import * as ts from "typescript";
import { ImportStatement, ParsedSourceFile, SourceRange } from "@mahiva/shared";

export interface IImportExtractor {
  extractImports(parsedFile: ParsedSourceFile): ImportStatement[];
}

export class ImportExtractor implements IImportExtractor {
  public extractImports(parsedFile: ParsedSourceFile): ImportStatement[] {
    const rawAst = parsedFile.rawAst as ts.SourceFile | undefined;

    if (rawAst && typeof rawAst === "object" && "statements" in rawAst) {
      return this.extractFromSourceFile(rawAst, parsedFile.fileId);
    }

    return [];
  }

  private extractFromSourceFile(sourceFile: ts.SourceFile, fileId: string): ImportStatement[] {
    const imports: ImportStatement[] = [];

    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement)) {
        continue;
      }

      const moduleSpecifier = this.getModuleSpecifier(statement);
      if (!moduleSpecifier) {
        continue;
      }

      const importClause = statement.importClause;
      const symbols: ImportStatement["symbols"] = [];

      if (importClause?.name) {
        symbols.push({
          importedName: "default",
          alias: importClause.name.text,
        });
      }

      if (importClause?.namedBindings) {
        if (ts.isNamespaceImport(importClause.namedBindings)) {
          symbols.push({
            importedName: "*",
            alias: importClause.namedBindings.name.text,
          });
        } else if (ts.isNamedImports(importClause.namedBindings)) {
          for (const element of importClause.namedBindings.elements) {
            symbols.push({
              importedName: element.propertyName?.text ?? element.name.text,
              alias: element.propertyName ? element.name.text : undefined,
            });
          }
        }
      }

      imports.push({
        id: `imp:${fileId}#${moduleSpecifier}:${statement.getStart(sourceFile)}`,
        fileId,
        moduleSpecifier,
        resolvedFileId: undefined,
        isTypeOnly: importClause?.isTypeOnly ?? false,
        isExternal: !moduleSpecifier.startsWith(".") && !moduleSpecifier.startsWith("/"),
        symbols,
        range: this.toRange(sourceFile, statement.pos, statement.end),
      });
    }

    return imports;
  }

  private getModuleSpecifier(statement: ts.ImportDeclaration): string | undefined {
    const moduleSpecifier = statement.moduleSpecifier;

    if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
      return moduleSpecifier.text;
    }

    return undefined;
  }

  private toRange(sourceFile: ts.SourceFile, start: number, end: number): SourceRange {
    const startPos = sourceFile.getLineAndCharacterOfPosition(start);
    const endPos = sourceFile.getLineAndCharacterOfPosition(end);

    return {
      start: {
        line: startPos.line + 1,
        column: startPos.character + 1,
        offset: start,
      },
      end: {
        line: endPos.line + 1,
        column: endPos.character + 1,
        offset: end,
      },
    };
  }
}

export const defaultImportExtractor = new ImportExtractor();

export function extractImports(parsedFile: ParsedSourceFile): ImportStatement[] {
  return defaultImportExtractor.extractImports(parsedFile);
}
