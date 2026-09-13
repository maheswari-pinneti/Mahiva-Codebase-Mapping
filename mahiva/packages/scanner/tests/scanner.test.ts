import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  CodebaseScanner,
  detectLanguage,
  isBinaryFile,
  isTestFile,
} from "../src/index.js";
import { getDefaultConfig } from "@mahiva/config";
import { Language } from "@mahiva/shared";

describe("@mahiva/scanner - File Classifier", () => {
  it("detects languages correctly from file paths", () => {
    expect(detectLanguage("src/auth.ts")).toBe(Language.TYPESCRIPT);
    expect(detectLanguage("src/App.tsx")).toBe(Language.TSX);
    expect(detectLanguage("scripts/build.js")).toBe(Language.JAVASCRIPT);
    expect(detectLanguage("components/Header.jsx")).toBe(Language.JSX);
    expect(detectLanguage("main.py")).toBe(Language.PYTHON);
    expect(detectLanguage("unknown.xyz")).toBe(Language.UNKNOWN);
  });

  it("identifies test files correctly", () => {
    expect(isTestFile("src/auth.test.ts")).toBe(true);
    expect(isTestFile("src/auth.spec.ts")).toBe(true);
    expect(isTestFile("tests/unit/login.ts")).toBe(true);
    expect(isTestFile("src/auth.ts")).toBe(false);
  });
});

describe("@mahiva/scanner - Binary Detection", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "mahiva-scanner-binary-"),
    );
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("distinguishes text from binary files", async () => {
    const textPath = path.join(tempDir, "source.ts");
    const binaryPath = path.join(tempDir, "image.png");

    await fs.writeFile(textPath, "export const value = 42;\n");
    await fs.writeFile(
      binaryPath,
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]),
    );

    expect(await isBinaryFile(textPath)).toBe(false);
    expect(await isBinaryFile(binaryPath)).toBe(true);
  });
});

describe("@mahiva/scanner - CodebaseScanner", () => {
  let tempDir: string;
  let scanner: CodebaseScanner;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mahiva-scan-test-"));
    scanner = new CodebaseScanner();
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("discovers valid source files and respects .gitignore", async () => {
    await fs.mkdir(path.join(tempDir, "src"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "ignored-dir"), { recursive: true });

    await fs.writeFile(
      path.join(tempDir, "src", "index.ts"),
      "export const a = 1;",
    );
    await fs.writeFile(
      path.join(tempDir, "src", "app.tsx"),
      "export const App = () => null;",
    );
    await fs.writeFile(
      path.join(tempDir, "ignored-dir", "secret.ts"),
      "export const s = 0;",
    );
    await fs.writeFile(path.join(tempDir, ".gitignore"), "ignored-dir/\n");

    const config = {
      ...getDefaultConfig(),
      root: tempDir,
    };

    const summary = await scanner.scan(config);

    expect(summary.totalFilesDiscovered).toBe(2);
    expect(summary.byLanguage[Language.TYPESCRIPT]).toBe(1);
    expect(summary.byLanguage[Language.TSX]).toBe(1);

    const paths = summary.files.map((f) => f.relativePath);
    expect(paths).toContain("src/index.ts");
    expect(paths).toContain("src/app.tsx");
    expect(paths.some((p) => p.includes("ignored-dir"))).toBe(false);
  });
});
