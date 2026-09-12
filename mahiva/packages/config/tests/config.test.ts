import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { ConfigLoader, getDefaultConfig, MahivaConfigSchema } from "../src/index.js";
import { Language } from "@mahiva/shared";

describe("@mahiva/config", () => {
  let tempDir: string;
  let loader: ConfigLoader;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mahiva-config-test-"));
    loader = new ConfigLoader();
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("loads frozen defaults when no file is present", async () => {
    const config = await loader.loadConfig(tempDir);
    expect(config.root).toBe(tempDir);
    expect(config.languages).toContain(Language.TYPESCRIPT);
    expect(config.maxFileSizeKb).toBe(2048);
  });

  it("loads and validates custom json configuration", async () => {
    const customConfig = {
      name: "custom-repo",
      include: ["lib/**/*"],
      exclude: ["**/vendor/**"],
      maxFileSizeKb: 4096,
      languages: ["typescript", "python"],
    };

    await fs.writeFile(
      path.join(tempDir, "mahiva.config.json"),
      JSON.stringify(customConfig, null, 2)
    );

    const loaded = await loader.loadConfig(tempDir);
    expect(loaded.name).toBe("custom-repo");
    expect(loaded.include).toEqual(["lib/**/*"]);
    expect(loaded.languages).toEqual([Language.TYPESCRIPT, Language.PYTHON]);
    expect(loaded.maxFileSizeKb).toBe(4096);
  });

  it("rejects invalid configuration structures", () => {
    const invalidConfig = {
      name: "", // name must be min 1 char
      maxFileSizeKb: -100, // must be positive
    };

    expect(() => MahivaConfigSchema.parse(invalidConfig)).toThrow();
  });
});
