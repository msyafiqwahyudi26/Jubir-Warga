// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock data adapter
// Bridge: serve data dari window.JWData (beta lama) — sebagai fallback
// kalau Supabase belum di-init. Berguna untuk dev offline juga.
//
// Pakai: import { mockClient } dari './mock' lalu pakai sebagai drop-in
// replacement untuk queries dari './queries'.
// ─────────────────────────────────────────────────────────

import type {
  Thread, ThreadWithAuthor, Karya, Kelas, KelasModul,
  Pejabat, Janji, JanjiWithPejabat, Petisi, PetisiWithProgress,
  Laporan, Polling, Profile, Badge, GameType,
  ChapterId, TopicId, JanjiStatus, KaryaType, LaporanCategory,
} from './types';

declare global {
  interface Window {
    JWData?: any;
    JWStore?: any;
  }
}

const D = () => (typeof window !== 'undefined' ? window.JWData : null);
const S = () => (typeof window !== 'undefined' ? window.JWStore : null);

function mockUserToProfile(u: any): Profile {
  return {
    id: u.id,
    username: u.id,
    name: u.name,
    bio: u.bio ?? null,
    chapter_id: (u.chapter || '').toLowerCase().replace(/\s.*/, '') as ChapterId,
    avatar_url: null,
    level: u.level ?? 1,
    xp: u.xp ?? 0,
    is_admin: false,
    is_anonim: false,
    onboarded: true,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  };
}

function mockThreadToWithAuthor(t: any): ThreadWithAuthor {
  const author = D()?.byId?.user(t.authorId);
  return {
    id: t.id,
    author_id: t.authorId,
    title: t.title,
    body: t.preview,
    preview: t.preview,
    topic_id: t.cat as TopicId,
    chapter_id: t.loc as ChapterId,
    format: t.fmt,
    upvotes: t.upvotes ?? 0,
    downvotes: t.downvotes ?? 0,
    reply_count: t.replies ?? 0,
    hot: t.hot ?? false,
    pinned: false,
    created_at: new Date(Date.now() - parseInt(t.time) * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author_name: author?.name ?? 'Anonim',
    author_username: author?.id ?? null,
    author_avatar: null,
    author_level: author?.level ?? 1,
    chapter_name: t.chapter ?? null,
    topic_label: t.cat ?? null,
  };
}

function mockPetisiToWithProgress(p: any): PetisiWithProgress {
  const initiator = D()?.byId?.user(p.initiatorId);
  return {
    id: p.id,
    initiator_id: p.initiatorId,
    title: p.title,
    summary: p.summary,
    body: null,
    icon: p.icon,
    target: p.target,
    current_count: p.current ?? 0,
    deadline: p.deadline,
    tags: p.tags,
    status: 'active',
    created_at: new Date().toISOString(),
    progress_pct: p.target ? Math.round((p.current / p.target) * 100) : 0,
    initiator_name: initiator?.name ?? null,
    initiator_username: initiator?.id ?? null,
  };
}

function mockJanjiToWithPejabat(j: any): JanjiWithPejabat {
  const pejabat = D()?.byId?.pejabat(j.pejabatId);
  return {
    id: j.id,
    pejabat_id: j.pejabatId,
    topik: j.topik,
    janji_text: j.janji,
    source_url: null,
    source_quote: null,
    status: j.status as JanjiStatus,
    deadline: j.deadline,
    pemantau_count: j.pemantau ?? 0,
    evidence_count: j.evidenceCount ?? 0,
    submitted_by: null,
    verified_at: null,
    created_at: new Date().toISOString(),
    pejabat_nama: pejabat?.nama ?? null,
    pejabat_jabatan: pejabat?.jabatan ?? null,
    pejabat_partai: pejabat?.partai ?? null,
    pejabat_skor: pejabat?.skor ?? null,
  };
}

// ── Public API: drop-in replacement untuk queries.ts ───────
export const mockClient = {
  async listThreads(filter: any = {}) {
    const threads = D()?.threads ?? [];
    let result: ThreadWithAuthor[] = threads.map(mockThreadToWithAuthor);
    if (filter.topic) result = result.filter(t => t.topic_id === filter.topic);
    if (filter.chapter) result = result.filter(t => t.chapter_id === filter.chapter);
    if (filter.hot) result = result.filter(t => t.hot);
    return result.slice(0, filter.limit ?? 20);
  },

  async getThread(id: string) {
    const t = D()?.byId?.thread(id);
    return t ? mockThreadToWithAuthor(t) : null;
  },

  async listPetisi() {
    return (D()?.petisi ?? []).map(mockPetisiToWithProgress);
  },

  async getPetisi(id: string) {
    const p = D()?.byId?.petisi(id);
    return p ? mockPetisiToWithProgress(p) : null;
  },

  async signPetisi(petisiId: string) {
    return S()?.actions?.sign(petisiId);
  },

  async isPetisiSigned(petisiId: string) {
    return !!S()?.getState()?.signed?.[petisiId];
  },

  async listJanji(filter: any = {}) {
    let result = (D()?.janji ?? []).map(mockJanjiToWithPejabat);
    if (filter.status) result = result.filter((j: JanjiWithPejabat) => j.status === filter.status);
    if (filter.pejabat_id) result = result.filter((j: JanjiWithPejabat) => j.pejabat_id === filter.pejabat_id);
    return result.slice(0, filter.limit ?? 50);
  },

  async getJanji(id: string) {
    const j = D()?.byId?.janji(id);
    return j ? mockJanjiToWithPejabat(j) : null;
  },

  async followJanji(janjiId: string) { S()?.actions?.toggleFollow(janjiId); },
  async unfollowJanji(janjiId: string) { S()?.actions?.toggleFollow(janjiId); },

  async listPejabat(level?: string) {
    let result = D()?.pejabat ?? [];
    if (level) result = result.filter((p: any) => p.level === level);
    return result;
  },

  async getPejabat(id: string) {
    return D()?.byId?.pejabat(id);
  },

  async listKarya(type?: KaryaType) {
    let result = D()?.karya ?? [];
    if (type) result = result.filter((k: any) => k.type === type);
    return result;
  },

  async listKelas() {
    return D()?.kelas ?? [];
  },

  async getKelas(id: string) {
    return D()?.byId?.kelas(id);
  },

  async listLaporan(category?: LaporanCategory) {
    let result = D()?.laporan ?? [];
    if (category) result = result.filter((l: any) => l.kategori === category);
    return result;
  },

  async listPolling() {
    return D()?.polling ?? [];
  },

  async listChapters() {
    return D()?.chapters ?? [];
  },

  async listTopics() {
    return D()?.topikUtama ?? [];
  },

  async listBadges() {
    return D()?.badges ?? [];
  },
};

/**
 * Auto-detect: pakai Supabase kalau initJWClient sudah dipanggil,
 * fallback ke mock kalau belum (offline dev / beta lama).
 *
 * Pakai di Phase 2: tidak perlu — selalu real Supabase.
 * Pakai di beta sekarang: bisa wire ke ini supaya migrate gradual.
 */
export function isMockMode(): boolean {
  if (typeof window === 'undefined') return false;
  // Mock mode aktif kalau JWData ada di window dan Supabase belum init
  return !!window.JWData;
}
