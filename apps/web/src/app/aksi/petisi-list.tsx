import { createClient } from '@/lib/supabase/server';
import { PetisiRow } from './petisi-row';

export async function PetisiList() {
  const supabase = await createClient();
  const { data: petisi } = await supabase
    .from('petisi_with_progress')
    .select('*')
    .eq('status', 'active')
    .order('current_count', { ascending: false })
    .limit(6);

  if (!petisi || petisi.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">Belum ada petisi aktif.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {petisi.map((p) => (
        <PetisiRow key={p.id ?? Math.random()} petisi={p} />
      ))}
    </div>
  );
}
