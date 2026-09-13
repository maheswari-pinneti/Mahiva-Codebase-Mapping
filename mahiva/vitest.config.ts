import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      "@mahiva/shared": path.resolve(__dirname, "packages/shared/src/index.ts"),
      "@mahiva/filesystem": path.resolve(
        __dirname,
        "packages/filesystem/src/index.ts",
      ),
      "@mahiva/config": path.resolve(__dirname, "packages/config/src/index.ts"),
      "@mahiva/scanner": path.resolve(
        __dirname,
        "packages/scanner/src/index.ts",
      ),
      "@mahiva/languages": path.resolve(
        __dirname,
        "packages/languages/src/index.ts",
      ),
      "@mahiva/parser": path.resolve(__dirname, "packages/parser/src/index.ts"),
      "@mahiva/ast": path.resolve(__dirname, "packages/ast/src/index.ts"),
      "@mahiva/symbols": path.resolve(
        __dirname,
        "packages/symbols/src/index.ts",
      ),
      "@mahiva/imports": path.resolve(
        __dirname,
        "packages/imports/src/index.ts",
      ),
      "@mahiva/analyzer": path.resolve(
        __dirname,
        "packages/analyzer/src/index.ts",
      ),
      "@mahiva/relationships": path.resolve(
        __dirname,
        "packages/relationships/src/index.ts",
      ),
      "@mahiva/graph": path.resolve(__dirname, "packages/graph/src/index.ts"),
      "@mahiva/database": path.resolve(
        __dirname,
        "packages/database/src/index.ts",
      ),
      "@mahiva/query": path.resolve(__dirname, "packages/query/src/index.ts"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "packages/**/*.test.ts",
      "apps/**/*.test.ts",
      "tests/**/*.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "../**"],
  },
});
