# DMC — Digital Media Commons Kiosk/Admin App

Next.js (App Router, Turbopack) app for Rice Library's DMC equipment checkout kiosk and admin panel. Postgres via Prisma. Public URL: `https://digitaldmc.library.rice.edu`.

## Running the service

**Always run in production mode (`next start`), never `next dev`, for the live service.**
The public domain is proxied through Apache (`ProxyPass / http://localhost:3000/`, see
`/etc/httpd/conf.d/sslvirtualhosts.conf`), and Apache does not forward WebSocket upgrades.
`next dev`'s HMR client repeatedly fails to connect its `/_next/webpack-hmr` socket through
that proxy, which put the Turbopack dev runtime into a broken state where client components'
`useEffect` fetches silently never fired (e.g. `/admin/forms` looked empty even though the API
and DB were fine). Switching to a production build fixed it outright.

Process is managed by **pm2** (process name `dmc`), registered with systemd (`pm2-hl39.service`,
enabled) so it survives reboots, and `pm2 save` keeps the process list current.

```bash
npm run build
pm2 restart dmc      # after a new build
pm2 logs dmc          # check status/errors
```

To deploy code changes: `npm run build` then `pm2 restart dmc`. There is no CI/CD — this is a
manual build+restart on the box.

Port 3000 is the app; Apache terminates TLS on 443 and reverse-proxies to it.

## Architecture

- `app/admin/*` — staff admin panel (forms CRUD, submissions/check-in). No auth guard currently.
- `app/kiosk/*` — patron-facing self-checkout kiosk flow.
- `app/api/forms`, `app/api/forms/[id]` — CRUD for equipment "forms" (checkout templates).
- `app/api/submissions`, `app/api/submissions/[id]` — checkout/check-in submission records.
- `app/api/upload` — writes uploaded equipment images to `public/uploads/` (uuid filenames),
  returns an `/api/uploads/<filename>` URL (see gotcha below — do NOT change this back to a
  bare `/uploads/...` static path).
- `app/api/uploads/[filename]` — serves files from `public/uploads/` by reading them from disk
  on every request. Exists because of the gotcha below; new uploads must go through this route,
  not direct static `/public` serving.
- `prisma/schema.prisma` — `forms` and `submissions` tables (Postgres via `@prisma/adapter-pg`).
- `lib/prisma.ts` — Prisma client singleton.

### `forms` table
`id, created_at, updated_at, category, title, description, equipment_labels[], equipment_images[]`
— parallel arrays, index `i` in `equipment_labels` corresponds to `equipment_images[i]`.

### Admin forms CRUD (built 2026-07-15)
- List: `app/admin/forms/page.tsx` — client-fetches `/api/forms`, has search-by-title.
- New: `app/admin/forms/new/page.tsx` — uploads images then `POST /api/forms`.
- View: `app/admin/forms/[id]/page.tsx` — read-only detail.
- Edit: `app/admin/forms/[id]/edit/page.tsx` — same UI as New, prefilled; only re-uploads
  equipment images that were newly added (tracked via an optional `file` field on the local
  equipment item — items without `file` keep their existing `/uploads/...` path).
- Delete: wired on the list page's Delete button (`window.confirm` + `DELETE /api/forms/:id`).

**Gotcha:** `next.config.ts` has `cacheComponents: true`. Any client component that reads
dynamic data synchronously at the top (e.g. `useParams()`) must be wrapped in `<Suspense>`
or `next build` fails with "Uncached data was accessed outside of `<Suspense>`". Existing
precedent: `app/kiosk/forms/[id]/page.tsx` and `app/admin/submissions/[id]/check-in/page.tsx`
both export a thin wrapper that renders the real content component inside `<Suspense>`.

**Gotcha:** Next.js snapshots the `/public` directory listing when the server process starts
(independent of `cacheComponents` — confirmed present with it both on and off). A file written
to `public/uploads/` *after* the server started returns 404 through the normal static path until
the next `pm2 restart`/rebuild — a real problem here since staff upload new equipment images
while the app stays up for weeks. Fixed 2026-07-23 by serving uploads through
`app/api/uploads/[filename]/route.ts` (plain dynamic route handler, reads from disk per-request)
instead of relying on `/public` static serving. `POST /api/upload` returns `/api/uploads/...`
paths now. Old `forms.equipment_images` rows with bare `/uploads/...` paths still work because
those files were already known to the static-file snapshot as of the last restart — don't be
surprised if they keep resolving; they're not proof the underlying bug is gone.

## Environment

- `.env` has `DATABASE_URL` only — don't print/cat this file (contains DB credentials).
- No sudo access in this environment; can't edit nginx/httpd/systemd config directly, but the
  Apache vhost configs under `/etc/httpd/conf.d/` are world-readable.
