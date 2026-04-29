// ─────────────────────────────────────────────────────────
// Jubir Warga — Type-safe query functions (Supabase wrapper)
// Pure functions, framework-agnostic. Pakai langsung atau via hooks.
// ─────────────────────────────────────────────────────────

import { getJWClient } from './client';
import type {
  ChapterId, TopicId, JanjiStatus, KaryaType, LaporanCategory,
  Thread, ThreadWithAuthor, ThreadReply,
  Karya, Kelas, KelasModul, KelasEnrollment,
  Pejabat, Janji, JanjiWithPejabat, JanjiEvidence,
  Petisi, PetisiWithProgress,
  Laporan, Polling, Kampanye,
  Profile, Badge, GameType,
} from './types';
import type {
  SubmitThreadInput, SubmitReplyInput, SubmitKaryaInput,
  SubmitJanjiInput, SubmitLaporanInput, SubmitPetisiInput,
  UpdateProfileInput, VotePollingInput,
} from './schemas';

// ── Threads ────────────────────────────────────────────────
export interface ThreadsFilter {
  topic?: TopicId;
  chapter?: ChapterId;
  hot?: boolean;
  limit?: number;
  offset?: number;
}

export async function listThreads(filter: ThreadsFilter = {}): Promise<ThreadWithAuthor[]> {
  let q = getJWClient()
    .from('threads_with_author')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(filter.limit ?? 20);

  if (filter.topic)   q = q.eq('topic_id', filter.topic);
  if (filter.chapter) q = q.eq('chapter_id', filter.chapter);
  if (filter.hot)     q = q.eq('hot', true);
  if (filter.offset)  q = q.range(filter.offset, filter.offset + (filter.limit ?? 20) - 1);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ThreadWithAuthor[];
}

export async function getThread(id: string): Promise<ThreadWithAuthor | null> {
  const { data, error } = await getJWClient()
    .from('threads_with_author')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as ThreadWithAuthor;
}

export async function listThreadReplies(threadId: string): Promise<ThreadReply[]> {
  const { data, error } = await getJWClient()
    .from('thread_replies')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ThreadReply[];
}

export async function submitThread(input: SubmitThreadInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');

  const { data, error } = await getJWClient()
    .from('threads')
    .insert({ ...input, author_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function submitReply(input: SubmitReplyInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');

  const { data, error } = await getJWClient()
    .from('thread_replies')
    .insert({ ...input, author_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function voteThread(threadId: string, vote: -1 | 1) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');

  const { error } = await getJWClient()
    .from('thread_votes')
    .upsert({ thread_id: threadId, user_id: user.id, vote }, { onConflict: 'thread_id,user_id' });
  if (error) throw error;
}

export async function unvoteThread(threadId: string) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('thread_votes').delete().match({ thread_id: threadId, user_id: user.id });
  if (error) throw error;
}

// ── Petisi ─────────────────────────────────────────────────
export async function listPetisi(activeOnly = true): Promise<PetisiWithProgress[]> {
  let q = getJWClient().from('petisi_with_progress').select('*').order('created_at', { ascending: false });
  if (activeOnly) q = q.eq('status', 'active');
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PetisiWithProgress[];
}

export async function getPetisi(id: string): Promise<PetisiWithProgress | null> {
  const { data, error } = await getJWClient().from('petisi_with_progress').select('*').eq('id', id).single();
  if (error) return null;
  return data as PetisiWithProgress;
}

export async function signPetisi(petisiId: string) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('petisi_signatures').insert({ petisi_id: petisiId, user_id: user.id });
  if (error) throw error;
}

export async function isPetisiSigned(petisiId: string): Promise<boolean> {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) return false;
  const { count } = await getJWClient()
    .from('petisi_signatures')
    .select('*', { count: 'exact', head: true })
    .match({ petisi_id: petisiId, user_id: user.id });
  return (count ?? 0) > 0;
}

export async function submitPetisi(input: SubmitPetisiInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { data, error } = await getJWClient()
    .from('petisi')
    .insert({ ...input, initiator_id: user.id, status: 'active' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Janji & Pejabat ────────────────────────────────────────
export interface JanjiFilter {
  status?: JanjiStatus;
  pejabat_id?: string;
  level?: 'Pusat' | 'Provinsi' | 'Kota';
  limit?: number;
}

export async function listJanji(filter: JanjiFilter = {}): Promise<JanjiWithPejabat[]> {
  let q = getJWClient().from('janji_with_pejabat').select('*').order('created_at', { ascending: false }).limit(filter.limit ?? 50);
  if (filter.status)     q = q.eq('status', filter.status);
  if (filter.pejabat_id) q = q.eq('pejabat_id', filter.pejabat_id);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as JanjiWithPejabat[];
}

export async function getJanji(id: string): Promise<JanjiWithPejabat | null> {
  const { data, error } = await getJWClient().from('janji_with_pejabat').select('*').eq('id', id).single();
  if (error) return null;
  return data as JanjiWithPejabat;
}

export async function submitJanji(input: SubmitJanjiInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { data, error } = await getJWClient()
    .from('janji')
    .insert({ ...input, submitted_by: user.id, status: 'Belum' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function followJanji(janjiId: string) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('janji_pemantau').insert({ janji_id: janjiId, user_id: user.id });
  if (error) throw error;
}

export async function unfollowJanji(janjiId: string) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('janji_pemantau').delete().match({ janji_id: janjiId, user_id: user.id });
  if (error) throw error;
}

export async function getJanjiEvidence(janjiId: string): Promise<JanjiEvidence[]> {
  const { data, error } = await getJWClient().from('janji_evidence').select('*').eq('janji_id', janjiId).order('uploaded_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as JanjiEvidence[];
}

export async function listPejabat(level?: 'Pusat' | 'Provinsi' | 'Kota'): Promise<Pejabat[]> {
  let q = getJWClient().from('pejabat').select('*').order('skor', { ascending: false });
  if (level) q = q.eq('level', level);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Pejabat[];
}

export async function getPejabat(id: string): Promise<Pejabat | null> {
  const { data, error } = await getJWClient().from('pejabat').select('*').eq('id', id).single();
  if (error) return null;
  return data as Pejabat;
}

// ── Karya ──────────────────────────────────────────────────
export async function listKarya(type?: KaryaType, limit = 20): Promise<Karya[]> {
  let q = getJWClient().from('karya').select('*').order('published_at', { ascending: false }).limit(limit);
  if (type) q = q.eq('type', type);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Karya[];
}

export async function getKarya(id: string): Promise<Karya | null> {
  const { data, error } = await getJWClient().from('karya').select('*').eq('id', id).single();
  if (error) return null;
  return data as Karya;
}

export async function submitKarya(input: SubmitKaryaInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { data, error } = await getJWClient().from('karya').insert({ ...input, author_id: user.id }).select().single();
  if (error) throw error;
  return data;
}

// ── Kelas ──────────────────────────────────────────────────
export async function listKelas(): Promise<Kelas[]> {
  const { data, error } = await getJWClient().from('kelas').select('*').order('featured', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Kelas[];
}

export async function getKelas(id: string): Promise<Kelas | null> {
  const { data, error } = await getJWClient().from('kelas').select('*').eq('id', id).single();
  if (error) return null;
  return data as Kelas;
}

export async function getKelasModul(kelasId: string): Promise<KelasModul[]> {
  const { data, error } = await getJWClient().from('kelas_modul').select('*').eq('kelas_id', kelasId).order('ord');
  if (error) throw error;
  return (data ?? []) as KelasModul[];
}

export async function enrollKelas(kelasId: string) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('kelas_enrollment').insert({ kelas_id: kelasId, user_id: user.id, progress: 0 });
  if (error) throw error;
}

export async function updateKelasProgress(kelasId: string, progress: number) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient()
    .from('kelas_enrollment')
    .update({ progress, ...(progress >= 100 ? { completed_at: new Date().toISOString() } : {}) })
    .match({ kelas_id: kelasId, user_id: user.id });
  if (error) throw error;
}

// ── Laporan ────────────────────────────────────────────────
export async function listLaporan(category?: LaporanCategory, limit = 20): Promise<Laporan[]> {
  let q = getJWClient().from('laporan').select('*').order('created_at', { ascending: false }).limit(limit);
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Laporan[];
}

export async function getLaporan(id: string): Promise<Laporan | null> {
  const { data, error } = await getJWClient().from('laporan').select('*').eq('id', id).single();
  if (error) return null;
  return data as Laporan;
}

export async function submitLaporan(input: SubmitLaporanInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { data, error } = await getJWClient().from('laporan').insert({ ...input, reporter_id: user.id }).select().single();
  if (error) throw error;
  return data;
}

export async function dukungLaporan(laporanId: string) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('laporan_dukungan').insert({ laporan_id: laporanId, user_id: user.id });
  if (error) throw error;
}

// ── Polling ────────────────────────────────────────────────
export async function listPolling(): Promise<Polling[]> {
  const { data, error } = await getJWClient().from('polling').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Polling[];
}

export async function votePolling(input: VotePollingInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('polling_votes').upsert({ ...input, user_id: user.id });
  if (error) throw error;
}

// ── Profile ────────────────────────────────────────────────
export async function getMyProfile(): Promise<Profile | null> {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) return null;
  const { data, error } = await getJWClient().from('profiles').select('*').eq('id', user.id).single();
  if (error) return null;
  return data as Profile;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getJWClient().from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data as Profile;
}

export async function updateMyProfile(input: UpdateProfileInput) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) throw new Error('Auth required');
  const { error } = await getJWClient().from('profiles').update({ ...input, updated_at: new Date().toISOString() }).eq('id', user.id);
  if (error) throw error;
}

export async function getMyBadges(): Promise<{ badge_id: string; earned_at: string }[]> {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) return [];
  const { data, error } = await getJWClient().from('user_badges').select('badge_id, earned_at').eq('user_id', user.id);
  if (error) return [];
  return (data ?? []) as any;
}

// ── Game scores ────────────────────────────────────────────
export async function recordGameScore(game: GameType, score: number, won: boolean, attempts = 1) {
  const user = (await getJWClient().auth.getUser()).data.user;
  if (!user) return;
  await getJWClient().from('game_scores').insert({ user_id: user.id, game, score, won, attempts });
}

export async function getLeaderboard(game: GameType, limit = 10) {
  const { data, error } = await getJWClient()
    .from('game_scores')
    .select('user_id, score, profiles!inner(name, username, avatar_url, level)')
    .eq('game', game)
    .order('score', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

// ── Reference data (cached) ────────────────────────────────
export async function listChapters() {
  const { data, error } = await getJWClient().from('chapters').select('*');
  if (error) throw error;
  return data ?? [];
}

export async function listTopics() {
  const { data, error } = await getJWClient().from('topics').select('*');
  if (error) throw error;
  return data ?? [];
}

export async function listBadges(): Promise<Badge[]> {
  const { data, error } = await getJWClient().from('badges').select('*');
  if (error) throw error;
  return (data ?? []) as Badge[];
}
