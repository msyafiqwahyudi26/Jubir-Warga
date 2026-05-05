import {
  ALIGNMENT_META,
  ALIGNMENT_STATUSES,
  type AlignmentBreakdown,
} from '@/lib/tagih/alignment';
import {
  alignmentPercent,
  alignmentTotal,
} from '@/lib/tagih/alignment-counter';

type Props = {
  breakdown: AlignmentBreakdown;
  pendingCount: number;
  className?: string;
};

// Aggregate stats grid — 4 card per alignment status + 1 transparency card
// untuk pending review. Total sebagai context line di atas.
export function AlignmentStats({ breakdown, pendingCount, className }: Props) {
  const reviewed = alignmentTotal(breakdown);
  const grandTotal = reviewed + pendingCount;

  return (
    <section
      aria-labelledby="alignment-stats-heading"
      className={['mt-8', className ?? ''].join(' ')}
    >
      <header className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2
            id="alignment-stats-heading"
            className="font-display text-xl font-bold text-jw-blue"
          >
            Selaras agenda resmi
          </h2>
          <p className="text-xs text-jw-muted mt-0.5">
            Janji ditelaah terhadap RPJMN, RPJMD, dan Visi Misi paslon
            (sumber resmi pemerintah).
          </p>
        </div>
        <p className="text-xs text-jw-muted">
          <strong className="font-semibold text-jw-ink">{reviewed}</strong> dari{' '}
          <strong className="font-semibold text-jw-ink">{grandTotal}</strong>{' '}
          janji sudah ditelaah
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ALIGNMENT_STATUSES.map((s) => {
          const meta = ALIGNMENT_META[s];
          const Icon = meta.icon;
          const count = breakdown[s];
          const pct = alignmentPercent(s, breakdown);
          return (
            <article
              key={s}
              className="rounded-jw-lg border border-jw-line bg-white p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-jw-sm w-6 h-6',
                    meta.pillBg,
                    meta.pillText,
                  ].join(' ')}
                >
                  <Icon size={14} aria-hidden />
                </span>
                <span className="text-xs font-semibold text-jw-ink">
                  {meta.label}
                </span>
              </div>
              <p className="font-display text-2xl font-bold text-jw-blue leading-none">
                {count}
              </p>
              <p className="text-xs text-jw-muted mt-1">
                {reviewed > 0 ? `${pct}% dari yang ditelaah` : 'belum ada'}
              </p>
            </article>
          );
        })}
      </div>

      {pendingCount > 0 && (
        <p className="mt-3 text-xs text-jw-muted">
          <strong className="font-semibold text-jw-ink">{pendingCount}</strong>{' '}
          janji belum ditelaah — antrean review kurator + AI berjalan rutin.
        </p>
      )}
    </section>
  );
}
