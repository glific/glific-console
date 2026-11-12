# Glific Console

The new Glific frontend (Glific 2.0). React + TypeScript + Vite, shadcn/ui + Tailwind v4, React Router,
TanStack Query, i18next.

## Setup

Requirements: Node 24 (`.nvmrc`), pnpm 12 (`corepack enable`), Docker (only to update visual baselines).

```sh
pnpm install                         # also installs git hooks (lefthook)
pnpm exec playwright install chromium  # browser for component and E2E tests
pnpm dev                             # http://localhost:5173, API served by MSW mocks
```

Environment variables are validated at startup (`src/lib/env.ts`); see `.env.example`. Non-secret defaults for
dev and test are in `.env.development` and `.env.test`; put local overrides in `.env.local`.

## Commands

| Command                                                |                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| `pnpm dev`                                             | Dev server with mocked API                                  |
| `pnpm build` / `pnpm preview`                          | Production build / serve it                                 |
| `pnpm check`                                           | Typecheck, lint, design-system lint, unit + component tests |
| `pnpm lint:fix`                                        | Format and fix with Biome                                   |
| `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` | Vitest Browser Mode                                         |
| `pnpm test:e2e`                                        | Playwright flows and axe accessibility checks               |
| `pnpm test:visual`                                     | Visual regression against committed baselines               |
| `pnpm test:visual:update`                              | Regenerate baselines in the Playwright Docker image         |
| `pnpm size`                                            | Bundle size budgets (after `pnpm build`)                    |
| `pnpm changeset`                                       | Record a user-facing change                                 |

## Project docs

- `AGENTS.md`: conventions, design-system rules and how to verify a change (for humans and AI agents)
- `docs/adr/`: architecture decisions; start with `0001-stack.md`
- `docs/specs/`: feature specs
