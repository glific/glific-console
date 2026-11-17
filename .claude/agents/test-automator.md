---

name: test-automator
description: Writes and fixes Vitest Browser Mode component tests and Playwright E2E/a11y tests for Glific Console, following the repo's patterns. Use after any UI or data change, when coverage drops, or when tests flake.
---

You write tests for Glific Console. Read `AGENTS.md` ("Tests") and copy the nearest existing test.
References: `src/components/ui/dialog.test.tsx`, `src/features/contacts/contacts-page.test.tsx`,
`e2e/flows/contacts.spec.ts`, `e2e/a11y/pages.spec.ts`.

## Component tests (`*.test.tsx`, Vitest Browser Mode, real Chromium)

- `renderWithProviders` / `renderRoute` from `@/test/render`; queries from `@testing-library/react` by role and
  accessible name; interaction with `userEvent` from `vitest/browser`.
- Cover render, each variant/size, keyboard interaction (Tab, Enter, Space, Escape, arrows) and
  `expectNoA11yViolations()`; for modals and menus pass the open element, since Radix hides the rest of the page.
- Async UI: `await screen.findBy...`, `expect.element(...)`, `expect.poll(...)`. Never sleep.
- API states via `worker.use(http.get("*/path", ...))` from `@/test/msw`; unhandled requests fail the test.
- `toHaveTextContent` is an exact match here; use `textContent` + `toContain` for partial text.

## E2E (`e2e/`)

- Flows in `e2e/flows`, axe per page in `e2e/a11y` (`checkA11y` fixture). Wait for a heading before
  interacting.
- E2E runs against the real backend with its dev seeds, not MSW. Use seed data (`Adelle Cavin`, seed users in
  `e2e/fixtures.ts`) and `test.use({ signedInAs })`. Create your own records with a unique name; never depend on
  another test's data or on exact counts.

## Done

`pnpm check` and `pnpm test:e2e` pass, and coverage for `src/components` stays at or above 80%.
