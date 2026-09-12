import { describe, it, expect, beforeEach } from "vitest";
import {
  LanguageRegistry,
  LanguageDefinition,
  IGrammarLoader,
} from "../src/index.js";
import { Language } from "@mahiva/shared";

describe("@mahiva/languages - LanguageRegistry", () => {
  let registry: LanguageRegistry;

  beforeEach(() => {
    registry = new LanguageRegistry();
  });

  it("registers built-in definitions by default", () => {
    expect(registry.getByLanguage(Language.TYPESCRIPT)).toBeDefined();
    expect(registry.getByLanguage(Language.PYTHON)).toBeDefined();
    expect(registry.getByLanguage(Language.GO)).toBeDefined();
    expect(registry.getByLanguage(Language.RUST)).toBeDefined();
    expect(registry.getByLanguage(Language.JAVA)).toBeDefined();
    expect(registry.getByLanguage(Language.CPP)).toBeDefined();
    expect(registry.getByLanguage(Language.JSON)).toBeDefined();
    expect(registry.getByLanguage(Language.MARKDOWN)).toBeDefined();
  });

  it("resolves definitions by file path and extension", () => {
    const tsDef = registry.getByFilePath("src/auth/service.ts");
    expect(tsDef?.id).toBe(Language.TYPESCRIPT);
    expect(tsDef?.supportsCompilerApi).toBe(true);

    const pyDef = registry.getByFilePath("scripts/generate.py");
    expect(pyDef?.id).toBe(Language.PYTHON);
    expect(pyDef?.singleLineComment).toBe("#");

    const rsDef = registry.getByFilePath("crates/engine/main.rs");
    expect(rsDef?.id).toBe(Language.RUST);

    const javaDef = registry.getByFilePath("src/main/java/com/example/App.java");
    expect(javaDef?.id).toBe(Language.JAVA);

    const yamlDef = registry.getByFilePath("config/deploy.yaml");
    expect(yamlDef?.id).toBe(Language.YAML);

    const mdDef = registry.getByFilePath("docs/overview.md");
    expect(mdDef?.id).toBe(Language.MARKDOWN);
  });

  it("supports dynamic registration of custom languages", () => {
    const customLang: LanguageDefinition = {
      id: Language.KOTLIN,
      displayName: "Kotlin",
      extensions: [".kt", ".kts"],
      singleLineComment: "//",
      queryPatterns: {},
      supportsCompilerApi: false,
    };

    registry.register(customLang);

    const resolved = registry.getByFilePath("app/src/Main.kt");
    expect(resolved?.displayName).toBe("Kotlin");
    expect(resolved?.id).toBe(Language.KOTLIN);
  });

  it("delegates to grammar loader when requested", async () => {
    const mockLoader: IGrammarLoader = {
      hasGrammar: (name: string) => name === "tree-sitter-typescript",
      loadGrammar: async (name: string) => ({ loaded: name }),
    };

    registry.setGrammarLoader(mockLoader);

    const grammar = await registry.loadGrammarFor(Language.TYPESCRIPT);
    expect(grammar).toEqual({ loaded: "tree-sitter-typescript" });
  });

  it("throws descriptive error when loading grammar without loader", async () => {
    await expect(registry.loadGrammarFor(Language.TYPESCRIPT)).rejects.toThrow(
      /Grammar loader not configured/
    );
  });
});
