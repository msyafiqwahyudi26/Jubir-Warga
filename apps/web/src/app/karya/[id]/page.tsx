import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReadingView } from './reading-view';
import { NonTulisanPlaceholder } from './non-tulisan-placeholder';

type RouteParams = Promise<{ id: string }>;

export default async function KaryaDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: karya } = await supabase
    .from('karya')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!karya) notFound();

  if (karya.type === 'Tulisan') {
    return <ReadingView karya={karya} />;
  }
  return <NonTulisanPlaceholder karya={karya} />;
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('karya')
    .select('title, type')
    .eq('id', id)
    .maybeSingle();
  return {
    title: `${data?.title ?? 'Karya'} — ${data?.type ?? ''} — Jubir Warga`,
  };
}
