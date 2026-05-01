import type { Database } from '@jw/data/types';
import { formatRelative } from '@/lib/format';

type ThreadReply = Database['public']['Tables']['thread_replies']['Row'];

export function ReplyRow({ reply }: { reply: ThreadReply }) {
  return (
    <article className="rounded-jw-md border border-jw-line bg-white p-4">
      <p className="text-xs text-jw-muted mb-2">
        {formatRelative(reply.created_at)}
      </p>
      <p className="text-sm text-jw-ink whitespace-pre-wrap">{reply.body}</p>
    </article>
  );
}
