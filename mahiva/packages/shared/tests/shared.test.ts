import { describe, it, expect } from "vitest";
import {
  Language,
  SymbolKind,
  RelationshipType,
  Visibility,
  FileDescriptor,
  CodeSymbol,
  SHARED_VERSION
} from "../src/index.js";

describe("@mahiva/shared Domain Enums", () => {
  it("should contain standard supported languages", () => {
    expect(Language.TYPESCRIPT).toBe("typescript");
    expect(Language.PYTHON).toBe("python");
    expect(Language.GO).toBe("go");
    expect(Language.RUST).toBe("rust");
  });

  it("should have expected relationship definitions", () => {
    expect(RelationshipType.CALLS).toBe("CALLS");
    expect(RelationshipType.IMPORTS).toBe("IMPORTS");
    expect(RelationshipType.EXTENDS).toBe("EXTENDS");
    expect(RelationshipType.CONTAINS).toBe("CONTAINS");
  });

  it("should have discrete SymbolKind values", () => {
    expect(SymbolKind.FUNCTION).toBe("function");
    expect(SymbolKind.CLASS).toBe("class");
    expect(SymbolKind.INTERFACE).toBe("interface");
  });
});

describe("@mahiva/shared Entity Instantiation", () => {
  it("should instantiate a valid FileDescriptor contract", () => {
    const file: FileDescriptor = {
      id: "file-uuid-001",
      repositoryId: "repo-uuid-001",
      relativePath: "src/auth/service.ts",
      absolutePath: "/project/src/auth/service.ts",
      name: "service.ts",
      extension: ".ts",
      language: Language.TYPESCRIPT,
      sizeBytes: 1024,
      contentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      isTestFile: false,
      isIgnored: false,
    };

    expect(file.language).toBe(Language.TYPESCRIPT);
    expect(file.isTestFile).toBe(false);
  });

  it("should instantiate a valid CodeSymbol with source range", () => {
    const symbol: CodeSymbol = {
      id: "sym-001",
      fileId: "file-uuid-001",
      name: "login",
      canonicalName: "AuthService.login",
      kind: SymbolKind.METHOD,
      visibility: Visibility.PUBLIC,
      isExported: true,
      isAsync: true,
      range: {
        start: { line: 12, column: 2, offset: 240 },
        end: { line: 24, column: 3, offset: 510 },
      },
      signature: "async login(credentials: Credentials): Promise<Session>",
    };

    expect(symbol.kind).toBe(SymbolKind.METHOD);
    expect(symbol.range.start.line).toBe(12);
  });

  it("exports package version constant", () => {
    expect(SHARED_VERSION).toBe("0.1.0");
  });
});
