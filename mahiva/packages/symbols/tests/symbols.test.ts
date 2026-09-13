import { describe, it, expect } from "vitest";
import { AstSymbolExtractor } from "../src/index.js";
import {
  Language,
  ParsedSourceFile,
  SymbolKind,
  Visibility,
} from "@mahiva/shared";

describe("@mahiva/symbols - AstSymbolExtractor", () => {
  const extractor = new AstSymbolExtractor();

  const mockParsedFile: ParsedSourceFile = {
    fileId: "src/auth/service.ts",
    language: Language.TYPESCRIPT,
    contentHash: "hash-abc-123",
    rootNode: {
      id: "src/auth/service.ts#root",
      kind: "root",
      name: "src/auth/service.ts",
      range: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 30, column: 1, offset: 800 },
      },
      children: [
        {
          id: "src/auth/service.ts#class_1",
          kind: SymbolKind.CLASS,
          name: "AuthService",
          range: {
            start: { line: 2, column: 1, offset: 10 },
            end: { line: 20, column: 2, offset: 500 },
          },
          metadata: {
            isExported: true,
          },
          children: [
            {
              id: "src/auth/service.ts#method_1",
              kind: SymbolKind.METHOD,
              name: "login",
              range: {
                start: { line: 5, column: 3, offset: 80 },
                end: { line: 12, column: 4, offset: 250 },
              },
              metadata: {
                visibility: Visibility.PUBLIC,
                isAsync: true,
                signature: "login(credentials: Credentials): Promise<Session>",
              },
              children: [],
            },
            {
              id: "src/auth/service.ts#property_1",
              kind: SymbolKind.PROPERTY,
              name: "tokenSecret",
              range: {
                start: { line: 15, column: 3, offset: 300 },
                end: { line: 15, column: 35, offset: 332 },
              },
              metadata: {
                visibility: Visibility.PRIVATE,
              },
              children: [],
            },
          ],
        },
        {
          id: "src/auth/service.ts#interface_1",
          kind: SymbolKind.INTERFACE,
          name: "Credentials",
          range: {
            start: { line: 22, column: 1, offset: 520 },
            end: { line: 26, column: 2, offset: 610 },
          },
          metadata: {
            isExported: true,
          },
          children: [],
        },
      ],
    },
  };

  it("extracts all declared symbols with accurate parentage and canonical names", () => {
    const table = extractor.extractSymbols(mockParsedFile);

    expect(table.symbols.length).toBe(4);

    const classSym = table.byCanonicalName.get("AuthService");
    expect(classSym).toBeDefined();
    expect(classSym?.kind).toBe(SymbolKind.CLASS);
    expect(classSym?.isExported).toBe(true);

    const methodSym = table.byCanonicalName.get("AuthService.login");
    expect(methodSym).toBeDefined();
    expect(methodSym?.kind).toBe(SymbolKind.METHOD);
    expect(methodSym?.isAsync).toBe(true);
    expect(methodSym?.signature).toBe(
      "login(credentials: Credentials): Promise<Session>",
    );
    expect(methodSym?.visibility).toBe(Visibility.PUBLIC);

    const propSym = table.byCanonicalName.get("AuthService.tokenSecret");
    expect(propSym).toBeDefined();
    expect(propSym?.visibility).toBe(Visibility.PRIVATE);
  });

  it("indexes symbols cleanly by SymbolKind", () => {
    const table = extractor.extractSymbols(mockParsedFile);

    const classes = table.byKind.get(SymbolKind.CLASS) ?? [];
    const methods = table.byKind.get(SymbolKind.METHOD) ?? [];
    const interfaces = table.byKind.get(SymbolKind.INTERFACE) ?? [];

    expect(classes.length).toBe(1);
    expect(methods.length).toBe(1);
    expect(interfaces.length).toBe(1);
    expect(interfaces[0]?.name).toBe("Credentials");
  });

  it("filters extraction by target kinds when requested", () => {
    const table = extractor.extractSymbols(mockParsedFile, {
      targetKinds: [SymbolKind.INTERFACE],
    });

    expect(table.symbols.length).toBe(1);
    expect(table.symbols[0]?.name).toBe("Credentials");
    expect(table.byCanonicalName.has("AuthService")).toBe(false);
  });
});
