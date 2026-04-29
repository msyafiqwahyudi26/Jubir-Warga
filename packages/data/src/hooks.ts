// ─────────────────────────────────────────────────────────
// Jubir Warga — React Query hooks (TanStack Query)
// Wrap query functions dengan caching + retry + optimistic UI
//
// Pakai di Phase 2 Next.js. Setup QueryClient di app provider.
// ─────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import * as Q from './queries';
import type * as T from './types';
import type * as S from './schemas';

// ── Query keys factory (untuk invalidation pattern) ────────
export const qk = {
  all: ['jw'] as const,
  threads: (filter?: Q.ThreadsFilter) => ['jw','threads', filter ?? {}] as const,
  thread: (id: string) => ['jw','thread', id] as const,
  threadReplies: (threadId: string) => ['jw','thread', threadId, 'replies'] as const,
  petisi: (activeOnly?: boolean) => ['jw','petisi', activeOnly ?? true] as const,
  petisiOne: (id: string) => ['jw','petisi', id] as const,
  petisiSigned: (id: string) => ['jw','petisi', id, 'signed'] as const,
  janji: (filter?: Q.JanjiFilter) => ['jw','janji', filter ?? {}] as const,
  janjiOne: (id: string) => ['jw','janji', id] as const,
  janjiEvidence: (id: string) => ['jw','janji', id, 'evidence'] as const,
  pejabat: (level?: any) => ['jw','pejabat', level ?? 'all'] as const,
  pejabatOne: (id: string) => ['jw','pejabat', id] as const,
  karya: (type?: T.KaryaType) => ['jw','karya', type ?? 'all'] as const,
  karyaOne: (id: string) => ['jw','karya', id] as const,
  kelas: () => ['jw','kelas'] as const,
  kelasOne: (id: string) => ['jw','kelas', id] as const,
  kelasModul: (id: string) => ['jw','kelas', id, 'modul'] as const,
  laporan: (cat?: T.LaporanCategory) => ['jw','laporan', cat ?? 'all'] as const,
  laporanOne: (id: string) => ['jw','laporan', id] as const,
  polling: () => ['jw','polling'] as const,
  myProfile: () => ['jw','me','profile'] as const,
  profile: (id: string) => ['jw','profile', id] as const,
  myBadges: () => ['jw','me','badges'] as const,
  leaderboard: (game: T.GameType) => ['jw','leaderboard', game] as const,
  chapters: () => ['jw','ref','chapters'] as const,
  topics: () => ['jw','ref','topics'] as const,
  badges: () => ['jw','ref','badges'] as const,
};

const STALE_REF = 1000 * 60 * 60;   // 1 jam (reference data)
const STALE_LIST = 1000 * 60;        // 1 menit (list)
const STALE_DETAIL = 1000 * 30;      // 30 detik (detail page)

// ── Threads ────────────────────────────────────────────────
export function useThreads(filter: Q.ThreadsFilter = {}) {
  return useQuery({
    queryKey: qk.threads(filter),
    queryFn: () => Q.listThreads(filter),
    staleTime: STALE_LIST,
  });
}

export function useThread(id: string) {
  return useQuery({
    queryKey: qk.thread(id),
    queryFn: () => Q.getThread(id),
    staleTime: STALE_DETAIL,
    enabled: !!id,
  });
}

export function useThreadReplies(threadId: string) {
  return useQuery({
    queryKey: qk.threadReplies(threadId),
    queryFn: () => Q.listThreadReplies(threadId),
    staleTime: STALE_DETAIL,
    enabled: !!threadId,
  });
}

export function useSubmitThread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: S.SubmitThreadInput) => Q.submitThread(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jw','threads'] }),
  });
}

export function useVoteThread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, vote }: { threadId: string; vote: -1 | 1 }) => Q.voteThread(threadId, vote),
    onSuccess: (_, { threadId }) => qc.invalidateQueries({ queryKey: qk.thread(threadId) }),
  });
}

export function useSubmitReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: S.SubmitReplyInput) => Q.submitReply(input),
    onSuccess: (_, { thread_id }) => qc.invalidateQueries({ queryKey: qk.threadReplies(thread_id) }),
  });
}

// ── Petisi ─────────────────────────────────────────────────
export function usePetisiList(activeOnly = true) {
  return useQuery({
    queryKey: qk.petisi(activeOnly),
    queryFn: () => Q.listPetisi(activeOnly),
    staleTime: STALE_LIST,
  });
}

export function usePetisi(id: string) {
  return useQuery({
    queryKey: qk.petisiOne(id),
    queryFn: () => Q.getPetisi(id),
    staleTime: STALE_DETAIL,
    enabled: !!id,
  });
}

export function useIsPetisiSigned(petisiId: string) {
  return useQuery({
    queryKey: qk.petisiSigned(petisiId),
    queryFn: () => Q.isPetisiSigned(petisiId),
    staleTime: STALE_DETAIL,
    enabled: !!petisiId,
  });
}

export function useSignPetisi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (petisiId: string) => Q.signPetisi(petisiId),
    onSuccess: (_, petisiId) => {
      qc.invalidateQueries({ queryKey: qk.petisiOne(petisiId) });
      qc.invalidateQueries({ queryKey: qk.petisiSigned(petisiId) });
      qc.invalidateQueries({ queryKey: ['jw','petisi'] });
    },
  });
}

// ── Janji ──────────────────────────────────────────────────
export function useJanji(filter: Q.JanjiFilter = {}) {
  return useQuery({
    queryKey: qk.janji(filter),
    queryFn: () => Q.listJanji(filter),
    staleTime: STALE_LIST,
  });
}

export function useJanjiDetail(id: string) {
  return useQuery({
    queryKey: qk.janjiOne(id),
    queryFn: () => Q.getJanji(id),
    staleTime: STALE_DETAIL,
    enabled: !!id,
  });
}

export function useFollowJanji() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ janjiId, follow }: { janjiId: string; follow: boolean }) =>
      follow ? Q.followJanji(janjiId) : Q.unfollowJanji(janjiId),
    onSuccess: (_, { janjiId }) => qc.invalidateQueries({ queryKey: qk.janjiOne(janjiId) }),
  });
}

export function useJanjiEvidence(janjiId: string) {
  return useQuery({
    queryKey: qk.janjiEvidence(janjiId),
    queryFn: () => Q.getJanjiEvidence(janjiId),
    staleTime: STALE_DETAIL,
    enabled: !!janjiId,
  });
}

export function usePejabatList(level?: 'Pusat' | 'Provinsi' | 'Kota') {
  return useQuery({
    queryKey: qk.pejabat(level),
    queryFn: () => Q.listPejabat(level),
    staleTime: STALE_REF,
  });
}

export function usePejabat(id: string) {
  return useQuery({
    queryKey: qk.pejabatOne(id),
    queryFn: () => Q.getPejabat(id),
    staleTime: STALE_REF,
    enabled: !!id,
  });
}

// ── Karya ──────────────────────────────────────────────────
export function useKaryaList(type?: T.KaryaType) {
  return useQuery({
    queryKey: qk.karya(type),
    queryFn: () => Q.listKarya(type),
    staleTime: STALE_LIST,
  });
}

export function useKarya(id: string) {
  return useQuery({
    queryKey: qk.karyaOne(id),
    queryFn: () => Q.getKarya(id),
    staleTime: STALE_DETAIL,
    enabled: !!id,
  });
}

// ── Kelas ──────────────────────────────────────────────────
export function useKelasList() {
  return useQuery({
    queryKey: qk.kelas(),
    queryFn: Q.listKelas,
    staleTime: STALE_REF,
  });
}

export function useKelas(id: string) {
  return useQuery({
    queryKey: qk.kelasOne(id),
    queryFn: () => Q.getKelas(id),
    staleTime: STALE_REF,
    enabled: !!id,
  });
}

export function useKelasModul(kelasId: string) {
  return useQuery({
    queryKey: qk.kelasModul(kelasId),
    queryFn: () => Q.getKelasModul(kelasId),
    staleTime: STALE_REF,
    enabled: !!kelasId,
  });
}

export function useEnrollKelas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (kelasId: string) => Q.enrollKelas(kelasId),
    onSuccess: (_, kelasId) => qc.invalidateQueries({ queryKey: qk.kelasOne(kelasId) }),
  });
}

// ── Laporan ────────────────────────────────────────────────
export function useLaporanList(category?: T.LaporanCategory) {
  return useQuery({
    queryKey: qk.laporan(category),
    queryFn: () => Q.listLaporan(category),
    staleTime: STALE_LIST,
  });
}

export function useLaporan(id: string) {
  return useQuery({
    queryKey: qk.laporanOne(id),
    queryFn: () => Q.getLaporan(id),
    staleTime: STALE_DETAIL,
    enabled: !!id,
  });
}

export function useSubmitLaporan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: S.SubmitLaporanInput) => Q.submitLaporan(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jw','laporan'] }),
  });
}

// ── Polling ────────────────────────────────────────────────
export function usePollingList() {
  return useQuery({
    queryKey: qk.polling(),
    queryFn: Q.listPolling,
    staleTime: STALE_LIST,
  });
}

export function useVotePolling() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: S.VotePollingInput) => Q.votePolling(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.polling() }),
  });
}

// ── Profile ────────────────────────────────────────────────
export function useMyProfile() {
  return useQuery({
    queryKey: qk.myProfile(),
    queryFn: Q.getMyProfile,
    staleTime: STALE_DETAIL,
  });
}

export function useUpdateMyProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: S.UpdateProfileInput) => Q.updateMyProfile(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.myProfile() }),
  });
}

export function useMyBadges() {
  return useQuery({
    queryKey: qk.myBadges(),
    queryFn: Q.getMyBadges,
    staleTime: STALE_REF,
  });
}

// ── Reference ──────────────────────────────────────────────
export function useChapters() {
  return useQuery({ queryKey: qk.chapters(), queryFn: Q.listChapters, staleTime: STALE_REF });
}

export function useTopics() {
  return useQuery({ queryKey: qk.topics(), queryFn: Q.listTopics, staleTime: STALE_REF });
}

export function useBadges() {
  return useQuery({ queryKey: qk.badges(), queryFn: Q.listBadges, staleTime: STALE_REF });
}

// ── Leaderboard ────────────────────────────────────────────
export function useLeaderboard(game: T.GameType) {
  return useQuery({
    queryKey: qk.leaderboard(game),
    queryFn: () => Q.getLeaderboard(game),
    staleTime: STALE_LIST,
  });
}
