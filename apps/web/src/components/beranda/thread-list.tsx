import Link from 'next/link';
import { MessageCircle, ArrowUp, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatRelative } from '@/lib/format';
import { EmptyForum } from '@/components/illustrations/empty-forum';

export async function ThreadList() {
  const supabase = await createClient();

  // Read dari view `threads_with_author` (sudah include author_name + chapter_name)
  // Kalau database masih kosong (belum ada thread di-seed), tampilkan empty state.
  const { data: threads, error } = await supabase
    .from('threads_with_author')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(3);

  if (error) {
    return (
      <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
        Gagal memuat thread: {error.message}
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="rounded-jw-lg border border-dashed border-jw-line p-8 text-center flex flex-col items-center">
        <EmptyForum size={220} />
        <p className="font-hand text-xl text-jw-coral mt-2">— belum ada thread di Phase 2</p>
        <p className="text-sm text-jw-ink/70 mt-1">
          Database baru, belum ada user yang post. Jadi yang pertama!
        </p>
        <Link
          href="/komunitas"
          className="inline-block mt-4 rounded-jw-md bg-jw-blue px-4 py-2 text-sm font-semibold text-white hover:bg-jw-blue-soft"
        >
          Mulai diskusi pertama →
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {threads.map((t) => (
        <li
          key={t.id ?? Math.random()}
          className="rounded-jw-lg bg-white border border-jw-line p-5 hover:shadow-jw-md transition"
        >
          <div className="flex items-center gap-2 text-xs text-jw-ink/60 mb-2">
            <span className="font-medium text-jw-blue">{t.author_name ?? 'Anonim'}</span>
            {t.chapter_name && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {t.chapter_name}
                </span>
              </>
            )}
          </div>
          <Link
            href={`/komunitas/${t.id}`}
            className="block font-display text-lg font-semibold text-jw-blue leading-snug hover:text-jw-coral transition line-clamp-3"
          >
            {t.title}
          </Link>
          {t.preview && (
            <p className="text-sm text-jw-ink/70 mt-2 line-clamp-2">{t.preview}</p>
          )}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-jw-line text-xs text-jw-ink/60">
            <span className="inline-flex items-center gap-1">
              <ArrowUp size={14} /> {t.upvotes ?? 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle size={14} /> {t.reply_count ?? 0}
            </span>
            <span className="ml-auto">{formatRelative(t.created_at)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ThreadListSkeleton() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="rounded-jw-lg bg-white border border-jw-line p-5 animate-pulse"
        >
          <div className="h-3 w-1/3 bg-jw-pill-grey-bg rounded mb-3" />
          <div className="h-5 w-full bg-jw-pill-grey-bg rounded mb-2" />
          <div className="h-5 w-2/3 bg-jw-pill-grey-bg rounded mb-4" />
          <div className="h-3 w-3/4 bg-jw-pill-grey-bg rounded" />
        </li>
      ))}
    </ul>
  );
}
