import { describe, it, expect } from "vitest";
import { extractImports, extractExports } from "../src/index.js";
import { Language } from "@mahiva/shared";
import * as ts from "typescript";

describe("@mahiva/imports", () => {
  it("extracts import statements from TypeScript source", () => {
    const source = `
      import type { User } from './types';
      import { login } from './auth';
      import auth from './auth';
    `;

    const file = ts.createSourceFile("src/index.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

    const imports = extractImports({
      fileId: "src/index.ts",
      language: Language.TYPESCRIPT,
      contentHash: "hash",
      rootNode: {
        id: "root",
        kind: "root",
        name: "src/index.ts",
        range: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } },
        children: [],
      },
      rawAst: file,
    });

    expect(imports).toHaveLength(3);
    expect(imports[0]?.moduleSpecifier).toBe("./types");
    expect(imports[0]?.isTypeOnly).toBe(true);
    expect(imports[1]?.symbols[0]?.importedName).toBe("login");
    expect(imports[2]?.symbols[0]?.alias).toBe("auth");
  });

  it("extracts export statements from TypeScript source", () => {
    const source = `
      export { login } from './auth';
      export default function app() {}
    `;

    const file = ts.createSourceFile("src/index.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

    const exports = extractExports({
      fileId: "src/index.ts",
      language: Language.TYPESCRIPT,
      contentHash: "hash",
      rootNode: {
        id: "root",
        kind: "root",
        name: "src/index.ts",
        range: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } },
        children: [],
      },
      rawAst: file,
    });

    expect(exports).toHaveLength(2);
    expect(exports[0]?.exportedName).toBe("login");
    expect(exports[1]?.isDefault).toBe(true);
  });
});
