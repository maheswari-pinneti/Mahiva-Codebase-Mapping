import { z } from "zod";
import { Language } from "@mahiva/shared";

const LanguageEnum = z.nativeEnum(Language);

export const MahivaConfigSchema = z.object({
  name: z.string().min(1).default("mahiva-project"),
  root: z.string().default("."),
  include: z
    .array(z.string())
    .default(["src/**/*", "packages/**/*", "apps/**/*"]),
  exclude: z
    .array(z.string())
    .default([
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.git/**",
      "**/coverage/**",
      "**/.cache/**",
    ]),
  languages: z
    .array(LanguageEnum)
    .default([
      Language.TYPESCRIPT,
      Language.TSX,
      Language.JAVASCRIPT,
      Language.JSX,
    ]),
  maxFileSizeKb: z.number().positive().default(2048), // 2 MB max per file
  followSymlinks: z.boolean().default(false),
  storage: z
    .object({
      databasePath: z.string().default(".mahiva/mahiva.sqlite"),
    })
    .default({}),
});

export type MahivaConfig = z.infer<typeof MahivaConfigSchema>;
export type MahivaConfigInput = z.input<typeof MahivaConfigSchema>;
