'use client';

import { Sparkles } from 'lucide-react';

type Props = {
  context?: string;
  position?: 'bottom-right' | 'bottom-center';
  className?: string;
};

export function NalaTriggerButton({
  context,
  position = 'bottom-right',
  className,
}: Props) {
  // Spec #5 wires this to the global Nala panel (Zustand store + Drawer).
  // For now: visible CTA only. No-op onClick keeps the focus ring + hover state
  // alive so the FAB can be visually audited in Beranda screenshots.
  const positionCls =
    position === 'bottom-center'
      ? 'left-1/2 -translate-x-1/2 bottom-6'
      : 'right-6 bottom-6';

  return (
    <button
      type="button"
      aria-label={`Tanya Nala${context ? ` ${context}` : ''}`}
      className={[
        'fixed z-30 inline-flex items-center gap-2',
        'rounded-full bg-jw-coral text-white',
        'px-5 py-3 min-h-11 min-w-11',
        'shadow-jw-lg hover:shadow-jw-md',
        'text-sm font-semibold tracking-tight',
        'transition-transform hover:scale-105 active:scale-[0.98]',
        positionCls,
        className ?? '',
      ].join(' ')}
    >
      <Sparkles size={18} aria-hidden />
      <span>Tanya Nala{context ? ` ${context}` : ''}</span>
    </button>
  );
}
