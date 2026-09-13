import { NodeType, RelationshipType } from "@mahiva/shared";
import type { GraphEdgeAttributes, GraphNodeAttributes } from "@mahiva/shared";
import type { RelationshipResult } from "@mahiva/relationships";

export interface GraphTraversalStep {
  nodeId: string;
  depth: number;
}

export interface GraphTraversalOptions {
  maxDepth?: number;
  includeEdgeTypes?: RelationshipType[];
}

export class GraphModel {
  private readonly nodes = new Map<string, GraphNodeAttributes>();
  private readonly edges: GraphEdgeAttributes[] = [];
  private readonly outgoing = new Map<string, GraphEdgeAttributes[]>();
  private readonly incoming = new Map<string, GraphEdgeAttributes[]>();

  public constructor(relationshipResults: RelationshipResult[] = []) {
    for (const result of relationshipResults) {
      this.addNode({
        id: result.fileId,
        type: NodeType.FILE,
        name: result.fileId,
        path: result.fileId,
        fileId: result.fileId,
      });

      for (const edge of result.edges) {
        this.addEdge(edge);
      }
    }
  }

  public addNode(node: GraphNodeAttributes): void {
    this.nodes.set(node.id, { ...node });
    if (!this.outgoing.has(node.id)) {
      this.outgoing.set(node.id, []);
    }
    if (!this.incoming.has(node.id)) {
      this.incoming.set(node.id, []);
    }
  }

  public addEdge(edge: GraphEdgeAttributes): void {
    this.addNode({
      id: edge.source,
      type: NodeType.FILE,
      name: edge.source,
      path: edge.source,
      fileId: edge.source,
    });

    this.addNode({
      id: edge.target,
      type:
        edge.type === RelationshipType.CONTAINS
          ? NodeType.SYMBOL
          : NodeType.FILE,
      name: edge.target,
      path: edge.target,
      fileId: edge.source,
    });

    this.edges.push({ ...edge });
    this.outgoing.get(edge.source)?.push({ ...edge });
    this.incoming.get(edge.target)?.push({ ...edge });
  }

  public hasNode(nodeId: string): boolean {
    return this.nodes.has(nodeId);
  }

  public hasEdge(source: string, target: string): boolean {
    return (this.outgoing.get(source) ?? []).some(
      (edge) => edge.target === target,
    );
  }

  public getNode(nodeId: string): GraphNodeAttributes | undefined {
    return this.nodes.get(nodeId);
  }

  public getOutgoingEdges(nodeId: string): GraphEdgeAttributes[] {
    return [...(this.outgoing.get(nodeId) ?? [])];
  }

  public getIncomingEdges(nodeId: string): GraphEdgeAttributes[] {
    return [...(this.incoming.get(nodeId) ?? [])];
  }

  public traverse(
    startNodeId: string,
    options: GraphTraversalOptions = {},
  ): GraphTraversalStep[] {
    const maxDepth = options.maxDepth ?? Number.POSITIVE_INFINITY;
    const includeEdgeTypes = options.includeEdgeTypes
      ? new Set(options.includeEdgeTypes)
      : null;

    const visited = new Set<string>([startNodeId]);
    const queue: Array<{ nodeId: string; depth: number }> = [
      { nodeId: startNodeId, depth: 0 },
    ];
    const traversal: GraphTraversalStep[] = [{ nodeId: startNodeId, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        break;
      }

      const nextDepth = current.depth + 1;
      if (nextDepth > maxDepth) {
        continue;
      }

      for (const edge of this.outgoing.get(current.nodeId) ?? []) {
        if (includeEdgeTypes && !includeEdgeTypes.has(edge.type)) {
          continue;
        }

        if (visited.has(edge.target)) {
          continue;
        }

        visited.add(edge.target);
        queue.push({ nodeId: edge.target, depth: nextDepth });
        traversal.push({ nodeId: edge.target, depth: nextDepth });
      }
    }

    return traversal;
  }

  public findDependents(
    startNodeId: string,
    maxDepth = Number.POSITIVE_INFINITY,
  ): string[] {
    const queue: Array<{ nodeId: string; depth: number }> = [
      { nodeId: startNodeId, depth: 0 },
    ];
    const visited = new Set<string>([startNodeId]);
    const dependents = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        break;
      }

      for (const edge of this.incoming.get(current.nodeId) ?? []) {
        if (current.depth >= maxDepth) {
          continue;
        }

        if (visited.has(edge.source)) {
          continue;
        }

        visited.add(edge.source);
        dependents.add(edge.source);
        queue.push({ nodeId: edge.source, depth: current.depth + 1 });
      }
    }

    return [...dependents];
  }

  public toJSON() {
    return {
      nodes: [...this.nodes.values()],
      edges: [...this.edges],
    };
  }
}

export function buildGraph(
  relationshipResults: RelationshipResult[],
): GraphModel {
  return new GraphModel(relationshipResults);
}

export const PACKAGE_NAME = "@mahiva/graph";
