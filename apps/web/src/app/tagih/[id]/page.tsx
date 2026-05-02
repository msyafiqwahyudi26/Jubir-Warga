import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { isJanjiStatus } from '@/lib/tagih/constants';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { StatusPill } from '../status-pill';
import { JanjiBody } from './janji-body';
import { PejabatCard } from './pejabat-card';
import { StatusTimeline } from './status-timeline';
import { EvidenceList } from './evidence-list';
import { FollowButton } from './follow-button';
import { ShareButtons } from './share-buttons';

type RouteParams = Promise<{ id: string }>;

export default async function JanjiDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [janjiRes, evidenceRes, userRes] = await Promise.all([
    supabase.from('janji').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('janji_evidence')
      .select('*')
      .eq('janji_id', id)
      .order('uploaded_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const janji = janjiRes.data;
  const evidence = evidenceRes.data ?? [];
  const user = userRes.data.user;

  if (!janji) notFound();

  const [pejabatRes, followRes] = await Promise.all([
    janji.pejabat_id
      ? supabase
          .from('pejabat')
          .select('*')
          .eq('id', janji.pejabat_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from('janji_pemantau')
          .select('*', { count: 'exact', head: true })
          .match({ janji_id: id, user_id: user.id })
      : Promise.resolve({ count: 0 }),
  ]);

  const pejabat = pejabatRes.data ?? null;
  const followedCount =
    'count' in followRes && typeof followRes.count === 'number'
      ? followRes.count
      : 0;
  const initiallyFollowed = followedCount > 0;

  const status = isJanjiStatus(janji.status) ? janji.status : 'Belum';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/tagih"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Tagih Janji
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <StatusPill status={status} />
          <span className="inline-flex items-center gap-1 text-xs text-jw-muted">
            <Users size={11} aria-hidden /> {janji.pemantau_count ?? 0} pemantau
          </span>
        </div>
        <JanjiBody
          topik={janji.topik}
          janjiText={janji.janji_text}
          sourceQuote={janji.source_quote}
          sourceUrl={janji.source_url}
          deadline={janji.deadline}
        />
      </header>

      <div className="my-6 flex items-center gap-3 flex-wrap">
        <FollowButton janjiId={janji.id} initiallyFollowed={initiallyFollowed} />
        <ShareButtons
          title={janji.janji_text.slice(0, 80)}
          url={`/tagih/${janji.id}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PejabatCard pejabat={pejabat} />
        <StatusTimeline
          status={status}
          verifiedAt={janji.verified_at}
          createdAt={janji.created_at}
        />
      </div>

      <div className="mt-4">
        <EvidenceList evidence={evidence} />
      </div>

      <NalaTriggerButton context={`janji "${janji.janji_text.slice(0, 60)}"`} />
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
    .from('janji')
    .select('janji_text')
    .eq('id', id)
    .maybeSingle();
  const title = data?.janji_text
    ? `${data.janji_text.slice(0, 60)}…`
    : 'Janji';
  return { title: `${title} — Tagih Janji Jubir Warga` };
}
