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

    console.log(`Scanned ${summary.totalFilesDiscovered} files from ${summary.repositoryRoot}`);
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

    console.log(JSON.stringify(
      {
        service: "mahiva-cli",
        status: "ready",
        repositoryRoot: summary.repositoryRoot,
        totalFilesDiscovered: summary.totalFilesDiscovered,
        byLanguage: summary.byLanguage,
      },
      null,
      2
    ));
  });

program.parse(process.argv);

export const PACKAGE_NAME = "@mahiva/cli";
