-- ─────────────────────────────────────────────────────────
-- Jubir Warga — Migration 0003: Fix handle_new_user trigger
--
-- Bug context:
-- Migration 0001_init.sql:497-518 mendefinisikan trigger handle_new_user yang
-- INSERT ke tabel public.profiles dengan kolom 'badges'. Tetapi tabel profiles
-- TIDAK punya kolom 'badges' (lihat 0001_init.sql skema profiles).
--
-- PostgreSQL `create or replace function` hanya validate syntax saat compile,
-- bukan column existence di body. Bug baru muncul saat trigger fire (saat user
-- pertama signup). Karena belum ada user yang signup ke production, bug ini
-- baru ke-detect saat Spec #2 demo seed siap di-execute.
--
-- Fix: hapus kolom 'badges' dari insert. Badge tracking sudah di-handle oleh
-- tabel public.user_badges (normalized join) yang sudah ada di 0001.
--
-- Discovered: 2026-04-29 saat audit pre-flight Spec #2 oleh planner + Claude Code.
-- ─────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, level, xp, onboarded)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    1,
    0,
    false
  );
  -- Auto-grant 'warga-baru' badge via normalized join table
  insert into public.user_badges (user_id, badge_id) values (new.id, 'warga-baru');
  return new;
end;
$$ language plpgsql security definer;

-- Verification (run separately):
--   select pg_get_functiondef('public.handle_new_user'::regproc);
--   -- Inspect: insert into public.profiles (id, name, level, xp, onboarded) — NO 'badges'
