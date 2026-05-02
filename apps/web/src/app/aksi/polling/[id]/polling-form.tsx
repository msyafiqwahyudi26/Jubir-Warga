'use client';

import { useState, useTransition } from 'react';
import { Square, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { votePollingAction } from '../../actions';
import type { PollingOptionVM } from '@/lib/aksi/constants';

type Props = {
  pollingId: string;
  options: PollingOptionVM[];
};

export function PollingForm({ pollingId, options }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (optionId: string) => {
    if (pending) return;
    setSelected(optionId);
    const fd = new FormData();
    fd.set('pollingId', pollingId);
    fd.set('optionId', optionId);
    startTransition(async () => {
      const result = await votePollingAction(fd);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSubmit(opt.id)}
            disabled={pending}
            className="w-full flex items-center gap-3 rounded-jw-lg border border-jw-line bg-white p-4 text-left hover:border-jw-coral hover:bg-jw-pill-coral-bg/30 transition disabled:opacity-50"
          >
            {isSelected ? (
              <CheckSquare
                size={20}
                aria-hidden
                className="text-jw-coral flex-shrink-0"
              />
            ) : (
              <Square
                size={20}
                aria-hidden
                className="text-jw-muted flex-shrink-0"
              />
            )}
            <span className="text-sm font-medium text-jw-ink">{opt.label}</span>
          </button>
        );
      })}
      <p className="text-xs text-jw-muted italic mt-3 text-center">
        Login dulu kalau belum. Satu suara per akun.
      </p>
    </div>
  );
}
