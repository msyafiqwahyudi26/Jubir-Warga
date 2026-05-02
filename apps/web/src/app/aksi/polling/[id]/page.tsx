import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, Vote } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { parsePollingOptions } from '@/lib/aksi/constants';
import { formatDeadline, isClosed } from '@/lib/aksi/deadline';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { PollingForm } from './polling-form';
import { PollingResultBars } from './polling-result-bars';

type RouteParams = Promise<{ id: string }>;

export default async function PollingDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [pollingRes, userRes] = await Promise.all([
    supabase.from('polling').select('*').eq('id', id).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  const polling = pollingRes.data;
  const user = userRes.data.user;

  if (!polling) notFound();

  let alreadyVoted = false;
  if (user) {
    const { count } = await supabase
      .from('polling_votes')
      .select('*', { count: 'exact', head: true })
      .match({ polling_id: id, user_id: user.id });
    alreadyVoted = (count ?? 0) > 0;
  }

  const options = parsePollingOptions(polling.options);
  const totalVotes = polling.total_votes ?? 0;
  const closed = isClosed(polling.deadline) || polling.status === 'closed';
  const showResults = alreadyVoted || closed;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/aksi"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Aksi
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-coral text-white text-xs font-bold px-2 py-0.5 mb-3">
          <Vote size={11} aria-hidden /> POLLING
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-jw-blue leading-snug">
          {polling.question}
        </h1>
        <p className="text-xs text-jw-muted mt-2">
          {totalVotes.toLocaleString('id-ID')} suara ·{' '}
          {formatDeadline(polling.deadline)}
        </p>
      </header>

      {showResults ? (
        <PollingResultBars
          options={options}
          totalVotes={totalVotes}
          showAck={alreadyVoted}
        />
      ) : (
        <PollingForm pollingId={polling.id} options={options} />
      )}

      <NalaTriggerButton context={`polling "${polling.question}"`} />
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
    .from('polling')
    .select('question')
    .eq('id', id)
    .maybeSingle();
  return { title: `${data?.question ?? 'Polling'} — Aksi Jubir Warga` };
}
