'use client';

import { useState, useTransition } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { voteThreadAction } from './actions';

type Props = {
  threadId: string;
  initialScore: number;
};

export function VoteArrows({ threadId, initialScore }: Props) {
  const [score, setScore] = useState(initialScore);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [pending, startTransition] = useTransition();
  const [bump, setBump] = useState<'up' | 'down' | null>(null);

  const handle = (direction: 'up' | 'down') => {
    if (pending) return;
    setBump(direction);
    window.setTimeout(() => setBump(null), 200);
    const isToggle = voted === direction;
    const optimisticScore = isToggle
      ? score + (direction === 'up' ? -1 : 1)
      : voted === null
        ? score + (direction === 'up' ? 1 : -1)
        : score + (direction === 'up' ? 2 : -2);
    setScore(optimisticScore);
    setVoted(isToggle ? null : direction);

    const fd = new FormData();
    fd.set('threadId', threadId);
    fd.set('direction', isToggle ? 'unvote' : direction);

    startTransition(async () => {
      const result = await voteThreadAction(fd);
      if (!result.ok) {
        setScore(initialScore);
        setVoted(null);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-0.5 w-9 flex-shrink-0">
      <button
        type="button"
        onClick={() => handle('up')}
        disabled={pending}
        aria-label="Upvote"
        className={`p-1 rounded-jw-sm transition-all duration-200 disabled:opacity-50 ${
          voted === 'up'
            ? 'text-jw-coral bg-jw-pill-coral-bg/60'
            : 'text-jw-muted hover:text-jw-coral'
        } ${bump === 'up' ? 'scale-110' : ''}`}
      >
        <ChevronUp size={20} aria-hidden />
      </button>
      <span
        className={`text-sm font-mono font-semibold ${
          voted === 'up' ? 'text-jw-coral' : 'text-jw-ink'
        }`}
      >
        {score}
      </span>
      <button
        type="button"
        onClick={() => handle('down')}
        disabled={pending}
        aria-label="Downvote"
        className={`p-1 rounded-jw-sm transition-all duration-200 disabled:opacity-50 ${
          voted === 'down'
            ? 'text-jw-blue-soft bg-jw-pill-blue-bg'
            : 'text-jw-muted hover:text-jw-blue-soft'
        } ${bump === 'down' ? 'scale-110' : ''}`}
      >
        <ChevronDown size={20} aria-hidden />
      </button>
    </div>
  );
}
