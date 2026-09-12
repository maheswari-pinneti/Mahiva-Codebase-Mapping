import * as ts from "typescript";
import {
  Language,
  ParsedSourceFile,
  NormalizedAstNode,
  SourceRange,
  SymbolKind,
} from "@mahiva/shared";
import { IParserEngine, ParseOptions } from "../types.js";

export class TypeScriptParserEngine implements IParserEngine {
  public readonly engineName = "typescript-compiler-api";

  public supports(language: Language): boolean {
    return [
      Language.TYPESCRIPT,
      Language.TSX,
      Language.JAVASCRIPT,
      Language.JSX,
    ].includes(language);
  }

  public async parse(options: ParseOptions): Promise<ParsedSourceFile> {
    const { filePath, sourceText, language, contentHash = "" } = options;

    const scriptKind = this.resolveScriptKind(language, filePath);
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      scriptKind,
    );

    let idSequence = 0;
    const generateId = () => `${filePath}#node_${++idSequence}`;

    const convertRange = (node: ts.Node): SourceRange => {
      const start = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile),
      );
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      return {
        start: {
          line: start.line + 1,
          column: start.character + 1,
          offset: node.getStart(sourceFile),
        },
        end: {
          line: end.line + 1,
          column: end.character + 1,
          offset: node.getEnd(),
        },
      };
    };

    const mapNodeKind = (
      node: ts.Node,
    ):
      | SymbolKind
      | "root"
      | "call_expression"
      | "import_clause"
      | "export_clause" => {
      if (ts.isSourceFile(node)) return "root";
      if (ts.isFunctionDeclaration(node)) return SymbolKind.FUNCTION;
      if (ts.isMethodDeclaration(node)) return SymbolKind.METHOD;
      if (ts.isClassDeclaration(node)) return SymbolKind.CLASS;
      if (ts.isInterfaceDeclaration(node)) return SymbolKind.INTERFACE;
      if (ts.isTypeAliasDeclaration(node)) return SymbolKind.TYPE_ALIAS;
      if (ts.isEnumDeclaration(node)) return SymbolKind.ENUM;
      if (ts.isEnumMember(node)) return SymbolKind.ENUM_MEMBER;
      if (ts.isVariableDeclaration(node)) return SymbolKind.VARIABLE;
      if (ts.isPropertyDeclaration(node)) return SymbolKind.PROPERTY;
      if (ts.isConstructorDeclaration(node)) return SymbolKind.CONSTRUCTOR;
      if (ts.isCallExpression(node)) return "call_expression";
      if (ts.isImportDeclaration(node)) return "import_clause";
      if (ts.isExportDeclaration(node)) return "export_clause";
      return SymbolKind.VARIABLE;
    };

    const getNodeName = (node: ts.Node): string => {
      if (ts.isSourceFile(node)) return filePath;
      if (
        "name" in node &&
        node.name &&
        ts.isIdentifier(node.name as ts.Node)
      ) {
        return (node.name as ts.Identifier).text;
      }
      return "anonymous";
    };

    const visit = (node: ts.Node, parentId?: string): NormalizedAstNode => {
      const nodeId = generateId();
      const mappedKind = mapNodeKind(node);
      const name = getNodeName(node);
      const range = convertRange(node);

      const children: NormalizedAstNode[] = [];
      ts.forEachChild(node, (child) => {
        children.push(visit(child, nodeId));
      });

      return {
        id: nodeId,
        kind: mappedKind,
        name,
        range,
        parent: parentId,
        children,
      };
    };

    const rootNode = visit(sourceFile);

    return {
      fileId: filePath,
      language,
      contentHash,
      rootNode,
      rawAst: sourceFile,
    };
  }

  private resolveScriptKind(
    language: Language,
    filePath: string,
  ): ts.ScriptKind {
    if (language === Language.TSX || filePath.endsWith(".tsx"))
      return ts.ScriptKind.TSX;
    if (language === Language.JSX || filePath.endsWith(".jsx"))
      return ts.ScriptKind.JSX;
    if (
      language === Language.JAVASCRIPT ||
      filePath.endsWith(".js") ||
      filePath.endsWith(".mjs")
    )
      return ts.ScriptKind.JS;
    return ts.ScriptKind.TS;
  }
}
