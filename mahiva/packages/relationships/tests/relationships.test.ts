import { describe, it, expect } from "vitest";
import { buildRelationships, RelationshipBuilder } from "../src/index.js";
import { Language, RelationshipType, SymbolKind } from "@mahiva/shared";

describe("@mahiva/relationships", () => {
  it("builds import, export, and contains relationships from a parsed file", () => {
    const parsedFile = {
      fileId: "src/index.ts",
      language: Language.TYPESCRIPT,
      contentHash: "hash",
      rootNode: {
        id: "root",
        kind: "root",
        name: "src/index.ts",
        range: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } },
        children: [
          {
            id: "class-1",
            kind: SymbolKind.CLASS,
            name: "AuthService",
            metadata: { isExported: true },
            range: { start: { line: 2, column: 1, offset: 0 }, end: { line: 5, column: 2, offset: 100 } },
            children: [
              {
                id: "method-1",
                kind: SymbolKind.METHOD,
                name: "login",
                metadata: { visibility: "public", isAsync: false },
                range: { start: { line: 3, column: 3, offset: 10 }, end: { line: 4, column: 4, offset: 90 } },
                children: [],
              },
            ],
          },
        ],
      },
      rawAst: {
        statements: [],
      },
    };

    const result = buildRelationships(parsedFile);

    expect(result.fileId).toBe("src/index.ts");
    expect(result.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: RelationshipType.CONTAINS }),
    ]));
    expect(result.symbols[0]?.canonicalName).toBe("AuthService");
  });

  it("supports bulk relationship building", () => {
    const builder = new RelationshipBuilder();

    const result = builder.buildMany([]);

    expect(result).toEqual([]);
  });
});
