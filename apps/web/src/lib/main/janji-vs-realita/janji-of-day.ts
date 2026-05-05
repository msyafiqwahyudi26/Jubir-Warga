import type { Database } from '@jw/data/types';
import type { AlignmentStatus } from './constants';
import { isAlignmentStatus } from './constants';

type JanjiBase = Database['public']['Tables']['janji']['Row'];

// Window A schema (Migration 0004 LIGHT) extends `janji` dengan field-field di
// bawah. Sampai migration landed + types regenerate, kita pakai shape sendiri
// dengan optional + cast di query layer.
export type JanjiAlignmentExtras = {
  alignment_status: AlignmentStatus | null;
  alignment_reasoning: string | null;
  source_doc_url: string | null;
  source_doc_page: number | null;
  editorial_status: 'pending' | 'verified_curator' | 'curated_ai' | null;
};

export type JanjiWithAlignment = JanjiBase & JanjiAlignmentExtras;

const EPOCH = new Date('2026-01-01T00:00:00Z').getTime();

/**
 * Filter pool: hanya janji yang sudah punya alignment_status (verdict
 * generated) dan editorial_status verified_curator (admin approved).
 * Sebelum Window A migration + seed batch, pool kosong → empty state.
 */
export function eligibleForGame(
  janji: JanjiWithAlignment,
): boolean {
  return (
    isAlignmentStatus(janji.alignment_status) &&
    janji.editorial_status === 'verified_curator'
  );
}

/**
 * Deterministic pick: same date + same eligible pool = same target. Pool
 * harus stable-ordered (e.g. `.order('id', { ascending: true })`) supaya
 * rotasi reproducible cross-server-restart.
 */
export function pickJanjiOfDay(
  date: Date,
  pool: readonly JanjiWithAlignment[],
): JanjiWithAlignment | null {
  if (pool.length === 0) return null;
  const dayIndex = Math.floor(
    (date.getTime() - EPOCH) / (1000 * 60 * 60 * 24),
  );
  const idx = ((dayIndex % pool.length) + pool.length) % pool.length;
  return pool[idx] ?? null;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
