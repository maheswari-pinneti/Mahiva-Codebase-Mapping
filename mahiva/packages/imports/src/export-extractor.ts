import * as ts from "typescript";
import { ExportStatement, ParsedSourceFile, SourceRange } from "@mahiva/shared";

export interface IExportExtractor {
  extractExports(parsedFile: ParsedSourceFile): ExportStatement[];
}

export class ExportExtractor implements IExportExtractor {
  public extractExports(parsedFile: ParsedSourceFile): ExportStatement[] {
    const rawAst = parsedFile.rawAst as ts.SourceFile | undefined;

    if (rawAst && typeof rawAst === "object" && "statements" in rawAst) {
      return this.extractFromSourceFile(rawAst, parsedFile.fileId);
    }

    return [];
  }

  private extractFromSourceFile(sourceFile: ts.SourceFile, fileId: string): ExportStatement[] {
    const exports: ExportStatement[] = [];

    for (const statement of sourceFile.statements) {
      if (ts.isExportDeclaration(statement)) {
        const exportedName = statement.exportClause
          ? ts.isNamedExports(statement.exportClause)
            ? statement.exportClause.elements.map((element) => element.name.text).join(",")
            : "default"
          : "default";

        exports.push({
          id: `exp:${fileId}#${exportedName}:${statement.getStart(sourceFile)}`,
          fileId,
          exportedName,
          isDefault: !statement.exportClause,
          isTypeOnly: statement.isTypeOnly,
          range: this.toRange(sourceFile, statement.pos, statement.end),
        });
        continue;
      }

      if (ts.isExportAssignment(statement)) {
        exports.push({
          id: `exp:${fileId}#default:${statement.getStart(sourceFile)}`,
          fileId,
          exportedName: "default",
          isDefault: true,
          isTypeOnly: false,
          range: this.toRange(sourceFile, statement.pos, statement.end),
        });
        continue;
      }

      if (!this.hasExportModifier(statement)) {
        continue;
      }

      const exportedName = this.getExportedName(statement);
      const isDefault = this.isDefaultExport(statement);

      exports.push({
        id: `exp:${fileId}#${exportedName}:${statement.getStart(sourceFile)}`,
        fileId,
        exportedName,
        isDefault,
        isTypeOnly: this.isTypeOnlyExport(statement),
        range: this.toRange(sourceFile, statement.pos, statement.end),
      });
    }

    return exports;
  }

  private hasExportModifier(statement: ts.Node): boolean {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    return !!modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
  }

  private hasDefaultModifier(statement: ts.Node): boolean {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    return !!modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
  }

  private isDefaultExport(statement: ts.Node): boolean {
    return this.hasDefaultModifier(statement);
  }

  private isTypeOnlyExport(statement: ts.Statement): boolean {
    return ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement);
  }

  private getExportedName(statement: ts.Statement): string {
    if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isVariableStatement(statement)) {
      const name = ts.isFunctionDeclaration(statement)
        ? statement.name?.text
        : ts.isClassDeclaration(statement)
          ? statement.name?.text
          : undefined;

      if (name) {
        return name;
      }
    }

    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement) || ts.isEnumDeclaration(statement)) {
      return statement.name.text;
    }

    if (ts.isVariableStatement(statement)) {
      const firstDeclaration = statement.declarationList.declarations[0];
      return firstDeclaration?.name.getText() ?? "default";
    }

    return "default";
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

export const defaultExportExtractor = new ExportExtractor();

export function extractExports(parsedFile: ParsedSourceFile): ExportStatement[] {
  return defaultExportExtractor.extractExports(parsedFile);
}
