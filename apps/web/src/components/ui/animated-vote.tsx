'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type Direction = 'up' | 'down';

type Props = {
  count: number;
  voted?: Direction | null;
  disabled?: boolean;
  onVote: (dir: Direction) => void;
  className?: string;
};

// Reusable vote arrow widget per Spec #17 (microinteractions: hover coral +
// active scale-110 bump). Komunitas (`thread-row`) keeps its own custom widget
// because it owns optimistic-state + Server Action wiring; this is the
// drop-in pattern for new surfaces (Karya likes, Polling reactions, etc.).
export function AnimatedVote({
  count,
  voted = null,
  disabled = false,
  onVote,
  className,
}: Props) {
  const [bump, setBump] = useState<Direction | null>(null);

  const handle = (dir: Direction) => {
    if (disabled) return;
    setBump(dir);
    onVote(dir);
    window.setTimeout(() => setBump(null), 200);
  };

  return (
    <div
      className={[
        'flex flex-col items-center gap-0.5 w-9 flex-shrink-0',
        className ?? '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => handle('up')}
        disabled={disabled}
        aria-label="Upvote"
        className={[
          'p-1 rounded-jw-sm transition-transform duration-200',
          voted === 'up' ? 'text-jw-coral' : 'text-jw-muted hover:text-jw-coral',
          bump === 'up' ? 'scale-110' : 'scale-100',
          disabled ? 'opacity-50' : 'active:scale-95',
        ].join(' ')}
      >
        <ChevronUp size={20} aria-hidden />
      </button>
      <span
        className={[
          'text-sm font-mono font-semibold',
          voted === 'up'
            ? 'text-jw-coral'
            : voted === 'down'
              ? 'text-jw-blue-soft'
              : 'text-jw-ink',
        ].join(' ')}
      >
        {count}
      </span>
      <button
        type="button"
        onClick={() => handle('down')}
        disabled={disabled}
        aria-label="Downvote"
        className={[
          'p-1 rounded-jw-sm transition-transform duration-200',
          voted === 'down'
            ? 'text-jw-blue-soft'
            : 'text-jw-muted hover:text-jw-blue-soft',
          bump === 'down' ? 'scale-110' : 'scale-100',
          disabled ? 'opacity-50' : 'active:scale-95',
        ].join(' ')}
      >
        <ChevronDown size={20} aria-hidden />
      </button>
    </div>
  );
}
