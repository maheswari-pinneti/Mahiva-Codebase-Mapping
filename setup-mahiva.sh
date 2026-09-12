#!/usr/bin/env bash

set -e

echo "🚀 Creating Mahiva Codebase Mapping structure..."

# ============================================================
# GITHUB
# ============================================================

mkdir -p \
.github/ISSUE_TEMPLATE \
.github/workflows \
.github/scripts \
.husky \
.changeset

touch \
.github/ISSUE_TEMPLATE/bug_report.yml \
.github/ISSUE_TEMPLATE/feature_request.yml \
.github/ISSUE_TEMPLATE/parser_issue.yml \
.github/ISSUE_TEMPLATE/analyzer_issue.yml \
.github/ISSUE_TEMPLATE/performance_issue.yml \
.github/ISSUE_TEMPLATE/security_issue.yml \
.github/ISSUE_TEMPLATE/documentation.yml \
.github/ISSUE_TEMPLATE/config.yml \
.github/workflows/ci.yml \
.github/workflows/lint.yml \
.github/workflows/typecheck.yml \
.github/workflows/test.yml \
.github/workflows/build.yml \
.github/workflows/e2e.yml \
.github/workflows/benchmark.yml \
.github/workflows/security.yml \
.github/workflows/codeql.yml \
.github/workflows/dependency-review.yml \
.github/workflows/release.yml \
.github/workflows/publish.yml \
.github/workflows/nightly.yml \
.github/scripts/check-architecture.mjs \
.github/scripts/check-dependencies.mjs \
.github/scripts/check-package-boundaries.mjs \
.github/scripts/check-docs.mjs \
.github/scripts/check-workspace.mjs \
.github/CODEOWNERS \
.github/dependabot.yml \
.github/pull_request_template.md \
.husky/pre-commit \
.husky/commit-msg \
.changeset/README.md

# ============================================================
# CLI
# ============================================================

mkdir -p \
apps/cli/src/commands \
apps/cli/src/output \
apps/cli/src/formatters \
apps/cli/tests

touch \
apps/cli/src/commands/init.ts \
apps/cli/src/commands/scan.ts \
apps/cli/src/commands/status.ts \
apps/cli/src/commands/files.ts \
apps/cli/src/commands/symbols.ts \
apps/cli/src/commands/graph.ts \
apps/cli/src/commands/dependencies.ts \
apps/cli/src/commands/dependents.ts \
apps/cli/src/commands/callers.ts \
apps/cli/src/commands/callees.ts \
apps/cli/src/commands/impact.ts \
apps/cli/src/commands/architecture.ts \
apps/cli/src/commands/metrics.ts \
apps/cli/src/commands/changes.ts \
apps/cli/src/commands/api.ts \
apps/cli/src/commands/database.ts \
apps/cli/src/commands/tests.ts \
apps/cli/src/commands/search.ts \
apps/cli/src/output/json.ts \
apps/cli/src/output/table.ts \
apps/cli/src/output/tree.ts \
apps/cli/src/output/graph.ts \
apps/cli/src/output/terminal.ts \
apps/cli/src/formatters/error-formatter.ts \
apps/cli/src/formatters/scan-formatter.ts \
apps/cli/src/formatters/result-formatter.ts \
apps/cli/src/formatters/progress-formatter.ts \
apps/cli/src/cli.ts \
apps/cli/src/context.ts \
apps/cli/src/index.ts \
apps/cli/tests/init.test.ts \
apps/cli/tests/scan.test.ts \
apps/cli/tests/status.test.ts \
apps/cli/tests/files.test.ts \
apps/cli/tests/symbols.test.ts \
apps/cli/tests/graph.test.ts \
apps/cli/tests/impact.test.ts

# ============================================================
# SERVER
# ============================================================

mkdir -p \
apps/server/src/routes \
apps/server/src/middleware \
apps/server/src/plugins \
apps/server/src/schemas \
apps/server/src/services \
apps/server/tests

touch \
apps/server/src/routes/health.ts \
apps/server/src/routes/repositories.ts \
apps/server/src/routes/files.ts \
apps/server/src/routes/symbols.ts \
apps/server/src/routes/relationships.ts \
apps/server/src/routes/graph.ts \
apps/server/src/routes/dependencies.ts \
apps/server/src/routes/dependents.ts \
apps/server/src/routes/callers.ts \
apps/server/src/routes/callees.ts \
apps/server/src/routes/impact.ts \
apps/server/src/routes/metrics.ts \
apps/server/src/routes/changes.ts \
apps/server/src/routes/api-map.ts \
apps/server/src/routes/database-map.ts \
apps/server/src/routes/test-map.ts \
apps/server/src/routes/architecture.ts \
apps/server/src/routes/search.ts \
apps/server/src/middleware/error-handler.ts \
apps/server/src/middleware/request-context.ts \
apps/server/src/middleware/validation.ts \
apps/server/src/middleware/not-found.ts \
apps/server/src/plugins/cors.ts \
apps/server/src/plugins/logging.ts \
apps/server/src/plugins/swagger.ts \
apps/server/src/plugins/security.ts \
apps/server/src/schemas/repository.ts \
apps/server/src/schemas/file.ts \
apps/server/src/schemas/symbol.ts \
apps/server/src/schemas/relationship.ts \
apps/server/src/schemas/graph.ts \
apps/server/src/schemas/impact.ts \
apps/server/src/schemas/metrics.ts \
apps/server/src/schemas/search.ts \
apps/server/src/services/repository-service.ts \
apps/server/src/services/graph-service.ts \
apps/server/src/services/query-service.ts \
apps/server/src/services/scan-service.ts \
apps/server/src/services/search-service.ts \
apps/server/src/server.ts \
apps/server/src/index.ts \
apps/server/tests/health.test.ts \
apps/server/tests/repositories.test.ts \
apps/server/tests/files.test.ts \
apps/server/tests/symbols.test.ts \
apps/server/tests/graph.test.ts \
apps/server/tests/impact.test.ts

# ============================================================
# WEB
# ============================================================

mkdir -p \
apps/web/public/icons \
apps/web/src/app \
apps/web/src/layouts/AppLayout \
apps/web/src/layouts/Sidebar \
apps/web/src/layouts/Header \
apps/web/src/layouts/CommandBar \
apps/web/src/components/ui \
apps/web/src/components/cards \
apps/web/src/components/tables \
apps/web/src/components/charts \
apps/web/src/components/graph \
apps/web/src/components/source \
apps/web/src/components/loaders \
apps/web/src/pages/Dashboard/components \
apps/web/src/pages/Repositories \
apps/web/src/pages/Repository \
apps/web/src/pages/Files \
apps/web/src/pages/Symbols \
apps/web/src/pages/Dependencies \
apps/web/src/pages/CallGraph \
apps/web/src/pages/ImpactAnalysis \
apps/web/src/pages/Architecture \
apps/web/src/pages/APIMap \
apps/web/src/pages/DatabaseMap \
apps/web/src/pages/TestMap \
apps/web/src/pages/GitHistory \
apps/web/src/pages/Metrics \
apps/web/src/pages/Search \
apps/web/src/pages/Settings \
apps/web/src/features/repository \
apps/web/src/features/scanning \
apps/web/src/features/files \
apps/web/src/features/symbols \
apps/web/src/features/graph \
apps/web/src/features/impact \
apps/web/src/features/architecture \
apps/web/src/features/metrics \
apps/web/src/features/git \
apps/web/src/features/api \
apps/web/src/features/database \
apps/web/src/features/tests \
apps/web/src/store \
apps/web/src/services \
apps/web/src/hooks \
apps/web/src/types \
apps/web/src/utils \
apps/web/src/constants \
apps/web/src/theme \
apps/web/src/assets \
apps/web/tests/components \
apps/web/tests/pages \
apps/web/tests/features \
apps/web/tests/layouts

for component in Button Card Dialog Input Select Tabs Badge Tooltip Dropdown Breadcrumb Pagination; do
  mkdir -p "apps/web/src/components/ui/$component"
  touch "apps/web/src/components/ui/$component/index.ts"
done

touch \
apps/web/public/logo.svg \
apps/web/public/favicon.svg \
apps/web/public/manifest.json \
apps/web/src/app/App.tsx \
apps/web/src/app/routes.tsx \
apps/web/src/app/providers.tsx \
apps/web/src/app/error-boundary.tsx \
apps/web/src/app/config.ts \
apps/web/src/layouts/AppLayout/AppLayout.tsx \
apps/web/src/layouts/AppLayout/index.ts \
apps/web/src/layouts/Sidebar/Sidebar.tsx \
apps/web/src/layouts/Sidebar/SidebarItem.tsx \
apps/web/src/layouts/Sidebar/SidebarSection.tsx \
apps/web/src/layouts/Sidebar/index.ts \
apps/web/src/layouts/Header/Header.tsx \
apps/web/src/layouts/Header/RepositorySelector.tsx \
apps/web/src/layouts/Header/GlobalSearch.tsx \
apps/web/src/layouts/Header/NotificationCenter.tsx \
apps/web/src/layouts/Header/index.ts \
apps/web/src/layouts/CommandBar/CommandBar.tsx \
apps/web/src/layouts/CommandBar/CommandItem.tsx \
apps/web/src/layouts/CommandBar/index.ts \
apps/web/src/main.tsx \
apps/web/index.html

# ============================================================
# PACKAGES
# ============================================================

create_package() {
  mkdir -p "$1/src"
}

create_package packages/shared
mkdir -p packages/shared/src/types packages/shared/src/constants packages/shared/src/errors

touch \
packages/shared/src/types/repository.ts \
packages/shared/src/types/directory.ts \
packages/shared/src/types/file.ts \
packages/shared/src/types/symbol.ts \
packages/shared/src/types/relationship.ts \
packages/shared/src/types/graph.ts \
packages/shared/src/types/scan.ts \
packages/shared/src/types/metrics.ts \
packages/shared/src/types/index.ts \
packages/shared/src/index.ts

create_package packages/config

touch \
packages/config/src/schema.ts \
packages/config/src/defaults.ts \
packages/config/src/loader.ts \
packages/config/src/paths.ts \
packages/config/src/environment.ts \
packages/config/src/index.ts

create_package packages/logger

touch \
packages/logger/src/logger.ts \
packages/logger/src/child.ts \
packages/logger/src/serializers.ts \
packages/logger/src/index.ts

create_package packages/filesystem

touch \
packages/filesystem/src/read-file.ts \
packages/filesystem/src/write-file.ts \
packages/filesystem/src/exists.ts \
packages/filesystem/src/stat.ts \
packages/filesystem/src/walk-directory.ts \
packages/filesystem/src/hash-file.ts \
packages/filesystem/src/normalize-path.ts \
packages/filesystem/src/binary-detection.ts \
packages/filesystem/src/symlink.ts \
packages/filesystem/src/permissions.ts \
packages/filesystem/src/index.ts

create_package packages/languages
mkdir -p packages/languages/src/detectors

touch \
packages/languages/src/language.ts \
packages/languages/src/language-registry.ts \
packages/languages/src/extensions.ts \
packages/languages/src/detectors/extension-detector.ts \
packages/languages/src/detectors/shebang-detector.ts \
packages/languages/src/detectors/filename-detector.ts \
packages/languages/src/index.ts

create_package packages/scanner

touch \
packages/scanner/src/scanner.ts \
packages/scanner/src/discovery.ts \
packages/scanner/src/ignore-rules.ts \
packages/scanner/src/file-filter.ts \
packages/scanner/src/language-detection.ts \
packages/scanner/src/hashing.ts \
packages/scanner/src/scan-context.ts \
packages/scanner/src/scan-result.ts \
packages/scanner/src/progress.ts \
packages/scanner/src/index.ts

create_package packages/parser
mkdir -p packages/parser/src/tree-sitter packages/parser/src/typescript

touch \
packages/parser/src/parser.ts \
packages/parser/src/parser-result.ts \
packages/parser/src/parser-registry.ts \
packages/parser/src/tree-sitter/parser.ts \
packages/parser/src/tree-sitter/grammar-loader.ts \
packages/parser/src/tree-sitter/node-adapter.ts \
packages/parser/src/typescript/parser.ts \
packages/parser/src/typescript/program.ts \
packages/parser/src/typescript/node-adapter.ts \
packages/parser/src/index.ts

create_package packages/ast

mkdir -p \
packages/ast/src/nodes \
packages/ast/src/declarations \
packages/ast/src/expressions \
packages/ast/src/statements \
packages/ast/src/imports \
packages/ast/src/exports \
packages/ast/src/calls \
packages/ast/src/references \
packages/ast/src/locations \
packages/ast/src/visitors

touch packages/ast/src/index.ts

create_package packages/symbols

touch \
packages/symbols/src/extractor.ts \
packages/symbols/src/resolver.ts \
packages/symbols/src/symbol-table.ts \
packages/symbols/src/identity.ts \
packages/symbols/src/qualified-name.ts \
packages/symbols/src/locations.ts \
packages/symbols/src/index.ts

create_package packages/imports

touch \
packages/imports/src/import-parser.ts \
packages/imports/src/export-parser.ts \
packages/imports/src/require-parser.ts \
packages/imports/src/dynamic-import.ts \
packages/imports/src/module-resolver.ts \
packages/imports/src/package-resolver.ts \
packages/imports/src/index.ts

create_package packages/analyzer

touch \
packages/analyzer/src/call-analyzer.ts \
packages/analyzer/src/reference-analyzer.ts \
packages/analyzer/src/inheritance-analyzer.ts \
packages/analyzer/src/implementation-analyzer.ts \
packages/analyzer/src/dependency-analyzer.ts \
packages/analyzer/src/index.ts

create_package packages/relationships

touch \
packages/relationships/src/relationship-types.ts \
packages/relationships/src/relationship-builder.ts \
packages/relationships/src/relationship-resolver.ts \
packages/relationships/src/relationship-store.ts \
packages/relationships/src/confidence.ts \
packages/relationships/src/index.ts

create_package packages/graph

touch \
packages/graph/src/graph.ts \
packages/graph/src/nodes.ts \
packages/graph/src/edges.ts \
packages/graph/src/graph-builder.ts \
packages/graph/src/graph-loader.ts \
packages/graph/src/traversal.ts \
packages/graph/src/dependencies.ts \
packages/graph/src/dependents.ts \
packages/graph/src/shortest-path.ts \
packages/graph/src/index.ts

create_package packages/database
mkdir -p packages/database/src/schema packages/database/src/migrations packages/database/src/repositories

touch \
packages/database/src/client.ts \
packages/database/src/connection.ts \
packages/database/src/schema/repositories.ts \
packages/database/src/schema/directories.ts \
packages/database/src/schema/files.ts \
packages/database/src/schema/symbols.ts \
packages/database/src/schema/relationships.ts \
packages/database/src/schema/scans.ts \
packages/database/src/schema/commits.ts \
packages/database/src/schema/metrics.ts \
packages/database/src/schema/apis.ts \
packages/database/src/schema/database-tables.ts \
packages/database/src/schema/tests.ts \
packages/database/src/repositories/repository-repository.ts \
packages/database/src/repositories/file-repository.ts \
packages/database/src/repositories/symbol-repository.ts \
packages/database/src/repositories/relationship-repository.ts \
packages/database/src/repositories/scan-repository.ts \
packages/database/src/index.ts

create_package packages/query

touch \
packages/query/src/repositories.ts \
packages/query/src/files.ts \
packages/query/src/directories.ts \
packages/query/src/symbols.ts \
packages/query/src/relationships.ts \
packages/query/src/callers.ts \
packages/query/src/callees.ts \
packages/query/src/references.ts \
packages/query/src/dependencies.ts \
packages/query/src/dependents.ts \
packages/query/src/paths.ts \
packages/query/src/impact.ts \
packages/query/src/search.ts \
packages/query/src/index.ts

create_package packages/git

touch \
packages/git/src/repository.ts \
packages/git/src/branches.ts \
packages/git/src/commits.ts \
packages/git/src/diff.ts \
packages/git/src/changes.ts \
packages/git/src/blame.ts \
packages/git/src/index.ts

create_package packages/metrics

touch \
packages/metrics/src/loc.ts \
packages/metrics/src/complexity.ts \
packages/metrics/src/coupling.ts \
packages/metrics/src/fan-in.ts \
packages/metrics/src/fan-out.ts \
packages/metrics/src/dependency-depth.ts \
packages/metrics/src/hotspots.ts \
packages/metrics/src/maintainability.ts \
packages/metrics/src/index.ts

create_package packages/api-analyzer

touch \
packages/api-analyzer/src/route-detector.ts \
packages/api-analyzer/src/endpoint-parser.ts \
packages/api-analyzer/src/controller-analyzer.ts \
packages/api-analyzer/src/middleware-analyzer.ts \
packages/api-analyzer/src/request-types.ts \
packages/api-analyzer/src/response-types.ts \
packages/api-analyzer/src/index.ts

create_package packages/frontend-analyzer

touch \
packages/frontend-analyzer/src/component-analyzer.ts \
packages/frontend-analyzer/src/hook-analyzer.ts \
packages/frontend-analyzer/src/route-analyzer.ts \
packages/frontend-analyzer/src/state-analyzer.ts \
packages/frontend-analyzer/src/api-call-analyzer.ts \
packages/frontend-analyzer/src/props-analyzer.ts \
packages/frontend-analyzer/src/index.ts

create_package packages/backend-analyzer

touch \
packages/backend-analyzer/src/route-analyzer.ts \
packages/backend-analyzer/src/controller-analyzer.ts \
packages/backend-analyzer/src/service-analyzer.ts \
packages/backend-analyzer/src/repository-analyzer.ts \
packages/backend-analyzer/src/middleware-analyzer.ts \
packages/backend-analyzer/src/index.ts

create_package packages/database-analyzer

touch \
packages/database-analyzer/src/table-analyzer.ts \
packages/database-analyzer/src/column-analyzer.ts \
packages/database-analyzer/src/relation-analyzer.ts \
packages/database-analyzer/src/query-analyzer.ts \
packages/database-analyzer/src/migration-analyzer.ts \
packages/database-analyzer/src/orm-analyzer.ts \
packages/database-analyzer/src/index.ts

create_package packages/test-analyzer

touch \
packages/test-analyzer/src/test-discovery.ts \
packages/test-analyzer/src/test-symbols.ts \
packages/test-analyzer/src/source-test-mapping.ts \
packages/test-analyzer/src/coverage.ts \
packages/test-analyzer/src/test-frameworks.ts \
packages/test-analyzer/src/index.ts

create_package packages/architecture

touch \
packages/architecture/src/layer-detector.ts \
packages/architecture/src/boundary-detector.ts \
packages/architecture/src/dependency-rules.ts \
packages/architecture/src/violation-detector.ts \
packages/architecture/src/architecture-model.ts \
packages/architecture/src/index.ts

create_package packages/impact-analysis

touch \
packages/impact-analysis/src/direct-impact.ts \
packages/impact-analysis/src/transitive-impact.ts \
packages/impact-analysis/src/dependency-impact.ts \
packages/impact-analysis/src/api-impact.ts \
packages/impact-analysis/src/database-impact.ts \
packages/impact-analysis/src/test-impact.ts \
packages/impact-analysis/src/architecture-impact.ts \
packages/impact-analysis/src/index.ts

create_package packages/application
mkdir -p \
packages/application/src/scan \
packages/application/src/repository \
packages/application/src/analysis \
packages/application/src/query

touch \
packages/application/src/scan/scan-application.ts \
packages/application/src/scan/scan-pipeline.ts \
packages/application/src/repository/repository-application.ts \
packages/application/src/repository/repository-manager.ts \
packages/application/src/analysis/analysis-application.ts \
packages/application/src/query/query-application.ts \
packages/application/src/index.ts

create_package packages/plugins

touch \
packages/plugins/src/plugin.ts \
packages/plugins/src/plugin-registry.ts \
packages/plugins/src/plugin-loader.ts \
packages/plugins/src/index.ts

create_package packages/test-utils

touch \
packages/test-utils/src/fixtures.ts \
packages/test-utils/src/builders.ts \
packages/test-utils/src/assertions.ts \
packages/test-utils/src/temp-repository.ts \
packages/test-utils/src/index.ts

# ============================================================
# ROOT TESTS
# ============================================================

mkdir -p \
tests/fixtures/basic-project \
tests/fixtures/javascript-project \
tests/fixtures/typescript-project \
tests/fixtures/react-project \
tests/fixtures/node-project \
tests/fixtures/fullstack-project \
tests/fixtures/monorepo-project \
tests/fixtures/api-project \
tests/fixtures/database-project \
tests/fixtures/broken-project \
tests/unit \
tests/integration \
tests/e2e \
tests/performance \
tests/snapshots

# ============================================================
# DOCUMENTATION
# ============================================================

mkdir -p \
docs/getting-started \
docs/architecture \
docs/concepts \
docs/development \
docs/guides \
docs/api \
docs/database \
docs/ui \
docs/security \
docs/performance \
docs/plugins \
docs/examples \
docs/adr \
docs/reference

touch \
docs/README.md \
docs/getting-started/installation.md \
docs/getting-started/quick-start.md \
docs/getting-started/first-scan.md \
docs/getting-started/cli-basics.md \
docs/getting-started/troubleshooting.md \
docs/architecture/overview.md \
docs/architecture/system-architecture.md \
docs/architecture/dependency-rules.md \
docs/architecture/package-boundaries.md \
docs/architecture/scanner.md \
docs/architecture/parser.md \
docs/architecture/ast.md \
docs/architecture/symbols.md \
docs/architecture/imports.md \
docs/architecture/relationships.md \
docs/architecture/graph.md \
docs/architecture/database.md \
docs/architecture/query-engine.md \
docs/architecture/application-layer.md \
docs/architecture/plugin-system.md \
docs/concepts/codebase-map.md \
docs/concepts/dependency-graph.md \
docs/concepts/call-graph.md \
docs/concepts/symbol-resolution.md \
docs/concepts/impact-analysis.md \
docs/concepts/architecture-analysis.md \
docs/concepts/incremental-scanning.md \
docs/concepts/deterministic-analysis.md \
docs/concepts/code-health.md \
docs/concepts/local-first.md \
docs/development/setup.md \
docs/development/development.md \
docs/development/project-structure.md \
docs/development/coding-standards.md \
docs/development/testing.md \
docs/development/debugging.md \
docs/development/performance.md \
docs/development/architecture-rules.md \
docs/development/release.md \
docs/guides/cli.md \
docs/guides/configuration.md \
docs/guides/scanning.md \
docs/guides/ignore-files.md \
docs/guides/graph.md \
docs/guides/dependencies.md \
docs/guides/callers-and-callees.md \
docs/guides/impact.md \
docs/guides/architecture.md \
docs/guides/metrics.md \
docs/guides/git-analysis.md \
docs/guides/api-analysis.md \
docs/guides/database-analysis.md \
docs/guides/test-analysis.md \
docs/guides/plugins.md \
docs/guides/CI-integration.md \
docs/api/overview.md \
docs/api/authentication.md \
docs/api/repositories.md \
docs/api/files.md \
docs/api/symbols.md \
docs/api/relationships.md \
docs/api/graph.md \
docs/api/dependencies.md \
docs/api/impact.md \
docs/api/metrics.md \
docs/api/search.md \
docs/database/schema.md \
docs/database/tables.md \
docs/database/relationships.md \
docs/database/migrations.md \
docs/database/indexing.md \
docs/ui/overview.md \
docs/ui/design-system.md \
docs/ui/navigation.md \
docs/ui/dashboard.md \
docs/ui/repository-view.md \
docs/ui/file-explorer.md \
docs/ui/symbol-explorer.md \
docs/ui/dependency-graph.md \
docs/ui/call-graph.md \
docs/ui/impact-analysis.md \
docs/ui/architecture-view.md \
docs/ui/api-map.md \
docs/ui/database-map.md \
docs/ui/test-map.md \
docs/ui/metrics.md \
docs/ui/settings.md \
docs/security/security-model.md \
docs/security/filesystem-security.md \
docs/security/secrets.md \
docs/security/dependency-security.md \
docs/security/threat-model.md \
docs/security/reporting.md \
docs/performance/benchmarks.md \
docs/performance/scanner-performance.md \
docs/performance/parser-performance.md \
docs/performance/graph-performance.md \
docs/performance/database-performance.md \
docs/performance/large-repositories.md \
docs/plugins/plugin-overview.md \
docs/plugins/plugin-api.md \
docs/plugins/plugin-development.md \
docs/plugins/language-plugin.md \
docs/plugins/analyzer-plugin.md \
docs/examples/javascript.md \
docs/examples/typescript.md \
docs/examples/react.md \
docs/examples/node.md \
docs/examples/fullstack.md \
docs/examples/monorepo.md \
docs/examples/large-repository.md \
docs/adr/0001-monorepo.md \
docs/adr/0002-typescript.md \
docs/adr/0003-local-first.md \
docs/adr/0004-sqlite.md \
docs/adr/0005-tree-sitter.md \
docs/adr/0006-graphology.md \
docs/adr/0007-deterministic-engine.md \
docs/reference/configuration-reference.md \
docs/reference/relationship-types.md \
docs/reference/symbol-types.md \
docs/reference/graph-schema.md \
docs/reference/environment-variables.md \
docs/reference/exit-codes.md

# ============================================================
# EXAMPLES
# ============================================================

mkdir -p \
examples/javascript-project \
examples/typescript-project \
examples/react-project \
examples/node-project \
examples/fullstack-project \
examples/monorepo-project

# ============================================================
# CONFIG
# ============================================================

mkdir -p \
config/eslint \
config/prettier \
config/typescript \
config/vitest

touch \
config/eslint/base.js \
config/prettier/base.json \
config/typescript/base.json \
config/typescript/node.json \
config/typescript/react.json \
config/vitest/base.ts

# ============================================================
# SCRIPTS
# ============================================================

mkdir -p scripts

touch \
scripts/build.mjs \
scripts/clean.mjs \
scripts/benchmark.mjs \
scripts/check-architecture.mjs \
scripts/check-dependencies.mjs \
scripts/check-docs.mjs \
scripts/check-packages.mjs \
scripts/generate-docs.mjs \
scripts/generate-schema.mjs \
scripts/release.mjs

# ============================================================
# MAHIVA LOCAL STATE
# ============================================================

mkdir -p .mahiva
touch .mahiva/.gitkeep

# ============================================================
# ROOT FILES
# ============================================================

touch \
.gitignore \
.gitattributes \
.editorconfig \
.npmrc \
.nvmrc \
.cbmignore \
.dockerignore \
.prettierignore \
.prettierrc \
.gitleaks.toml \
eslint.config.js \
package.json \
pnpm-workspace.yaml \
pnpm-lock.yaml \
tsconfig.json \
vitest.config.ts \
playwright.config.ts \
Dockerfile \
docker-compose.yml \
README.md \
CONTRIBUTING.md \
CODE_OF_CONDUCT.md \
SECURITY.md \
GOVERNANCE.md \
ROADMAP.md \
CHANGELOG.md \
ARCHITECTURE.md \
LICENSE \
NOTICE

echo ""
echo "✅ Mahiva Codebase Mapping structure created!"
echo ""
echo "📁 Project:"
echo "   $(pwd)"
echo ""
echo "🔍 Checking structure..."
echo ""

find . \
  -not -path './.git/*' \
  -not -path './node_modules/*' \
  | sort

echo ""
echo "🎉 Done!"
echo ""
echo "Next:"
echo "  1. Initialize package manager"
echo "  2. Configure pnpm workspace"
echo "  3. Configure TypeScript"
echo "  4. Install dependencies"
echo "  5. Implement scanner"
echo "  6. Implement parser"
echo "  7. Implement symbol engine"
echo "  8. Implement relationship engine"
echo "  9. Implement graph engine"
echo " 10. Implement SQLite database"
echo " 11. Implement query engine"
echo " 12. Implement CLI"
echo " 13. Implement API"
echo " 14. Implement Web UI"
