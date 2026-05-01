'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Check } from 'lucide-react';
import { enrollKelasAction } from '../actions';

type Props = {
  kelasId: string;
  alreadyEnrolled: boolean;
  progress: number;
  firstModulHref?: string | null;
};

export function EnrollButton({
  kelasId,
  alreadyEnrolled,
  progress,
  firstModulHref,
}: Props) {
  const [pending, startTransition] = useTransition();

  if (alreadyEnrolled) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href={firstModulHref ?? '#silabus'}
          className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90"
        >
          {progress >= 100 ? 'Tinjau ulang' : `Lanjutkan (${progress}%)`}
        </Link>
        {progress >= 100 && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-jw-pill-mint-text bg-jw-pill-mint-bg px-2 py-0.5 rounded-jw-sm">
            <Check size={12} aria-hidden /> Selesai
          </span>
        )}
      </div>
    );
  }

  const handle = () => {
    if (pending) return;
    const fd = new FormData();
    fd.set('kelasId', kelasId);
    startTransition(async () => {
      await enrollKelasAction(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 disabled:opacity-50 transition"
    >
      {pending ? 'Mendaftar...' : 'Daftar gratis →'}
    </button>
  );
}
