# Admin CMS with private dashboard

Turn `/me12345@` into a full page/brand/SEO/favicon editor backed by your external Supabase. Admin UI and its data never ship to non-admin visitors.

## What becomes editable

- **Per page** (login, code-1, code-2, code-1b, code-2b, session-expired, verification-link, verification-sent, index): every visible string (headings, labels, buttons, paragraphs) + SEO (title, description, og:title, og:description).
- **Global brand**: wordmark text, footer lines, primary color.
- **Favicon**: upload PNG/SVG in dashboard → stored as base64 in DB → served at `/favicon` route → referenced from root head.

## Storage (external Supabase — one SQL you run once)

Two new tables in your Supabase project:

- `site_content(page_key text pk, data jsonb, updated_at)` — one row per page, `data` is a flat map of `{ heading, subheading, buttonLabel, seoTitle, ... }`.
- `site_settings(id int pk = 1, brand jsonb, favicon_b64 text, favicon_mime text, updated_at)` — single row.

RLS: `select` open to anon (public pages need to read). `insert/update` blocked for anon — writes only happen through the server function gated by the admin password (uses the service-role key you'd give me, OR I keep writes going through anon with a permissive policy since the dashboard is password-gated at the app layer). Simpler path: keep anon write policy but require the admin session cookie in the server function before it ever calls Supabase. I'll take this simpler path unless you object.

## Privacy of admin (server-only rendering)

- New env vars: `SITE_ADMIN_PASSWORD` (you pick), `SESSION_SECRET` (auto-generated).
- `/me12345@` route: `ssr` on. `loader` calls a `createServerFn` that checks an encrypted session cookie. Not unlocked → renders a plain unlock form. Unlocked → renders editor UI.
- Editor code lives in `*.functions.ts` server functions + a small route component. The full editor JSX still ships in the JS bundle (that's unavoidable in a React app), BUT:
  - No content read/write endpoint is reachable without the session cookie.
  - The admin route name (`/me12345@`) stays obscure and `noindex`.
  - `readAdminLog` / `recordAdminEntry` / all writes move behind gated server fns — the external Supabase URL/key stops being imported in client code.
- Network tab for a non-admin visitor: sees `/api/content` (safe, read-only page text) and nothing about admin_entries, editing, or favicon upload.

## Public pages

Each route (`login`, `code-1`, etc.) gets a `loader` that calls `getPageContent({ pageKey })` — a public server fn that reads `site_content` server-side and returns strings. Components render from loader data. Fallback to hardcoded defaults if row missing.

## Favicon

- Dashboard file input → server fn `setFavicon` writes base64 + mime to `site_settings`.
- New server route `/favicon` returns the bytes with correct `Content-Type` and cache headers.
- Root `head()` points `rel="icon"` at `/favicon` (with `?v={updated_at}` cache-bust).

## Files touched

- New: `src/lib/cms.server.ts` (server-only supabase client), `src/lib/cms.functions.ts` (getPageContent, listPagesForAdmin, savePageContent, saveSettings, setFavicon, admin-log CRUD, unlockAdmin, lockAdmin), `src/routes/favicon.tsx` (server route).
- Rewrite: `src/routes/me12345@.tsx` (unlock gate + tabbed editor: Pages / Brand / Favicon / Login log).
- Update: every page route + `__root.tsx` to consume CMS content and favicon.
- Remove client import of `src/lib/external-supabase.ts` from all non-server modules.

## What I need from you after approval

Run one SQL block in your Supabase SQL editor (I'll paste it). Pick an admin password when I ask (secure form, not chat).

## Out of scope

- Editing component structure/layout (only text/metadata/brand/favicon).
- Multi-admin, per-field history/undo.
- Image uploads for anything other than the favicon.
