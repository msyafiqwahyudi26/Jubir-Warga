import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  MODUL_TYPE_LABEL,
  calcTargetProgress,
} from '@/lib/kelas/constants';
import type { ModulType } from '@jw/data/types';
import { ModuleBody } from './module-body';
import { ModuleProgressButton } from './module-progress-button';
import { ModuleNav } from './module-nav';

type RouteParams = Promise<{ id: string; modulId: string }>;

const MODUL_TYPES: readonly ModulType[] = [
  'video',
  'workshop',
  'capstone',
  'reading',
];

function isModulType(v: string | null | undefined): v is ModulType {
  return typeof v === 'string' && (MODUL_TYPES as readonly string[]).includes(v);
}

export default async function LessonPlayerPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id, modulId } = await params;
  const supabase = await createClient();

  const [kelasRes, modulListRes, userRes] = await Promise.all([
    supabase.from('kelas').select('id, title').eq('id', id).maybeSingle(),
    supabase
      .from('kelas_modul')
      .select('*')
      .eq('kelas_id', id)
      .order('ord', { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const kelas = kelasRes.data;
  const modulList = modulListRes.data ?? [];
  const user = userRes.data.user;

  if (!kelas) notFound();
  if (!user) {
    redirect(`/masuk?redirect=/kelas/${id}/modul/${modulId}`);
  }

  // Auth gate: enrollment required to play modul.
  const { data: enrollment } = await supabase
    .from('kelas_enrollment')
    .select('progress')
    .match({ kelas_id: id, user_id: user.id })
    .maybeSingle();

  if (!enrollment) {
    redirect(`/kelas/${id}`);
  }

  const idx = modulList.findIndex((m) => m.id === modulId);
  if (idx < 0) notFound();
  const modul = modulList[idx]!;

  const total = modulList.length;
  const ord = modul.ord ?? idx + 1;
  const progress = enrollment.progress ?? 0;
  const target = calcTargetProgress(ord, total);

  const prevModul = idx > 0 ? modulList[idx - 1] : null;
  const nextModul = idx < modulList.length - 1 ? modulList[idx + 1] : null;
  const prevHref = prevModul ? `/kelas/${id}/modul/${prevModul.id}` : null;
  const nextHref = nextModul ? `/kelas/${id}/modul/${nextModul.id}` : null;

  const knownType = isModulType(modul.type) ? modul.type : null;
  const typeLabel = knownType ? MODUL_TYPE_LABEL[knownType] : 'Modul';

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href={`/kelas/${id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> {kelas.title}
      </Link>

      <header className="mb-6">
        <p className="text-xs text-jw-muted">
          Modul {ord} dari {total} · {typeLabel}
          {modul.duration ? ` · ${modul.duration}` : null}
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-jw-blue leading-tight mt-1">
          {modul.title}
        </h1>
      </header>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-jw-muted mb-1">
          <span>Progress kelas</span>
          <span className="font-mono font-semibold text-jw-blue">
            {progress}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-jw-coral to-jw-marigold transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-jw-muted mt-1">
          Modul ini akan ngangkat progress jadi {target}%.
        </p>
      </div>

      <ModuleBody
        videoUrl={modul.video_url}
        transcript={modul.transcript}
      />

      <div className="mt-8 flex items-center justify-end">
        <ModuleProgressButton
          kelasId={id}
          modulId={modul.id}
          modulOrd={ord}
          totalModul={total}
          currentProgress={progress}
          nextHref={nextHref}
        />
      </div>

      <ModuleNav prevHref={prevHref} nextHref={nextHref} kelasId={id} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { modulId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('kelas_modul')
    .select('title')
    .eq('id', modulId)
    .maybeSingle();
  return { title: `${data?.title ?? 'Modul'} — Kelas Jubir Warga` };
}
