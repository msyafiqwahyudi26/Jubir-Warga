/**
 * verify-karya-content.ts — one-shot post-apply verification for Spec #19.
 * Mirrors the SQL query Mas spec'd:
 *
 *   SELECT id, title, length(body) AS body_len, type FROM karya
 *    WHERE id LIKE '88888888-0001-%'
 *       OR title IN (...5 titles...)
 *    ORDER BY type, title;
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TITLE_MATCHES = [
  'Lima Cara Sederhana Pemuda Bisa Ikut Audit Anggaran Daerah',
  'Kenapa Generasi Kita Skeptis terhadap Demokrasi (dan Kenapa Itu Wajar)',
  'Surat untuk Diriku di Tahun 2030: Soal Politik dan Harapan',
  'Konstitusi dalam 8 Panel Komik',
  'Antara Aktivis dan Burnout: Cerita 3 Penggerak Komunitas',
];

async function main() {
  const SEED_IDS = [
    '88888888-0001-0000-0000-000000000001',
    '88888888-0001-0000-0000-000000000002',
    '88888888-0001-0000-0000-000000000003',
    '88888888-0001-0000-0000-000000000004',
    '88888888-0001-0000-0000-000000000005',
  ];
  const { data: byId } = await supabase
    .from('karya')
    .select('id, title, body, type')
    .in('id', SEED_IDS);

  const { data: byTitle } = await supabase
    .from('karya')
    .select('id, title, body, type')
    .in('title', TITLE_MATCHES);

  const seen = new Set<string>();
  const all = [...(byId ?? []), ...(byTitle ?? [])]
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .sort((a, b) => {
      const t = (a.type ?? '').localeCompare(b.type ?? '');
      return t !== 0 ? t : a.title.localeCompare(b.title);
    });

  console.log(
    `\n${'id'.padEnd(38)} ${'type'.padEnd(12)} ${'body_len'.padStart(8)}  title`,
  );
  console.log('-'.repeat(120));
  for (const r of all) {
    const len = (r.body ?? '').length;
    console.log(
      `${r.id.padEnd(38)} ${(r.type ?? '').padEnd(12)} ${String(len).padStart(8)}  ${r.title.slice(0, 60)}`,
    );
  }
  console.log(`\ntotal rows: ${all.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
