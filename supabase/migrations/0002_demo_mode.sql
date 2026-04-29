-- ─────────────────────────────────────────────────────────
-- Jubir Warga — Migration 0002: Demo mode
-- Adds `is_demo` flag to user-content tables + cleanup function.
-- Run via Supabase SQL Editor (project ref: ifrautpvbhdbhieystxk).
--
-- Depends on: 0001_init.sql (must be applied first)
-- ─────────────────────────────────────────────────────────

-- ── 1. Add is_demo flag to user-content tables ────────────
-- Reference data (chapters, topics, badges) and join tables
-- (thread_votes, petisi_signatures, kelas_enrollment, janji_pemantau,
-- laporan_dukungan, laporan_komentar, polling_votes, user_badges)
-- intentionally do NOT receive `is_demo` — see spec section "TIDAK ditambah".

alter table public.profiles       add column is_demo boolean not null default false;
alter table public.threads        add column is_demo boolean not null default false;
alter table public.thread_replies add column is_demo boolean not null default false;
alter table public.karya          add column is_demo boolean not null default false;
alter table public.kelas          add column is_demo boolean not null default false;
alter table public.pejabat        add column is_demo boolean not null default false;
alter table public.janji          add column is_demo boolean not null default false;
alter table public.janji_evidence add column is_demo boolean not null default false;
alter table public.petisi         add column is_demo boolean not null default false;
alter table public.laporan        add column is_demo boolean not null default false;
alter table public.polling        add column is_demo boolean not null default false;
alter table public.kampanye       add column is_demo boolean not null default false;
alter table public.game_scores    add column is_demo boolean not null default false;

-- ── 2. Partial indexes for cleanup performance ────────────
-- WHERE is_demo = true → small index, zero overhead on normal queries
-- (which never filter on is_demo). Speeds up cleanup_demo_data() scan.

create index if not exists idx_profiles_is_demo       on public.profiles(is_demo)       where is_demo = true;
create index if not exists idx_threads_is_demo        on public.threads(is_demo)        where is_demo = true;
create index if not exists idx_thread_replies_is_demo on public.thread_replies(is_demo) where is_demo = true;
create index if not exists idx_karya_is_demo          on public.karya(is_demo)          where is_demo = true;
create index if not exists idx_kelas_is_demo          on public.kelas(is_demo)          where is_demo = true;
create index if not exists idx_pejabat_is_demo        on public.pejabat(is_demo)        where is_demo = true;
create index if not exists idx_janji_is_demo          on public.janji(is_demo)          where is_demo = true;
create index if not exists idx_janji_evidence_is_demo on public.janji_evidence(is_demo) where is_demo = true;
create index if not exists idx_petisi_is_demo         on public.petisi(is_demo)         where is_demo = true;
create index if not exists idx_laporan_is_demo        on public.laporan(is_demo)        where is_demo = true;
create index if not exists idx_polling_is_demo        on public.polling(is_demo)        where is_demo = true;
create index if not exists idx_kampanye_is_demo       on public.kampanye(is_demo)       where is_demo = true;
create index if not exists idx_game_scores_is_demo    on public.game_scores(is_demo)    where is_demo = true;

-- ── 3. Cleanup function ───────────────────────────────────
-- Deletes all rows flagged is_demo=true across content tables.
-- Order: children before parents — explicit deletion is safer than relying
-- on cascade and gives accurate per-table counts.
--
-- This function only cleans `public.*`. Demo auth users (~300 in
-- `auth.users`) must be removed separately via Supabase Admin API in
-- `cleanup-demo-seed.ts` (Spec #2).
--
-- Returns: summary table (table_name, deleted_count) — one row per table.
-- Invoke at production launch (June 2026):
--   select * from public.cleanup_demo_data();

create or replace function public.cleanup_demo_data()
returns table (table_name text, deleted_count bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count bigint;
begin
  -- Activity log: profiles FK is ON DELETE SET NULL, so cascade won't auto-clean.
  -- Must delete by user_id explicitly before profiles.
  delete from public.activity_log where user_id in (select id from public.profiles where is_demo);
  get diagnostics v_count = row_count;
  table_name := 'activity_log'; deleted_count := v_count; return next;

  delete from public.game_scores where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'game_scores'; deleted_count := v_count; return next;

  delete from public.kampanye where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'kampanye'; deleted_count := v_count; return next;

  delete from public.polling where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'polling'; deleted_count := v_count; return next;

  delete from public.laporan where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'laporan'; deleted_count := v_count; return next;

  delete from public.petisi where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'petisi'; deleted_count := v_count; return next;

  delete from public.janji_evidence where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'janji_evidence'; deleted_count := v_count; return next;

  delete from public.janji where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'janji'; deleted_count := v_count; return next;

  delete from public.pejabat where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'pejabat'; deleted_count := v_count; return next;

  delete from public.kelas where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'kelas'; deleted_count := v_count; return next;

  delete from public.karya where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'karya'; deleted_count := v_count; return next;

  delete from public.thread_replies where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'thread_replies'; deleted_count := v_count; return next;

  delete from public.threads where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'threads'; deleted_count := v_count; return next;

  -- Profiles last. auth.users handled separately via Admin API (Spec #2).
  delete from public.profiles where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'profiles'; deleted_count := v_count; return next;
end;
$$;

-- Restrict execution: service_role only. Anon/authenticated must NEVER call this.
revoke execute on function public.cleanup_demo_data() from public;
revoke execute on function public.cleanup_demo_data() from anon;
revoke execute on function public.cleanup_demo_data() from authenticated;
grant  execute on function public.cleanup_demo_data() to service_role;

comment on function public.cleanup_demo_data() is
  'Removes all is_demo=true rows from content tables. Run at production launch. Service-role only.';

-- ── Done ──────────────────────────────────────────────────
-- Verify after apply:
--   select table_name from information_schema.columns
--   where table_schema = 'public' and column_name = 'is_demo' order by table_name;
--   -- Expected: 13 rows
--
--   select proname from pg_proc where proname = 'cleanup_demo_data';
--   -- Expected: 1 row
