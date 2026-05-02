import type { Database } from '@jw/data/types';
import { dicebearAvatarUrl } from '@/lib/profil/constants';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type Props = {
  profile: Pick<
    ProfileRow,
    'name' | 'username' | 'chapter_id' | 'level' | 'avatar_url' | 'created_at'
  >;
  jwNumber: string;
};

function formatJoined(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PasporIdentitas({ profile, jwNumber }: Props) {
  const seed = profile.username ?? profile.name ?? 'warga';
  const avatar = profile.avatar_url ?? dicebearAvatarUrl(seed, 128);

  return (
    <div className="aspect-[5/7] w-full max-w-sm mx-auto rounded-jw-xl bg-jw-cream border-2 border-jw-line p-6 flex flex-col gap-5 shadow-jw-lg">
      <header className="flex items-center justify-between">
        <span className="font-hand text-jw-coral text-sm">— identitas</span>
        <span className="font-mono text-[10px] text-jw-muted">{jwNumber}</span>
      </header>

      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={`Avatar ${profile.name ?? profile.username ?? 'warga'}`}
          className="flex-shrink-0 w-20 h-20 rounded-full bg-white border-2 border-jw-blue object-cover"
        />
        <div className="min-w-0">
          <p className="font-display text-lg font-bold text-jw-blue leading-tight">
            {profile.name ?? profile.username ?? 'Warga'}
          </p>
          {profile.username && (
            <p className="text-xs text-jw-muted font-mono">@{profile.username}</p>
          )}
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Chapter" value={profile.chapter_id ?? '—'} />
        <Row
          label="Level"
          value={`Level ${profile.level ?? 1}`}
        />
        <Row label="Bergabung" value={formatJoined(profile.created_at)} />
      </dl>

      <p className="mt-auto text-[10px] text-jw-muted italic">
        Avatar default DiceBear identicon. Upload kustom Sprint 4.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="text-jw-muted w-24 flex-shrink-0">{label}</dt>
      <dd className="text-jw-ink font-semibold">{value}</dd>
    </div>
  );
}
