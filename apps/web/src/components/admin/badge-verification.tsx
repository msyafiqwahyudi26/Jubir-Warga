/**
 * VerificationBadge — pill badge untuk editorial_status.
 *
 * Reusable di:
 *   - /admin/janji list (per row indicator)
 *   - /admin/janji/[id] edit form (current state)
 *   - /tagih/* public-facing (Window B consume) trust signal
 *
 * Two-tier verification per Spec #34 + STRATEGY_PIVOT:
 *   - "Terverifikasi Kurator" (verified_curator): manual review oleh Mas/tim
 *   - "Kurasi AI" (curated_ai): auto-generated AI alignment, marked transparent
 *   - "Menunggu Review" (pending): default, belum diaudit
 *
 * Pakai Lucide icon (CheckCircle2 / Sparkles / Clock) — bukan native unicode
 * emoji per CLAUDE.md §5.6 anti-pattern.
 */
import { EDITORIAL_BADGE_META, type EditorialStatus } from '@/lib/admin/types';

type Size = 'sm' | 'md';

export function VerificationBadge({
  status,
  size = 'md',
  className = '',
}: {
  status: EditorialStatus;
  size?: Size;
  className?: string;
}) {
  const meta = EDITORIAL_BADGE_META[status];
  const Icon = meta.icon;

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1'
      : 'text-sm px-2.5 py-1 gap-1.5';
  const iconSize = size === 'sm' ? 11 : 13;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-jw-sm ${meta.pillBg} ${meta.pillText} ${sizeClasses} ${className}`}
      aria-label={`Status editorial: ${meta.label}`}
    >
      <Icon size={iconSize} aria-hidden />
      {meta.label}
    </span>
  );
}
