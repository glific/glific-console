# Glific Console

The new Glific frontend (Glific 2.0). React + TypeScript + Vite, shadcn/ui + Tailwind v4, React Router,
TanStack Query, i18next.

## Setup

Requirements: Node 24 (`.nvmrc`), pnpm 12 (`corepack enable`), Docker (only to update visual baselines).

Like the current app, the console runs on **https://glific.test:3000**. One-time setup (skip what you already
have from the current app or backend):

```sh
# /etc/hosts
127.0.0.1 glific.test
127.0.0.1 api.glific.test
```

The dev server reuses the backend's mkcert certificate from `../glific/priv/cert` (set `GLIFIC_CERT_DIR` if your
backend lives elsewhere). Without it, it falls back to plain http.

```sh
pnpm install                           # also installs git hooks (lefthook)
pnpm exec playwright install chromium  # browser for component and E2E tests
pnpm dev                               # https://glific.test:3000, API answered by MSW mocks
GLIFIC_DEV_PORT=3001 pnpm dev          # run beside the current app, which also uses 3000
```

Sign in with any phone number and the password `password` while mocks are on. To use your local backend
(`https://api.glific.test:4001`), set `VITE_ENABLE_MOCKS=false` in `.env.local`. Its websocket origin check expects
port 3000, so stop the current app first or add the new origin to the backend's `REQUEST_ORIGIN`.

Environment variables are validated at startup (`src/lib/env.ts`); see `.env.example`. Non-secret defaults for
dev and test are in `.env.development` and `.env.test`; put local overrides in `.env.local`.

## Commands

| Command                                                |                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| `pnpm dev`                                             | Dev server on https://glific.test:3000 with mocked API      |
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
