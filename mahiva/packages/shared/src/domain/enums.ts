export enum Language {
  TYPESCRIPT = "typescript",
  TSX = "tsx",
  JAVASCRIPT = "javascript",
  JSX = "jsx",
  PYTHON = "python",
  GO = "go",
  RUST = "rust",
  JAVA = "java",
  CPP = "cpp",
  C = "c",
  CSHARP = "csharp",
  PHP = "php",
  RUBY = "ruby",
  KOTLIN = "kotlin",
  SWIFT = "swift",
  JSON = "json",
  YAML = "yaml",
  MARKDOWN = "markdown",
  UNKNOWN = "unknown",
}

export enum SymbolKind {
  FUNCTION = "function",
  METHOD = "method",
  CLASS = "class",
  INTERFACE = "interface",
  TYPE_ALIAS = "type_alias",
  ENUM = "enum",
  ENUM_MEMBER = "enum_member",
  VARIABLE = "variable",
  CONSTANT = "constant",
  PROPERTY = "property",
  CONSTRUCTOR = "constructor",
  MODULE = "module",
  NAMESPACE = "namespace",
  GETTER = "getter",
  SETTER = "setter",
}

export enum Visibility {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  INTERNAL = "internal",
}

export enum RelationshipType {
  CONTAINS = "CONTAINS",
  IMPORTS = "IMPORTS",
  EXPORTS = "EXPORTS",
  CALLS = "CALLS",
  REFERENCES = "REFERENCES",
  EXTENDS = "EXTENDS",
  IMPLEMENTS = "IMPLEMENTS",
  TYPE_DEPENDS = "TYPE_DEPENDS",
  DEPENDS_ON = "DEPENDS_ON",
  ROUTES_TO = "ROUTES_TO",
  USES_TABLE = "USES_TABLE",
  TESTS = "TESTS",
}

export enum NodeType {
  REPOSITORY = "repository",
  DIRECTORY = "directory",
  FILE = "file",
  SYMBOL = "symbol",
  API_ENDPOINT = "api_endpoint",
  DATABASE_TABLE = "database_table",
  TEST_SUITE = "test_suite",
}
