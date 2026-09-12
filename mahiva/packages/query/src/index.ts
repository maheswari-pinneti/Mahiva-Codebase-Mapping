import type { GraphEdgeAttributes, GraphNodeAttributes } from "@mahiva/shared";
import type { InMemoryDatabase } from "@mahiva/database";

export interface QueryOptions {
  nodeId?: string;
  type?: string;
}

export interface QueryResult {
  nodes: GraphNodeAttributes[];
  edges: GraphEdgeAttributes[];
}

export class QueryEngine {
  public constructor(private readonly database: InMemoryDatabase) {}

  public query(options: QueryOptions = {}): QueryResult {
    const nodes = this.database.listNodes().filter((node) => {
      if (options.nodeId && node.id !== options.nodeId) {
        return false;
      }

      if (options.type && node.type !== options.type) {
        return false;
      }

      return true;
    });

    const edges = this.database.getEdges().filter((edge) => {
      if (options.nodeId) {
        return edge.source === options.nodeId || edge.target === options.nodeId;
      }

      return true;
    });

    return {
      nodes,
      edges,
    };
  }
}

export function createQueryEngine(database: InMemoryDatabase): QueryEngine {
  return new QueryEngine(database);
}

export const PACKAGE_NAME = "@mahiva/query";
