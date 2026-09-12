import { describe, it, expect } from "vitest";
import * as ts from "typescript";
import { analyzeParsedFile, analyzeParsedFiles, CodebaseAnalyzer } from "../src/index.js";
import { Language, SymbolKind } from "@mahiva/shared";

describe("@mahiva/analyzer", () => {
  it("analyzes imports, exports, and symbols for a parsed TypeScript file", () => {
    const source = `
      import type { User } from './types';

      export interface User { id: string; }
      export class AuthService {
        public login(user: User) {
          return user.id;
        }
      }
      export { AuthService as DefaultAuthService } from './auth';
    `;

    const file = ts.createSourceFile("src/index.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

    const result = analyzeParsedFile({
      fileId: "src/index.ts",
      language: Language.TYPESCRIPT,
      contentHash: "hash",
      rawAst: file,
      rootNode: {
        id: "root",
        kind: "root",
        name: "src/index.ts",
        range: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } },
        children: [
          {
            id: "interface",
            kind: SymbolKind.INTERFACE,
            name: "User",
            metadata: { isExported: true },
            range: { start: { line: 2, column: 7, offset: 7 }, end: { line: 2, column: 19, offset: 19 } },
            children: [],
          },
          {
            id: "class",
            kind: SymbolKind.CLASS,
            name: "AuthService",
            metadata: { isExported: true },
            range: { start: { line: 3, column: 7, offset: 25 }, end: { line: 7, column: 8, offset: 80 } },
            children: [
              {
                id: "method",
                kind: SymbolKind.METHOD,
                name: "login",
                metadata: { visibility: "public", isExported: false },
                range: { start: { line: 4, column: 9, offset: 42 }, end: { line: 6, column: 10, offset: 72 } },
                children: [],
              },
            ],
          },
        ],
      },
    });

    expect(result.imports).toHaveLength(1);
    expect(result.exports).toHaveLength(3);
    expect(result.symbols.map((symbol) => symbol.canonicalName)).toContain("AuthService.login");
    expect(result.publicSymbols).toHaveLength(2);
    expect(result.hasDefaultExport).toBe(false);
    expect(result.importedModules).toContain("./types");
  });

  it("aggregates multiple parsed files into a summary", () => {
    const analyzer = new CodebaseAnalyzer();

    const summary = analyzer.analyzeMany([
      {
        fileId: "src/a.ts",
        language: Language.TYPESCRIPT,
        contentHash: "a",
        rootNode: {
          id: "root-a",
          kind: "root",
          name: "src/a.ts",
          range: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } },
          children: [],
        },
      },
      {
        fileId: "src/b.ts",
        language: Language.TYPESCRIPT,
        contentHash: "b",
        rootNode: {
          id: "root-b",
          kind: "root",
          name: "src/b.ts",
          range: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } },
          children: [],
        },
      },
    ]);

    expect(summary.totalFiles).toBe(2);
    expect(summary.totalSymbols).toBe(0);
    expect(summary.totalImports).toBe(0);
    expect(summary.totalExports).toBe(0);
    expect(summary.byFileId.get("src/a.ts")?.fileId).toBe("src/a.ts");
  });

  it("exposes the convenience function for analyzing multiple files", () => {
    const summary = analyzeParsedFiles([]);

    expect(summary.totalFiles).toBe(0);
    expect(summary.files).toEqual([]);
  });
});
