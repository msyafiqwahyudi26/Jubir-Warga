import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type Props = {
  prevHref: string | null;
  nextHref: string | null;
  kelasId: string;
};

export function ModuleNav({ prevHref, nextHref, kelasId }: Props) {
  return (
    <nav className="mt-8 flex items-center justify-between gap-3 border-t border-jw-line pt-6">
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline"
        >
          <ChevronLeft size={14} aria-hidden /> Modul sebelumnya
        </Link>
      ) : (
        <Link
          href={`/kelas/${kelasId}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-jw-muted hover:text-jw-coral"
        >
          <ChevronLeft size={14} aria-hidden /> Kembali ke detail kelas
        </Link>
      )}
      {nextHref ? (
        <Link
          href={nextHref}
          className="text-sm font-semibold text-jw-coral hover:underline"
        >
          Modul berikutnya →
        </Link>
      ) : (
        <Link
          href={`/kelas/${kelasId}`}
          className="text-sm font-semibold text-jw-coral hover:underline"
        >
          Selesai · ke ringkasan kelas →
        </Link>
      )}
    </nav>
  );
}
