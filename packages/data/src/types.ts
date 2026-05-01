// ─────────────────────────────────────────────────────────
// Jubir Warga — Database types (mirror of Supabase schema)
// Auto-gen via `supabase gen types typescript` — overrides ini
// ─────────────────────────────────────────────────────────

export type ChapterId = 'jakarta' | 'bandung' | 'malang' | 'surabaya' | 'jogja' | 'medan' | 'makassar';
export type TopicId = 'politik' | 'lingkungan' | 'gender' | 'mental' | 'kerja' | 'pendidikan' | 'budaya' | 'transport' | 'lokal';
export type ThreadFormat = 'diskusi' | 'tanya' | 'pengalaman' | 'polling' | 'live';
export type KaryaType = 'Tulisan' | 'Vlog' | 'Ilustrasi' | 'Podcast' | 'Zine';
export type KelasLevel = 'Pemula' | 'Menengah' | 'Lanjut';
export type ModulType = 'video' | 'workshop' | 'capstone' | 'reading';
export type PejabatLevel = 'Pusat' | 'Provinsi' | 'Kota' | 'Kabupaten';
export type JanjiStatus = 'Belum' | 'Berjalan' | 'Mandek' | 'Ditepati' | 'Diingkari';
export type EvidenceType = 'foto' | 'dokumen' | 'video' | 'data' | 'link';
export type LaporanCategory = 'jalan' | 'banjir' | 'sampah' | 'listrik' | 'layanan' | 'drainase' | 'lain';
export type LaporanStatus = 'Diterima' | 'Ditindaklanjuti' | 'Selesai' | 'Ditolak';
export type GameType = 'tebak-kata' | 'spot-hoaks' | 'tebak-pasal' | 'janji-realita' | 'tts' | 'quiz';

export interface Chapter {
  id: ChapterId;
  name: string;
  city: string | null;
  province: string | null;
  members_count: number;
  active: boolean;
  created_at: string;
}

export interface Topic {
  id: TopicId;
  label: string;
}

export interface Profile {
  id: string;          // uuid
  username: string | null;
  name: string | null;
  bio: string | null;
  chapter_id: ChapterId | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  is_admin: boolean;
  is_anonim: boolean;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  author_id: string | null;
  title: string;
  body: string | null;
  preview: string | null;
  topic_id: TopicId | null;
  chapter_id: ChapterId | null;
  format: ThreadFormat | null;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  hot: boolean;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThreadWithAuthor extends Thread {
  author_name: string | null;
  author_username: string | null;
  author_avatar: string | null;
  author_level: number | null;
  chapter_name: string | null;
  topic_label: string | null;
}

export interface ThreadReply {
  id: string;
  thread_id: string;
  parent_id: string | null;
  author_id: string | null;
  body: string;
  upvotes: number;
  created_at: string;
}

export interface ThreadVote {
  thread_id: string;
  user_id: string;
  vote: -1 | 1;
  created_at: string;
}

export interface Karya {
  id: string;
  author_id: string | null;
  type: KaryaType;
  title: string;
  body: string | null;
  cover_url: string | null;
  meta: string | null;
  tags: string[] | null;
  views: number;
  featured: boolean;
  published_at: string;
}

export interface Kelas {
  id: string;
  mentor_id: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  level: KelasLevel | null;
  price_idr: number;
  participant_count: number;
  featured: boolean;
  created_at: string;
}

export interface KelasModul {
  id: string;
  kelas_id: string;
  ord: number;
  title: string;
  duration: string | null;
  type: ModulType | null;
  video_url: string | null;
  transcript: string | null;
}

export interface KelasEnrollment {
  kelas_id: string;
  user_id: string;
  progress: number;       // 0..100
  enrolled_at: string;
  completed_at: string | null;
}

export interface Pejabat {
  id: string;
  nama: string;
  jabatan: string | null;
  partai: string | null;
  level: PejabatLevel | null;
  dapil: string | null;
  photo_url: string | null;
  skor: number;           // 0..100
  created_at: string;
}

export interface Janji {
  id: string;
  pejabat_id: string;
  topik: string | null;
  janji_text: string;
  source_url: string | null;
  source_quote: string | null;
  status: JanjiStatus | null;
  deadline: string | null;
  pemantau_count: number;
  evidence_count: number;
  submitted_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface JanjiWithPejabat extends Janji {
  pejabat_nama: string | null;
  pejabat_jabatan: string | null;
  pejabat_partai: string | null;
  pejabat_skor: number | null;
}

export interface JanjiEvidence {
  id: string;
  janji_id: string;
  type: EvidenceType;
  title: string | null;
  source: string | null;
  url: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface Petisi {
  id: string;
  initiator_id: string | null;
  title: string;
  summary: string | null;
  body: string | null;
  icon: string | null;
  target: number;
  current_count: number;
  deadline: string | null;
  tags: string[] | null;
  status: 'active' | 'closed' | 'victory';
  created_at: string;
}

export interface PetisiWithProgress extends Petisi {
  progress_pct: number;
  initiator_name: string | null;
  initiator_username: string | null;
}

export interface PetisiSignature {
  petisi_id: string;
  user_id: string;
  signed_at: string;
}

export interface Laporan {
  id: string;
  reporter_id: string | null;
  category: LaporanCategory;
  title: string;
  description: string | null;
  location: string | null;
  city: string | null;
  photo_url: string | null;
  status: LaporanStatus;
  dukungan_count: number;
  is_anonim: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface Polling {
  id: string;
  question: string;
  options: PollingOption[];
  total_votes: number;
  deadline: string | null;
  status: 'active' | 'closed';
  created_at: string;
}

export interface PollingOption {
  id: string;
  label: string;
  emoji?: string;
  votes: number;
}

export interface Kampanye {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  participant_count: number;
  featured: boolean;
  status: 'active' | 'closed';
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  criteria: string | null;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface GameScore {
  id: string;
  user_id: string;
  game: GameType;
  score: number;
  attempts: number;
  won: boolean;
  played_at: string;
}

// ─────────────────────────────────────────────────────────
// Database type — auto-generated dari Supabase CLI.
// Re-run: supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
// Domain types di atas tetap dipakai sebagai TypeScript-friendly aliases di app code.
// ─────────────────────────────────────────────────────────
export type { Database } from './database.types';
