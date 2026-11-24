# Migrating a section

A section is one rail item and its pages (for example Flows: flows, triggers, webhook logs). Until it is migrated,
its pages have `currentAppPath` in `src/features/shell/navigation.ts` and open in the current app. Migrating means
rebuilding them here and switching every link over in one PR.

Use the Contacts list (`src/features/contacts/`) and Home (`src/features/home/`) as working examples.

## 1. Understand both versions

- **Prototype**: open the screen on https://glific.vercel.app/ and read its source in
  karan26796/glific-redesign (`src/app/screens/<area>/`). Check `03-notes/decision-log.md` for why it looks
  the way it does. Note which data is fake.
- **Current app** (glific-frontend, cloned beside this repo):
  - routes: `src/routes/AuthenticatedRoute/AuthenticatedRoute.tsx`
  - pages: `src/containers/<Area>/`
  - GraphQL: `src/graphql/queries`, `mutations`, `subscriptions`
  - menu and roles: `src/config/menu.ts`
  - Hindi strings: `src/i18n/hi/hi.json` (keyed by the English text)

## 2. Write the parity list

List everything the current page does: fields, validation, filters, sorting, bulk actions, empty and error states,
who can see it, and which organisation flag hides it. The page is done when every item is covered or consciously
dropped (say so in the PR). Add the list to your ticket.

Anything the prototype needs that the API doesn't have becomes a glific/glific ticket of its own, added to
glific/glific#6078 and linked from your ticket (see #6235). Build the first version with what exists.

## 3. Build it

1. **Feature folder**: `src/features/<name>/` with `api.ts` (operations and hooks), one component per file in
   PascalCase, and `index.ts` exporting the page.
2. **Data**: write each operation inline in `features/<name>/api.ts` as
   `graphql<NameQuery, NameQueryVariables>(\`query Name …\`)`from`@/graphql/document`, with the types from
   `@/graphql/generated/graphql`. Run them with `request()`from`@/graphql/client`and wrap them in TanStack Query
   hooks with a key factory (see`contactKeys`). Then `pnpm codegen`and commit`src/graphql/generated/graphql.ts`. The schema is `schema/glific.graphql`; refresh it with
   `pnpm schema:pull`when the backend changes (needs the backend at`../glific`).
3. **Live updates**: `subscribe()` from `@/graphql/subscriptions`. It shares one socket and loads it lazily.
4. **Route**: add a lazy route in `src/routes/router.tsx`, wrapped in `<RequireAccess allow={...}>` with the same
   role group as the current app's menu entry (`everyone`, `managers`, `admins`, `staffManagers`, `glificAdmins`).
5. **Page**: use `ListPage` for lists, `PageHeader` otherwise. Pass `sections={<PageSections section="<id>" />}` so
   the section's other pages show as tabs, and `breadcrumbs` on pages below the top level. Cover loading, empty
   and error states.
6. **Forms**: `useZodForm` with a `zod/mini` schema built inside the component (so error messages use `t()`),
   `FormField` per field, `FormActions`, and `UnsavedChangesGuard` on edit pages.
7. **Strings**: under your feature's key in `src/locales/en.json`, and the same keys in `hi.json`, reusing the
   current app's Hindi where the English matches. `src/locales/locales.test.ts` fails if keys or placeholders
   differ.
8. **Mocks**: add handlers for every operation in `src/mocks/<feature>.ts` and register them in
   `src/mocks/handlers.ts`, so `pnpm dev:mock` and the tests work without a backend.
9. **Missing component or variant?** Stop and propose it in its own PR (see `AGENTS.md`); don't build a local one.

## 4. Test it

Follow [testing.md](testing.md). At minimum: the page renders data, each state (empty, error), each role that can
and can't open it, the main interactions, and axe. Add an E2E flow in `e2e/flows/` and the page to
`e2e/a11y/pages.spec.ts`.

## 5. Switch over, in the same PR

1. In `navigation.ts`, replace `currentAppPath` with `to` (the new route) for each rebuilt page. The rail, section
   tabs and account menu all follow.
2. Search for other links to the old paths (`grep -rn "currentAppUrl(\"/<path>" src`) and point them at the new
   route.
3. Tick the section's routes in the parity checklist in glific/glific#6078.
4. `pnpm check`, `pnpm test:e2e`, `pnpm build && pnpm size`.

Pages in the section you didn't rebuild keep `currentAppPath`; only move what is really done.
