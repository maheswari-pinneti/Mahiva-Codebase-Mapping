import { describe, it, expect } from "vitest";
import { createDatabase } from "@mahiva/database";
import { QueryEngine, createQueryEngine } from "../src/index.js";
import { NodeType, RelationshipType } from "@mahiva/shared";

describe("@mahiva/query", () => {
  it("queries nodes and edges from the database", () => {
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

    const engine = createQueryEngine(db);
    const result = engine.query({ nodeId: "file-a" });

    expect(result.nodes).toHaveLength(1);
    expect(result.edges).toHaveLength(1);
  });

  it("supports direct QueryEngine construction", () => {
    const db = createDatabase();
    const engine = new QueryEngine(db);

    expect(engine.query().nodes).toEqual([]);
  });
});
