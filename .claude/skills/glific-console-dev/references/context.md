# Context

## What glific-console is

The Glific 2.0 frontend: a rebuild of glific-frontend (React + MUI + Apollo) on Vite, React 19, shadcn/ui,
Tailwind v4, TanStack Query and i18next, talking to the same Glific backend (GraphQL plus REST for auth).

The design is the 2.0 prototype:

- Live: https://glific.vercel.app/
- Source: https://github.com/karan26796/glific-redesign (the product shell is `src/app/GlificApp.jsx`; screens
  are in `src/app/screens/`; design notes and the decision log are in `03-notes/`)

The prototype is a visual and behavioural spec. Its data is fake, and some of it has no backend yet.

## Rollout

1. The console is served at `console.<shortcode>.glific.com`, beside the current app at `<shortcode>.glific.com`.
   Both talk to `api.<shortcode>.glific.com` (`backendOrigin()` in `src/lib/backend.ts`).
2. Organisations get 30 days to get used to it.
3. Then the console address is retired and the new app moves to `<shortcode>.glific.com`.

During the overlap, any page not rebuilt yet opens in the current app: `currentAppUrl()` is the same address
without `console.`. Those links appear only in the left rail, the account menu and the right panel and strip, never
inside pages. The current app's old sign-in addresses (`/registration`, `/resetpassword-phone`, …) redirect to the
new sign-in pages in `router.tsx`.

## Strategy

Reskinning every page means testing and fixing every page, so we only rebuild pages that gain new functionality.
Flows and the Glific AI work come first. Pages like Templates or Interactive messages keep opening in the current
app until there is a reason to move them.

## The epic: glific/glific#6078

| Ticket       | Area                                                     | State of play                                                                     |
| ------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| #6199        | App foundations: roles, forms, translations, analytics   | Done in glific/glific-console#17                                                  |
| #6200        | App shell: rail, account menu, right panel, IA           | glific/glific-console#18                                                          |
| #6201        | Log in, reset password, My account                       | Log in and reset in glific/glific-console#19; My account opens in the current app |
| #6202        | Home                                                     | First version in glific/glific-console#19                                         |
| #6235        | Backend data for Home                                    | Waiting on PM definitions                                                         |
| #6203        | Contacts                                                 | List page exists; other pages open in the current app                             |
| #6204        | Chats                                                    | Not started                                                                       |
| #6173        | Flow list and folders                                    | Not started                                                                       |
| #6205, #6206 | Library; templates, interactive messages, WhatsApp forms | Not started                                                                       |
| #6207        | WhatsApp groups                                          | Not started                                                                       |
| #6208        | Monitor pages                                            | Not started                                                                       |
| #6209        | Settings                                                 | Not started                                                                       |
| #6210        | Staff, Glific team admin, registration                   | Staff sign-up done in #19                                                         |
| #6211        | AI pages                                                 | Not started                                                                       |
| #6212        | Check every page and roll out internally                 | Last                                                                              |

Bigger 2.0 work lives in its own epics: #6174 (flow editor), #6175 (Monitor), #6176 (data analytics), #6177
(Schedule), #6178 (test a flow with Glific AI).

The epic body has the route parity checklist: every route in the current app, grouped by ticket. Tick a route when
the console covers it.

## Ownership

|        | Dev 1                  | Dev 2                                          |
| ------ | ---------------------- | ---------------------------------------------- |
| Now    | Flows (#6173)          | Chats (#6204)                                  |
| Paired | Library (#6205, #6206) | Contacts (#6203)                               |
| Later  | AI pages (#6211)       | Settings, Staff, Monitor (#6209, #6210, #6208) |

AI features are built inside the section they belong to, not as a separate stream. The Glific AI panel and its
hooks (`src/features/glific-ai`) are shared: change them in a small PR the other dev reviews.

## Decisions already made

- Log in is phone + password (the backend has no email log in). Staff sign-up uses a WhatsApp code and invisible
  reCAPTCHA (`VITE_RECAPTCHA_SITE_KEY`); the trial (`/trial`) uses an emailed code.
- Section menus are tabs or a column inside the page (`PageSections`), not flyouts on the rail, as in the prototype.
- The account alert bar from the prototype is not built: it needs backend changes.
- Home stats use what the backend has today (new contacts, messages; received, sent and spend for admins only,
  because `dailyAppUsage` is admin-only). The prototype's metrics wait for #6235.
- Bundle budgets: 200 kB first load, 60 kB per lazy page. There is no total budget.
- Forms validate with Zod mini (`zod/mini`), not full Zod, to keep pages small.
