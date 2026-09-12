export type { SymbolExtractionOptions, SymbolTable, ISymbolExtractor } from "./types.js";
export { AstSymbolExtractor } from "./extractors/ast-extractor.js";

import { AstSymbolExtractor } from "./extractors/ast-extractor.js";
export const defaultSymbolExtractor = new AstSymbolExtractor();
