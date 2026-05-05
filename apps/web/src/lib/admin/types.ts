/**
 * Admin module types — local augmentation untuk Spec #34 Migration 0004 LIGHT.
 *
 * Until `pnpm data:typegen` is re-run post-migration apply, the auto-generated
 * Database type doesn't include the new janji.alignment_* / editorial_* fields
 * or the editorial_review table. This module hand-types those fields so the
 * admin scaffold compiles without `any`.
 *
 * After migration apply + types regen: keep this file (the union types are
 * still useful for narrowing), but ExtendedJanjiRow can be replaced by the
 * generated row type directly.
 */
import {
  CheckCircle2,
  Sparkles,
  Clock,
  type LucideIcon,
} from 'lucide-react';

export const ALIGNMENT_STATUSES = [
  'aligned',
  'partial',
  'drift',
  'contradict',
] as const;
export type AlignmentStatus = (typeof ALIGNMENT_STATUSES)[number];

export const EDITORIAL_STATUSES = [
  'pending',
  'verified_curator',
  'curated_ai',
] as const;
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];

export const REVIEW_ACTIONS = ['approve', 'modify', 'reject', 'flag'] as const;
export type ReviewAction = (typeof REVIEW_ACTIONS)[number];

export const REVIEW_TARGET_TYPES = ['janji', 'verdict'] as const;
export type ReviewTargetType = (typeof REVIEW_TARGET_TYPES)[number];

// Janji row dengan alignment + editorial fields (post-Migration 0004).
export type ExtendedJanjiRow = {
  id: string;
  janji_text: string;
  topik: string | null;
  status: string | null;
  pejabat_id: string | null;
  source_url: string | null;
  source_quote: string | null;
  deadline: string | null;
  created_at: string | null;
  // 0004 LIGHT additions
  alignment_status: AlignmentStatus | null;
  alignment_reasoning: string | null;
  source_doc_url: string | null;
  source_doc_page: number | null;
  editorial_status: EditorialStatus | null;
  editorial_reviewer_id: string | null;
  editorial_reviewed_at: string | null;
};

export type EditorialReviewRow = {
  id: string;
  reviewer_id: string | null;
  target_type: ReviewTargetType;
  target_id: string;
  action: ReviewAction;
  notes: string | null;
  reviewed_at: string | null;
};

// ── Verification badge meta (Lucide icons, no native unicode emoji) ──
export const EDITORIAL_BADGE_META: Record<
  EditorialStatus,
  { label: string; icon: LucideIcon; pillBg: string; pillText: string }
> = {
  verified_curator: {
    label: 'Terverifikasi Kurator',
    icon: CheckCircle2,
    pillBg: 'bg-jw-pill-mint-bg',
    pillText: 'text-jw-pill-mint-text',
  },
  curated_ai: {
    label: 'Kurasi AI',
    icon: Sparkles,
    pillBg: 'bg-jw-pill-blue-bg',
    pillText: 'text-jw-pill-blue-text',
  },
  pending: {
    label: 'Menunggu Review',
    icon: Clock,
    pillBg: 'bg-jw-pill-grey-bg',
    pillText: 'text-jw-pill-grey-text',
  },
};

export const ALIGNMENT_LABELS: Record<AlignmentStatus, string> = {
  aligned: 'Selaras dengan dokumen',
  partial: 'Sebagian selaras',
  drift: 'Menyimpang',
  contradict: 'Bertentangan',
};

export function isAlignmentStatus(
  v: string | null | undefined,
): v is AlignmentStatus {
  return (
    typeof v === 'string' &&
    (ALIGNMENT_STATUSES as readonly string[]).includes(v)
  );
}

export function isEditorialStatus(
  v: string | null | undefined,
): v is EditorialStatus {
  return (
    typeof v === 'string' &&
    (EDITORIAL_STATUSES as readonly string[]).includes(v)
  );
}

export function isReviewAction(v: string | null | undefined): v is ReviewAction {
  return (
    typeof v === 'string' && (REVIEW_ACTIONS as readonly string[]).includes(v)
  );
}
