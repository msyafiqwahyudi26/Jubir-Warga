import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, ExternalLink, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { isJanjiStatus } from '@/lib/tagih/constants';
import { ALIGNMENT_META } from '@/lib/tagih/alignment';
import { lookupAlignmentSeed } from '@/lib/tagih/alignment-seed';
import { VerificationBadge } from '@/components/admin/badge-verification';
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

  // Frontend-first phase 1 enrichment via ALIGNMENT_SEED. Phase 2 akan
  // shift ke kolom janji.alignment_* setelah Migration 0004 LIGHT applied.
  const seed = lookupAlignmentSeed(janji.id);

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
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

      {/* Spec #24-LIGHT: alignment verdict + reasoning + source doc link */}
      <div className="my-6">
        <AlignmentDetail seed={seed} />
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

      <NalaTriggerButton context={`janji ${janji.janji_text.slice(0, 60)}`} />
    </main>
  );
}

// Alignment block per Spec #24-LIGHT. Inline di file ini karena spec strict
// scope: tagih/components/ hanya 3 file (filter-advanced, alignment-stats,
// janji-card-with-badge). Block ini route-specific.
function AlignmentDetail({
  seed,
}: {
  seed: ReturnType<typeof lookupAlignmentSeed>;
}) {
  if (!seed) {
    return (
      <section
        aria-labelledby="alignment-pending-heading"
        className="rounded-jw-lg border border-dashed border-jw-line bg-jw-cream/40 p-5"
      >
        <h3
          id="alignment-pending-heading"
          className="font-display text-base font-semibold text-jw-blue"
        >
          Selaras agenda resmi
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <VerificationBadge status="pending" size="sm" />
        </div>
        <p className="text-sm text-jw-ink/80 mt-3 leading-relaxed">
          Janji ini belum ditelaah terhadap RPJMN/RPJMD/Visi Misi. Tim editorial
          + AI sedang mereview batch baru — kalau kamu nemu rujukan dokumen
          resminya, drop di kolom evidence atau diskusikan di Komunitas.
        </p>
      </section>
    );
  }

  const meta = ALIGNMENT_META[seed.status];
  const Icon = meta.icon;

  return (
    <section
      aria-labelledby="alignment-verdict-heading"
      className="rounded-jw-lg border border-jw-line bg-white p-5"
    >
      <header className="flex items-start gap-3 flex-wrap">
        <span
          className={[
            'inline-flex items-center justify-center rounded-jw-md w-10 h-10 flex-shrink-0',
            meta.pillBg,
            meta.pillText,
          ].join(' ')}
          aria-hidden
        >
          <Icon size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <h3
            id="alignment-verdict-heading"
            className="font-display text-base font-semibold text-jw-blue leading-snug"
          >
            Selaras agenda resmi: {meta.label}
          </h3>
          <p className="text-xs text-jw-muted mt-0.5">{meta.desc}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <VerificationBadge status={seed.editorial_status} size="sm" />
          </div>
        </div>
      </header>

      <div className="mt-4 pt-4 border-t border-jw-line">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-jw-muted mb-2">
          Alasan verdict
        </h4>
        <p className="text-sm text-jw-ink leading-relaxed whitespace-pre-wrap">
          {seed.reasoning}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-jw-line">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-jw-muted mb-2">
          Sumber dokumen resmi
        </h4>
        <a
          href={seed.source_doc_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-jw-coral hover:underline break-all"
        >
          <ExternalLink size={14} aria-hidden />
          {seed.source_doc_url}
          {seed.source_doc_page ? ` · halaman ${seed.source_doc_page}` : ''}
        </a>
      </div>

      <p className="mt-4 pt-4 border-t border-jw-line text-[11px] text-jw-muted leading-relaxed">
        Mau koreksi atau tambah konteks? Diskusi di{' '}
        <Link
          href="/komunitas"
          className="font-semibold text-jw-coral hover:underline"
        >
          Komunitas
        </Link>{' '}
        atau lapor via /tagih/baru.
      </p>
    </section>
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
