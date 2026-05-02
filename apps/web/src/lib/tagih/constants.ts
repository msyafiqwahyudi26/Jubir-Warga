import type { JanjiStatus, PejabatLevel } from '@jw/data/types';
import {
  CheckCircle,
  Loader,
  Pause,
  XCircle,
  Clock,
  type LucideIcon,
} from 'lucide-react';

// Lucide icon + brand-token classes per status. Replaces Phase 1 unicode
// symbols (✓ ↻ ⏸ ✕ ⌛) which rendered inconsistently across OS.
export const STATUS_META: Record<
  JanjiStatus,
  { label: string; pillBg: string; pillText: string; icon: LucideIcon }
> = {
  Ditepati: {
    label: 'Ditepati',
    pillBg: 'bg-jw-pill-mint-bg',
    pillText: 'text-jw-pill-mint-text',
    icon: CheckCircle,
  },
  Berjalan: {
    label: 'Berjalan',
    pillBg: 'bg-jw-pill-marigold-bg',
    pillText: 'text-jw-pill-marigold-text',
    icon: Loader,
  },
  Mandek: {
    label: 'Mandek',
    pillBg: 'bg-jw-pill-grey-bg',
    pillText: 'text-jw-pill-grey-text',
    icon: Pause,
  },
  Diingkari: {
    label: 'Diingkari',
    pillBg: 'bg-jw-pill-coral-bg',
    pillText: 'text-jw-pill-coral-text',
    icon: XCircle,
  },
  Belum: {
    label: 'Belum',
    pillBg: 'bg-jw-pill-blue-bg',
    pillText: 'text-jw-pill-blue-text',
    icon: Clock,
  },
};

export const JANJI_STATUSES: readonly JanjiStatus[] = [
  'Belum',
  'Berjalan',
  'Mandek',
  'Ditepati',
  'Diingkari',
];

export const LEVEL_OPTIONS: { id: PejabatLevel; label: string }[] = [
  { id: 'Pusat', label: 'Pusat' },
  { id: 'Provinsi', label: 'Provinsi' },
  { id: 'Kota', label: 'Kota/Kab.' },
];

export const PEJABAT_LEVELS: readonly PejabatLevel[] = [
  'Pusat',
  'Provinsi',
  'Kota',
  'Kabupaten',
];

// 5 cluster pulau MVP — Sprint 4 expand ke 38 provinsi.
export const PROVINSI_OPTIONS = [
  { id: 'sumatera', label: 'Sumatera', hex: '#3B4A8A' },
  { id: 'jawa', label: 'Jawa', hex: '#1A2256' },
  { id: 'kalimantan', label: 'Kalimantan', hex: '#F2B137' },
  { id: 'sulawesi', label: 'Sulawesi', hex: '#E8632B' },
  { id: 'papua', label: 'Maluku-Papua', hex: '#7FB69E' },
] as const;

// Sprint 3 hard-coded partai mapping (Mas decision). Sprint 4 migrate ke DB
// table `partai_politik` + view `janji_per_partai`.
export const PARTAI_HARD_CODED = [
  { id: 'pdip', name: 'PDIP', hex: '#C44434' },
  { id: 'gerindra', name: 'Gerindra', hex: '#1A2256' },
  { id: 'golkar', name: 'Golkar', hex: '#F2B137' },
  { id: 'nasdem', name: 'NasDem', hex: '#7FB69E' },
  { id: 'pkb', name: 'PKB', hex: '#3B4A8A' },
  { id: 'pks', name: 'PKS', hex: '#E8632B' },
] as const;

export function isJanjiStatus(v: string | null | undefined): v is JanjiStatus {
  return typeof v === 'string' && (JANJI_STATUSES as readonly string[]).includes(v);
}

export function isPejabatLevel(
  v: string | null | undefined,
): v is PejabatLevel {
  return typeof v === 'string' && (PEJABAT_LEVELS as readonly string[]).includes(v);
}

export type StatusBreakdown = Record<JanjiStatus, number>;

export function emptyStatusBreakdown(): StatusBreakdown {
  return { Belum: 0, Berjalan: 0, Mandek: 0, Ditepati: 0, Diingkari: 0 };
}

export function tagihStatPercent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((part / total) * 100)));
}
