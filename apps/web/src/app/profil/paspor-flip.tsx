'use client';

import { useState } from 'react';
import { PASPOR_PAGES, type PasporPageId } from '@/lib/profil/constants';
import { PasporCover } from './paspor-cover';
import { PasporIdentitas } from './paspor-identitas';
import { PasporStempel, type EarnedBadge } from './paspor-stempel';
import { PasporVisa, type VisaEntry } from './paspor-visa';
import type { Database } from '@jw/data/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type Props = {
  profile: Pick<
    ProfileRow,
    | 'name'
    | 'username'
    | 'chapter_id'
    | 'level'
    | 'avatar_url'
    | 'created_at'
  >;
  jwNumber: string;
  badges: EarnedBadge[];
  visaEntries: VisaEntry[];
};

export function PasporFlip({ profile, jwNumber, badges, visaEntries }: Props) {
  const [page, setPage] = useState<PasporPageId>('cover');

  return (
    <div>
      <nav
        role="tablist"
        aria-label="Halaman paspor"
        className="flex items-center gap-2 mb-4 overflow-x-auto pb-1"
      >
        {PASPOR_PAGES.map((p) => {
          const active = page === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setPage(p.id)}
              className={`flex-shrink-0 rounded-jw-md px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? 'bg-jw-blue text-white'
                  : 'text-jw-ink hover:bg-jw-line/40'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </nav>

      <div role="tabpanel">
        {page === 'cover' && (
          <PasporCover jwNumber={jwNumber} username={profile.username} />
        )}
        {page === 'identitas' && (
          <PasporIdentitas profile={profile} jwNumber={jwNumber} />
        )}
        {page === 'stempel' && <PasporStempel badges={badges} />}
        {page === 'visa' && <PasporVisa entries={visaEntries} />}
      </div>
    </div>
  );
}
