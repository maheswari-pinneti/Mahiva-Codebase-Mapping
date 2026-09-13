import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";
import type { GraphEdgeAttributes, GraphNodeAttributes } from "@mahiva/shared";

export interface DatabaseOptions {
  filePath?: string;
}

export interface PersistenceRecord<T> {
  id: string;
  payload: T;
}

export class InMemoryDatabase {
  private readonly filePath?: string;
  private readonly db: InstanceType<typeof Database>;

  public constructor(options: DatabaseOptions = {}) {
    this.filePath = options.filePath ? resolve(options.filePath) : undefined;

    if (this.filePath) {
      mkdirSync(dirname(this.filePath), { recursive: true });
    }

    this.db = new Database(this.filePath ?? ":memory:");
    this.initializeSchema();
  }

  public saveNode(node: GraphNodeAttributes): void {
    this.db
      .prepare(
        `
          INSERT INTO graph_nodes (id, type, name, path, fileId, kind, metadata)
          VALUES (@id, @type, @name, @path, @fileId, @kind, @metadata)
          ON CONFLICT(id) DO UPDATE SET
            type = excluded.type,
            name = excluded.name,
            path = excluded.path,
            fileId = excluded.fileId,
            kind = excluded.kind,
            metadata = excluded.metadata
        `,
      )
      .run(this.serializeNode(node));
  }

  public saveEdge(edge: GraphEdgeAttributes): void {
    this.db
      .prepare(
        `
          INSERT INTO graph_edges (id, type, source, target, weight, metadata)
          VALUES (@id, @type, @source, @target, @weight, @metadata)
          ON CONFLICT(id) DO UPDATE SET
            type = excluded.type,
            source = excluded.source,
            target = excluded.target,
            weight = excluded.weight,
            metadata = excluded.metadata
        `,
      )
      .run(this.serializeEdge(edge));
  }

  public getNode(nodeId: string): GraphNodeAttributes | undefined {
    const row = this.db
      .prepare(
        `
          SELECT id, type, name, path, fileId, kind, metadata
          FROM graph_nodes
          WHERE id = ?
        `,
      )
      .get(nodeId) as
      | {
          id: string;
          type: GraphNodeAttributes["type"];
          name: string;
          path: string | null;
          fileId: string | null;
          kind: string | null;
          metadata: string | null;
        }
      | undefined;

    return row ? this.deserializeNode(row) : undefined;
  }

  public getEdges(): GraphEdgeAttributes[] {
    const rows = this.db
      .prepare(
        `
          SELECT id, type, source, target, weight, metadata
          FROM graph_edges
          ORDER BY id
        `,
      )
      .all() as Array<{
      id: string;
      type: GraphEdgeAttributes["type"];
      source: string;
      target: string;
      weight: number | null;
      metadata: string | null;
    }>;

    return rows.map((row) => this.deserializeEdge(row));
  }

  public listNodes(): GraphNodeAttributes[] {
    const rows = this.db
      .prepare(
        `
          SELECT id, type, name, path, fileId, kind, metadata
          FROM graph_nodes
          ORDER BY id
        `,
      )
      .all() as Array<{
      id: string;
      type: GraphNodeAttributes["type"];
      name: string;
      path: string | null;
      fileId: string | null;
      kind: string | null;
      metadata: string | null;
    }>;

    return rows.map((row) => this.deserializeNode(row));
  }

  public close(): void {
    this.db.close();
  }

  private initializeSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS graph_nodes (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        path TEXT,
        fileId TEXT,
        kind TEXT,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS graph_edges (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        source TEXT NOT NULL,
        target TEXT NOT NULL,
        weight INTEGER,
        metadata TEXT
      );
    `);
  }

  private serializeNode(node: GraphNodeAttributes): {
    id: string;
    type: GraphNodeAttributes["type"];
    name: string;
    path: string | null;
    fileId: string | null;
    kind: string | null;
    metadata: string | null;
  } {
    return {
      id: node.id,
      type: node.type,
      name: node.name,
      path: node.path ?? null,
      fileId: node.fileId ?? null,
      kind: node.kind ?? null,
      metadata: node.metadata ? JSON.stringify(node.metadata) : null,
    };
  }

  private serializeEdge(edge: GraphEdgeAttributes): {
    id: string;
    type: GraphEdgeAttributes["type"];
    source: string;
    target: string;
    weight: number | null;
    metadata: string | null;
  } {
    return {
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      weight: edge.weight ?? null,
      metadata: edge.metadata ? JSON.stringify(edge.metadata) : null,
    };
  }

  private deserializeNode(row: {
    id: string;
    type: GraphNodeAttributes["type"];
    name: string;
    path: string | null;
    fileId: string | null;
    kind: string | null;
    metadata: string | null;
  }): GraphNodeAttributes {
    return {
      id: row.id,
      type: row.type,
      name: row.name,
      path: row.path ?? undefined,
      fileId: row.fileId ?? undefined,
      kind: row.kind ?? undefined,
      metadata: row.metadata
        ? (JSON.parse(row.metadata) as Record<string, unknown>)
        : undefined,
    };
  }

  private deserializeEdge(row: {
    id: string;
    type: GraphEdgeAttributes["type"];
    source: string;
    target: string;
    weight: number | null;
    metadata: string | null;
  }): GraphEdgeAttributes {
    return {
      id: row.id,
      type: row.type,
      source: row.source,
      target: row.target,
      weight: row.weight ?? undefined,
      metadata: row.metadata
        ? (JSON.parse(row.metadata) as Record<string, unknown>)
        : undefined,
    };
  }
}

export function createDatabase(
  options: DatabaseOptions = {},
): InMemoryDatabase {
  return new InMemoryDatabase(options);
}

export const PACKAGE_NAME = "@mahiva/database";
