import { CodeSymbol, ParsedSourceFile, SymbolKind } from "@mahiva/shared";

export interface SymbolExtractionOptions {
  includeNested?: boolean;
  includeAnonymous?: boolean;
  targetKinds?: SymbolKind[];
}

export interface SymbolTable {
  fileId: string;
  symbols: CodeSymbol[];
  byCanonicalName: Map<string, CodeSymbol>;
  byKind: Map<SymbolKind, CodeSymbol[]>;
}

export interface ISymbolExtractor {
  extractSymbols(parsedFile: ParsedSourceFile, options?: SymbolExtractionOptions): SymbolTable;
}
