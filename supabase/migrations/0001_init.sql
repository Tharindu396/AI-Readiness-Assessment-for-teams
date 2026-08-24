-- AI Readiness Assessment: initial schema.
-- No auth — organizations and their admin dashboards are reached by unguessable slugs,
-- so both slug columns must stay high-entropy and unique.

create extension if not exists pgcrypto;

create table organizations (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  admin_slug  text not null unique,
  created_at  timestamptz not null default now()
);

create table teams (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations (id) on delete cascade,
  name       text not null,
  headcount  integer not null check (headcount >= 0)
);

create index teams_org_id_idx on teams (org_id);

create table responses (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations (id) on delete cascade,
  team_id    uuid not null references teams (id) on delete cascade,
  -- raw 1-5 answers, keyed by question id — see lib/questions.ts
  answers    jsonb not null,
  -- computed 0-100 score per dimension at submit time — see lib/scoring.ts
  scores     jsonb not null,
  created_at timestamptz not null default now()
);

create index responses_org_id_idx on responses (org_id);
create index responses_team_id_idx on responses (team_id);

-- Row Level Security: this app has no end-user auth, so all reads/writes route through
-- the server-side data layer (lib/db) using the service role key, which bypasses RLS.
-- RLS is enabled anyway as a floor against the anon key ever being exposed client-side.
alter table organizations enable row level security;
alter table teams enable row level security;
alter table responses enable row level security;

-- BYPASSRLS on service_role skips policy checks, but Postgres still requires the base
-- table grants — without these, every request 42501s with "permission denied for table".
grant usage on schema public to service_role;
grant all on organizations, teams, responses to service_role;
