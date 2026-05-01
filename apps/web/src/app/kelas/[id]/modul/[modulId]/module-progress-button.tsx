'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { markModulCompleteAction } from '../../../actions';
import { calcTargetProgress } from '@/lib/kelas/constants';

type Props = {
  kelasId: string;
  modulId: string;
  modulOrd: number;
  totalModul: number;
  currentProgress: number;
  nextHref: string | null;
};

export function ModuleProgressButton({
  kelasId,
  modulId,
  modulOrd,
  totalModul,
  currentProgress,
  nextHref,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const target = calcTargetProgress(modulOrd, totalModul);
  const alreadyDone = currentProgress >= target;

  const handle = () => {
    if (pending || alreadyDone) return;
    const fd = new FormData();
    fd.set('kelasId', kelasId);
    fd.set('modulId', modulId);
    fd.set('modulOrd', String(modulOrd));
    fd.set('totalModul', String(totalModul));
    startTransition(async () => {
      const result = await markModulCompleteAction(fd);
      if (result.ok && nextHref) {
        router.push(nextHref);
      } else if (result.ok) {
        router.refresh();
      }
    });
  };

  if (alreadyDone) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-pill-mint-bg text-jw-pill-mint-text px-4 py-2 text-sm font-semibold">
        <Check size={14} aria-hidden /> Modul ini sudah selesai
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-4 py-2 text-sm font-semibold hover:bg-jw-coral/90 disabled:opacity-50 transition"
    >
      {pending ? 'Menyimpan...' : 'Tandai selesai →'}
    </button>
  );
}
