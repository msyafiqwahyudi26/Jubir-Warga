'use client';

import { useState, type ReactNode } from 'react';
import { PROFILE_TABS, type ProfileTabId } from '@/lib/profil/constants';

type Props = {
  ktp: ReactNode;
  kontribusi: ReactNode;
  pengaturan: ReactNode;
};

export function ProfileTabs({ ktp, kontribusi, pengaturan }: Props) {
  const [tab, setTab] = useState<ProfileTabId>('ktp');

  return (
    <div>
      <nav
        role="tablist"
        aria-label="Tab profil"
        className="flex items-center gap-2 border-b border-jw-line mb-6 overflow-x-auto"
      >
        {PROFILE_TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold border-b-2 transition ${
                active
                  ? 'border-jw-coral text-jw-blue'
                  : 'border-transparent text-jw-muted hover:text-jw-ink'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div role="tabpanel">
        {tab === 'ktp' && ktp}
        {tab === 'kontribusi' && kontribusi}
        {tab === 'pengaturan' && pengaturan}
      </div>
    </div>
  );
}
