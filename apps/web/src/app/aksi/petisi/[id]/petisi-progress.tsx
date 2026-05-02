import { Users } from 'lucide-react';
import { calculatePercent } from '@/lib/aksi/constants';

export function PetisiProgress({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  const pct = calculatePercent(current, target);

  return (
    <div className="rounded-jw-lg border border-jw-line bg-white p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-jw-blue">
          <Users size={14} aria-hidden />
          {current.toLocaleString('id-ID')} tanda tangan
        </span>
        <span className="text-xs text-jw-muted">
          dari target {target.toLocaleString('id-ID')} ·{' '}
          <span className="font-mono font-semibold text-jw-coral">
            {pct.toFixed(1)}%
          </span>
        </span>
      </div>
      <div
        className="h-3 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress petisi ${pct.toFixed(1)}%`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-jw-coral to-jw-marigold transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
