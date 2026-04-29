# Spec #1 — Schema migration: `is_demo` flag + cleanup function

**Sprint**: 2
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 30 menit
**Dependency**: Migration 0001 sudah ter-apply (lihat `supabase/migrations/0001_init.sql`)

---

## Goal

Tambah penanda `is_demo BOOLEAN` di tabel-tabel content user, plus function PostgreSQL untuk cleanup demo data nanti saat production launch. Persiapkan database supaya 300 fake user (Spec #2) bisa di-seed tanpa kontaminasi data real, dan saat launch tinggal eksekusi 1 perintah untuk membersihkan.

## Konteks

Per kesepakatan Sprint 2: kita akan generate ~300 user fiktif + derived content (~150 thread, ~600 reply, dst) untuk membuat website terlihat hidup saat pitch ke investor. Data real (pejabat, janji, badges, chapters, topics) yang sudah di-seed di `0001_init.sql` + `seed.sql` tetap aman. Saat production launch Juni 2026, demo data harus bisa dibersihkan tanpa risiko menghapus data real.

## File yang dibuat

- `supabase/migrations/0002_demo_mode.sql` — migration baru

## File yang TIDAK boleh diubah

- `supabase/migrations/0001_init.sql` — immutable (sudah ter-apply ke production project)
- `supabase/seed.sql` — biarkan, content lama tetap valid (kolom `is_demo` akan default false)

## Schema diff

Tambah kolom `is_demo BOOLEAN NOT NULL DEFAULT false` di tabel-tabel berikut:

| Table | Alasan |
|---|---|
| `profiles` | 300 fake user perlu ditandai |
| `threads` | Demo thread |
| `thread_replies` | Demo reply |
| `karya` | Demo karya creator |
| `kelas` | (real seed `false`, demo seed `true` kalau ada tambahan) |
| `pejabat` | Real pejabat tetap `false`. Buffer untuk fictional pejabat kalau ada di demo |
| `janji` | Sama seperti pejabat |
| `janji_evidence` | Demo evidence |
| `petisi` | Demo petisi |
| `laporan` | Demo laporan warga |
| `polling` | Demo polling |
| `kampanye` | Demo kampanye |
| `game_scores` | Demo skor game (penting: jangan campur dengan leaderboard real nanti) |

**TIDAK** ditambah `is_demo`:

- `chapters`, `topics`, `badges` — reference data, tidak ada konsep "demo" untuk ini
- `thread_votes`, `petisi_signatures`, `kelas_enrollment`, `janji_pemantau`, `laporan_dukungan`, `laporan_komentar`, `polling_votes`, `user_badges` — join tables, "demo-ness" diturunkan dari parent. Cleanup pakai `ON DELETE CASCADE` yang sudah ada di FK.
- `activity_log` — tidak relevan, cleanup pakai `WHERE user_id IN (SELECT id FROM profiles WHERE is_demo)`.

## Index untuk cleanup performance

```sql
create index if not exists idx_profiles_is_demo on public.profiles(is_demo) where is_demo = true;
create index if not exists idx_threads_is_demo on public.threads(is_demo) where is_demo = true;
create index if not exists idx_petisi_is_demo on public.petisi(is_demo) where is_demo = true;
-- Dan lain-lain untuk tabel yang biasa di-query banyak
```

Partial index `WHERE is_demo = true` lebih kecil & cepat untuk cleanup query, tanpa overhead di query normal yang tidak filter `is_demo`.

## Cleanup function

```sql
create or replace function public.cleanup_demo_data()
returns table (table_name text, deleted_count bigint)
language plpgsql
security definer
as $$
declare
  v_count bigint;
begin
  -- Ordered by FK dependency (children first via cascade, but explicit for safety)

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

  -- Profiles last — auth.users di-handle terpisah via Admin API di script Spec #2
  delete from public.profiles where is_demo;
  get diagnostics v_count = row_count;
  table_name := 'profiles'; deleted_count := v_count; return next;
end;
$$;

-- Restrict execution: hanya admin
revoke execute on function public.cleanup_demo_data() from public, anon, authenticated;
grant execute on function public.cleanup_demo_data() to service_role;
```

Cara invoke saat launch nanti:
```sql
select * from public.cleanup_demo_data();
-- Output: tabel summary jumlah row yang dihapus per tabel.
```

Catatan: function ini hanya bersihkan data di `public.*`. Auth users yang dibuat untuk demo (~300 user di `auth.users`) harus dibersihkan terpisah via Admin API. Lihat Spec #2 untuk script `cleanup-demo-seed.ts`.

## RLS policies

**TIDAK ada perubahan RLS.** Demo data tetap visible di app sekarang (memang tujuannya). Saat production launch, bisa pilih:

- Opsi A: jalankan `cleanup_demo_data()` — demo data hilang permanen.
- Opsi B (kalau mau retain demo data sebagai sandbox): tambah RLS filter `is_demo = false` di semua public read policy. Ini bukan scope sekarang.

## Acceptance checklist

- [ ] File `supabase/migrations/0002_demo_mode.sql` dibuat
- [ ] Migration di-apply ke project `ifrautpvbhdbhieystxk` lewat SQL Editor
- [ ] Verifikasi kolom `is_demo` ada di 13 tabel dengan query:
  ```sql
  select table_name, column_name, data_type, column_default
  from information_schema.columns
  where table_schema = 'public' and column_name = 'is_demo'
  order by table_name;
  ```
  Expected: 13 rows.
- [ ] Verifikasi function `cleanup_demo_data` exists:
  ```sql
  select proname from pg_proc where proname = 'cleanup_demo_data';
  ```
  Expected: 1 row.
- [ ] Verifikasi semua data existing punya `is_demo = false` (default sudah handle, tapi confirm):
  ```sql
  select count(*) from public.pejabat where is_demo = false;  -- expect 14
  select count(*) from public.janji where is_demo = false;    -- expect 14
  ```

## Out of scope (jangan kerjakan di spec ini)

- ❌ Generate demo seed data — itu Spec #2
- ❌ Update RLS policies untuk filter `is_demo` — nanti saat production launch
- ❌ Update queries di `apps/web` atau `packages/data` — tidak perlu, default behavior sama
- ❌ Drop demo data sekarang — function ada untuk dipanggil nanti, jangan eksekusi

## Verification command (Mas / planner audit)

```sql
-- Run di SQL Editor Supabase setelah migration applied
select
  count(*) filter (where column_name = 'is_demo' and table_schema = 'public') as demo_columns,
  (select count(*) from pg_proc where proname = 'cleanup_demo_data') as cleanup_function,
  (select count(*) from public.chapters) as chapters,
  (select count(*) from public.pejabat where is_demo = false) as real_pejabat
from information_schema.columns;
-- Expected: demo_columns=13, cleanup_function=1, chapters=7, real_pejabat=14
```
