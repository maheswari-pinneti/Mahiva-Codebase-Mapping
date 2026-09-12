import path from "node:path";
import { Language } from "@mahiva/shared";

const EXTENSION_MAP: Record<string, Language> = {
  ".ts": Language.TYPESCRIPT,
  ".mts": Language.TYPESCRIPT,
  ".cts": Language.TYPESCRIPT,
  ".tsx": Language.TSX,
  ".js": Language.JAVASCRIPT,
  ".mjs": Language.JAVASCRIPT,
  ".cjs": Language.JAVASCRIPT,
  ".jsx": Language.JSX,
  ".py": Language.PYTHON,
  ".go": Language.GO,
  ".rs": Language.RUST,
  ".java": Language.JAVA,
  ".cpp": Language.CPP,
  ".cc": Language.CPP,
  ".cxx": Language.CPP,
  ".hpp": Language.CPP,
  ".c": Language.C,
  ".h": Language.C,
  ".cs": Language.CSHARP,
  ".php": Language.PHP,
  ".rb": Language.RUBY,
  ".kt": Language.KOTLIN,
  ".swift": Language.SWIFT,
  ".json": Language.JSON,
  ".yaml": Language.YAML,
  ".yml": Language.YAML,
  ".md": Language.MARKDOWN,
};

export function detectLanguage(filePath: string): Language {
  const ext = path.extname(filePath).toLowerCase();
  return EXTENSION_MAP[ext] ?? Language.UNKNOWN;
}

export function isTestFile(relativePath: string): boolean {
  const normalized = relativePath.toLowerCase().replace(/\\/g, "/");
  return (
    normalized.startsWith("tests/") ||
    normalized.startsWith("__tests__/") ||
    normalized.includes("/tests/") ||
    normalized.includes("/__tests__/") ||
    normalized.includes("/fixtures/") ||
    normalized.endsWith(".test.ts") ||
    normalized.endsWith(".spec.ts") ||
    normalized.endsWith(".test.tsx") ||
    normalized.endsWith(".spec.tsx") ||
    normalized.endsWith(".test.js") ||
    normalized.endsWith(".spec.js") ||
    normalized.endsWith("_test.go") ||
    normalized.endsWith("_test.py")
  );
}
