#!/usr/bin/env node

import { Command } from "commander";
import { ConfigLoader } from "@mahiva/config";
import { CodebaseScanner } from "@mahiva/scanner";

const program = new Command();

program
  .name("mahiva")
  .description("Mahiva Codebase Mapping CLI")
  .version("0.1.0");

program
  .command("scan")
  .argument("<path>", "path to scan")
  .description("scan a codebase directory")
  .action(async (targetPath: string) => {
    const loader = new ConfigLoader();
    const config = await loader.loadConfig(targetPath);
    const scanner = new CodebaseScanner();
    const summary = await scanner.scan(config);

    console.log(
      `Scanned ${summary.totalFilesDiscovered} files from ${summary.repositoryRoot}`,
    );
    console.log(JSON.stringify(summary.byLanguage, null, 2));
  });

program
  .command("status")
  .description("show current Mahiva project status")
  .action(async () => {
    const loader = new ConfigLoader();
    const config = await loader.loadConfig(process.cwd());
    const scanner = new CodebaseScanner();
    const summary = await scanner.scan(config);

    console.log(
      JSON.stringify(
        {
          service: "mahiva-cli",
          status: "ready",
          repositoryRoot: summary.repositoryRoot,
          totalFilesDiscovered: summary.totalFilesDiscovered,
          byLanguage: summary.byLanguage,
        },
        null,
        2,
      ),
    );
  });

program
  .command("analyze")
  .argument("[path]", "codebase directory", ".")
  .description("analyze a codebase")
  .action(async (targetPath: string) => {
    const { CodebaseScanner } = await import("@mahiva/scanner");
    const { loadConfig } = await import("@mahiva/config");

    const root = path.resolve(targetPath);
    const config = await loadConfig(root);

    const scanner = new CodebaseScanner();
    const result = await scanner.scan(config);

    console.log("");
    console.log("Mahiva Codebase Analysis");
    console.log("========================");
    console.log("");
    console.log(`Repository: ${result.repositoryRoot}`);
    console.log(`Files analyzed: ${result.totalFilesDiscovered}`);
    console.log(`Directories: ${result.totalDirectories}`);
    console.log("");

    console.log("Languages:");
    for (const [language, count] of Object.entries(result.byLanguage)) {
      if (count > 0) {
        console.log(`  ${language}: ${count}`);
      }
    }

    console.log("");

    console.log("Extensions:");
    for (const [extension, count] of Object.entries(result.byExtension)) {
      console.log(`  ${extension}: ${count}`);
    }

    console.log("");

    console.log(`Total bytes: ${result.statistics.totalBytes}`);
    console.log(`Binary files skipped: ${result.statistics.binaryFiles}`);
    console.log(`Oversized files skipped: ${result.statistics.oversizedFiles}`);
    console.log(`Duration: ${result.durationMs}ms`);
    console.log("");
  });
program.parse(process.argv);

export const PACKAGE_NAME = "@mahiva/cli";
