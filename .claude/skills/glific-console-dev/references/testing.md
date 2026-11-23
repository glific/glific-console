# Testing

Three layers, all run in CI on every PR (`.github/workflows/ci.yml`):

| Layer              | Command                                       | Runs against                      | Lives in                        |
| ------------------ | --------------------------------------------- | --------------------------------- | ------------------------------- |
| Unit and component | `pnpm test` (`pnpm test:watch` while working) | Real Chromium, MSW mocks          | `*.test.ts(x)` next to the code |
| E2E and axe        | `pnpm test:e2e`                               | Your local backend with dev seeds | `e2e/flows/`, `e2e/a11y/`       |
| Bundle budgets     | `pnpm build && pnpm size`                     | The production build              | `.size-limit.js`                |

`pnpm check` runs typecheck, lint, design-system lint and the unit and component tests. It must pass before you
call something done.

CI's first job runs: `pnpm codegen` with a diff check (generated GraphQL types must be committed), typecheck,
`biome ci`, `pnpm lint:ds`, `pnpm test:coverage` (80% coverage gate on `src/components`), `pnpm build`, `pnpm size`.
The second job clones the backend (a same-named branch if one exists), runs `mix setup`, starts it and runs
`pnpm test:e2e`. Failed E2E runs upload a Playwright report as an artifact.

## Component and feature tests (Vitest Browser Mode)

Tests run in a real Chromium, so focus, layout, CSS tokens and keyboard behave as they do for users.

Helpers (`src/test/`):

- `renderRoute(path, { signedIn })`: the whole app at a route, signed in as the mock user (a Glific admin) by
  default. Returns `router` so you can assert `router.state.location.pathname`.
- `renderWithProviders(ui)`: one component with the app's providers (query client, i18n). Wrap it in a
  `MemoryRouter` if it renders links.
- `expectNoA11yViolations(container?)`: axe on the document. When a Radix menu or dialog is open it aria-hides the
  page behind it, so pass the open menu or dialog as `container`.
- `worker` (`@/test/msw`): the MSW worker. Handlers reset after each test, and `localStorage` is cleared.
- `userEvent` from `vitest/browser`, and Testing Library queries by role and accessible name.

Mocks (`src/mocks/`):

- Every GraphQL operation has a default handler: `glificApi.query("OperationName", ...)` or
  `glificApi.mutation(...)`. `glificApi` and the default handler list are exported from `src/mocks/handlers.ts`;
  feature handlers live in `src/mocks/<feature>.ts`. Auth REST endpoints are in `src/mocks/auth.ts`
  (`MOCK_PASSWORD`, `MOCK_OTP`).
- Override per test: `worker.use(glificApi.query("Contacts", () => HttpResponse.json({ data: { ... } })))`.
- Other roles: `worker.use(currentUserWithRoles(["Staff"]))` (any access-role labels; `["Counsellor"]` is a custom
  role, which counts as a manager).
- Live updates: socket handlers come from `createGraphQLSubscriptionHandler("*/socket")` (`msw/graphql`). Keep the
  `subscription` object it gives you and call `subscription.publish({ data: { ... } })` when the test needs an
  event. See `src/features/glific-ai/GlificAiPanel.test.tsx`.

What every page test covers:

1. It renders data from the mocked API, and passes axe.
2. Empty and error states (override the handler).
3. Roles: a user who can open it, and one who can't (gets the "no access" page or doesn't see the link).
4. The main interactions with the keyboard and mouse.
5. Anything that links to the current app points at `${location.origin}/<path>` (in tests the current app shares
   the origin).

Patterns and pitfalls:

- **Use `findBy*` (or `expect.poll`) for anything that appears after a request or a lazy route loads.** Pages are
  lazy routes; a `getBy*` right after navigation passes locally and fails on the slower CI machine.
- `location.assign` can't be spied on. Full page loads to other origins go through `browser.open()`
  (`src/lib/browser.ts`); spy on that: `vi.spyOn(browser, "open").mockImplementation(() => {})`.
- To test forwarding to the current app, mock `currentAppUrl` with
  `vi.mock("@/lib/backend", async (importOriginal) => ({ ...(await importOriginal()), currentAppUrl: ... }))`
  (see `src/routes/CurrentAppRedirect.test.tsx`).
- A test that reloads with "Vite unexpectedly reloaded a test" means a dependency was discovered mid-run: add it
  to `optimizeDeps.include` in `vite.config.ts`.
- The mock user's name is "Glific Team", so Home greets "Glific".

## E2E (Playwright)

`pnpm test:e2e` runs `e2e/` against `https://api.glific.test:4001` with the backend's dev seeds, the same way CI
does. It reuses `pnpm dev` if it's running, otherwise starts it. MSW is never used here.

- Seed users are in `e2e/fixtures.ts`: `glificAdmin` (`919900000001`, seeded by glific/glific#6214) and `staff`.
  Tests sign in as `glificAdmin` by default; switch with `test.use({ signedInAs: "staff" })`, or
  `test.use({ signedInAs: null })` for signed-out pages.
- `checkA11y()` runs axe (WCAG 2.1 AA) on the current page. Every new page gets an entry in
  `e2e/a11y/pages.spec.ts`; user journeys go in `e2e/flows/`.
- A test that creates data gives it a unique name, so tests don't depend on each other.
- A feature that needs a backend change: push a backend branch with the same name as your console branch, and CI
  runs your E2E against it.
- Backend setup locally: `mix setup` in `../glific` loads the seeds; restart it with `mix phx.server`.

## Bundle budgets

`pnpm build && pnpm size` checks:

- **First load** (`index.html` and everything it imports statically): 200 kB gzipped, size and running time.
- **Each lazy page**: 60 kB gzipped on top of the first load, size only.
- Monitoring SDKs (Sentry, PostHog): 300 kB, loaded after first paint.
- App CSS: 24 kB.

A page over budget usually means a heavy import: a barrel (`@/components/chat` pulls the whole chat kit, import
the file directly), a library that belongs in `components/ui` behind a lazy boundary, or an overlay (menus,
tooltips, sheets) that could load on first use. Keep pages as lazy routes and side-panel apps lazy.

## Running the app

- `pnpm dev`: https://glific.test:3000 against your local backend. Log in with a seed user.
- `pnpm dev:mock`: same address, MSW answers the API; any phone with the password `password`. Handy for UI work and
  for states that are hard to reach on a real backend.
- `GLIFIC_DEV_PORT=3001 pnpm dev` to run beside the current app; live updates then need that origin in the
  backend's `REQUEST_ORIGIN`.

## Commits and PRs

- lefthook runs Biome (with fixes), typecheck and the design-system lint before each commit, and commitlint on the
  message. `LEFTHOOK=0 git commit ...` skips it once; CI runs the same checks anyway.
- Conventional Commits with a lowercase subject (`fix(flows): keep folder on save`); body lines at most 100
  characters; no co-author trailers. Add a changeset (`pnpm changeset`) for user-facing changes.
- Design-system lint (`no-raw-controls`) rejects native `<button>`, `<input>` and friends outside
  `src/components/ui`, and any new component named `*Button`, `*Input`, `*Checkbox`, `*Switch`, `*Modal`.
  A new control belongs in `src/components/ui`; a feature component that only adds behaviour gets a name that
  says what it does.
- Comments only explain a non-obvious why.
