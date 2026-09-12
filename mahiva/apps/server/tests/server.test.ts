import { describe, it, expect } from "vitest";
import { PACKAGE_NAME, getProjectStatus } from "../src/index.js";

describe("@mahiva/server", () => {
  it("exposes the server package identity", () => {
    expect(PACKAGE_NAME).toBe("@mahiva/server");
  });

  it("builds a project status payload using the configured scanner pipeline", async () => {
    const status = await getProjectStatus(process.cwd());

    expect(status.service).toBe("mahiva-server");
    expect(status.status).toBe("ready");
    expect(status.totalFilesDiscovered).toBeGreaterThanOrEqual(0);
  });
});
