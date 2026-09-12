import { Language, ParsedSourceFile } from "@mahiva/shared";
import { IParserEngine, ParseOptions } from "./types.js";
import { TypeScriptParserEngine } from "./engines/typescript-engine.js";
import { TreeSitterParserEngine } from "./engines/tree-sitter-engine.js";

export class UnifiedParser {
  private engines: IParserEngine[] = [];

  constructor() {
    // TypeScript Compiler API engine takes priority for JS/TS semantic fidelity
    this.registerEngine(new TypeScriptParserEngine());
    // Polyglot Tree-sitter engine serves cross-language and fallback queries
    this.registerEngine(new TreeSitterParserEngine());
  }

  public registerEngine(engine: IParserEngine): void {
    this.engines.unshift(engine); // Register at the beginning so newer engines have higher priority
  }

  public async parse(options: ParseOptions): Promise<ParsedSourceFile> {
    const engine = this.engines.find((e) => e.supports(options.language));

    if (!engine) {
      throw new Error(`No parser engine available for language: ${options.language}`);
    }

    return engine.parse(options);
  }

  public canParse(language: Language): boolean {
    return this.engines.some((e) => e.supports(language));
  }
}

export const defaultUnifiedParser = new UnifiedParser();
