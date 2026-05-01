'use client';

import { Sparkles } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';

export function RingkasNalaButton({ threadTitle }: { threadTitle: string }) {
  const openPanel = useNalaStore((s) => s.openPanel);
  const addMessage = useNalaStore((s) => s.addMessage);

  const handle = () => {
    openPanel(`thread "${threadTitle}"`);
    addMessage({
      role: 'user',
      content: `Ringkas thread ini buat aku: "${threadTitle}"`,
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      title="Ringkas thread ini via Nala"
      className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-jw-md border border-jw-coral bg-jw-pill-coral-bg/60 px-3 py-1.5 text-xs font-semibold text-jw-coral hover:bg-jw-pill-coral-bg transition"
    >
      <Sparkles size={12} aria-hidden />
      Ringkas via Nala
    </button>
  );
}
