import path from "node:path";
import { Language } from "@mahiva/shared";
import { LanguageDefinition, IGrammarLoader } from "../types.js";
import { BUILTIN_LANGUAGES } from "../definitions/index.js";

export class LanguageRegistry {
  private definitionsById = new Map<Language, LanguageDefinition>();
  private definitionsByExt = new Map<string, LanguageDefinition>();
  private definitionsByFilename = new Map<string, LanguageDefinition>();
  private grammarLoader?: IGrammarLoader;

  constructor(grammarLoader?: IGrammarLoader) {
    this.grammarLoader = grammarLoader;
    this.registerDefaults();
  }

  public register(definition: LanguageDefinition): void {
    this.definitionsById.set(definition.id, definition);

    for (const ext of definition.extensions) {
      this.definitionsByExt.set(ext.toLowerCase(), definition);
    }

    if (definition.filenames) {
      for (const name of definition.filenames) {
        this.definitionsByFilename.set(name.toLowerCase(), definition);
      }
    }
  }

  public getByLanguage(language: Language): LanguageDefinition | undefined {
    return this.definitionsById.get(language);
  }

  public getByFilePath(filePath: string): LanguageDefinition | undefined {
    const filename = path.basename(filePath).toLowerCase();
    if (this.definitionsByFilename.has(filename)) {
      return this.definitionsByFilename.get(filename);
    }

    const ext = path.extname(filePath).toLowerCase();
    return this.definitionsByExt.get(ext);
  }

  public isSupported(filePath: string): boolean {
    return this.getByFilePath(filePath) !== undefined;
  }

  public listLanguages(): LanguageDefinition[] {
    return Array.from(this.definitionsById.values());
  }

  public setGrammarLoader(loader: IGrammarLoader): void {
    this.grammarLoader = loader;
  }

  public async loadGrammarFor(language: Language): Promise<unknown> {
    if (!this.grammarLoader) {
      throw new Error(`Grammar loader not configured in LanguageRegistry`);
    }

    const def = this.getByLanguage(language);
    if (!def || !def.treeSitterGrammarName) {
      throw new Error(`Language '${language}' does not define a Tree-sitter grammar`);
    }

    return this.grammarLoader.loadGrammar(def.treeSitterGrammarName);
  }

  private registerDefaults(): void {
    for (const def of BUILTIN_LANGUAGES) {
      this.register(def);
    }
  }
}

export const defaultLanguageRegistry = new LanguageRegistry();
