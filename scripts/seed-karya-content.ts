/**
 * seed-karya-content.ts
 *
 * Idempotent runner untuk Spec #19: backfill karya body markdown dari draft
 * di docs/karya-content-drafts/ ke Supabase. Alternatif untuk
 * `psql -f supabase/karya_content_seed.sql` — kasih log per file dan
 * verifikasi pre/post body length.
 *
 * STRATEGY:
 * - 5 draft pertama target via `karya_id` UUID dari frontmatter (deterministik
 *   match supabase/seed.sql).
 * - 5 draft berikutnya target via `title` exact match (UUID demo seed
 *   regenerable, jadi pakai title).
 * - Idempotent guard: skip kalau body sudah ada (bukan null, bukan empty).
 *
 * Run:
 *   pnpm tsx scripts/seed-karya-content.ts
 *
 * Pre-req: .env.local di repo root harus ada SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *
 * APPROVAL GATE: Per Spec #19, jangan jalanin terhadap production sebelum Mas
 * approve via chat. Script ini disimpan ready-to-run, bukan auto-trigger.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY ||
  SUPABASE_SERVICE_ROLE_KEY.length < 200
) {
  console.error(
    'Missing/short SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DRAFTS_DIR = 'docs/karya-content-drafts';

type Draft = {
  file: string;
  karyaId: string | null; // null = match by title
  title: string;
  type: string;
  body: string;
};

// Minimal YAML frontmatter parser (no dep). Handles `key: "quoted"` and
// `key: bare` on single lines, separated by --- delimiters at file head.
function parseFrontmatter(raw: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const trimmed = raw.replace(/^﻿/, ''); // strip BOM
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: trimmed };
  const [, fmBlock, body] = match;
  const fm: Record<string, string> = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fm[m[1]] = value;
  }
  return { frontmatter: fm, body: body.trim() };
}

async function loadDrafts(): Promise<Draft[]> {
  const files = (await readdir(DRAFTS_DIR))
    .filter((f) => /^\d+.*\.md$/.test(f))
    .sort();
  const drafts: Draft[] = [];
  for (const file of files) {
    const raw = await readFile(join(DRAFTS_DIR, file), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(raw);
    if (!frontmatter.title) {
      console.warn(`  ⚠ ${file}: missing 'title' in frontmatter, skip`);
      continue;
    }
    const karyaIdRaw = frontmatter.karya_id ?? '';
    const karyaId =
      karyaIdRaw && karyaIdRaw !== 'TITLE_MATCH' ? karyaIdRaw : null;
    drafts.push({
      file,
      karyaId,
      title: frontmatter.title,
      type: frontmatter.type ?? 'Tulisan',
      body,
    });
  }
  return drafts;
}

type Result = { ok: boolean; reason: string; bodyLen: number };

async function applyDraft(d: Draft): Promise<Result> {
  // Read current row to verify guard. Single round-trip dapet body status.
  const matchExpr = d.karyaId
    ? supabase.from('karya').select('id, title, body').eq('id', d.karyaId)
    : supabase.from('karya').select('id, title, body').eq('title', d.title);

  const { data: rows, error: readErr } = await matchExpr;
  if (readErr) {
    return { ok: false, reason: `read error: ${readErr.message}`, bodyLen: 0 };
  }
  if (!rows || rows.length === 0) {
    return {
      ok: false,
      reason: d.karyaId
        ? `no row with id ${d.karyaId}`
        : `no row with title "${d.title}"`,
      bodyLen: 0,
    };
  }
  const targetIds = rows
    .filter((r) => !r.body || r.body.trim() === '')
    .map((r) => r.id);
  if (targetIds.length === 0) {
    return {
      ok: true,
      reason: `${rows.length} row(s) found but all already have body — skip (idempotent)`,
      bodyLen: 0,
    };
  }

  const { error: updErr } = await supabase
    .from('karya')
    .update({ body: d.body })
    .in('id', targetIds);

  if (updErr) {
    return { ok: false, reason: `update error: ${updErr.message}`, bodyLen: 0 };
  }
  return {
    ok: true,
    reason: `updated ${targetIds.length} row(s)`,
    bodyLen: d.body.length,
  };
}

async function main() {
  console.log(`\n[seed-karya-content] loading drafts from ${DRAFTS_DIR}/`);
  const drafts = await loadDrafts();
  console.log(`  found ${drafts.length} draft(s)\n`);

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const d of drafts) {
    const target = d.karyaId
      ? `id=${d.karyaId.slice(0, 8)}…`
      : `title="${d.title.slice(0, 50)}…"`;
    process.stdout.write(`  ${d.file} → ${target} … `);
    const res = await applyDraft(d);
    if (!res.ok) {
      console.log(`❌ ${res.reason}`);
      failCount++;
    } else if (res.bodyLen === 0) {
      console.log(`⏭  ${res.reason}`);
      skipCount++;
    } else {
      console.log(`✅ ${res.reason} (body ${res.bodyLen} chars)`);
      successCount++;
    }
  }

  console.log(
    `\n[seed-karya-content] done. ${successCount} updated, ${skipCount} skipped (already filled), ${failCount} failed.`,
  );
  if (failCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\n[seed-karya-content] fatal:', err);
  process.exit(1);
});
