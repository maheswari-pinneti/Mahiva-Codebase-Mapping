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

export const JavaDefinition: LanguageDefinition = {
  id: Language.JAVA,
  displayName: "Java",
  extensions: [".java"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-java",
  supportsCompilerApi: false,
  queryPatterns: {
    classes: `(class_declaration name: (identifier) @name) @class`,
    interfaces: `(interface_declaration name: (identifier) @name) @interface`,
    imports: `(import_declaration) @import`,
    calls: `(method_invocation name: (identifier) @call)`,
  },
};

export const CDefinition: LanguageDefinition = {
  id: Language.C,
  displayName: "C",
  extensions: [".c", ".h"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-c",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_definition name: (identifier) @name) @function`,
    classes: `(struct_specifier name: (type_identifier) @name) @class`,
    imports: `(preproc_include) @import`,
    calls: `(call_expression function: (identifier) @call)`,
  },
};

export const CPPDefinition: LanguageDefinition = {
  id: Language.CPP,
  displayName: "C++",
  extensions: [".cpp", ".cc", ".cxx", ".hpp", ".hh", ".hxx"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-cpp",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_definition name: (identifier) @name) @function`,
    classes: `(class_specifier name: (type_identifier) @name) @class`,
    interfaces: `(struct_specifier name: (type_identifier) @name) @interface`,
    imports: `(preproc_include) @import`,
    calls: `(call_expression function: (identifier) @call)`,
  },
};

export const CSharpDefinition: LanguageDefinition = {
  id: Language.CSHARP,
  displayName: "C#",
  extensions: [".cs"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-c-sharp",
  supportsCompilerApi: false,
  queryPatterns: {
    classes: `(class_declaration name: (identifier) @name) @class`,
    interfaces: `(interface_declaration name: (identifier) @name) @interface`,
    imports: `(using_directive) @import`,
    calls: `(invocation_expression function: (identifier) @call)`,
  },
};

export const PHPDefinition: LanguageDefinition = {
  id: Language.PHP,
  displayName: "PHP",
  extensions: [".php"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-php",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_definition name: (name) @name) @function`,
    classes: `(class_declaration name: (name) @name) @class`,
    imports: `(namespace_use_declaration) @import`,
    calls: `(function_call_expression function: (name) @call)`,
  },
};

export const RubyDefinition: LanguageDefinition = {
  id: Language.RUBY,
  displayName: "Ruby",
  extensions: [".rb"],
  singleLineComment: "#",
  multiLineComment: { start: "=begin", end: "=end" },
  treeSitterGrammarName: "tree-sitter-ruby",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(method name: (identifier) @name) @function`,
    classes: `(class name: (constant) @name) @class`,
    imports: `(command (identifier) @import)`,
    calls: `(call receiver: (constant) @call)`,
  },
};

export const KotlinDefinition: LanguageDefinition = {
  id: Language.KOTLIN,
  displayName: "Kotlin",
  extensions: [".kt", ".kts"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-kotlin",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_declaration (simple_identifier) @name) @function`,
    classes: `(class_declaration (type_identifier) @name) @class`,
    interfaces: `(interface_declaration (type_identifier) @name) @interface`,
    imports: `(import_list) @import`,
    calls: `(call_expression (simple_identifier) @call)`,
  },
};

export const SwiftDefinition: LanguageDefinition = {
  id: Language.SWIFT,
  displayName: "Swift",
  extensions: [".swift"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-swift",
  supportsCompilerApi: false,
  queryPatterns: {
    functions: `(function_declaration name: (simple_identifier) @name) @function`,
    classes: `(class_declaration name: (type_identifier) @name) @class`,
    interfaces: `(protocol_declaration name: (type_identifier) @name) @interface`,
    imports: `(import_declaration) @import`,
    calls: `(function_call_expression function: (simple_identifier) @call)`,
  },
};

export const JSONDefinition: LanguageDefinition = {
  id: Language.JSON,
  displayName: "JSON",
  extensions: [".json"],
  singleLineComment: "//",
  multiLineComment: { start: "/*", end: "*/" },
  treeSitterGrammarName: "tree-sitter-json",
  supportsCompilerApi: false,
  queryPatterns: {},
};

export const YAMLDefinition: LanguageDefinition = {
  id: Language.YAML,
  displayName: "YAML",
  extensions: [".yaml", ".yml"],
  singleLineComment: "#",
  treeSitterGrammarName: "tree-sitter-yaml",
  supportsCompilerApi: false,
  queryPatterns: {},
};

export const MarkdownDefinition: LanguageDefinition = {
  id: Language.MARKDOWN,
  displayName: "Markdown",
  extensions: [".md", ".markdown"],
  singleLineComment: "<!--",
  multiLineComment: { start: "<!--", end: "-->" },
  treeSitterGrammarName: "tree-sitter-markdown",
  supportsCompilerApi: false,
  queryPatterns: {},
};

export const BUILTIN_LANGUAGES: LanguageDefinition[] = [
  TypeScriptDefinition,
  TSXDefinition,
  JavaScriptDefinition,
  JSXDefinition,
  PythonDefinition,
  GoDefinition,
  RustDefinition,
  JavaDefinition,
  CDefinition,
  CPPDefinition,
  CSharpDefinition,
  PHPDefinition,
  RubyDefinition,
  KotlinDefinition,
  SwiftDefinition,
  JSONDefinition,
  YAMLDefinition,
  MarkdownDefinition,
];
