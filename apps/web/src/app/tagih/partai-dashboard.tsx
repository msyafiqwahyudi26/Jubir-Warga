import { PARTAI_HARD_CODED } from '@/lib/tagih/constants';

// Sprint 3: hard-coded mock percentages per Mas decision. Sprint 4 query
// aggregate view `janji_per_partai` (count by pejabat.partai join janji).
const MOCK_PERCENT: Record<string, number> = {
  pdip: 38,
  gerindra: 26,
  golkar: 18,
  nasdem: 9,
  pkb: 6,
  pks: 3,
};

export function PartaiDashboard() {
  return (
    <section className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— partai</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          Janji per partai
        </h3>
      </header>
      <div className="space-y-2">
        {PARTAI_HARD_CODED.map((p) => {
          const percent = MOCK_PERCENT[p.id] ?? 0;
          return (
            <div key={p.id}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-jw-ink">{p.name}</span>
                <span className="font-mono text-jw-muted">{percent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${percent}%`, background: p.hex }}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${p.name}: ${percent}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-jw-muted mt-3 italic">
        Detail page partai Sprint 4 (data agregat akurat menyusul).
      </p>
    </section>
  );
}
