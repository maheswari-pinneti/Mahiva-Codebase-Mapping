import {
  CodeSymbol,
  NormalizedAstNode,
  ParsedSourceFile,
  SymbolKind,
  Visibility,
} from "@mahiva/shared";
import { walkAst } from "@mahiva/ast";
import { ISymbolExtractor, SymbolExtractionOptions, SymbolTable } from "../types.js";

const VALID_SYMBOL_KINDS = new Set<string>([
  SymbolKind.FUNCTION,
  SymbolKind.METHOD,
  SymbolKind.CLASS,
  SymbolKind.INTERFACE,
  SymbolKind.TYPE_ALIAS,
  SymbolKind.ENUM,
  SymbolKind.ENUM_MEMBER,
  SymbolKind.VARIABLE,
  SymbolKind.CONSTANT,
  SymbolKind.PROPERTY,
  SymbolKind.CONSTRUCTOR,
]);

export class AstSymbolExtractor implements ISymbolExtractor {
  public extractSymbols(
    parsedFile: ParsedSourceFile,
    options: SymbolExtractionOptions = {}
  ): SymbolTable {
    const symbols: CodeSymbol[] = [];
    const byCanonicalName = new Map<string, CodeSymbol>();
    const byKind = new Map<SymbolKind, CodeSymbol[]>();

    const targetKinds = options.targetKinds ? new Set(options.targetKinds) : null;
    const includeAnonymous = options.includeAnonymous ?? false;

    walkAst(parsedFile.rootNode, (node: NormalizedAstNode, context) => {
      // Only process recognized SymbolKinds
      if (!VALID_SYMBOL_KINDS.has(node.kind)) {
        return;
      }

      const kind = node.kind as SymbolKind;

      if (targetKinds && !targetKinds.has(kind)) {
        return;
      }

      if (!includeAnonymous && (node.name === "anonymous" || !node.name)) {
        return;
      }

      // Determine parent scope hierarchy
      const parentSymbol = context.ancestors
        .slice()
        .reverse()
        .find((ancestor) => VALID_SYMBOL_KINDS.has(ancestor.kind));

      const canonicalName = parentSymbol
        ? `${parentSymbol.name}.${node.name}`
        : node.name;

      const symbolId = `sym:${parsedFile.fileId}#${canonicalName}:${node.range.start.line}:${node.range.start.column}`;

      const codeSymbol: CodeSymbol = {
        id: symbolId,
        fileId: parsedFile.fileId,
        name: node.name,
        canonicalName,
        kind,
        range: node.range,
        signature: typeof node.metadata?.signature === "string" ? node.metadata.signature : undefined,
        visibility: (node.metadata?.visibility as Visibility) ?? Visibility.PUBLIC,
        isExported: Boolean(node.metadata?.isExported ?? false),
        isAsync: Boolean(node.metadata?.isAsync ?? false),
        parentId: parentSymbol?.id,
      };

      symbols.push(codeSymbol);
      byCanonicalName.set(canonicalName, codeSymbol);

      const existingForKind = byKind.get(kind) ?? [];
      existingForKind.push(codeSymbol);
      byKind.set(kind, existingForKind);
    });

    return {
      fileId: parsedFile.fileId,
      symbols,
      byCanonicalName,
      byKind,
    };
  }
}
