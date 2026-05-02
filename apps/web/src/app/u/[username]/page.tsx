import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { generateJWNumber, currentJWYear } from '@/lib/profil/nomor-jw';
import { PasporFlip } from '@/app/profil/paspor-flip';
import {
  KontribusiStats,
  type KontribusiCounts,
} from '@/app/profil/kontribusi-stats';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import type { EarnedBadge } from '@/app/profil/paspor-stempel';
import type { VisaEntry } from '@/app/profil/paspor-visa';
import { ShareProfileButton } from './share-profile-button';

type RouteParams = Promise<{ username: string }>;

export default async function PublicProfilePage({
  params,
}: {
  params: RouteParams;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (!profile || profile.is_anonim) notFound();

  const jwNumber = generateJWNumber(profile.id, currentJWYear());

  const [
    badgesRes,
    threadsCount,
    karyaCount,
    petisiCount,
    janjiCount,
    kelasCount,
    kelasCompletedCount,
    recentThreads,
    recentKarya,
  ] = await Promise.all([
    supabase
      .from('user_badges')
      .select('badge_id, earned_at, badges(id, name, description)')
      .eq('user_id', profile.id),
    supabase
      .from('threads')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', profile.id),
    supabase
      .from('karya')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', profile.id),
    supabase
      .from('petisi_signatures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id),
    supabase
      .from('janji_pemantau')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id),
    supabase
      .from('kelas_enrollment')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id),
    supabase
      .from('kelas_enrollment')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .not('completed_at', 'is', null),
    supabase
      .from('threads')
      .select('id, title, created_at')
      .eq('author_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('karya')
      .select('id, title, published_at')
      .eq('author_id', profile.id)
      .order('published_at', { ascending: false })
      .limit(5),
  ]);

  const badges: EarnedBadge[] = (badgesRes.data ?? [])
    .map((row) => {
      const badge = Array.isArray(row.badges) ? row.badges[0] : row.badges;
      if (!badge) return null;
      return {
        id: badge.id,
        name: badge.name,
        description: badge.description ?? null,
        earnedAt: row.earned_at,
      };
    })
    .filter((b): b is EarnedBadge => b !== null);

  const counts: KontribusiCounts = {
    threads: threadsCount.count ?? 0,
    karya: karyaCount.count ?? 0,
    petisi: petisiCount.count ?? 0,
    janji: janjiCount.count ?? 0,
    kelas: kelasCount.count ?? 0,
    kelasCompleted: kelasCompletedCount.count ?? 0,
  };

  // Public visa: only public-author content (threads + karya). Petisi sign /
  // janji follow / kelas enroll = private actions, dihilangkan dari publik.
  const visaEntries: VisaEntry[] = [
    ...(recentThreads.data ?? []).map((t) => ({
      id: t.id,
      type: 'thread' as const,
      label: t.title,
      at: t.created_at,
    })),
    ...(recentKarya.data ?? []).map((k) => ({
      id: k.id,
      type: 'karya' as const,
      label: k.title,
      at: k.published_at,
    })),
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Beranda
      </Link>

      <header className="mb-8 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <span className="font-hand text-jw-coral text-base">— warga</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
            {profile.name ?? profile.username}
          </h1>
          <p className="text-sm text-jw-muted">
            @{profile.username} · Level {profile.level ?? 1} ·{' '}
            <span className="font-mono text-xs">{jwNumber}</span>
          </p>
          {profile.bio && (
            <p className="text-base text-jw-ink/80 mt-3 max-w-xl">
              {profile.bio}
            </p>
          )}
        </div>
        <ShareProfileButton username={profile.username ?? ''} />
      </header>

      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-jw-blue mb-3">
          KTP Warga
        </h2>
        <PasporFlip
          profile={profile}
          jwNumber={jwNumber}
          badges={badges}
          visaEntries={visaEntries}
        />
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-jw-blue mb-3">
          Kontribusi publik
        </h2>
        <KontribusiStats counts={counts} />
      </section>

      <NalaTriggerButton context={`profil @${profile.username}`} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — Profil Jubir Warga`,
    description: `KTP Warga + kontribusi publik @${username}`,
  };
}
