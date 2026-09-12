import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { NodeFileSystem, normalizePath } from "../src/index.js";

describe("@mahiva/filesystem", () => {
  let tempDir: string;
  let fileSystem: NodeFileSystem;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mahiva-fs-test-"));
    fileSystem = new NodeFileSystem();
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("normalizes paths across Windows and POSIX formats", () => {
    expect(normalizePath("src\\components\\Button.tsx")).toBe("src/components/Button.tsx");
    expect(normalizePath("src/components/Button.tsx")).toBe("src/components/Button.tsx");
    expect(normalizePath("")).toBe("");
  });

  it("writes and reads files safely", async () => {
    const filePath = path.join(tempDir, "nested", "test.txt");
    await fileSystem.writeFile(filePath, "Mahiva Codebase Mapping");

    expect(await fileSystem.exists(filePath)).toBe(true);
    const content = await fileSystem.readFile(filePath);
    expect(content).toBe("Mahiva Codebase Mapping");
  });

  it("computes deterministic SHA-256 hashes", async () => {
    const filePath = path.join(tempDir, "hash-test.txt");
    await fileSystem.writeFile(filePath, "deterministic-content");

    const hash1 = await fileSystem.computeHash(filePath);
    const hash2 = await fileSystem.computeHash(filePath);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("walks directories recursively while respecting skip filters", async () => {
    await fileSystem.writeFile(path.join(tempDir, "src", "index.ts"), "export {}");
    await fileSystem.writeFile(path.join(tempDir, "src", "utils", "helper.ts"), "export {}");
    await fileSystem.writeFile(path.join(tempDir, "node_modules", "package", "index.js"), "{}");

    const discovered: string[] = [];
    for await (const entry of fileSystem.walk(tempDir, {
      recursive: true,
      skip: (entryPath) => entryPath.startsWith("node_modules"),
    })) {
      if (entry.stats.isFile) {
        discovered.push(entry.relativePath);
      }
    }

    expect(discovered).toContain("src/index.ts");
    expect(discovered).toContain("src/utils/helper.ts");
    expect(discovered.some((p) => p.includes("node_modules"))).toBe(false);
  });
});
