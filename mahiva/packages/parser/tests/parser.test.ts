import { describe, it, expect } from "vitest";
import { UnifiedParser, TypeScriptParserEngine, TreeSitterParserEngine } from "../src/index.js";
import { Language, SymbolKind } from "@mahiva/shared";

describe("@mahiva/parser - TypeScript Compiler API Engine", () => {
  const tsEngine = new TypeScriptParserEngine();

  it("parses TypeScript declarations into normalized AST nodes", async () => {
    const source = `
      export interface User {
        id: string;
        name: string;
      }

      export class AuthService {
        public async login(username: string): Promise<boolean> {
          return true;
        }
      }
    `;

    const parsed = await tsEngine.parse({
      filePath: "src/auth.ts",
      sourceText: source,
      language: Language.TYPESCRIPT,
    });

    expect(parsed.fileId).toBe("src/auth.ts");
    expect(parsed.language).toBe(Language.TYPESCRIPT);
    expect(parsed.rootNode.kind).toBe("root");

    // Traverse root children
    const childKinds = parsed.rootNode.children.map((c) => c.kind);
    expect(childKinds).toContain(SymbolKind.INTERFACE);
    expect(childKinds).toContain(SymbolKind.CLASS);

    const classNode = parsed.rootNode.children.find((c) => c.kind === SymbolKind.CLASS);
    expect(classNode?.name).toBe("AuthService");
  });

  it("calculates accurate 1-indexed source line and column coordinates", async () => {
    const source = "function greet(): string {\n  return 'hello';\n}";

    const parsed = await tsEngine.parse({
      filePath: "src/greet.ts",
      sourceText: source,
      language: Language.TYPESCRIPT,
    });

    const fnNode = parsed.rootNode.children.find((c) => c.kind === SymbolKind.FUNCTION);
    expect(fnNode).toBeDefined();
    expect(fnNode?.name).toBe("greet");
    expect(fnNode?.range.start.line).toBe(1);
    expect(fnNode?.range.start.column).toBe(1);
    expect(fnNode?.range.end.line).toBe(3);
  });
});

describe("@mahiva/parser - Tree-sitter Engine", () => {
  const treeSitterEngine = new TreeSitterParserEngine();

  it("supports polyglot languages registered in the registry", () => {
    expect(treeSitterEngine.supports(Language.PYTHON)).toBe(true);
    expect(treeSitterEngine.supports(Language.GO)).toBe(true);
    expect(treeSitterEngine.supports(Language.RUST)).toBe(true);
  });

  it("parses source into a canonical root node structure", async () => {
    const source = "def calculate_total(items):\n    return sum(items)\n";

    const parsed = await treeSitterEngine.parse({
      filePath: "services/calc.py",
      sourceText: source,
      language: Language.PYTHON,
    });

    expect(parsed.fileId).toBe("services/calc.py");
    expect(parsed.language).toBe(Language.PYTHON);
    expect(parsed.rootNode.range.start.line).toBe(1);
  });
});

describe("@mahiva/parser - UnifiedParser Router", () => {
  const parser = new UnifiedParser();

  it("routes TypeScript code to TypeScript engine and Python to Tree-sitter", async () => {
    expect(parser.canParse(Language.TYPESCRIPT)).toBe(true);
    expect(parser.canParse(Language.PYTHON)).toBe(true);
    expect(parser.canParse(Language.UNKNOWN)).toBe(false);

    const tsResult = await parser.parse({
      filePath: "test.ts",
      sourceText: "const x = 10;",
      language: Language.TYPESCRIPT,
    });
    expect(tsResult.rootNode).toBeDefined();
  });
});
