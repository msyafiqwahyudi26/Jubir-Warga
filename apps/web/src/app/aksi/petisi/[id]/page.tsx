import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatDeadline } from '@/lib/aksi/deadline';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { PetisiBody } from './petisi-body';
import { PetisiProgress } from './petisi-progress';
import { SignPetisiButton } from './sign-petisi-button';
import { ShareButtons } from './share-buttons';

type RouteParams = Promise<{ id: string }>;

export default async function PetisiDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [petisiRes, userRes] = await Promise.all([
    supabase
      .from('petisi_with_progress')
      .select('*')
      .eq('id', id)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  const petisi = petisiRes.data;
  const user = userRes.data.user;

  if (!petisi || !petisi.id || !petisi.title) notFound();

  let alreadySigned = false;
  if (user) {
    const { count } = await supabase
      .from('petisi_signatures')
      .select('*', { count: 'exact', head: true })
      .match({ petisi_id: id, user_id: user.id });
    alreadySigned = (count ?? 0) > 0;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/aksi"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Aksi
      </Link>

      <header className="mb-6">
        <span className="inline-block rounded-jw-sm bg-jw-pill-coral-bg text-jw-pill-coral-text text-xs font-semibold px-2 py-0.5 mb-3">
          PETISI
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          {petisi.title}
        </h1>
        {petisi.summary && (
          <p className="text-base text-jw-ink/80 mt-3">{petisi.summary}</p>
        )}
        <p className="text-xs text-jw-muted mt-3">
          {formatDeadline(petisi.deadline)}
        </p>
      </header>

      <PetisiProgress
        current={petisi.current_count ?? 0}
        target={petisi.target ?? 1000}
      />

      <div className="my-6 flex items-center gap-3 flex-wrap">
        <SignPetisiButton petisiId={petisi.id} alreadySigned={alreadySigned} />
        <ShareButtons
          title={petisi.title}
          url={`/aksi/petisi/${petisi.id}`}
        />
      </div>

      <PetisiBody body={petisi.body ?? ''} />

      <NalaTriggerButton context={`petisi "${petisi.title}"`} />
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
    .from('petisi')
    .select('title')
    .eq('id', id)
    .maybeSingle();
  return { title: `${data?.title ?? 'Petisi'} — Aksi Jubir Warga` };
}
