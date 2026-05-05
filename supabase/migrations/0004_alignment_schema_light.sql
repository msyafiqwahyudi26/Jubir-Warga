-- ─────────────────────────────────────────────────────────
-- Migration 0004 — Alignment schema LIGHT + Editorial moderation
-- Sprint 4 Spec #34 (REDUCED-SCOPE 2026-05-05)
-- ─────────────────────────────────────────────────────────
-- Adds:
--   1. janji.alignment_status + reasoning + source_doc fields (RPJMN/RPJMD anchor)
--   2. janji.editorial_status + reviewer audit trail
--   3. editorial_review log table (immutable audit)
--
-- Idempotent: uses `if not exists` for columns + `do $$ … if not exists … $$`
-- guards for policies/tables. profiles.is_admin already exists from 0001.
--
-- NO pgvector. NO embedding. NO LLM column. Sprint 5+ defer.
-- ─────────────────────────────────────────────────────────

-- ── Janji extension: alignment + editorial fields ─────────
alter table public.janji
  add column if not exists alignment_status text
    check (alignment_status in ('aligned', 'partial', 'drift', 'contradict'));

alter table public.janji
  add column if not exists alignment_reasoning text;

alter table public.janji
  add column if not exists source_doc_url text;

alter table public.janji
  add column if not exists source_doc_page int;

alter table public.janji
  add column if not exists editorial_status text default 'pending'
    check (editorial_status in ('pending', 'verified_curator', 'curated_ai'));

alter table public.janji
  add column if not exists editorial_reviewer_id uuid references public.profiles(id);

alter table public.janji
  add column if not exists editorial_reviewed_at timestamptz;

create index if not exists idx_janji_editorial_status
  on public.janji(editorial_status);

create index if not exists idx_janji_alignment_status
  on public.janji(alignment_status);

-- ── Editorial review log (audit trail) ────────────────────
create table if not exists public.editorial_review (
  id           uuid primary key default gen_random_uuid(),
  reviewer_id  uuid references public.profiles(id) on delete set null,
  target_type  text not null check (target_type in ('janji', 'verdict')),
  target_id    uuid not null,
  action       text not null check (action in ('approve', 'modify', 'reject', 'flag')),
  notes        text,
  reviewed_at  timestamptz default now()
);

create index if not exists idx_editorial_review_target
  on public.editorial_review(target_type, target_id);

create index if not exists idx_editorial_review_reviewer
  on public.editorial_review(reviewer_id, reviewed_at desc);

-- ── RLS: editorial_review admin-only write/read ───────────
alter table public.editorial_review enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'editorial_review'
      and policyname = 'admins_write_review_log'
  ) then
    create policy "admins_write_review_log" on public.editorial_review
      for insert with check (
        exists (
          select 1 from public.profiles
          where id = auth.uid() and is_admin = true
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'editorial_review'
      and policyname = 'admins_read_review_log'
  ) then
    create policy "admins_read_review_log" on public.editorial_review
      for select using (
        exists (
          select 1 from public.profiles
          where id = auth.uid() and is_admin = true
        )
      );
  end if;
end $$;

-- ── Note: janji UPDATE policy "Admin can verify janji" sudah ada di 0001
-- (covers admin moderate). Tidak perlu duplicate.
-- ── Note: profiles.is_admin sudah ada di 0001 (line 40). Skip.

comment on column public.janji.alignment_status is
  'Alignment vs RPJMN/RPJMD/Visi Misi: aligned/partial/drift/contradict. Manual seed Sprint 4, automated Sprint 5+.';

comment on column public.janji.editorial_status is
  'Editorial moderation: pending (default), verified_curator (manual review), curated_ai (auto).';

comment on table public.editorial_review is
  'Immutable audit trail untuk editorial moderation actions. Spec #34 Sprint 4.';

-- Verify (run manually after apply):
-- select column_name from information_schema.columns
--   where table_schema='public' and table_name='janji'
--     and column_name like 'alignment%' or column_name like 'editorial%' or column_name like 'source_doc%';
-- Expected: 7 columns added.
