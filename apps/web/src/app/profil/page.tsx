import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateJWNumber, currentJWYear } from '@/lib/profil/nomor-jw';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { ProfileTabs } from './profile-tabs';
import { PasporFlip } from './paspor-flip';
import { KontribusiStats, type KontribusiCounts } from './kontribusi-stats';
import { Pengaturan } from './pengaturan';
import { EditProfileForm } from './edit-profile-form';
import type { EarnedBadge } from './paspor-stempel';
import type { VisaEntry } from './paspor-visa';

export const metadata: Metadata = {
  title: 'Profil — Jubir Warga',
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/masuk?redirect=/profil');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) redirect('/masuk?redirect=/profil');

  const jwNumber = generateJWNumber(user.id, currentJWYear());

  // Parallel fetch: badges (joined) + 5 contribution counts + visa entries.
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
    recentPetisi,
    recentJanji,
    recentKelas,
  ] = await Promise.all([
    supabase
      .from('user_badges')
      .select('badge_id, earned_at, badges(id, name, description)')
      .eq('user_id', user.id),
    supabase
      .from('threads')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id),
    supabase
      .from('karya')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id),
    supabase
      .from('petisi_signatures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('janji_pemantau')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('kelas_enrollment')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('kelas_enrollment')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('completed_at', 'is', null),
    supabase
      .from('threads')
      .select('id, title, created_at')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('karya')
      .select('id, title, published_at')
      .eq('author_id', user.id)
      .order('published_at', { ascending: false })
      .limit(5),
    supabase
      .from('petisi_signatures')
      .select('petisi_id, signed_at, petisi(title)')
      .eq('user_id', user.id)
      .order('signed_at', { ascending: false })
      .limit(5),
    supabase
      .from('janji_pemantau')
      .select('janji_id, followed_at, janji(janji_text)')
      .eq('user_id', user.id)
      .order('followed_at', { ascending: false })
      .limit(5),
    supabase
      .from('kelas_enrollment')
      .select('kelas_id, enrolled_at, kelas(title)')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })
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
    ...(recentPetisi.data ?? []).map((p) => {
      const petisi = Array.isArray(p.petisi) ? p.petisi[0] : p.petisi;
      return {
        id: p.petisi_id,
        type: 'petisi' as const,
        label: petisi?.title ?? '(petisi terhapus)',
        at: p.signed_at,
      };
    }),
    ...(recentJanji.data ?? []).map((j) => {
      const janji = Array.isArray(j.janji) ? j.janji[0] : j.janji;
      return {
        id: j.janji_id,
        type: 'janji' as const,
        label: (janji?.janji_text ?? '(janji terhapus)').slice(0, 80),
        at: j.followed_at,
      };
    }),
    ...(recentKelas.data ?? []).map((k) => {
      const kelas = Array.isArray(k.kelas) ? k.kelas[0] : k.kelas;
      return {
        id: k.kelas_id,
        type: 'kelas' as const,
        label: kelas?.title ?? '(kelas terhapus)',
        at: k.enrolled_at,
      };
    }),
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <header className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <span className="font-hand text-jw-coral text-base">— akunmu</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue">
            {profile.name ?? profile.username ?? 'Warga'}
          </h1>
          <p className="text-sm text-jw-muted">
            {profile.username ? `@${profile.username} · ` : ''}Level{' '}
            {profile.level ?? 1}
            {' · '}
            <span className="font-mono text-xs">{jwNumber}</span>
          </p>
        </div>
        {profile.username && (
          <Link
            href={`/u/${profile.username}`}
            className="text-sm font-semibold text-jw-coral hover:underline"
          >
            Lihat profil publik →
          </Link>
        )}
      </header>

      <ProfileTabs
        ktp={
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-start">
            <EditProfileForm
              initialName={profile.name ?? ''}
              initialUsername={profile.username ?? ''}
              initialBio={profile.bio ?? ''}
              initialChapterId={profile.chapter_id ?? ''}
            />
            <PasporFlip
              profile={profile}
              jwNumber={jwNumber}
              badges={badges}
              visaEntries={visaEntries}
            />
          </div>
        }
        kontribusi={<KontribusiStats counts={counts} />}
        pengaturan={<Pengaturan />}
      />

      <NalaTriggerButton context="tentang Profil" />
    </div>
  );
}
