import { describe, it, expect } from "vitest";
import { PACKAGE_NAME, renderDashboard } from "../src/index.js";

describe("@mahiva/web", () => {
  it("renders the initial dashboard shell", () => {
    expect(PACKAGE_NAME).toBe("@mahiva/web");
    expect(renderDashboard()).toContain("Mahiva Dashboard");
  });
});
