# Sol Vibrations — Website & Student Portal

Production website and CMS for **Sol Vibrations**, a 501(c)(3) nonprofit in Tulsa, OK providing free guitar and ukulele lessons to children in underserved communities and bringing healing music to nursing homes and veterans hospitals.

> *Our sound is light, our light is sound.*

## Stack

- **Next.js 15** (App Router, TypeScript strict) + **Payload CMS 3** in one app
- **PostgreSQL** via `@payloadcms/db-postgres` (Neon in production)
- **Tailwind CSS 4** with brand tokens as CSS variables
- **S3-compatible storage** (`@payloadcms/storage-s3`) for all media uploads
- Deploys to **Vercel** (fully serverless-compatible)

## Local setup

### 1. Prerequisites

- Node 20+ and pnpm 9/10
- PostgreSQL — either locally installed, or via Docker:

```sh
docker compose up -d   # starts Postgres 17 with user/pass/db: sol / sol / sol_vibrations
```

### 2. Environment

```sh
cp .env.example .env
```

Fill in:

| Variable | Notes |
| --- | --- |
| `DATABASE_URI` | e.g. `postgres://sol:sol@127.0.0.1:5432/sol_vibrations` (Docker) or your local PG |
| `PAYLOAD_SECRET` | any long random string (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
| `S3_*` | leave blank locally — uploads fall back to `./media`. **Required in production.** |
| `EMAIL_FROM` | sender address once an email provider is wired up |

### 3. Install, run, seed

```sh
pnpm install
pnpm dev            # first run pushes the DB schema (dev mode)
pnpm seed           # in a second terminal, once dev server has started
```

The seed creates programs, events, posts, team members, site settings, and two logins:

- Admin: `admin@solvibrations.net` / `changeme123`
- Mentor: `mentor@solvibrations.net` / `changeme123`

**Change these immediately in any real environment.**

- Site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## Useful scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | dev server (auto-pushes schema changes to the DB) |
| `pnpm build` / `pnpm start` | production build / serve |
| `pnpm seed` | seed sample content (skips if users already exist) |
| `pnpm generate:types` | regenerate `src/payload-types.ts` after changing collections |
| `pnpm generate:importmap` | regenerate the admin import map after adding admin components |
| `pnpm payload migrate:create` | create a DB migration (use for production schema changes) |

## Deploying to Vercel

### 1. Neon (database)

1. Create a project at [neon.tech](https://neon.tech) (free tier is fine to start).
2. Copy the pooled connection string (`...-pooler.neon.tech`) — serverless needs the pooler.
3. Set it as `DATABASE_URI` in Vercel.

### 2. Vercel Blob (media storage)

1. In the Vercel project: **Storage → Create Database → Blob**, attach it to the project.
   Vercel injects `BLOB_READ_WRITE_TOKEN` automatically and the app switches to Blob storage.
2. If media was previously uploaded while running on local storage, push those files into the store once:
   ```sh
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... node scripts/upload-media-to-blob.mjs
   ```

(An S3-compatible bucket also works — set the `S3_*` vars instead; the Blob token takes precedence when both exist.)

### 3. Vercel project

1. Import the repo, framework preset **Next.js**.
2. Set env vars: `DATABASE_URI` (Neon pooled URI), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` (the production URL), `EMAIL_FROM`, and optionally `RESEND_API_KEY`.
   The build **fails at "Generating static pages"** with `missing secret key` / DB errors if these are absent — pages prerender against the real database at build time.
3. Deploy.

### 4. Production schema

Dev mode pushes schema automatically; production does not. For the first deploy and any collection change afterward:

```sh
pnpm payload migrate:create                                    # commit the generated migration
NODE_ENV=production DATABASE_URI=<neon-uri> pnpm payload migrate   # run against production
```

Then seed production (or create your first admin at `/admin` on first visit):

```sh
NODE_ENV=production DATABASE_URI=<neon-uri> pnpm seed
```

**`NODE_ENV=production` matters**: without it, `payload run`/CLI commands start in dev mode and try to push schema changes directly to the database, which conflicts with the migrated schema.

## Content model (Phase 1)

| Collection | Purpose |
| --- | --- |
| Pages | flexible block-based pages (hero, richText, imageText, CTA banner, stats, FAQ) |
| Programs | Guitar / Ukulele / Healing Music Outreach cards + enroll CTAs |
| Events | upcoming & past, `isPublic` flag |
| Posts | news/blog with drafts |
| Gallery Items | photos; **cannot publish without `photoReleaseConfirmed`**; captions must never contain student full names |
| Team Members | about-page grid |
| Enrollments | created by the public `/enroll` form; triage via `status` |
| Contact Submissions | created by the public `/contact` form |
| Media | uploads (S3), required alt text |
| Users | auth; roles: admin / mentor / student / parent (student & parent used in Phase 2) |

Globals: **Site Settings** (nav, contact info, 501(c)(3) blurb, EIN, socials) and **Donate Page** (external giving links — no payment processing on this site).

### Access model

- Public: read published content; create Enrollments & ContactSubmissions only (honeypot + rate-limited).
- Mentor: write Posts/Events/GalleryItems, read Enrollments; no user management.
- Admin: everything.

## Email

All transactional mail goes through `src/utilities/sendEmail.ts`, currently a console/log stub.
`TODO: wire provider (Resend or SES)` — swap the implementation in that one file when a provider is chosen.

## Phase 2 (not yet built)

Auth-gated student portal (`/portal`): assigned lesson videos, training materials, student practice uploads with mentor feedback, parent read-only visibility, and the enrollment → account-creation workflow. See the project brief before starting; Phase 1 intentionally scaffolds only the `role` field on Users.
