import { MahivaConfig, MahivaConfigSchema } from "./schema.js";

/**
 * Returns frozen default configuration settings.
 */
export function getDefaultConfig(): Readonly<MahivaConfig> {
  return Object.freeze(MahivaConfigSchema.parse({}));
}
