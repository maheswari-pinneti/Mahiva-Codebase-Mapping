import { NormalizedAstNode, SymbolKind } from "@mahiva/shared";
import { walkAst, WalkAction } from "../traversal/visitor.js";

export type AstNodeKind = SymbolKind | "root" | "call_expression" | "import_clause" | "export_clause";

/**
 * Finds all nodes matching one or more specific AST kinds.
 */
export function findNodesByKind(
  root: NormalizedAstNode,
  kinds: AstNodeKind | AstNodeKind[]
): NormalizedAstNode[] {
  const targetKinds = new Set(Array.isArray(kinds) ? kinds : [kinds]);
  const results: NormalizedAstNode[] = [];

  walkAst(root, (node) => {
    if (targetKinds.has(node.kind)) {
      results.push(node);
    }
  });

  return results;
}

/**
 * Finds the first node matching a specific name and optional kind.
 */
export function findNodeByName(
  root: NormalizedAstNode,
  name: string,
  kind?: AstNodeKind
): NormalizedAstNode | undefined {
  let found: NormalizedAstNode | undefined;

  walkAst(root, (node) => {
    if (node.name === name && (!kind || node.kind === kind)) {
      found = node;
      return WalkAction.STOP;
    }
  });

  return found;
}

/**
 * Returns all direct and indirect descendants of a node.
 */
export function getDescendants(node: NormalizedAstNode): NormalizedAstNode[] {
  const descendants: NormalizedAstNode[] = [];

  for (const child of node.children) {
    descendants.push(child);
    descendants.push(...getDescendants(child));
  }

  return descendants;
}

/**
 * Finds all function calls and method invocation nodes inside a given tree.
 */
export function findCallExpressions(root: NormalizedAstNode): NormalizedAstNode[] {
  return findNodesByKind(root, "call_expression");
}
