'use client';

import { Sparkles } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';

export function NalaPanelTrigger() {
  const openPanel = useNalaStore((s) => s.openPanel);

  return (
    <button
      type="button"
      onClick={() => openPanel()}
      aria-label="Buka chat dengan Nala"
      className="inline-flex items-center gap-1.5 rounded-jw-md border border-jw-coral bg-jw-pill-coral-bg/60 px-3 py-1.5 text-sm font-semibold text-jw-coral hover:bg-jw-pill-coral-bg transition"
    >
      <Sparkles size={14} aria-hidden />
      <span className="hidden sm:inline">Tanya Nala</span>
    </button>
  );
}
