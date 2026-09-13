const DEFAULT_IGNORED_DIRECTORIES = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "bower_components",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  ".vite",
  "target",
  "vendor",
]);

export function isDefaultIgnoredPath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

  if (!normalized) {
    return false;
  }

  const segments = normalized.split("/");

  return segments.some((segment) => DEFAULT_IGNORED_DIRECTORIES.has(segment));
}

export function getDefaultIgnoredDirectories(): string[] {
  return Array.from(DEFAULT_IGNORED_DIRECTORIES);
}
