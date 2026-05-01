import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, Award, Clock, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BETA_PRICING_NOTE, LEVEL_OPTIONS } from '@/lib/kelas/constants';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import type { KelasLevel } from '@jw/data/types';
import { EnrollButton } from './enroll-button';
import { SilabusList } from './silabus-list';

type RouteParams = Promise<{ id: string }>;

const KELAS_LEVELS: readonly KelasLevel[] = ['Pemula', 'Menengah', 'Lanjut'];

function isKelasLevel(v: string | null | undefined): v is KelasLevel {
  return typeof v === 'string' && (KELAS_LEVELS as readonly string[]).includes(v);
}

export default async function KelasDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [kelasRes, modulRes, userRes] = await Promise.all([
    supabase.from('kelas').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('kelas_modul')
      .select('*')
      .eq('kelas_id', id)
      .order('ord', { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const kelas = kelasRes.data;
  const modulList = modulRes.data ?? [];
  const user = userRes.data.user;

  if (!kelas) notFound();

  let enrollment: { progress: number | null; completed_at: string | null } | null =
    null;
  if (user) {
    const { data } = await supabase
      .from('kelas_enrollment')
      .select('progress, completed_at')
      .match({ kelas_id: id, user_id: user.id })
      .maybeSingle();
    enrollment = data;
  }

  const progress = enrollment?.progress ?? 0;
  const knownLevel = isKelasLevel(kelas.level) ? kelas.level : null;
  const levelOpt = knownLevel
    ? LEVEL_OPTIONS.find((l) => l.id === knownLevel)
    : null;
  const price = kelas.price_idr ?? 0;
  const firstModulId = modulList[0]?.id ?? null;
  const firstModulHref =
    firstModulId !== null ? `/kelas/${kelas.id}/modul/${firstModulId}` : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/kelas"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Kelas
      </Link>

      <header className="rounded-jw-xl bg-jw-blue text-jw-cream p-6 md:p-8 mb-8">
        {levelOpt && (
          <span className="inline-block rounded-jw-sm bg-jw-cream/15 text-jw-cream text-xs font-semibold px-2 py-0.5 mb-3">
            {levelOpt.label}
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
          {kelas.title}
        </h1>
        {kelas.description && (
          <p className="mt-3 text-sm md:text-base opacity-90 max-w-2xl">
            {kelas.description}
          </p>
        )}
        <div className="mt-5 flex items-center gap-4 text-sm flex-wrap">
          {kelas.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden /> {kelas.duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Award size={14} aria-hidden /> Sertifikat
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} aria-hidden /> {kelas.participant_count ?? 0}{' '}
            peserta
          </span>
        </div>
        <div className="mt-6">
          <EnrollButton
            kelasId={kelas.id}
            alreadyEnrolled={!!enrollment}
            progress={progress}
            firstModulHref={firstModulHref}
          />
          {price > 0 && (
            <p className="text-xs opacity-70 mt-3">
              <span className="line-through">
                Rp {price.toLocaleString('id-ID')}
              </span>{' '}
              · {BETA_PRICING_NOTE}
            </p>
          )}
        </div>
      </header>

      <section id="silabus">
        <h2 className="font-display text-2xl font-bold text-jw-blue mb-4">
          Silabus
        </h2>
        <SilabusList
          kelasId={kelas.id}
          modulList={modulList}
          enrolled={!!enrollment}
          progress={progress}
        />
      </section>

      <NalaTriggerButton context={`kelas "${kelas.title}"`} />
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
    .from('kelas')
    .select('title')
    .eq('id', id)
    .maybeSingle();
  return { title: `${data?.title ?? 'Kelas'} — Kelas Jubir Warga` };
}
