import { promises as fs } from "node:fs";
import Fastify from "fastify";
import { ConfigLoader } from "@mahiva/config";
import { CodebaseScanner } from "@mahiva/scanner";
import { defaultUnifiedParser } from "@mahiva/parser";
import { analyzeParsedFiles } from "@mahiva/analyzer";
import { buildRelationshipsForFiles } from "@mahiva/relationships";
import { buildGraph } from "@mahiva/graph";

export interface ProjectStatus {
  service: string;
  status: "ready";
  message: string;
  repositoryRoot: string;
  totalFilesDiscovered: number;
  filesParsed: number;
  totalSymbols: number;
  graphNodeCount: number;
  graphEdgeCount: number;
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

  const parsedFiles = [] as Awaited<ReturnType<typeof defaultUnifiedParser.parse>>[];

  for (const file of summary.files) {
    if (!defaultUnifiedParser.canParse(file.language)) {
      continue;
    }

    const sourceText = await fs.readFile(file.absolutePath, "utf-8");
    const parsedFile = await defaultUnifiedParser.parse({
      filePath: file.absolutePath,
      sourceText,
      language: file.language,
      contentHash: file.contentHash,
    });

    parsedFiles.push(parsedFile);
  }

  const analysis = analyzeParsedFiles(parsedFiles);
  const relationships = buildRelationshipsForFiles(parsedFiles);
  const graph = buildGraph(relationships);
  const graphSummary = graph.toJSON();

  return {
    service: "mahiva-server",
    status: "ready",
    message: `Scanned ${summary.totalFilesDiscovered} files, parsed ${parsedFiles.length} files, and derived ${graphSummary.edges.length} relationships in ${summary.repositoryRoot}.`,
    repositoryRoot: summary.repositoryRoot,
    totalFilesDiscovered: summary.totalFilesDiscovered,
    filesParsed: parsedFiles.length,
    totalSymbols: analysis.totalSymbols,
    graphNodeCount: graphSummary.nodes.length,
    graphEdgeCount: graphSummary.edges.length,
    byLanguage: summary.byLanguage,
    durationMs: summary.durationMs,
  };
}

export async function startServer() {
  await app.listen({ port: 3000, host: "0.0.0.0" });
}

export const PACKAGE_NAME = "@mahiva/server";
