import { NodeType, RelationshipType } from "../domain/enums.js";

export interface GraphNodeAttributes {
  id: string;
  type: NodeType;
  name: string;
  path?: string;
  fileId?: string;
  kind?: string;
  metadata?: Record<string, unknown>;
}

export interface GraphEdgeAttributes {
  id: string;
  type: RelationshipType;
  source: string;
  target: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface ImpactAnalysisResult {
  targetSymbol: string;
  targetFile: string;
  directDependents: {
    symbolId: string;
    symbolName: string;
    fileId: string;
    filePath: string;
    relationship: RelationshipType;
  }[];
  indirectDependentsCount: number;
  affectedTests: string[];
  affectedApiRoutes: string[];
  totalAffectedFiles: number;
  traversalDepth: number;
}
