import Fastify from "fastify";
import { ConfigLoader } from "@mahiva/config";
import { CodebaseScanner } from "@mahiva/scanner";

export interface ProjectStatus {
  service: string;
  status: "ready";
  message: string;
  repositoryRoot: string;
  totalFilesDiscovered: number;
  byLanguage: Record<string, number>;
  durationMs: number;
}

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return { status: "ok", service: "mahiva-server" };
});

app.get("/api/status", async () => {
  return getProjectStatus(process.cwd());
});

export async function getProjectStatus(projectRoot = process.cwd()): Promise<ProjectStatus> {
  const loader = new ConfigLoader();
  const config = await loader.loadConfig(projectRoot);
  const scanner = new CodebaseScanner();
  const summary = await scanner.scan(config);

  return {
    service: "mahiva-server",
    status: "ready",
    message: `Scanned ${summary.totalFilesDiscovered} files in ${summary.repositoryRoot}.`,
    repositoryRoot: summary.repositoryRoot,
    totalFilesDiscovered: summary.totalFilesDiscovered,
    byLanguage: summary.byLanguage,
    durationMs: summary.durationMs,
  };
}

export async function startServer() {
  await app.listen({ port: 3000, host: "0.0.0.0" });
}

export const PACKAGE_NAME = "@mahiva/server";
