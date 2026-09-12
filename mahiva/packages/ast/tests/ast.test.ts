import { describe, it, expect } from "vitest";
import {
  walkAst,
  WalkAction,
  findNodesByKind,
  findNodeByName,
  getDescendants,
  AstNormalizer,
} from "../src/index.js";
import { NormalizedAstNode, SymbolKind } from "@mahiva/shared";

describe("@mahiva/ast - AST Normalization & Selectors", () => {
  const dummyTree: NormalizedAstNode = {
    id: "file#root",
    kind: "root",
    name: "src/auth.ts",
    range: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 20, column: 1, offset: 500 },
    },
    children: [
      {
        id: "file#class_1",
        kind: SymbolKind.CLASS,
        name: "AuthService",
        range: {
          start: { line: 2, column: 1, offset: 10 },
          end: { line: 15, column: 2, offset: 350 },
        },
        children: [
          {
            id: "file#method_1",
            kind: SymbolKind.METHOD,
            name: "login",
            range: {
              start: { line: 3, column: 3, offset: 40 },
              end: { line: 8, column: 4, offset: 180 },
            },
            children: [
              {
                id: "file#call_1",
                kind: "call_expression",
                name: "validateCredentials",
                range: {
                  start: { line: 4, column: 5, offset: 70 },
                  end: { line: 4, column: 30, offset: 95 },
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "file#interface_1",
        kind: SymbolKind.INTERFACE,
        name: "UserSession",
        range: {
          start: { line: 16, column: 1, offset: 360 },
          end: { line: 19, column: 2, offset: 480 },
        },
        children: [],
      },
    ],
  };

  it("normalizes and populates parent links throughout the tree", () => {
    const cloned = AstNormalizer.cloneNode(dummyTree);
    AstNormalizer.normalize({
      fileId: "src/auth.ts",
      language: "typescript" as any,
      contentHash: "hash123",
      rootNode: cloned,
    });

    const classNode = cloned.children[0];
    const methodNode = classNode?.children[0];
    const callNode = methodNode?.children[0];

    expect(classNode?.parent).toBe("file#root");
    expect(methodNode?.parent).toBe("file#class_1");
    expect(callNode?.parent).toBe("file#method_1");
  });

  it("finds nodes by specific kinds", () => {
    const classes = findNodesByKind(dummyTree, SymbolKind.CLASS);
    expect(classes.length).toBe(1);
    expect(classes[0]?.name).toBe("AuthService");

    const callsAndInterfaces = findNodesByKind(dummyTree, [
      "call_expression",
      SymbolKind.INTERFACE,
    ]);
    expect(callsAndInterfaces.length).toBe(2);
  });

  it("finds specific node by name", () => {
    const node = findNodeByName(dummyTree, "login", SymbolKind.METHOD);
    expect(node).toBeDefined();
    expect(node?.id).toBe("file#method_1");
  });

  it("gathers all descendants of a subtree", () => {
    const descendants = getDescendants(dummyTree);
    expect(descendants.length).toBe(4); // class, method, call, interface
  });

  it("respects WalkAction.STOP and WalkAction.SKIP_CHILDREN", () => {
    const visited: string[] = [];

    walkAst(dummyTree, (node) => {
      visited.push(node.name);
      if (node.name === "AuthService") {
        return WalkAction.SKIP_CHILDREN;
      }
    });

    expect(visited).toContain("src/auth.ts");
    expect(visited).toContain("AuthService");
    expect(visited).toContain("UserSession");
    // Children of AuthService skipped
    expect(visited).not.toContain("login");
    expect(visited).not.toContain("validateCredentials");
  });
});
