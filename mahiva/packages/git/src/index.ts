import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export interface GitRemote {
  name: string;
  url: string;
}

export interface GitStatusSummary {
  branch: string;
  hasChanges: boolean;
  modified: number;
  added: number;
  deleted: number;
  untracked: number;
  staged: number;
  ahead: number;
  behind: number;
  remotes: GitRemote[];
}

export class GitRepository {
  public constructor(private readonly rootPath: string = process.cwd()) {}

  public getRootPath(): string {
    return resolve(this.rootPath);
  }

  public run(args: string[]): string {
    const rootPath = this.getRootPath();

    if (!existsSync(resolve(rootPath, ".git"))) {
      throw new Error(`No git repository exists at ${rootPath}`);
    }

    try {
      return execFileSync("git", ["-C", rootPath, ...args], {
        encoding: "utf8",
      }).trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`git ${args.join(" ")} failed: ${message}`);
    }
  }

  public getCurrentBranch(): string {
    const branch = this.run(["branch", "--show-current"]);
    return branch || "HEAD detached";
  }

  public getLatestCommit(): string {
    return this.run(["rev-parse", "HEAD"]);
  }

  public getRemotes(): GitRemote[] {
    const raw = this.run(["remote", "-v"]);

    if (!raw) {
      return [];
    }

    const remotes = new Map<string, string>();
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([^\s]+)\s+(\S+)\s+\((fetch|push)\)$/);
      if (!match) {
        continue;
      }

      const [, name, url] = match;
      remotes.set(name, url);
    }

    return [...remotes.entries()].map(([name, url]) => ({ name, url }));
  }

  public getStatusSummary(): GitStatusSummary {
    const raw = this.run(["status", "--short", "--branch"]);
    const lines = raw.split(/\r?\n/).filter(Boolean);

    const statusLine =
      lines.find((line) => line.startsWith("## ")) ?? "## HEAD (no branch)";
    const branchMatch = statusLine.match(/^##\s+([^\s]+)/);
    const branch = branchMatch ? branchMatch[1] : "HEAD";

    let ahead = 0;
    let behind = 0;
    const aheadMatch = statusLine.match(/ahead\s+(\d+)/i);
    const behindMatch = statusLine.match(/behind\s+(\d+)/i);

    if (aheadMatch) {
      ahead = Number.parseInt(aheadMatch[1], 10);
    }

    if (behindMatch) {
      behind = Number.parseInt(behindMatch[1], 10);
    }

    let modified = 0;
    let added = 0;
    let deleted = 0;
    let untracked = 0;
    let staged = 0;

    for (const line of lines) {
      if (line.startsWith("## ")) {
        continue;
      }

      const statusCode = line.slice(0, 2).trim();
      const fileStatus = line.slice(3);

      if (statusCode === "??") {
        untracked += 1;
        continue;
      }

      if (statusCode === "A") {
        added += 1;
      }

      if (statusCode === "M") {
        modified += 1;
      }

      if (statusCode === "D") {
        deleted += 1;
      }

      if (statusCode === "R") {
        modified += 1;
      }

      if (statusCode === "U" || statusCode === "UU") {
        modified += 1;
      }

      if (fileStatus) {
        staged += 1;
      }
    }

    return {
      branch,
      hasChanges: lines.some((line) => !line.startsWith("## ")),
      modified,
      added,
      deleted,
      untracked,
      staged,
      ahead,
      behind,
      remotes: this.getRemotes(),
    };
  }
}

export function createGitRepository(rootPath = process.cwd()): GitRepository {
  return new GitRepository(rootPath);
}

export const PACKAGE_NAME = "@mahiva/git";
