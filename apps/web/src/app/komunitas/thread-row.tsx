import Link from 'next/link';
import { MessageCircle, MapPin } from 'lucide-react';
import type { Database } from '@jw/data/types';
import { formatRelative } from '@/lib/format';
import { VoteArrows } from './vote-arrows';

type ThreadView =
  Database['public']['Views']['threads_with_author']['Row'];

export function ThreadRow({ thread }: { thread: ThreadView }) {
  // View rows technically allow null id/title, but in practice the underlying
  // `threads` table guarantees both. Defensive guard so the row renders nothing
  // (instead of a broken link) if the view ever returns a malformed entry.
  if (!thread.id || !thread.title) return null;

  const score = (thread.upvotes ?? 0) - (thread.downvotes ?? 0);

  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-4 hover:border-jw-blue-soft/40 transition flex gap-3">
      <VoteArrows threadId={thread.id} initialScore={score} />
      <div className="flex-1 min-w-0">
        <Link
          href={`/komunitas/${thread.id}`}
          className="block font-display text-lg font-semibold text-jw-blue leading-snug hover:underline"
        >
          {thread.title}
        </Link>
        {thread.preview && (
          <p className="text-sm text-jw-ink/70 mt-1 line-clamp-2">
            {thread.preview}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
          <span className="font-semibold text-jw-blue">
            {thread.author_name ?? 'Anonim'}
          </span>
          {thread.chapter_name && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} aria-hidden /> {thread.chapter_name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={11} aria-hidden /> {thread.reply_count ?? 0}
          </span>
          <span>{formatRelative(thread.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
