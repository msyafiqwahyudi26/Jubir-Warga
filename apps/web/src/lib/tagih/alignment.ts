// Alignment + editorial constants for Tagih Dashboard light (Spec #24-LIGHT).
//
// Schema target: migration 0004 LIGHT (Window A) menambah `alignment_status`,
// `alignment_reasoning`, `source_doc_url`, `source_doc_page`, `editorial_status`,
// `editorial_reviewer_id`, `editorial_reviewed_at` ke `janji` table.
//
// Window B fallback strategy: kalau migration belum landed di DB, query
// `select *` masih return existing fields, dan field alignment akan
// undefined/null → UI render placeholder "belum di-review" graceful. Saat
// Window A migrate + types regenerated, field naturally available.

import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  XOctagon,
  ShieldCheck,
  Sparkles,
  CircleDashed,
} from 'lucide-react';

// ─── Alignment status (4-tier verdict) ────────────────────────────────

export const ALIGNMENT_STATUSES = [
  'aligned',
  'partial',
  'drift',
  'contradict',
] as const;

export type AlignmentStatus = (typeof ALIGNMENT_STATUSES)[number];

export type AlignmentMeta = {
  label: string;
  short: string;
  desc: string;
  pillBg: string;
  pillText: string;
  icon: LucideIcon;
};

export const ALIGNMENT_META: Record<AlignmentStatus, AlignmentMeta> = {
  aligned: {
    label: 'Selaras',
    short: 'Selaras',
    desc: 'Janji ini selaras dengan agenda RPJMN/RPJMD/Visi Misi.',
    pillBg: 'bg-jw-pill-mint-bg',
    pillText: 'text-jw-pill-mint-text',
    icon: CheckCircle2,
  },
  partial: {
    label: 'Selaras Sebagian',
    short: 'Sebagian',
    desc: 'Sebagian selaras, sebagian belum tercermin di rencana resmi.',
    pillBg: 'bg-jw-pill-marigold-bg',
    pillText: 'text-jw-pill-marigold-text',
    icon: CircleDot,
  },
  drift: {
    label: 'Bergeser',
    short: 'Bergeser',
    desc: 'Janji bergeser dari arah yang dijanjikan di dokumen resmi.',
    pillBg: 'bg-jw-pill-coral-bg',
    pillText: 'text-jw-pill-coral-text',
    icon: AlertTriangle,
  },
  contradict: {
    label: 'Berlawanan',
    short: 'Berlawanan',
    desc: 'Janji bertolak belakang dengan agenda resmi yang dirujuk.',
    pillBg: 'bg-jw-pill-coral-bg',
    pillText: 'text-jw-pill-coral-text',
    icon: XOctagon,
  },
};

const VALID_ALIGNMENT = new Set<string>(ALIGNMENT_STATUSES);

export function isAlignmentStatus(
  v: string | null | undefined,
): v is AlignmentStatus {
  return typeof v === 'string' && VALID_ALIGNMENT.has(v);
}

// ─── Editorial verification (2-tier badge + pending) ──────────────────

export const EDITORIAL_STATUSES = [
  'pending',
  'verified_curator',
  'curated_ai',
] as const;

export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];

export type EditorialMeta = {
  label: string;
  short: string;
  desc: string;
  pillBg: string;
  pillText: string;
  icon: LucideIcon;
};

export const EDITORIAL_META: Record<EditorialStatus, EditorialMeta> = {
  verified_curator: {
    label: 'Terverifikasi Kurator',
    short: 'Kurator',
    desc: 'Sudah diverifikasi manual oleh tim kurator Jubir Warga.',
    pillBg: 'bg-jw-pill-blue-bg',
    pillText: 'text-jw-pill-blue-text',
    icon: ShieldCheck,
  },
  curated_ai: {
    label: 'Kurasi AI',
    short: 'AI',
    desc: 'Diproses AI dan dirilis dengan transparansi proses — belum direview kurator.',
    pillBg: 'bg-jw-pill-grey-bg',
    pillText: 'text-jw-pill-grey-text',
    icon: Sparkles,
  },
  pending: {
    label: 'Menunggu Review',
    short: 'Pending',
    desc: 'Belum ditelaah kurator atau AI. Status akan diperbarui.',
    pillBg: 'bg-jw-pill-grey-bg',
    pillText: 'text-jw-pill-grey-text',
    icon: CircleDashed,
  },
};

const VALID_EDITORIAL = new Set<string>(EDITORIAL_STATUSES);

export function isEditorialStatus(
  v: string | null | undefined,
): v is EditorialStatus {
  return typeof v === 'string' && VALID_EDITORIAL.has(v);
}

// ─── Aggregate ────────────────────────────────────────────────────────

export type AlignmentBreakdown = Record<AlignmentStatus, number>;

export function emptyAlignmentBreakdown(): AlignmentBreakdown {
  return { aligned: 0, partial: 0, drift: 0, contradict: 0 };
}

// Topik pool — derived dari Sprint 3 seed (supabase/seed.sql) + RPJMN
// kategori turunan. Sprint 5+ migrate ke DB table `topik` saat scraping
// aktif. Order matters untuk filter chip (most-common first).
export const TOPIK_OPTIONS = [
  { id: 'Ekonomi', label: 'Ekonomi' },
  { id: 'Pendidikan', label: 'Pendidikan' },
  { id: 'Kesehatan', label: 'Kesehatan' },
  { id: 'Lingkungan', label: 'Lingkungan' },
  { id: 'Transportasi', label: 'Transportasi' },
  { id: 'UMKM', label: 'UMKM' },
  { id: 'Sampah', label: 'Sampah' },
  { id: 'Banjir', label: 'Banjir' },
  { id: 'Pelayanan', label: 'Pelayanan publik' },
  { id: 'Ketenagakerjaan', label: 'Ketenagakerjaan' },
  { id: 'Keamanan', label: 'Keamanan' },
] as const;

export type TopikId = (typeof TOPIK_OPTIONS)[number]['id'];

const VALID_TOPIK = new Set<string>(TOPIK_OPTIONS.map((t) => t.id));

export function isTopikId(v: string | null | undefined): v is TopikId {
  return typeof v === 'string' && VALID_TOPIK.has(v);
}

// Partai filter — reuse PARTAI_HARD_CODED dari constants.ts. Definisi
// di sini untuk filter validation.
const VALID_PARTAI = new Set<string>([
  'PDIP',
  'Gerindra',
  'Golkar',
  'NasDem',
  'PKB',
  'PKS',
  'Demokrat',
  'PAN',
  'PPP',
]);

export function isPartaiName(v: string | null | undefined): v is string {
  return typeof v === 'string' && VALID_PARTAI.has(v);
}
