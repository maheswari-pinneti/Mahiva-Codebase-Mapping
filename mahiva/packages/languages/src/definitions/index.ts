import { Language } from "@mahiva/shared";
import { LanguageDefinition } from "../types.js";

export const TypeScriptDefinition: LanguageDefinition = {
  id: Language.TYPESCRIPT,
  displayName: "TypeScript",
  extensions: [".ts", ".mts", ".cts"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-typescript",
  supportsCompilerApi: true,
  queryPatterns: {
    functions: `(function_declaration name: (identifier) @name) @function`,
    classes: `(class_declaration name: (type_identifier) @name) @class`,
    interfaces: `(interface_declaration name: (type_identifier) @name) @interface`,
    methods: `(method_definition name: (property_identifier) @name) @method`,
    imports: `(import_statement) @import`,
    exports: `(export_statement) @export`,
    calls: `(call_expression function: [(identifier) (member_expression)] @call)`,
  },
};

export const TSXDefinition: LanguageDefinition = {
  id: Language.TSX,
  displayName: "TypeScript React (TSX)",
  extensions: [".tsx"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-tsx",
  supportsCompilerApi: true,
  queryPatterns: {
    ...TypeScriptDefinition.queryPatterns,
  },
};

export const JavaScriptDefinition: LanguageDefinition = {
  id: Language.JAVASCRIPT,
  displayName: "JavaScript",
  extensions: [".js", ".mjs", ".cjs"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-javascript",
  supportsCompilerApi: true,
  queryPatterns: {
    functions: `(function_declaration name: (identifier) @name) @function`,
    classes: `(class_declaration name: (identifier) @name) @class`,
    methods: `(method_definition name: (property_identifier) @name) @method`,
    imports: `(import_statement) @import`,
    exports: `(export_statement) @export`,
    calls: `(call_expression function: [(identifier) (member_expression)] @call)`,
  },
};

export const JSXDefinition: LanguageDefinition = {
  id: Language.JSX,
  displayName: "JavaScript React (JSX)",
  extensions: [".jsx"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-javascript",
  supportsCompilerApi: true,
  queryPatterns: {
    ...JavaScriptDefinition.queryPatterns,
  },
};

export const PythonDefinition: LanguageDefinition = {
  id: Language.PYTHON,
  displayName: "Python",
  extensions: [".py", ".pyw"],
  singleLineComment: "#",
  multiLineComment: { start: '"""', end: '"""' },
  treeSitterGrammarName: "tree-sitter-python",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_definition name: (identifier) @name) @function`,
    classes: `(class_definition name: (identifier) @name) @class`,
    imports: `[(import_statement) (import_from_statement)] @import`,
    calls: `(call function: [(identifier) (attribute)] @call)`,
  },
};

export const GoDefinition: LanguageDefinition = {
  id: Language.GO,
  displayName: "Go",
  extensions: [".go"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-go",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_declaration name: (identifier) @name) @function`,
    methods: `(method_declaration name: (field_identifier) @name) @method`,
    imports: `(import_declaration) @import`,
    calls: `(call_expression function: [(identifier) (selector_expression)] @call)`,
  },
};

export const RustDefinition: LanguageDefinition = {
  id: Language.RUST,
  displayName: "Rust",
  extensions: [".rs"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-rust",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_item name: (identifier) @name) @function`,
    classes: `(struct_item name: (type_identifier) @name) @class`,
    interfaces: `(trait_item name: (type_identifier) @name) @interface`,
    imports: `(use_declaration) @import`,
    calls: `(call_expression function: [(identifier) (field_expression)] @call)`,
  },
};

export const BUILTIN_LANGUAGES: LanguageDefinition[] = [
  TypeScriptDefinition,
  TSXDefinition,
  JavaScriptDefinition,
  JSXDefinition,
  PythonDefinition,
  GoDefinition,
  RustDefinition,
];
