import type { Database } from '@jw/data/types';
import { ReplyRow } from './reply-row';

type ThreadReply = Database['public']['Tables']['thread_replies']['Row'];

export function ReplyTree({ replies }: { replies: ThreadReply[] }) {
  if (replies.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">
        Belum ada balasan. Jadi yang pertama nimbrung.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {replies.map((r) => (
        <ReplyRow key={r.id} reply={r} />
      ))}
    </div>
  );
}
