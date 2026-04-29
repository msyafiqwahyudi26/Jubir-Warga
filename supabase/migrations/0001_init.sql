-- ─────────────────────────────────────────────────────────
-- Jubir Warga — Initial Schema Migration (0001)
-- Run via Supabase SQL Editor atau supabase db push
-- ─────────────────────────────────────────────────────────

-- ── Enable extensions ──────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";  -- untuk full-text search nanti

-- ── Reference data: chapters ──────────────────────────────
create table public.chapters (
  id            text primary key,
  name          text not null,
  city          text,
  province      text,
  members_count int default 0,
  active        boolean default true,
  created_at    timestamptz default now()
);

insert into public.chapters (id, name, city, province, active) values
  ('jakarta',  'Jakarta',      'Jakarta',  'DKI Jakarta',  true),
  ('bandung',  'Bandung Raya', 'Bandung',  'Jawa Barat',   true),
  ('malang',   'Malang Raya',  'Malang',   'Jawa Timur',   true),
  ('surabaya', 'Surabaya',     'Surabaya', 'Jawa Timur',   false),
  ('jogja',    'Yogyakarta',   'Yogyakarta','DI Yogyakarta',false),
  ('medan',    'Medan',        'Medan',    'Sumatera Utara',false),
  ('makassar', 'Makassar',     'Makassar', 'Sulawesi Selatan',false);

-- ── User profiles (extends auth.users) ────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  name          text,
  bio           text,
  chapter_id    text references public.chapters(id),
  avatar_url    text,
  level         int default 1,
  xp            int default 0,
  is_admin      boolean default false,
  is_anonim     boolean default false,
  onboarded     boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_profiles_chapter on public.profiles(chapter_id);
create index idx_profiles_username_trgm on public.profiles using gin(username gin_trgm_ops);

-- ── Topics (taxonomy) ─────────────────────────────────────
create table public.topics (
  id    text primary key,
  label text not null
);
insert into public.topics (id, label) values
  ('politik','Politik & Demokrasi'),
  ('lingkungan','Lingkungan & Iklim'),
  ('gender','Gender & Kesetaraan'),
  ('mental','Mental Health'),
  ('kerja','Ekonomi & Kerja'),
  ('pendidikan','Pendidikan'),
  ('budaya','Budaya Pop & Media'),
  ('transport','Transportasi & Kota'),
  ('lokal','Isu Lokal');

-- ── Forum threads ─────────────────────────────────────────
create table public.threads (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references public.profiles(id) on delete set null,
  title       text not null,
  body        text,
  preview     text generated always as (substring(coalesce(body, '') from 1 for 200)) stored,
  topic_id    text references public.topics(id),
  chapter_id  text references public.chapters(id),
  format      text check (format in ('diskusi','tanya','pengalaman','polling','live')),
  upvotes     int default 0,
  downvotes   int default 0,
  reply_count int default 0,
  hot         boolean default false,
  pinned      boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index idx_threads_topic on public.threads(topic_id);
create index idx_threads_chapter on public.threads(chapter_id);
create index idx_threads_hot on public.threads(hot) where hot = true;
create index idx_threads_created on public.threads(created_at desc);

create table public.thread_replies (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid references public.threads(id) on delete cascade,
  parent_id  uuid references public.thread_replies(id) on delete cascade,
  author_id  uuid references public.profiles(id) on delete set null,
  body       text not null,
  upvotes    int default 0,
  created_at timestamptz default now()
);
create index idx_replies_thread on public.thread_replies(thread_id);

create table public.thread_votes (
  thread_id uuid references public.threads(id) on delete cascade,
  user_id   uuid references public.profiles(id) on delete cascade,
  vote      smallint check (vote in (-1, 1)),
  created_at timestamptz default now(),
  primary key (thread_id, user_id)
);

-- ── Karya (creator content) ───────────────────────────────
create table public.karya (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references public.profiles(id) on delete set null,
  type        text check (type in ('Tulisan','Vlog','Ilustrasi','Podcast','Zine')),
  title       text not null,
  body        text,
  cover_url   text,
  meta        text,  -- "7 mnt baca", "12:34", dll
  tags        text[],
  views       int default 0,
  featured    boolean default false,
  published_at timestamptz default now()
);

-- ── Kelas (LMS) ───────────────────────────────────────────
create table public.kelas (
  id           uuid primary key default gen_random_uuid(),
  mentor_id    uuid references public.profiles(id),
  title        text not null,
  description  text,
  duration     text,
  level        text check (level in ('Pemula','Menengah','Lanjut')),
  price_idr    int default 0,
  participant_count int default 0,
  featured     boolean default false,
  created_at   timestamptz default now()
);

create table public.kelas_modul (
  id        uuid primary key default gen_random_uuid(),
  kelas_id  uuid references public.kelas(id) on delete cascade,
  ord       int not null,  -- urutan modul (1, 2, 3, ...)
  title     text not null,
  duration  text,
  type      text check (type in ('video','workshop','capstone','reading')),
  video_url text,
  transcript text,
  unique (kelas_id, ord)
);

create table public.kelas_enrollment (
  kelas_id  uuid references public.kelas(id) on delete cascade,
  user_id   uuid references public.profiles(id) on delete cascade,
  progress  int default 0 check (progress between 0 and 100),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  primary key (kelas_id, user_id)
);

-- ── Pejabat & Janji ───────────────────────────────────────
create table public.pejabat (
  id        uuid primary key default gen_random_uuid(),
  nama      text not null,
  jabatan   text,
  partai    text,
  level     text check (level in ('Pusat','Provinsi','Kota','Kabupaten')),
  dapil     text,
  photo_url text,
  skor      int default 0 check (skor between 0 and 100),
  created_at timestamptz default now()
);

create table public.janji (
  id           uuid primary key default gen_random_uuid(),
  pejabat_id   uuid references public.pejabat(id) on delete cascade,
  topik        text,
  janji_text   text not null,
  source_url   text,
  source_quote text,
  status       text check (status in ('Belum','Berjalan','Mandek','Ditepati','Diingkari')),
  deadline     date,
  pemantau_count int default 0,
  evidence_count int default 0,
  submitted_by  uuid references public.profiles(id),
  verified_at  timestamptz,
  created_at   timestamptz default now()
);

create index idx_janji_status on public.janji(status);
create index idx_janji_pejabat on public.janji(pejabat_id);

create table public.janji_evidence (
  id          uuid primary key default gen_random_uuid(),
  janji_id    uuid references public.janji(id) on delete cascade,
  type        text check (type in ('foto','dokumen','video','data','link')),
  title       text,
  source      text,
  url         text,  -- kalau file: storage path. kalau link: external URL
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz default now()
);

create table public.janji_pemantau (
  janji_id   uuid references public.janji(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  followed_at timestamptz default now(),
  primary key (janji_id, user_id)
);

-- ── Petisi ────────────────────────────────────────────────
create table public.petisi (
  id           uuid primary key default gen_random_uuid(),
  initiator_id uuid references public.profiles(id) on delete set null,
  title        text not null,
  summary      text,
  body         text,
  icon         text,
  target       int default 1000,
  current_count int default 0,  -- denormalized counter, sync via trigger
  deadline     date,
  tags         text[],
  status       text default 'active' check (status in ('active','closed','victory')),
  created_at   timestamptz default now()
);

create table public.petisi_signatures (
  petisi_id  uuid references public.petisi(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  signed_at  timestamptz default now(),
  primary key (petisi_id, user_id)
);

-- Trigger: auto-update petisi.current_count saat sign/unsign
create or replace function update_petisi_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.petisi set current_count = current_count + 1 where id = NEW.petisi_id;
  elsif (TG_OP = 'DELETE') then
    update public.petisi set current_count = current_count - 1 where id = OLD.petisi_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trg_petisi_count
after insert or delete on public.petisi_signatures
for each row execute function update_petisi_count();

-- ── Laporan warga ─────────────────────────────────────────
create table public.laporan (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid references public.profiles(id) on delete set null,
  category     text check (category in ('jalan','banjir','sampah','listrik','layanan','drainase','lain')),
  title        text not null,
  description  text,
  location     text,
  city         text,
  photo_url    text,
  status       text default 'Diterima' check (status in ('Diterima','Ditindaklanjuti','Selesai','Ditolak')),
  dukungan_count int default 0,
  is_anonim    boolean default false,
  created_at   timestamptz default now(),
  resolved_at  timestamptz
);

create table public.laporan_dukungan (
  laporan_id uuid references public.laporan(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (laporan_id, user_id)
);

create table public.laporan_komentar (
  id         uuid primary key default gen_random_uuid(),
  laporan_id uuid references public.laporan(id) on delete cascade,
  author_id  uuid references public.profiles(id) on delete set null,
  body       text not null,
  created_at timestamptz default now()
);

-- ── Polling ───────────────────────────────────────────────
create table public.polling (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  options     jsonb not null,  -- [{id,label,emoji,votes}]
  total_votes int default 0,
  deadline    date,
  status      text default 'active',
  created_at  timestamptz default now()
);

create table public.polling_votes (
  polling_id uuid references public.polling(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  option_id  text not null,
  voted_at   timestamptz default now(),
  primary key (polling_id, user_id)
);

-- ── Kampanye ──────────────────────────────────────────────
create table public.kampanye (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  icon         text,
  participant_count int default 0,
  featured     boolean default false,
  status       text default 'active',
  created_at   timestamptz default now()
);

-- ── Badges ────────────────────────────────────────────────
create table public.badges (
  id          text primary key,
  name        text not null,
  description text,
  icon        text,
  criteria    text  -- description of how to earn
);

insert into public.badges (id, name, description, icon, criteria) values
  ('warga-baru',    'Warga Baru',    'Bergabung pertama kali',         '🌱', 'auto on signup'),
  ('streak-3',      'Tebak 3 Hari',  '3-day Wordle streak',            '🔥', 'play wordle 3 days in a row'),
  ('aktivis-mula',  'Aktivis Mula',  'Tanda tangani 1 petisi',         '✍️', 'sign 1 petisi'),
  ('penulis',       'Penulis',       'Submit 1 karya',                  '✏️', 'publish 1 karya'),
  ('forum-star',    'Forum Star',    'Thread 50+ balasan',              '⭐', 'have a thread with 50+ replies'),
  ('scholar',       'Civic Scholar', 'Selesaikan 1 kelas',              '🎓', 'complete kelas 100%'),
  ('streak-7',      'Streak 7',      '7 hari berturut-turut',           '🌟', '7-day login streak'),
  ('voter',         'Voter',         'Vote di 10 polling',              '🗳️', 'vote 10 pollings'),
  ('penggerak',     'Penggerak',     'Ajak 3 teman gabung',             '🤝', 'referral 3 users'),
  ('jubir-sejati',  'Jubir Sejati',  'Lulus kelas Jubir Warga',         '🏆', 'pass capstone Kelas Jubir Warga'),
  ('100-aksi',      '100 Aksi',      '100 aksi selesai',                '💯', 'cumulative 100 vote/sign/submit'),
  ('og-warga',      'OG Warga',      'Bergabung sejak 2024',            '👑', 'created_at < 2025-01-01');

create table public.user_badges (
  user_id  uuid references public.profiles(id) on delete cascade,
  badge_id text references public.badges(id),
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

-- ── Game scores ───────────────────────────────────────────
create table public.game_scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  game        text check (game in ('tebak-kata','spot-hoaks','tebak-pasal','janji-realita','tts','quiz')),
  score       int default 0,
  attempts    int default 0,
  won         boolean default false,
  played_at   timestamptz default now()
);
create index idx_scores_user_game on public.game_scores(user_id, game);
create index idx_scores_played on public.game_scores(played_at desc);

-- ── Activity log (audit trail) ────────────────────────────
create table public.activity_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  action     text not null,  -- 'sign_petisi', 'submit_lapor', 'comment', etc.
  resource_type text,  -- 'petisi', 'thread', 'janji', etc.
  resource_id   uuid,
  metadata   jsonb,
  created_at timestamptz default now()
);
create index idx_activity_user on public.activity_log(user_id, created_at desc);

-- ─────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────

-- Enable RLS on all user-data tables
alter table public.profiles            enable row level security;
alter table public.threads             enable row level security;
alter table public.thread_replies      enable row level security;
alter table public.thread_votes        enable row level security;
alter table public.karya               enable row level security;
alter table public.kelas               enable row level security;
alter table public.kelas_enrollment    enable row level security;
alter table public.pejabat             enable row level security;
alter table public.janji               enable row level security;
alter table public.janji_evidence      enable row level security;
alter table public.janji_pemantau      enable row level security;
alter table public.petisi              enable row level security;
alter table public.petisi_signatures   enable row level security;
alter table public.laporan             enable row level security;
alter table public.laporan_dukungan    enable row level security;
alter table public.laporan_komentar    enable row level security;
alter table public.polling             enable row level security;
alter table public.polling_votes       enable row level security;
alter table public.user_badges         enable row level security;
alter table public.game_scores         enable row level security;
alter table public.activity_log        enable row level security;

-- Reference tables (public read, admin write)
alter table public.chapters enable row level security;
alter table public.topics   enable row level security;
alter table public.badges   enable row level security;

create policy "Public can read chapters" on public.chapters for select using (true);
create policy "Public can read topics"   on public.topics   for select using (true);
create policy "Public can read badges"   on public.badges   for select using (true);

-- Profiles: read public, edit only own
create policy "Profiles are viewable by everyone"  on public.profiles for select using (true);
create policy "Users can insert own profile"       on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"       on public.profiles for update using (auth.uid() = id);

-- Threads: read public, write authenticated, edit own
create policy "Threads are viewable by everyone"   on public.threads for select using (true);
create policy "Authenticated can create threads"   on public.threads for insert with check (auth.uid() = author_id);
create policy "Users can update own threads"       on public.threads for update using (auth.uid() = author_id);
create policy "Users can delete own threads"       on public.threads for delete using (auth.uid() = author_id);

-- Replies: same pattern
create policy "Replies viewable by everyone"  on public.thread_replies for select using (true);
create policy "Auth can create replies"       on public.thread_replies for insert with check (auth.uid() = author_id);
create policy "Edit own replies"              on public.thread_replies for update using (auth.uid() = author_id);

-- Votes: tiap user 1x vote per thread
create policy "Votes viewable by everyone"    on public.thread_votes for select using (true);
create policy "Auth can vote"                  on public.thread_votes for insert with check (auth.uid() = user_id);
create policy "Auth can update own vote"       on public.thread_votes for update using (auth.uid() = user_id);
create policy "Auth can delete own vote"       on public.thread_votes for delete using (auth.uid() = user_id);

-- Karya
create policy "Karya viewable by everyone"    on public.karya for select using (true);
create policy "Auth can submit karya"          on public.karya for insert with check (auth.uid() = author_id);
create policy "Auth can edit own karya"        on public.karya for update using (auth.uid() = author_id);

-- Kelas: read public, enrollment by self
create policy "Kelas viewable by everyone"           on public.kelas for select using (true);
create policy "Auth can enroll self"                  on public.kelas_enrollment for insert with check (auth.uid() = user_id);
create policy "Users can view own enrollment"        on public.kelas_enrollment for select using (auth.uid() = user_id);
create policy "Users can update own progress"        on public.kelas_enrollment for update using (auth.uid() = user_id);

-- Pejabat & Janji: read public, write admin only
create policy "Pejabat viewable by everyone"  on public.pejabat for select using (true);
create policy "Admin can manage pejabat"      on public.pejabat for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Janji viewable by everyone"    on public.janji for select using (true);
create policy "Auth can submit janji"          on public.janji for insert with check (auth.uid() = submitted_by);
create policy "Admin can verify janji"        on public.janji for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Janji evidence: anyone authenticated can submit
create policy "Evidence viewable by everyone"  on public.janji_evidence for select using (true);
create policy "Auth can upload evidence"       on public.janji_evidence for insert with check (auth.uid() = uploaded_by);

-- Janji pemantau: tiap user follow sendiri
create policy "Pemantau viewable by everyone"  on public.janji_pemantau for select using (true);
create policy "Auth can follow janji"           on public.janji_pemantau for insert with check (auth.uid() = user_id);
create policy "Auth can unfollow"               on public.janji_pemantau for delete using (auth.uid() = user_id);

-- Petisi: read public, sign authenticated
create policy "Petisi viewable by everyone"    on public.petisi for select using (true);
create policy "Auth can create petisi"          on public.petisi for insert with check (auth.uid() = initiator_id);
create policy "Initiator can edit petisi"       on public.petisi for update using (auth.uid() = initiator_id);

create policy "Sigs viewable by everyone"      on public.petisi_signatures for select using (true);
create policy "Auth can sign petisi"            on public.petisi_signatures for insert with check (auth.uid() = user_id);
-- Note: NO update/delete on signatures — sign sekali, permanent

-- Laporan: read public, edit own (24 jam)
create policy "Laporan viewable by everyone"   on public.laporan for select using (true);
create policy "Auth can submit laporan"         on public.laporan for insert with check (auth.uid() = reporter_id);
create policy "Reporter can edit within 24h"   on public.laporan for update
  using (auth.uid() = reporter_id and created_at > now() - interval '24 hours');

create policy "Dukungan viewable"              on public.laporan_dukungan for select using (true);
create policy "Auth can dukung"                 on public.laporan_dukungan for insert with check (auth.uid() = user_id);
create policy "Auth can undukung"               on public.laporan_dukungan for delete using (auth.uid() = user_id);

create policy "Komentar viewable"              on public.laporan_komentar for select using (true);
create policy "Auth can comment"                on public.laporan_komentar for insert with check (auth.uid() = author_id);

-- Polling
create policy "Polling viewable"               on public.polling for select using (true);
create policy "Vote viewable"                  on public.polling_votes for select using (true);
create policy "Auth can vote polling"           on public.polling_votes for insert with check (auth.uid() = user_id);

-- User badges + game scores: read own + public top
create policy "Public can view all badges earned" on public.user_badges for select using (true);
create policy "System can grant badges"            on public.user_badges for insert with check (true);  -- via service_role

create policy "Public can view all scores"     on public.game_scores for select using (true);
create policy "Auth can record own scores"     on public.game_scores for insert with check (auth.uid() = user_id);

-- Activity log: read own, system writes
create policy "Users can view own activity"    on public.activity_log for select using (auth.uid() = user_id);
create policy "System can log activity"         on public.activity_log for insert with check (true);

-- ─────────────────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, level, xp, badges, onboarded)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    1,
    0,
    '[]'::jsonb,
    false
  );
  -- Auto-grant 'warga-baru' badge
  insert into public.user_badges (user_id, badge_id) values (new.id, 'warga-baru');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────
-- HELPER VIEWS untuk frontend convenience
-- ─────────────────────────────────────────────────────────

-- Threads with author info denormalized
create or replace view public.threads_with_author as
select
  t.*,
  p.name as author_name,
  p.username as author_username,
  p.avatar_url as author_avatar,
  p.level as author_level,
  c.name as chapter_name,
  topic.label as topic_label
from public.threads t
left join public.profiles p on p.id = t.author_id
left join public.chapters c on c.id = t.chapter_id
left join public.topics topic on topic.id = t.topic_id;

-- Petisi with progress %
create or replace view public.petisi_with_progress as
select
  p.*,
  case when target > 0 then round((current_count::numeric / target) * 100, 1) else 0 end as progress_pct,
  pp.name as initiator_name,
  pp.username as initiator_username
from public.petisi p
left join public.profiles pp on pp.id = p.initiator_id;

-- Janji with pejabat info
create or replace view public.janji_with_pejabat as
select
  j.*,
  pej.nama as pejabat_nama,
  pej.jabatan as pejabat_jabatan,
  pej.partai as pejabat_partai,
  pej.skor as pejabat_skor
from public.janji j
left join public.pejabat pej on pej.id = j.pejabat_id;

-- ── Done ──────────────────────────────────────────────────
-- Verify: select count(*) from information_schema.tables where table_schema = 'public';
-- Expected: ~25 tables + 3 views

comment on schema public is 'Jubir Warga MVP schema v0.1 — 2026-04-29';
