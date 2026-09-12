# Contributing to Mahiva Codebase Mapping

Thanks for your interest in Mahiva Codebase Mapping.

## Development workflow

1. Clone the repository.
2. Navigate to the workspace under `mahiva/`.
3. Install dependencies with `pnpm install`.
4. Run the standard verification commands before opening a pull request:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`

## Code standards

- Use TypeScript and keep code deterministic.
- Prefer small, testable packages over broad abstractions.
- Add or update tests for behavior changes.
- Keep package boundaries clear and avoid circular dependencies.

## Pull requests

- Keep changes focused.
- Include verification output when possible.
- Document new behavior in the relevant package or docs.

## Reporting issues

Open an issue with as much detail as possible, including reproduction steps, environment details, and expected behavior.
