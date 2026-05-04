import type { Database } from '@jw/data/types';

export type PejabatRow = Database['public']['Tables']['pejabat']['Row'];

export function PejabatCard({ pejabat }: { pejabat: PejabatRow | null }) {
  if (!pejabat) {
    return (
      <article className="rounded-jw-lg border border-jw-line bg-white p-5">
        <p className="text-sm text-jw-muted italic">
          Info pejabat tidak tersedia.
        </p>
      </article>
    );
  }

  const skor = pejabat.skor ?? null;

  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— pejabat</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          {pejabat.nama}
        </h3>
      </header>
      <dl className="space-y-1.5 text-sm">
        {pejabat.jabatan && (
          <div className="flex gap-2">
            <dt className="text-jw-muted w-20 flex-shrink-0">Jabatan</dt>
            <dd className="text-jw-ink">{pejabat.jabatan}</dd>
          </div>
        )}
        {pejabat.partai && (
          <div className="flex gap-2">
            <dt className="text-jw-muted w-20 flex-shrink-0">Partai</dt>
            <dd className="text-jw-ink font-semibold">{pejabat.partai}</dd>
          </div>
        )}
        {pejabat.level && (
          <div className="flex gap-2">
            <dt className="text-jw-muted w-20 flex-shrink-0">Level</dt>
            <dd className="text-jw-ink">{pejabat.level}</dd>
          </div>
        )}
        {pejabat.dapil && (
          <div className="flex gap-2">
            <dt className="text-jw-muted w-20 flex-shrink-0">Dapil</dt>
            <dd className="text-jw-ink">{pejabat.dapil}</dd>
          </div>
        )}
        {skor !== null && (
          <div className="flex gap-2">
            <dt className="text-jw-muted w-20 flex-shrink-0">Skor</dt>
            <dd className="text-jw-ink font-mono font-semibold">{skor}/100</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
