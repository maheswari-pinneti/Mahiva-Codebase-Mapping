import { describe, it, expect } from "vitest";
import { readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createDatabase, InMemoryDatabase } from "../src/index.js";
import { NodeType, RelationshipType } from "@mahiva/shared";

describe("@mahiva/database", () => {
  it("persists nodes and edges in memory", () => {
    const db = createDatabase();

    db.saveNode({
      id: "file-a",
      type: NodeType.FILE,
      name: "file-a",
      path: "src/file-a.ts",
      fileId: "file-a",
    });

    db.saveEdge({
      id: "edge-1",
      source: "file-a",
      target: "file-b",
      type: RelationshipType.IMPORTS,
      weight: 1,
    });

    expect(db.getNode("file-a")?.name).toBe("file-a");
    expect(db.getEdges()).toHaveLength(1);
  });

  it("persists nodes and edges across separate database instances", () => {
    const dbPath = join(tmpdir(), `mahiva-db-${Date.now()}.sqlite`);

    try {
      const first = createDatabase({ filePath: dbPath });

      first.saveNode({
        id: "file-b",
        type: NodeType.FILE,
        name: "file-b",
        path: "src/file-b.ts",
        fileId: "file-b",
      });

      first.saveEdge({
        id: "edge-2",
        source: "file-b",
        target: "file-c",
        type: RelationshipType.IMPORTS,
        weight: 1,
      });

      const second = createDatabase({ filePath: dbPath });

      expect(second.getNode("file-b")?.name).toBe("file-b");
      expect(second.getEdges()).toHaveLength(1);

      const persisted = readFileSync(dbPath);
      expect(persisted.subarray(0, 15).toString("ascii")).toContain(
        "SQLite format 3",
      );

      second.close();
      first.close();
    } finally {
      rmSync(dbPath, { force: true });
    }
  });

  it("allows direct model usage", () => {
    const db = new InMemoryDatabase();

    expect(db.listNodes()).toEqual([]);
    expect(db.getEdges()).toEqual([]);
  });
});
