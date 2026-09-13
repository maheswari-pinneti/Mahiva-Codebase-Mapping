import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import { CodebaseScanner } from "../src/scanner.js";
import { detectLanguage, isTestFile } from "../src/classifier.js";
import { isDefaultIgnoredPath } from "../src/ignore.js";
import { Language } from "@mahiva/shared";

describe("language detection", () => {
  it("detects TypeScript", () => {
    expect(detectLanguage("src/index.ts")).toBe(Language.TYPESCRIPT);
  });

  it("detects TSX", () => {
    expect(detectLanguage("src/App.tsx")).toBe(Language.TSX);
  });

  it("detects JavaScript", () => {
    expect(detectLanguage("src/index.js")).toBe(Language.JAVASCRIPT);
  });

  it("detects Python", () => {
    expect(detectLanguage("src/main.py")).toBe(Language.PYTHON);
  });

  it("detects JSON", () => {
    expect(detectLanguage("package.json")).toBe(Language.JSON);
  });

  it("detects YAML", () => {
    expect(detectLanguage("config.yml")).toBe(Language.YAML);
  });

  it("detects Markdown", () => {
    expect(detectLanguage("README.md")).toBe(Language.MARKDOWN);
  });

  it("returns UNKNOWN for unsupported extensions", () => {
    expect(detectLanguage("file.xyz")).toBe(Language.UNKNOWN);
  });
});

describe("test file detection", () => {
  it("detects tests directory", () => {
    expect(isTestFile("tests/scanner.test.ts")).toBe(true);
  });

  it("detects __tests__ directory", () => {
    expect(isTestFile("src/__tests__/scanner.ts")).toBe(true);
  });

  it("detects test suffix", () => {
    expect(isTestFile("src/scanner.test.ts")).toBe(true);
  });

  it("detects spec suffix", () => {
    expect(isTestFile("src/scanner.spec.ts")).toBe(true);
  });

  it("detects Go tests", () => {
    expect(isTestFile("scanner_test.go")).toBe(true);
  });

  it("detects Python tests", () => {
    expect(isTestFile("scanner_test.py")).toBe(true);
  });

  it("does not classify normal source files as tests", () => {
    expect(isTestFile("src/scanner.ts")).toBe(false);
  });
});

describe("default ignore rules", () => {
  it("ignores node_modules", () => {
    expect(isDefaultIgnoredPath("node_modules/package/index.js")).toBe(true);
  });

  it("ignores dist", () => {
    expect(isDefaultIgnoredPath("dist/index.js")).toBe(true);
  });

  it("ignores .git", () => {
    expect(isDefaultIgnoredPath(".git/config")).toBe(true);
  });

  it("ignores nested build directories", () => {
    expect(isDefaultIgnoredPath("packages/foo/build/index.js")).toBe(true);
  });

  it("does not ignore normal source directories", () => {
    expect(isDefaultIgnoredPath("packages/scanner/src/scanner.ts")).toBe(false);
  });
});

describe("CodebaseScanner", () => {
  let tempDirectory: string;

  async function createTempRepository(): Promise<string> {
    const directory = await mkdtemp(path.join(os.tmpdir(), "mahiva-scanner-"));

    await mkdir(path.join(directory, "src"), { recursive: true });
    await mkdir(path.join(directory, "tests"), { recursive: true });
    await mkdir(path.join(directory, "node_modules", "fake-package"), {
      recursive: true,
    });
    await mkdir(path.join(directory, "dist"), { recursive: true });

    await writeFile(
      path.join(directory, "src", "index.ts"),
      'export const message = "hello";\n',
    );

    await writeFile(
      path.join(directory, "src", "app.js"),
      'console.log("hello");\n',
    );

    await writeFile(
      path.join(directory, "tests", "scanner.test.ts"),
      'describe("scanner", () => {});\n',
    );

    await writeFile(
      path.join(directory, "package.json"),
      '{"name":"mahiva-test"}\n',
    );

    await writeFile(
      path.join(directory, "README.md"),
      "# Mahiva test repository\n",
    );

    await writeFile(
      path.join(directory, "node_modules", "fake-package", "index.js"),
      'module.exports = "ignored";\n',
    );

    await writeFile(
      path.join(directory, "dist", "bundle.js"),
      'console.log("ignored");\n',
    );

    await writeFile(path.join(directory, ".gitignore"), "ignored-folder/\n");

    await mkdir(path.join(directory, "ignored-folder"), {
      recursive: true,
    });

    await writeFile(
      path.join(directory, "ignored-folder", "ignored.ts"),
      "export const ignored = true;\n",
    );

    return directory;
  }

  beforeEach(async () => {
    tempDirectory = await createTempRepository();
  });

  it("scans source files", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    expect(result.totalFilesDiscovered).toBeGreaterThan(0);
    expect(result.files.length).toBe(result.totalFilesDiscovered);

    expect(result.byLanguage[Language.TYPESCRIPT]).toBeGreaterThan(0);
    expect(result.byLanguage[Language.JAVASCRIPT]).toBeGreaterThan(0);
    expect(result.byLanguage[Language.JSON]).toBeGreaterThan(0);
    expect(result.byLanguage[Language.MARKDOWN]).toBeGreaterThan(0);
  });

  it("collects extension statistics", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    expect(result.byExtension[".ts"]).toBeGreaterThan(0);
    expect(result.byExtension[".js"]).toBeGreaterThan(0);
    expect(result.byExtension[".json"]).toBeGreaterThan(0);
    expect(result.byExtension[".md"]).toBeGreaterThan(0);
  });

  it("collects scan statistics", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    expect(result.statistics.totalFiles).toBeGreaterThan(0);
    expect(result.statistics.totalBytes).toBeGreaterThan(0);
    expect(result.statistics.totalDirectories).toBeGreaterThan(0);
    expect(result.statistics.byLanguage).toBeDefined();
    expect(result.statistics.byExtension).toBeDefined();
  });

  it("does not scan node_modules files", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    expect(
      result.files.some((file) => file.relativePath.includes("node_modules")),
    ).toBe(false);
  });

  it("does not scan dist files", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    expect(
      result.files.some((file) => file.relativePath.includes("dist")),
    ).toBe(false);
  });

  it("respects language filtering", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [Language.TYPESCRIPT],
    });

    expect(result.files.length).toBeGreaterThan(0);

    expect(
      result.files.every((file) => file.language === Language.TYPESCRIPT),
    ).toBe(true);
  });

  it("respects configured excludes", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: ["tests"],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    expect(
      result.files.some((file) => file.relativePath.startsWith("tests/")),
    ).toBe(false);
  });

  it("marks discovered test files", async () => {
    const scanner = new CodebaseScanner();

    const result = await scanner.scan({
      root: tempDirectory,
      name: "test-repository",
      exclude: [],
      followSymlinks: false,
      maxFileSizeKb: 1024,
      languages: [],
    });

    const testFile = result.files.find((file) =>
      file.relativePath.endsWith("scanner.test.ts"),
    );

    expect(testFile).toBeDefined();
    expect(testFile?.isTestFile).toBe(true);
  });

  afterEach(async () => {
    if (tempDirectory) {
      await rm(tempDirectory, {
        recursive: true,
        force: true,
      });
    }
  });
});
