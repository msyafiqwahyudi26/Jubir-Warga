// Random distribution + concurrency helpers. Pure utility — no Supabase, no DOM.
import { faker } from './faker-id';

export function randInt(min: number, max: number): number {
  return faker.number.int({ min, max });
}

export function pickRandom<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pickRandom: empty array');
  return arr[faker.number.int({ min: 0, max: arr.length - 1 })] as T;
}

export function pickN<T>(arr: readonly T[], n: number): T[] {
  return faker.helpers.arrayElements(arr as T[], Math.min(n, arr.length));
}

/** Weighted choice over parallel items[] / weights[]. */
export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length !== weights.length) throw new Error('weightedPick: length mismatch');
  const total = weights.reduce((a, b) => a + b, 0);
  let r = faker.number.float({ min: 0, max: total });
  for (let i = 0; i < items.length; i++) {
    r -= weights[i] as number;
    if (r <= 0) return items[i] as T;
  }
  return items[items.length - 1] as T;
}

export type Tier = 'lurker' | 'medium' | 'power';

/** Build a tier list of total length = lurkers + mediums + powers, then shuffle. */
export function buildTierList(lurkers: number, mediums: number, powers: number): Tier[] {
  const arr: Tier[] = [];
  for (let i = 0; i < lurkers; i++) arr.push('lurker');
  for (let i = 0; i < mediums; i++) arr.push('medium');
  for (let i = 0; i < powers; i++) arr.push('power');
  return faker.helpers.shuffle(arr);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/** Run async work in batches with concurrency limit + per-batch delay. */
export async function batchParallel<I, O>(
  items: readonly I[],
  worker: (item: I, idx: number) => Promise<O>,
  opts: { concurrency: number; delayMs?: number; onBatch?: (done: number, total: number) => void }
): Promise<{ ok: O[]; failed: { idx: number; err: unknown }[] }> {
  const ok: O[] = [];
  const failed: { idx: number; err: unknown }[] = [];
  for (let i = 0; i < items.length; i += opts.concurrency) {
    const slice = items.slice(i, i + opts.concurrency);
    const results = await Promise.allSettled(slice.map((item, j) => worker(item, i + j)));
    for (let j = 0; j < results.length; j++) {
      const r = results[j] as PromiseSettledResult<O>;
      if (r.status === 'fulfilled') ok.push(r.value);
      else failed.push({ idx: i + j, err: r.reason });
    }
    opts.onBatch?.(Math.min(i + opts.concurrency, items.length), items.length);
    if (opts.delayMs && i + opts.concurrency < items.length) await sleep(opts.delayMs);
  }
  return { ok, failed };
}

/** Insert an array in chunks via supabase-js. Returns number successfully inserted. */
export async function bulkInsert<T extends Record<string, unknown>>(
  client: { from: (t: string) => { insert: (rows: T[]) => Promise<{ error: { message: string } | null }> } },
  table: string,
  rows: T[],
  chunkSize = 200
): Promise<{ inserted: number; failedChunks: { startIdx: number; err: string }[] }> {
  let inserted = 0;
  const failedChunks: { startIdx: number; err: string }[] = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await client.from(table).insert(chunk);
    if (error) {
      failedChunks.push({ startIdx: i, err: error.message });
    } else {
      inserted += chunk.length;
    }
  }
  return { inserted, failedChunks };
}
