import Link from 'next/link';
import { Check, Lock, ArrowRight } from 'lucide-react';
import type { Database, ModulType } from '@jw/data/types';
import {
  MODUL_TYPE_LABEL,
  calcTargetProgress,
} from '@/lib/kelas/constants';

type ModulRow = Database['public']['Tables']['kelas_modul']['Row'];

const MODUL_TYPES: readonly ModulType[] = [
  'video',
  'workshop',
  'capstone',
  'reading',
];

function isModulType(v: string | null | undefined): v is ModulType {
  return typeof v === 'string' && (MODUL_TYPES as readonly string[]).includes(v);
}

type Props = {
  kelasId: string;
  modulList: ModulRow[];
  enrolled: boolean;
  progress: number;
};

export function SilabusList({ kelasId, modulList, enrolled, progress }: Props) {
  if (modulList.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">
        Silabus lagi disusun. Cek lagi nanti.
      </p>
    );
  }

  const total = modulList.length;

  return (
    <ol className="space-y-2">
      {modulList.map((m, i) => {
        const ord = m.ord ?? i + 1;
        const target = calcTargetProgress(ord, total);
        const isDone = enrolled && progress >= target;
        const knownType = isModulType(m.type) ? m.type : null;
        const typeLabel = knownType ? MODUL_TYPE_LABEL[knownType] : 'Modul';

        const Inner = (
          <div
            className={`flex items-center gap-3 rounded-jw-md border p-3 transition ${
              isDone
                ? 'border-jw-pill-mint-text/30 bg-jw-pill-mint-bg/30'
                : 'border-jw-line bg-white hover:border-jw-blue-soft/40'
            }`}
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-jw-pill-blue-bg text-jw-pill-blue-text text-xs font-mono font-bold flex items-center justify-center">
              {ord}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-jw-blue text-sm leading-snug">
                {m.title}
              </p>
              <p className="text-xs text-jw-muted mt-0.5">
                {typeLabel}
                {m.duration ? ` · ${m.duration}` : null}
              </p>
            </div>
            <span className="flex-shrink-0 text-jw-muted">
              {isDone ? (
                <Check
                  size={16}
                  aria-label="Selesai"
                  className="text-jw-pill-mint-text"
                />
              ) : enrolled ? (
                <ArrowRight size={16} aria-hidden />
              ) : (
                <Lock size={14} aria-label="Login dulu untuk akses" />
              )}
            </span>
          </div>
        );

        return (
          <li key={m.id}>
            {enrolled ? (
              <Link
                href={`/kelas/${kelasId}/modul/${m.id}`}
                className="block"
              >
                {Inner}
              </Link>
            ) : (
              <div className="opacity-80">{Inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
