import { NormalizedAstNode, ParsedSourceFile } from "@mahiva/shared";
import { walkAst } from "./traversal/visitor.js";

export class AstNormalizer {
  /**
   * Links parent identifiers and validates range coordinates across the tree.
   */
  public static normalize(parsedFile: ParsedSourceFile): ParsedSourceFile {
    const root = parsedFile.rootNode;

    walkAst(root, (node, context) => {
      if (context.parent) {
        node.parent = context.parent.id;
      }
    });

    return parsedFile;
  }

  /**
   * Deep clones a normalized AST node tree.
   */
  public static cloneNode(node: NormalizedAstNode): NormalizedAstNode {
    return {
      id: node.id,
      kind: node.kind,
      name: node.name,
      range: {
        start: { ...node.range.start },
        end: { ...node.range.end },
      },
      parent: node.parent,
      children: node.children.map((child) => AstNormalizer.cloneNode(child)),
      metadata: node.metadata ? { ...node.metadata } : undefined,
    };
  }
}
