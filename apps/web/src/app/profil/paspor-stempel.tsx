import { Award } from 'lucide-react';

export type EarnedBadge = {
  id: string;
  name: string;
  description: string | null;
  earnedAt: string | null;
};

type Props = {
  badges: EarnedBadge[];
};

function formatEarned(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

export function PasporStempel({ badges }: Props) {
  return (
    <div className="aspect-[5/7] w-full max-w-sm mx-auto rounded-jw-xl bg-jw-cream border-2 border-jw-line p-6 flex flex-col shadow-jw-lg">
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-sm">— stempel</span>
        <p className="font-display text-lg font-bold text-jw-blue">
          {badges.length} stempel terkumpul
        </p>
      </header>

      {badges.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-sm text-jw-muted">
          <Award size={36} aria-hidden className="text-jw-line mb-3" />
          <p className="italic">
            Belum ada stempel. Mulai kontribusi (post thread, sign petisi, ikut
            kelas) buat dapet stempel pertama.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-3 overflow-y-auto">
          {badges.map((b) => (
            <li
              key={b.id}
              className="rounded-jw-md border border-jw-line bg-white p-3 text-center"
              title={b.description ?? b.name}
            >
              <Award
                size={24}
                aria-hidden
                className="text-jw-coral mx-auto mb-1"
              />
              <p className="text-[11px] font-semibold text-jw-blue line-clamp-2 leading-tight">
                {b.name}
              </p>
              {b.earnedAt && (
                <p className="text-[10px] text-jw-muted mt-0.5">
                  {formatEarned(b.earnedAt)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-auto pt-3 text-[10px] text-jw-muted italic">
        Custom SVG stempel set Sprint 4-5 (sekarang Lucide Award placeholder).
      </p>
    </div>
  );
}
