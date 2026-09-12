import { describe, it, expect } from "vitest";
import { buildGraph, GraphModel } from "../src/index.js";
import { RelationshipType, SymbolKind, Language } from "@mahiva/shared";

describe("@mahiva/graph", () => {
  it("builds a graph from relationship results and verifies traversal", () => {
    const graph = buildGraph([
      {
        fileId: "src/index.ts",
        imports: [],
        symbols: [],
        edges: [
          {
            id: "rel:src/index.ts#contains#AuthService",
            source: "src/index.ts",
            target: "AuthService",
            type: RelationshipType.CONTAINS,
            weight: 1,
          },
          {
            id: "rel:src/index.ts#imports#./auth",
            source: "src/index.ts",
            target: "./auth",
            type: RelationshipType.IMPORTS,
            weight: 1,
          },
        ],
      },
    ]);

    expect(graph.hasNode("src/index.ts")).toBe(true);
    expect(graph.hasNode("AuthService")).toBe(true);
    expect(graph.hasEdge("src/index.ts", "AuthService")).toBe(true);
    expect(graph.getOutgoingEdges("src/index.ts")).toHaveLength(2);

    const traversal = graph.traverse("src/index.ts", { maxDepth: 1 });
    expect(traversal.map((step) => step.nodeId)).toContain("AuthService");
  });

  it("supports graph model operations individually", () => {
    const graph = new GraphModel();

    graph.addNode({
      id: "A",
      type: "file" as any,
      name: "A",
      path: "A",
      fileId: "A",
    });

    graph.addEdge({
      id: "edge-1",
      source: "A",
      target: "B",
      type: RelationshipType.IMPORTS,
      weight: 1,
    });

    expect(graph.hasNode("B")).toBe(true);
    expect(graph.findDependents("B")).toContain("A");
  });
});
