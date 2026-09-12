import { Language } from "@mahiva/shared";

export interface TreeSitterQueryPatterns {
  functions?: string;
  classes?: string;
  interfaces?: string;
  methods?: string;
  imports?: string;
  exports?: string;
  calls?: string;
}

export interface LanguageDefinition {
  id: Language;
  displayName: string;
  extensions: string[];
  filenames?: string[];
  singleLineComment: string;
  multiLineComment?: {
    start: string;
    end: string;
  };
  treeSitterGrammarName?: string;
  queryPatterns: TreeSitterQueryPatterns;
  supportsCompilerApi: boolean;
}

export interface IGrammarLoader {
  loadGrammar(grammarName: string): Promise<unknown>;
  hasGrammar(grammarName: string): boolean;
}
