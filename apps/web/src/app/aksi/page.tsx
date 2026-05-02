import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { PollingFeaturedCard } from './polling-featured-card';
import { PetisiList } from './petisi-list';
import { KampanyePreview } from './kampanye-preview';

export const metadata: Metadata = {
  title: 'Aksi — Jubir Warga',
  description: 'Polling, petisi, kampanye warga.',
};

export default async function AksiPage() {
  const supabase = await createClient();

  const { data: polling } = await supabase
    .from('polling')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8 border-b border-jw-line pb-6">
        <span className="font-hand text-jw-coral text-base">— aksi warga</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Aksi
        </h1>
        <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
          Bukan cuma ngomong — kita kerjain.
        </p>
      </header>

      {polling && <PollingFeaturedCard polling={polling} className="mb-12" />}

      <section className="mb-12">
        <header className="mb-4">
          <span className="font-hand text-jw-coral text-base">— petisi</span>
          <h2 className="font-display text-2xl font-bold text-jw-blue">
            Petisi yang lagi jalan
          </h2>
        </header>
        <PetisiList />
      </section>

      <KampanyePreview className="mt-12" />

      <NalaTriggerButton context="tentang Aksi" />
    </div>
  );
}
