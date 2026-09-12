import { Language, ParsedSourceFile, NormalizedAstNode, SourceRange, SymbolKind } from "@mahiva/shared";
import { LanguageRegistry, defaultLanguageRegistry } from "@mahiva/languages";
import { IParserEngine, ParseOptions } from "../types.js";

export class TreeSitterParserEngine implements IParserEngine {
  public readonly engineName = "tree-sitter";
  private registry: LanguageRegistry;

  constructor(registry?: LanguageRegistry) {
    this.registry = registry ?? defaultLanguageRegistry;
  }

  public supports(language: Language): boolean {
    const def = this.registry.getByLanguage(language);
    return def !== undefined && def.treeSitterGrammarName !== undefined;
  }

  public async parse(options: ParseOptions): Promise<ParsedSourceFile> {
    const { filePath, sourceText, language, contentHash = "" } = options;
    const def = this.registry.getByLanguage(language);

    if (!def) {
      throw new Error(`Unsupported Tree-sitter language: ${language}`);
    }

    // Normalized root AST node representation
    const lines = sourceText.split("\n");
    const totalLines = lines.length;
    const lastLineLength = lines[totalLines - 1]?.length ?? 0;

    const fullRange: SourceRange = {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: totalLines, column: lastLineLength + 1, offset: sourceText.length },
    };

    const rootNode: NormalizedAstNode = {
      id: `${filePath}#root`,
      kind: "root",
      name: filePath,
      range: fullRange,
      children: [],
      metadata: {
        grammar: def.treeSitterGrammarName,
        language,
      },
    };

    return {
      fileId: filePath,
      language,
      contentHash,
      rootNode,
    };
  }
}
