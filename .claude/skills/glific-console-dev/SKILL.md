---

name: glific-console-dev
description: How to work on glific-console, the Glific 2.0 frontend. Use when starting work in this repo, picking up a ticket under glific/glific#6078, building or migrating a page or section, deciding where code goes, or asking how testing, mocks, E2E or bundle budgets work here.
---

# Working on glific-console

glific-console is the new Glific frontend (Glific 2.0). It is rolled out beside the current app
(glific-frontend) and replaces it section by section. Rules and conventions live in `AGENTS.md` (read it
first) and setup in `README.md`; this skill adds the context and the workflow around them.

- Background, rollout, tickets and who owns what: [references/context.md](references/context.md)
- Moving a section from the current app into the console: [references/migrating-a-section.md](references/migrating-a-section.md)
- Testing, mocks, E2E and budgets in detail: [references/testing.md](references/testing.md)

## First day

You already have `glific` (backend) and `glific-frontend` running locally.

1. Clone `glific/glific-console` beside them (e.g. `~/code/glific-console` next to `~/code/glific`): the console
   reads the backend's certificate and schema from `../glific`.
2. `corepack enable`, `pnpm install` (also installs the git hooks), `pnpm exec playwright install chromium`.
3. `pnpm dev` and log in at https://glific.test:3000 with a seed user (see `e2e/fixtures.ts`), or
   `pnpm dev:mock` with any phone and the password `password` (no backend).
4. Run `pnpm check` and `pnpm test:e2e`. Both must pass on a clean checkout before you change anything.
5. Read `AGENTS.md`, open the `/design-system` page (Glific admins only) to see the components and tokens, and
   pick a ticket from glific/glific#6078 in your area.

## Where things live

| You need                                                             | Look at                                                                                                                               |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| The IA: every section and page, who sees it, which org flag it needs | `src/features/shell/navigation.ts`                                                                                                    |
| Rail, account menu, right panel                                      | `src/features/shell/` (`AppShell`, `AppSidebar`, `AccountMenu`, `SidePanel`)                                                          |
| Right-panel apps (Glific AI, Notifications, Resources)               | `src/features/shell/side-apps.ts`; open one with `useSideApps().show("glificAi")`                                                     |
| Glific AI conversation from any page                                 | `useGlificAi()` in `src/features/glific-ai/glific-ai-context.ts`                                                                      |
| Roles                                                                | `src/features/auth/current-user.ts` (`everyone`, `managers`, `admins`, `staffManagers`, `glificAdmins`, `useAccess`), `RequireAccess` |
| Organisation flags and details                                       | `src/features/organization/organization.ts` (`useOrganizationServices`, `useOrganization`)                                            |
| Routes (all lazy)                                                    | `src/routes/router.tsx`                                                                                                               |
| List pages, headers, breadcrumbs, section tabs                       | `src/components/ListPage.tsx`, `src/components/PageHeader.tsx` (`breadcrumbs`, `sections`), `PageSections` from `@/features/shell`    |
| Forms                                                                | `@/components/form` (`useZodForm`, `FormField`, `FormActions`, `UnsavedChangesGuard`) with schemas from `zod/mini`                    |
| Strings                                                              | `src/locales/en.json` and `hi.json`, same keys, in the same change                                                                    |
| Tokens and design rules                                              | `src/styles/tokens.css` + `tokens.ts`; rules in `AGENTS.md`, enforced by `pnpm lint:ds`                                               |
| Mocks                                                                | `src/mocks/<feature>.ts`, registered in `src/mocks/handlers.ts`                                                                       |
| Bundle budgets                                                       | `.size-limit.js`: 200 kB first load, 60 kB per lazy page                                                                              |

## How we split the work

Work is divided by **feature** (a rail section), not by route. A section's list, add and edit pages share their
queries, mocks, strings and components, so one person owns the section end to end.

The order and owner of each package are in the **Work packages** tab of the "Glific 2.0 - Development Plan"
sheet: <https://docs.google.com/spreadsheets/d/1wAcT6TsZWMOg0pOtVAWPg_GIsaRVD-2wZftRc1vTkCM>. Take your track's
packages in order and update their Status there.

- Track A: flow list and folders, Library, AI assistants, Monitor lists.
- Track B: Contacts, Chats, WhatsApp groups, Settings, Staff and Glific team admin.

We only rebuild pages that get new functionality (Flows and the AI work first). Everything else keeps opening in
the current app until its turn.

To stay out of each other's way:

1. **Shared components are their own PR.** Anything new in `src/components` or `src/components/ui` goes in a small
   PR that the other dev reviews before your feature depends on it.
2. **Strings under your feature's key** (`flows.*`, `chats.*`), never in another feature's block.
3. **Mocks in your feature's file** (`src/mocks/flows.ts`), added to the list in `src/mocks/handlers.ts`.
4. **One PR moves a whole section**: swap `currentAppPath` for `to` in `navigation.ts` and tick the section's
   parity checklist in glific/glific#6078. Never leave a section half moved.
5. **Backend gaps get their own glific/glific ticket**, linked from your ticket and added to the epic, like
   glific/glific#6235 for Home. Don't wait on the other dev for backend questions.

## Before you open a PR

1. `pnpm check` passes (typecheck, lint, design-system lint, unit and component tests).
2. UI change: `pnpm test:e2e` passes against your local backend.
3. Changed a GraphQL operation: `pnpm codegen` and commit `src/graphql/generated/graphql.ts`.
4. New page or heavy import: `pnpm build && pnpm size` stays inside the budgets.
5. Strings exist in both `en.json` and `hi.json`.
6. Commits: Conventional Commits with a lowercase subject (`feat(flows): add folders`), body lines at most 100
   characters, no co-author trailers. Keep PR descriptions short and link the ticket.

## Habits that keep CI green

- Use `findBy*` for anything that appears after data or a lazy route loads; `getBy*` races in CI.
- Every page gets a role test (who can and can't see it) and an axe check.
- Comments explain a non-obvious why only. One component per file, in PascalCase.
- New dependency? Ask first and vet it (release age, maintainers, activity). If Vitest reloads mid-run after
  you add one, add it to `optimizeDeps.include` in `vite.config.ts`.
