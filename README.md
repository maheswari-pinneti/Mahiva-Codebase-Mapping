# Mahiva Codebase Mapping

Mahiva Codebase Mapping is a deterministic, local-first codebase intelligence toolchain for scanning repositories, extracting symbols and relationships, and building a queryable map of a software system.

## Repository structure

- `mahiva/` contains the active TypeScript monorepo implementation
- `packages/` contains additional workspace-level packages or future shared assets
- `.github/` contains repository automation and contribution metadata

## Current status

The repository already includes the foundation, filesystem engine, scanner, language registry, and parser layers. The project is configured for pnpm workspaces and is verified through lint, typecheck, tests, and package builds.

## Quick verification

From the repository root:

```bash
cd mahiva
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Key principles

- Deterministic static analysis first
- Local-first repository mapping
- Evidence-driven graph and impact analysis
- Incremental extension by phase, not by broad speculative rewrites

## Next phases

The roadmap continues with normalized AST work, symbol extraction, imports, semantic analysis, relationships, graph persistence, query engine, CLI, API, and web layers.
