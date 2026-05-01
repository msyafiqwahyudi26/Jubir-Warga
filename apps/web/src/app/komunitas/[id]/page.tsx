import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatRelative } from '@/lib/format';
import { VoteArrows } from '../vote-arrows';
import { ThreadBody } from './thread-body';
import { ReplyTree } from './reply-tree';
import { ReplyForm } from './reply-form';
import { RingkasNalaButton } from './ringkas-nala-button';

type RouteParams = Promise<{ id: string }>;

export default async function ThreadDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: thread }, { data: replies }] = await Promise.all([
    supabase
      .from('threads_with_author')
      .select('*')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('thread_replies')
      .select('*')
      .eq('thread_id', id)
      .order('created_at', { ascending: true }),
  ]);

  if (!thread || !thread.id || !thread.title) notFound();

  const score = (thread.upvotes ?? 0) - (thread.downvotes ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/komunitas"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Komunitas
      </Link>

      <article className="rounded-jw-xl border border-jw-line bg-white p-6 md:p-8 mb-6">
        <header className="flex items-start gap-4 mb-4">
          <VoteArrows threadId={thread.id} initialScore={score} />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-jw-blue leading-snug">
              {thread.title}
            </h1>
            <p className="text-sm text-jw-muted mt-2">
              <span className="font-semibold text-jw-blue">
                {thread.author_name ?? 'Anonim'}
              </span>
              {thread.chapter_name && <> · {thread.chapter_name}</>}
              <> · {formatRelative(thread.created_at)}</>
            </p>
          </div>
          <RingkasNalaButton threadTitle={thread.title} />
        </header>

        <ThreadBody body={thread.body ?? ''} />
      </article>

      <section className="mb-6">
        <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
          {replies?.length ?? 0} balasan
        </h2>
        <ReplyTree replies={replies ?? []} />
      </section>

      <ReplyForm threadId={thread.id} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('threads_with_author')
    .select('title')
    .eq('id', id)
    .maybeSingle();
  return {
    title: `${data?.title ?? 'Thread'} — Komunitas Jubir Warga`,
  };
}
