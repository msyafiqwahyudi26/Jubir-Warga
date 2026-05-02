import { Check } from 'lucide-react';
import { calculatePercent, type PollingOptionVM } from '@/lib/aksi/constants';

type Props = {
  options: PollingOptionVM[];
  totalVotes: number;
  showAck?: boolean;
};

export function PollingResultBars({
  options,
  totalVotes,
  showAck = false,
}: Props) {
  const total = totalVotes > 0 ? totalVotes : 1;
  const sorted = [...options].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-3">
      {sorted.map((opt) => {
        const pct = calculatePercent(opt.votes, total);
        return (
          <div key={opt.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-jw-ink">{opt.label}</span>
              <span className="text-xs font-mono text-jw-muted">
                {opt.votes.toLocaleString('id-ID')} ({pct.toFixed(1)}%)
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${opt.label}: ${pct.toFixed(1)}%`}
            >
              <div
                className="h-full rounded-full bg-jw-coral transition-[width] duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      {showAck && (
        <p className="text-xs text-jw-pill-mint-text mt-4 text-center font-semibold inline-flex items-center justify-center gap-1 w-full">
          <Check size={12} aria-hidden /> Suaramu sudah tercatat. Terima kasih.
        </p>
      )}
    </div>
  );
}
