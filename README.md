# Mahiva-Codebase-Mapping

 **Understand your codebase before you change it.**

Mahiva Codebase Mapping is an open-source developer tool designed to scan, analyze, map, and understand software codebases.

Mahiva starts with a lightweight CLI that discovers files, detects languages, and generates a machine-readable codebase map. Over time, it will evolve into a deeper code intelligence platform capable of understanding dependencies, architecture, changes, and potential impact across large software projects.

---

## 🚀 Vision

Modern software projects can contain thousands or millions of lines of code spread across frontend applications, backend services, APIs, databases, configuration files, and infrastructure.

Developers often spend significant time answering questions such as:

* Where is this feature implemented?
* Which files depend on this module?
* What APIs are connected to this component?
* What will break if I change this file?
* Which part of the application owns this functionality?
* How is the frontend connected to the backend?
* What changed between two versions?
* Which files are affected by a change?

**Mahiva aims to make these questions easier to answer.**

### Long-term vision

```text
Source Code
    ↓
Mahiva Scanner
    ↓
Code Analysis
    ↓
Dependency Graph
    ↓
Architecture Detection
    ↓
Impact Analysis
    ↓
Codebase Intelligence
```

---

# ✨ Current Features

## CLI

Mahiva currently provides a command-line interface with:

```bash
mahiva init
mahiva scan
mahiva map
mahiva status
```

### Initialize

```bash
mahiva init
```

Initializes Mahiva in a repository.

### Scan

```bash
mahiva scan
```

Scans the current codebase and reports:

* Files
* File extensions
* Basic language distribution
* Repository structure

Example:

```text
Mahiva Codebase Scan
====================

Root: /path/to/project
Files: 125

Languages / Extensions:
  .ts              42
  .tsx             31
  .json             8
  .css              7
  .md               5
  .js               4

Scan completed successfully.
```

### Generate a Map

```bash
mahiva map
```

Generates:

```text
mahiva-map.json
```

The map contains structured information about the scanned codebase.

Example:

```json
{
  "version": "0.1.0",
  "generatedAt": "2026-09-12T00:00:00.000Z",
  "root": "/project",
  "summary": {
    "totalFiles": 125,
    "extensions": {
      ".ts": 42,
      ".tsx": 31
    }
  },
  "files": [
    "src/index.ts",
    "src/core/scanner.ts",
    "src/core/mapper.ts"
  ]
}
```

### Status

```bash
mahiva status
```

Displays the current Mahiva project status.

---

# 🏗️ Architecture

Mahiva is being developed as a modular code intelligence system.

```text
Mahiva Codebase Mapping
│
├── CLI
│   ├── init
│   ├── scan
│   ├── map
│   └── status
│
├── Scanner
│   ├── files
│   ├── directories
│   └── extensions
│
├── Code Analysis
│   ├── imports
│   ├── exports
│   ├── functions
│   ├── classes
│   ├── interfaces
│   └── API routes
│
├── Dependency Graph
│   ├── file → file
│   ├── module → module
│   └── package → package
│
├── Architecture
│   ├── frontend
│   ├── backend
│   ├── database
│   └── services
│
├── Impact Analysis
│   ├── changed file
│   ├── affected files
│   └── affected APIs
│
└── Future
    ├── mahiva diff
    ├── mahiva impact
    ├── mahiva history
    └── Mahiva Version Control
```

---

# 🛠️ Technology Stack

Mahiva is currently built with a lightweight TypeScript/Node.js stack.

| Technology     | Purpose             |
| -------------- | ------------------- |
| TypeScript     | Core implementation |
| Node.js        | Runtime             |
| Commander      | CLI framework       |
| pnpm           | Package management  |
| GitHub Actions | CI/CD               |
| CodeQL         | Security analysis   |

The architecture is intentionally modular so additional analysis engines can be introduced later.

---

# 📦 Project Structure

```text
Mahiva-Codebase-Mapping/
│
├── mahiva-cli/
│   ├── src/
│   │   ├── core/
│   │   │   ├── scanner.ts
│   │   │   └── mapper.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── tsconfig.json
│
├── .github/
│   └── workflows/
│
├── README.md
└── .gitignore
```

Generated dependencies and build artifacts such as `node_modules/` and `dist/` should not be committed to the repository.

---

# 💻 Development

## Prerequisites

Install:

* Node.js
* pnpm
* Git

Check your versions:

```bash
node --version
pnpm --version
git --version
```

---

## Clone the Repository

```bash
git clone https://github.com/maheswari-pinneti/Mahiva-Codebase-Mapping.git
```

Enter the project:

```bash
cd Mahiva-Codebase-Mapping
```

Enter the CLI:

```bash
cd mahiva-cli
```

---

## Install Dependencies

```bash
pnpm install
```

This installs dependencies from:

```text
package.json
pnpm-lock.yaml
```

Do **not** commit:

```text
node_modules/
```

---

# 🔨 Build

Build the TypeScript CLI:

```bash
pnpm build
```

The compiled output is generated in:

```text
dist/
```

---

# ▶️ Development Mode

Run the CLI directly with TypeScript:

```bash
pnpm dev --help
```

Run:

```bash
pnpm dev init
```

Scan:

```bash
pnpm dev scan
```

Generate the map:

```bash
pnpm dev map
```

Check status:

```bash
pnpm dev status
```

---

# 🗺️ Codebase Mapping

The first stage of Mahiva focuses on creating a reliable representation of a software repository.

The mapping pipeline is:

```text
Repository
    ↓
Directory Walker
    ↓
File Discovery
    ↓
Extension Detection
    ↓
Codebase Map
    ↓
mahiva-map.json
```

The generated map becomes the foundation for future analysis.

---

# 🔬 Future Code Analysis

The next stage will introduce AST-based analysis.

Mahiva will progressively understand:

```text
Imports
Exports
Functions
Classes
Interfaces
Types
Variables
API Routes
Components
Services
Database Models
```

For example:

```text
UserDashboard.tsx
        │
        ├── imports UserService
        │
        ├── imports UserCard
        │
        └── calls /api/users
                    │
                    ↓
                UserController
                    │
                    ↓
                UserService
                    │
                    ↓
                UserRepository
                    │
                    ↓
                Database
```

This information can later become a dependency graph.

---

# 🔗 Dependency Graph

Mahiva will eventually model relationships such as:

```text
file → file
module → module
component → component
service → service
API → controller
controller → service
service → database
package → package
```

This enables developers to understand how different parts of a system are connected.

---

# 💥 Impact Analysis

One of Mahiva's long-term goals is impact analysis.

For example:

```bash
mahiva impact src/auth/authentication.ts
```

Mahiva could eventually report:

```text
Changed:
  src/auth/authentication.ts

Directly affected:
  src/auth/session.ts
  src/api/auth.ts

Indirectly affected:
  src/pages/Login.tsx
  src/components/AuthGuard.tsx

Affected API:
  POST /api/login

Affected tests:
  tests/authentication.test.ts
```

The goal is to help developers understand the potential consequences of a change before modifying a large system.

---

# 🔄 Future Commands

Planned commands include:

```bash
mahiva analyze
mahiva diff
mahiva impact
mahiva history
mahiva graph
mahiva architecture
```

### `mahiva analyze`

Deeply analyzes source code.

### `mahiva diff`

Understands structural changes between code versions.

### `mahiva impact`

Finds files, modules, APIs, and components affected by a change.

### `mahiva history`

Builds a historical understanding of how the codebase evolves.

### `mahiva graph`

Displays dependency relationships.

### `mahiva architecture`

Attempts to identify major architectural boundaries.

---

# 🌱 Development Roadmap

## Phase 1 — CLI Foundation

* [x] CLI setup
* [x] `init`
* [x] `scan`
* [x] `map`
* [x] `status`

## Phase 2 — Codebase Scanner

* [x] File discovery
* [x] Directory traversal
* [x] Extension detection
* [x] Ignored directories
* [ ] Advanced language detection
* [ ] Configurable scan rules

## Phase 3 — Code Analysis

* [ ] AST parsing
* [ ] Import detection
* [ ] Export detection
* [ ] Function detection
* [ ] Class detection
* [ ] Interface detection
* [ ] Type detection
* [ ] API route detection

## Phase 4 — Dependency Graph

* [ ] File dependency graph
* [ ] Module graph
* [ ] Package graph
* [ ] Circular dependency detection
* [ ] Graph visualization

## Phase 5 — Architecture Intelligence

* [ ] Frontend detection
* [ ] Backend detection
* [ ] Database detection
* [ ] Service detection
* [ ] API architecture
* [ ] Architecture visualization

## Phase 6 — Developer Intelligence

* [ ] `mahiva analyze`
* [ ] `mahiva diff`
* [ ] `mahiva impact`
* [ ] `mahiva history`
* [ ] Change impact reports

## Phase 7 — Future

* [ ] Large repository optimization
* [ ] Incremental analysis
* [ ] Persistent codebase index
* [ ] Developer integrations
* [ ] IDE integrations
* [ ] Mahiva version-control research

---

# 🔐 Security

Security is a core part of Mahiva's development.

The project uses automated security analysis and dependency auditing.

Developers should run:

```bash
pnpm audit
```

before introducing dependency changes.

Never commit:

```text
.env
credentials
API keys
tokens
private certificates
node_modules
build artifacts
```

Security issues should be reported responsibly rather than publicly exposing sensitive vulnerabilities.

---

# 🤝 Contributing

Mahiva is intended to become an open-source project that developers can build together.

Contributions are welcome.

Typical workflow:

```bash
git clone https://github.com/maheswari-pinneti/Mahiva-Codebase-Mapping.git

cd Mahiva-Codebase-Mapping

git checkout -b feature/my-feature

cd mahiva-cli

pnpm install

pnpm build

pnpm dev scan

git status

git add .

git commit -m "feat(mahiva): add my feature"

git push -u origin feature/my-feature
```

Then open a pull request on GitHub.

---

# 📌 Development Principles

Mahiva follows several principles:

### 1. Developer First

The tool should solve real problems developers face when navigating complex codebases.

### 2. Open Source

Core functionality should remain accessible to the developer community.

### 3. Deterministic Analysis

The same source code should produce predictable analysis results.

### 4. Modular Architecture

Scanning, parsing, graph generation, architecture detection, and impact analysis should remain independently extensible.

### 5. Performance

Mahiva should eventually support large repositories without requiring developers to wait unnecessarily.

### 6. Privacy

Source code analysis should preferably run locally.

Mahiva should not require developers to upload private source code to an external service for basic functionality.

---

# 🎯 Why Mahiva?

Large codebases become difficult to understand as they grow.

Mahiva is being built to provide a structured answer to:

> **"How does this codebase actually work?"**

Instead of searching through thousands of files manually:

```text
Developer
    │
    ↓
Mahiva
    │
    ├── What files exist?
    ├── What languages are used?
    ├── What depends on what?
    ├── Where are the APIs?
    ├── What architecture exists?
    ├── What will this change affect?
    └── How has the system evolved?
```

---

# 🌍 Open Source

Mahiva Codebase Mapping is being developed as an open-source project.

Repository:

**Mahiva Codebase Mapping**

https://github.com/maheswari-pinneti/Mahiva-Codebase-Mapping

The project is currently in an early development stage. APIs, architecture, and CLI commands may change as the project evolves.

---

# 📄 License

License information will be added as the project reaches its open-source release milestone.

---

# 🚀 Status

**Current stage: Early Development**

Current focus:

```text
CLI
 ↓
Scanner
 ↓
Codebase Map
 ↓
AST Analysis
 ↓
Dependency Graph
 ↓
Architecture
 ↓
Impact Analysis
 ↓
Developer Intelligence
```

Mahiva is intentionally being built incrementally — starting with a small, reliable codebase mapper and growing toward a comprehensive developer intelligence platform.

---

## Built for Developers

**Mahiva — Understand your codebase. Understand your changes. Build with confidence.**
