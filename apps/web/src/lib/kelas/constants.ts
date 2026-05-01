import type { KelasLevel, ModulType } from '@jw/data/types';

export type LevelPillColor = 'mint' | 'marigold' | 'coral';

export const LEVEL_OPTIONS: {
  id: KelasLevel;
  label: string;
  color: LevelPillColor;
}[] = [
  { id: 'Pemula', label: 'Pemula', color: 'mint' },
  { id: 'Menengah', label: 'Menengah', color: 'marigold' },
  { id: 'Lanjut', label: 'Lanjut', color: 'coral' },
];

// Tailwind class lookup for level pill (JIT keeps these in the bundle).
export const LEVEL_PILL_CLASS: Record<LevelPillColor, string> = {
  mint: 'bg-jw-pill-mint-bg text-jw-pill-mint-text',
  marigold: 'bg-jw-pill-marigold-bg text-jw-pill-marigold-text',
  coral: 'bg-jw-pill-coral-bg text-jw-pill-coral-text',
};

export const MODUL_TYPE_LABEL: Record<ModulType, string> = {
  video: 'Video',
  workshop: 'Workshop',
  capstone: 'Capstone',
  reading: 'Bacaan',
};

// Sprint 3 MVP: ALL kelas FREE selama beta & alpha (decision Mas 2026-05-01).
// Sprint 6+ akan introduce pricing tier + payment Midtrans.
export const BETA_PRICING_NOTE = 'Gratis selamanya untuk pengguna awal';

// Idempotent mark-complete helper. Returns the progress percentage that
// finishing modul `ord` (1-indexed) implies for a kelas with `total` modul.
export function calcTargetProgress(ord: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((ord / total) * 100)));
}
