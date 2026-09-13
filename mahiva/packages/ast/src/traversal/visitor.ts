import { NormalizedAstNode } from "@mahiva/shared";

export enum WalkAction {
  CONTINUE = "CONTINUE",
  SKIP_CHILDREN = "SKIP_CHILDREN",
  STOP = "STOP",
}

export interface AstVisitorContext {
  depth: number;
  parent?: NormalizedAstNode;
  ancestors: NormalizedAstNode[];
}

export type AstVisitorCallback = (
  node: NormalizedAstNode,
  context: AstVisitorContext,
) => WalkAction | void;

/**
 * Traverses an AST tree in Pre-Order (depth-first).
 */
export function walkAst(
  root: NormalizedAstNode,
  callback: AstVisitorCallback,
  ancestors: NormalizedAstNode[] = [],
  depth = 0,
): WalkAction {
  const context: AstVisitorContext = {
    depth,
    parent: ancestors[ancestors.length - 1],
    ancestors,
  };

  const action = callback(root, context) ?? WalkAction.CONTINUE;

  if (action === WalkAction.STOP) {
    return WalkAction.STOP;
  }

  if (action === WalkAction.SKIP_CHILDREN) {
    return WalkAction.CONTINUE;
  }

  const nextAncestors = [...ancestors, root];
  for (const child of root.children) {
    const childAction = walkAst(child, callback, nextAncestors, depth + 1);
    if (childAction === WalkAction.STOP) {
      return WalkAction.STOP;
    }
  }

  return WalkAction.CONTINUE;
}
