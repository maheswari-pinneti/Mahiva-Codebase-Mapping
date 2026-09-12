import { AstSymbolExtractor, type SymbolTable } from "@mahiva/symbols";
import { extractExports, extractImports } from "@mahiva/imports";
import type {
  CodeSymbol,
  ExportStatement,
  ImportStatement,
  Language,
  ParsedSourceFile,
} from "@mahiva/shared";

export interface FileAnalysis {
  fileId: string;
  language: Language;
  imports: ImportStatement[];
  exports: ExportStatement[];
  symbols: CodeSymbol[];
  symbolTable: SymbolTable;
  publicSymbols: CodeSymbol[];
  localImports: ImportStatement[];
  importedModules: string[];
  exportedNames: string[];
  hasDefaultExport: boolean;
}

export interface AnalysisSummary {
  files: FileAnalysis[];
  byFileId: Map<string, FileAnalysis>;
  totalFiles: number;
  totalSymbols: number;
  totalImports: number;
  totalExports: number;
}

export class CodebaseAnalyzer {
  private readonly symbolExtractor: AstSymbolExtractor;

  public constructor(
    symbolExtractor: AstSymbolExtractor = new AstSymbolExtractor(),
  ) {
    this.symbolExtractor = symbolExtractor;
  }

  public analyze(parsedFile: ParsedSourceFile): FileAnalysis {
    const symbolTable = this.symbolExtractor.extractSymbols(parsedFile);
    const imports = extractImports(parsedFile);
    const exports = extractExports(parsedFile);

    const exportedNames = new Set(
      exports
        .filter((statement) => !statement.isDefault)
        .map((statement) => statement.exportedName),
    );

    const normalizedSymbols = symbolTable.symbols.map((symbol) => {
      const isLocallyExported =
        symbol.isExported ||
        (symbol.parentId === undefined && exportedNames.has(symbol.name));

      return {
        ...symbol,
        isExported: isLocallyExported,
      };
    });

    const enrichedSymbolTable: SymbolTable = {
      fileId: symbolTable.fileId,
      symbols: normalizedSymbols,
      byCanonicalName: new Map<string, CodeSymbol>(),
      byKind: new Map(),
    };

    for (const symbol of normalizedSymbols) {
      enrichedSymbolTable.byCanonicalName.set(symbol.canonicalName, symbol);

      const existing = enrichedSymbolTable.byKind.get(symbol.kind) ?? [];
      existing.push(symbol);
      enrichedSymbolTable.byKind.set(symbol.kind, existing);
    }

    const publicSymbols = normalizedSymbols.filter(
      (symbol) => symbol.isExported,
    );
    const localImports = imports.filter((statement) => !statement.isExternal);

    return {
      fileId: parsedFile.fileId,
      language: parsedFile.language,
      imports,
      exports,
      symbols: normalizedSymbols,
      symbolTable: enrichedSymbolTable,
      publicSymbols,
      localImports,
      importedModules: imports.map((statement) => statement.moduleSpecifier),
      exportedNames: exports.map((statement) => statement.exportedName),
      hasDefaultExport: exports.some((statement) => statement.isDefault),
    };
  }

  public analyzeMany(parsedFiles: ParsedSourceFile[]): AnalysisSummary {
    const files = parsedFiles.map((parsedFile) => this.analyze(parsedFile));
    const byFileId = new Map<string, FileAnalysis>();

    for (const file of files) {
      byFileId.set(file.fileId, file);
    }

    return {
      files,
      byFileId,
      totalFiles: files.length,
      totalSymbols: files.reduce(
        (count, file) => count + file.symbols.length,
        0,
      ),
      totalImports: files.reduce(
        (count, file) => count + file.imports.length,
        0,
      ),
      totalExports: files.reduce(
        (count, file) => count + file.exports.length,
        0,
      ),
    };
  }
}

export const defaultAnalyzer = new CodebaseAnalyzer();

export function analyzeParsedFile(parsedFile: ParsedSourceFile): FileAnalysis {
  return defaultAnalyzer.analyze(parsedFile);
}

export function analyzeParsedFiles(
  parsedFiles: ParsedSourceFile[],
): AnalysisSummary {
  return defaultAnalyzer.analyzeMany(parsedFiles);
}

export const PACKAGE_NAME = "@mahiva/analyzer";
