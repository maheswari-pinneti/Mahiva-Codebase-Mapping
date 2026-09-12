import path from "node:path";
import { NodeFileSystem } from "@mahiva/filesystem";
import {
  MahivaConfig,
  MahivaConfigSchema,
  MahivaConfigInput,
} from "./schema.js";
import { getDefaultConfig } from "./defaults.js";

export class ConfigLoader {
  private fileSystem: NodeFileSystem;

  constructor(fileSystem?: NodeFileSystem) {
    this.fileSystem = fileSystem ?? new NodeFileSystem();
  }

  public async loadConfig(projectRoot: string): Promise<MahivaConfig> {
    const configFilenames = ["mahiva.config.json", ".mahivarc.json"];

    for (const filename of configFilenames) {
      const fullPath = path.resolve(projectRoot, filename);
      if (await this.fileSystem.exists(fullPath)) {
        try {
          const raw = await this.fileSystem.readFile(fullPath);
          const parsedJson = JSON.parse(raw) as MahivaConfigInput;
          return MahivaConfigSchema.parse(parsedJson);
        } catch (error) {
          throw new Error(
            `Failed to parse config at ${fullPath}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    const defaults = getDefaultConfig();
    return {
      ...defaults,
      root: projectRoot,
    };
  }

  public validateConfig(input: unknown): MahivaConfig {
    return MahivaConfigSchema.parse(input);
  }
}
