export {
  WalkAction,
  type AstVisitorContext,
  type AstVisitorCallback,
  walkAst,
} from "./traversal/visitor.js";

export {
  type AstNodeKind,
  findNodesByKind,
  findNodeByName,
  getDescendants,
  findCallExpressions,
} from "./selectors/queries.js";

export { AstNormalizer } from "./normalizer.js";
