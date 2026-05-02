'use client';

import { useTransition, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { followJanjiAction, unfollowJanjiAction } from '../actions';

type Props = {
  janjiId: string;
  initiallyFollowed: boolean;
};

export function FollowButton({ janjiId, initiallyFollowed }: Props) {
  const [followed, setFollowed] = useState(initiallyFollowed);
  const [pending, startTransition] = useTransition();

  const handle = () => {
    if (pending) return;
    const next = !followed;
    setFollowed(next);
    const fd = new FormData();
    fd.set('janjiId', janjiId);
    startTransition(async () => {
      const result = await (next
        ? followJanjiAction(fd)
        : unfollowJanjiAction(fd));
      if (!result.ok) {
        // Revert optimistic UI on server error.
        setFollowed(!next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      aria-pressed={followed}
      className={`inline-flex items-center gap-1.5 rounded-jw-md px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
        followed
          ? 'bg-jw-pill-mint-bg text-jw-pill-mint-text border border-jw-mint/30 hover:bg-jw-pill-mint-bg/70'
          : 'bg-jw-coral text-white hover:bg-jw-coral/90'
      }`}
    >
      {followed ? (
        <>
          <EyeOff size={14} aria-hidden /> Sedang dipantau
        </>
      ) : (
        <>
          <Eye size={14} aria-hidden /> Pantau janji ini
        </>
      )}
    </button>
  );
}
