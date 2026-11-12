---

name: test-automator
description: Writes and fixes Vitest Browser Mode component tests and Playwright E2E/a11y/visual tests for Glific Console, following the repo's patterns. Use after any UI or data change, when coverage drops, or when tests flake.
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

- Flows in `e2e/flows`, axe per page and theme in `e2e/a11y` (`checkA11y` fixture), screenshots in `e2e/visual`
  tagged `@visual`. Wait for a heading before interacting.
- Never generate visual baselines locally; use `pnpm test:visual:update` (Docker).

## Done

`pnpm check` and `pnpm test:e2e` pass, and coverage for `src/components` stays at or above 80%.
