import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  isAlignmentStatus,
  isEditorialStatus,
  type ExtendedJanjiRow,
} from '@/lib/admin/types';
import { JanjiEditForm } from '@/components/admin/janji-edit-form';

type RouteParams = Promise<{ id: string }>;

export default async function AdminJanjiEditPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Editorial fields belum di Database type sampai post-migration typegen.
  // Cast unknown — RLS + check constraint enforce shape.
  const res = (await supabase
    .from('janji')
    .select(
      'id, janji_text, topik, status, source_url, source_quote, ' +
        'alignment_status, alignment_reasoning, source_doc_url, source_doc_page, ' +
        'editorial_status, editorial_reviewer_id, editorial_reviewed_at',
    )
    .eq('id', id)
    .maybeSingle()) as unknown as { data: ExtendedJanjiRow | null };

  if (!res.data) notFound();
  const j = res.data;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/janji"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke daftar janji
      </Link>

      <header className="rounded-jw-lg border border-jw-line bg-jw-blue/5 p-5">
        <span className="font-hand text-jw-coral text-base">— janji</span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-jw-blue mt-1 leading-snug">
          {j.janji_text}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
          {j.topik && (
            <span className="uppercase tracking-wider font-semibold">
              {j.topik}
            </span>
          )}
          <span>Pelaksanaan: {j.status ?? 'Belum'}</span>
          {j.source_url && (
            <a
              href={j.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-jw-coral hover:underline"
            >
              Sumber kutipan
            </a>
          )}
        </div>
        {j.source_quote && (
          <p className="mt-3 text-sm text-jw-ink/80 leading-relaxed whitespace-pre-wrap font-display italic border-l-2 border-jw-coral pl-3">
            {j.source_quote}
          </p>
        )}
      </header>

      <JanjiEditForm
        janjiId={j.id}
        janjiText={j.janji_text}
        currentAlignment={
          isAlignmentStatus(j.alignment_status) ? j.alignment_status : null
        }
        currentReasoning={j.alignment_reasoning}
        currentSourceDocUrl={j.source_doc_url}
        currentSourceDocPage={j.source_doc_page}
        currentEditorialStatus={
          isEditorialStatus(j.editorial_status) ? j.editorial_status : 'pending'
        }
      />
    </div>
  );
}
