import {
  MessageCircle,
  BookOpen,
  Vote,
  Eye,
  GraduationCap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type KontribusiCounts = {
  threads: number;
  karya: number;
  petisi: number;
  janji: number;
  kelas: number;
  kelasCompleted: number;
};

type Props = {
  counts: KontribusiCounts;
};

export function KontribusiStats({ counts }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <Card
        Icon={MessageCircle}
        label="Thread"
        value={counts.threads}
        accent="text-jw-pill-blue-text"
      />
      <Card
        Icon={BookOpen}
        label="Karya"
        value={counts.karya}
        accent="text-jw-pill-coral-text"
      />
      <Card
        Icon={Vote}
        label="Petisi ditandatangani"
        value={counts.petisi}
        accent="text-jw-pill-marigold-text"
      />
      <Card
        Icon={Eye}
        label="Janji dipantau"
        value={counts.janji}
        accent="text-jw-pill-mint-text"
      />
      <Card
        Icon={GraduationCap}
        label="Kelas"
        value={counts.kelas}
        sub={
          counts.kelasCompleted > 0
            ? `${counts.kelasCompleted} selesai`
            : undefined
        }
        accent="text-jw-pill-blue-text"
      />
    </div>
  );
}

function Card({
  Icon,
  label,
  value,
  sub,
  accent,
}: {
  Icon: LucideIcon;
  label: string;
  value: number;
  sub?: string;
  accent: string;
}) {
  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-jw-muted">
        <Icon size={14} aria-hidden className={accent} /> {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-bold text-jw-blue leading-none">
        {value.toLocaleString('id-ID')}
      </div>
      {sub && <p className="text-[11px] text-jw-muted mt-1">{sub}</p>}
    </article>
  );
}
