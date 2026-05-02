'use client';

import { useTransition } from 'react';
import { Check } from 'lucide-react';
import { signPetisiAction } from '../../actions';

type Props = {
  petisiId: string;
  alreadySigned: boolean;
};

export function SignPetisiButton({ petisiId, alreadySigned }: Props) {
  const [pending, startTransition] = useTransition();

  if (alreadySigned) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-pill-mint-bg text-jw-pill-mint-text px-5 py-2.5 text-sm font-semibold">
        <Check size={14} aria-hidden /> Sudah ditandatangani
      </span>
    );
  }

  const handle = () => {
    if (pending) return;
    const fd = new FormData();
    fd.set('petisiId', petisiId);
    startTransition(async () => {
      await signPetisiAction(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 disabled:opacity-50 transition"
    >
      {pending ? 'Mengirim...' : 'Tanda tangan petisi'}
    </button>
  );
}
