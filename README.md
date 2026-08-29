# AI Readiness Assessment for Teams

An AI readiness assessment for organizations. Employees answer 10 questions;
admins get an org-wide readiness score, a per-team breakdown, and ranked
upskilling recommendations.

The point of view: **readiness ≠ usage.** High usage with unclear policy is
shadow AI risk. High access with low adoption is wasted spend. The dashboard
is built to surface that gap, not just report a single vanity score.

- **`/`** — create an org, add teams with headcount, get an invite link + a
  private admin dashboard link (no accounts — access is by unguessable slug)
- **`/a/[slug]`** — the respondent flow: pick a team, answer 10 questions one
  per screen (keyboard 1–5 supported), see your strongest/weakest dimension
- **`/dashboard/[slug]`** — the admin view: org score + band, participation
  rate, 5-dimension breakdown, team table, ranked recommendations. Supports
  `?demo=1` for a populated sample org with no setup required.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Postgres) · Vercel

All database access goes through a thin server-side data layer
([lib/db/](lib/db/)), so persistence is swappable. There's no end-user auth —
an org's assessment and dashboard are each reached by a separate unguessable
slug (`slug` for respondents, `admin_slug` for the admin, kept as separate
columns intentionally).

## How scoring works

Five dimensions — `tooling_access`, `usage_depth`, `skill_confidence`,
`policy_clarity`, `workflow_integration` — two questions each, 1–5 Likert
mapped to 0/25/50/75/100.

- Dimension score = mean of its 2 questions
- Respondent overall = mean of the 5 dimensions
- Team score = mean of respondents (hidden until a team has **3+ responses**,
  to keep individual answers anonymous)
- Org score = headcount-weighted mean of team scores

Bands: 0–39 Nascent · 40–59 Emerging · 60–79 Operational · 80–100 Advanced.

The recommendation engine ([lib/recommendations.ts](lib/recommendations.ts))
runs 5 deterministic rules against each team's dimension scores (e.g. high
`usage_depth` + low `policy_clarity` → "Shadow AI risk"), then dedupes matches
across teams into org-level recommendations that name every affected team.

Both engines are pure functions with unit tests — see
[lib/scoring.test.ts](lib/scoring.test.ts) and
[lib/recommendations.test.ts](lib/recommendations.test.ts).

## Local development

```bash
npm install
```

You need a Supabase project — either a local one (via the Supabase CLI +
Docker) or a free cloud project.

**Local (via Docker):**
```bash
npx supabase start        # applies supabase/migrations/0001_init.sql automatically
```
Copy the `API_URL` and `SERVICE_ROLE_KEY` (or `SECRET_KEY`, depending on CLI
version) it prints into `.env.local` (see `.env.example`):
```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=<service_role / secret key>
```

**Cloud project:** create one at [supabase.com](https://supabase.com), run
the contents of `supabase/migrations/0001_init.sql` in the project's SQL
Editor, then set `.env.local` from Project Settings → API:
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<secret key — not the publishable key>
```
Use the **secret** key, not the publishable/anon key — the app has no
client-side Supabase access (no `NEXT_PUBLIC_*` vars needed at all), and RLS
is enabled with grants only for `service_role`/secret, so the publishable key
can't read anything even if you wired it up.

Then:
```bash
npm run dev      # http://localhost:3000
npm test         # vitest — scoring + recommendation engine tests
npm run lint
npm run build    # production build
```

> Don't run `next build` and `next dev` against the same `.next/` directory
> at the same time — they clobber each other's cache and produce confusing
> Tailwind/webpack errors. Stop one before starting the other.

## Deploying to Vercel

1. Push to GitHub (already set up if you're reading this from the repo).
2. Create/confirm your Supabase project and that
   `supabase/migrations/0001_init.sql` has been applied to it (SQL Editor, or
   `supabase link --project-ref <ref>` + `supabase db push`).
3. Import the repo in Vercel — Next.js 14 App Router is auto-detected, no
   custom build command needed.
4. Set two environment variables in Vercel (Project Settings → Environment
   Variables): `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (the secret
   key). No `NEXT_PUBLIC_*` variables are needed.
5. Deploy. Invite links are built from the incoming request's `Host` header
   ([lib/site-url.ts](lib/site-url.ts)), so they work automatically on
   whatever domain Vercel assigns — nothing to hardcode.

## Project structure

```
app/
  page.tsx                    landing + create-assessment form
  a/[slug]/                   respondent flow
  dashboard/[slug]/           admin dashboard (+ ?demo=1)
components/
  assessment/                 respondent-flow UI
  dashboard/                  dashboard UI
  ui/                         shared primitives (Button, Badge, ScoreMeter, ...)
lib/
  scoring.ts                  pure scoring functions (tested)
  recommendations.ts          rule engine (tested)
  dashboard-data.ts           view-model builder used by the dashboard (tested)
  demo.ts                     in-memory sample dataset for ?demo=1
  db/                         thin Supabase data layer (server-only)
supabase/migrations/          schema
```
