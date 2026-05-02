import { MessageCircle, BookOpen, Vote, Eye, GraduationCap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type VisaEntryType =
  | 'thread'
  | 'karya'
  | 'petisi'
  | 'janji'
  | 'kelas';

export type VisaEntry = {
  id: string;
  type: VisaEntryType;
  label: string;
  at: string | null;
};

const ICON: Record<VisaEntryType, LucideIcon> = {
  thread: MessageCircle,
  karya: BookOpen,
  petisi: Vote,
  janji: Eye,
  kelas: GraduationCap,
};

const TYPE_LABEL: Record<VisaEntryType, string> = {
  thread: 'Thread',
  karya: 'Karya',
  petisi: 'Tanda tangan petisi',
  janji: 'Pantau janji',
  kelas: 'Kelas',
};

function formatStamp(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function PasporVisa({ entries }: { entries: VisaEntry[] }) {
  const sorted = [...entries].sort((a, b) => {
    const ta = a.at ? new Date(a.at).getTime() : 0;
    const tb = b.at ? new Date(b.at).getTime() : 0;
    return tb - ta;
  });

  return (
    <div className="aspect-[5/7] w-full max-w-sm mx-auto rounded-jw-xl bg-jw-cream border-2 border-jw-line p-6 flex flex-col shadow-jw-lg">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— visa</span>
        <p className="font-display text-lg font-bold text-jw-blue">
          Jejak partisipasi
        </p>
      </header>

      {sorted.length === 0 ? (
        <p className="text-sm text-jw-muted italic">
          Belum ada jejak. Mulai dengan posting thread atau sign petisi.
        </p>
      ) : (
        <ul className="space-y-2 overflow-y-auto pr-1">
          {sorted.slice(0, 12).map((entry) => {
            const Icon = ICON[entry.type];
            return (
              <li
                key={`${entry.type}-${entry.id}`}
                className="flex items-start gap-3 rounded-jw-sm border border-jw-line bg-white px-3 py-2"
              >
                <Icon
                  size={14}
                  aria-hidden
                  className="text-jw-coral flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-jw-blue">
                    {TYPE_LABEL[entry.type]}
                  </p>
                  <p className="text-xs text-jw-ink line-clamp-2">
                    {entry.label}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-jw-muted flex-shrink-0">
                  {formatStamp(entry.at)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
