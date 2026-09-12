import { describe, it, expect } from "vitest";
import { PACKAGE_NAME, getProjectStatus } from "../src/index.js";

describe("@mahiva/server", () => {
  it("exposes the server package identity", () => {
    expect(PACKAGE_NAME).toBe("@mahiva/server");
  });

  it("builds a project status payload using the configured engine pipeline", async () => {
    const status = await getProjectStatus(process.cwd());

    expect(status.service).toBe("mahiva-server");
    expect(status.status).toBe("ready");
    expect(status.totalFilesDiscovered).toBeGreaterThan(0);
    expect(status.filesParsed).toBeGreaterThan(0);
    expect(status.totalSymbols).toBeGreaterThan(0);
    expect(status.graphNodeCount).toBeGreaterThan(0);
    expect(status.graphEdgeCount).toBeGreaterThanOrEqual(0);
  });
});
