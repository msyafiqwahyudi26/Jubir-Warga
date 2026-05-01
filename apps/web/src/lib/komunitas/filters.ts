import type { TopicId, ChapterId, ThreadFormat } from '@jw/data/types';
import { TOPIK_OPTIONS, LOKASI_OPTIONS, FORMAT_OPTIONS } from './constants';

export type KomunitasFilter = {
  topic?: TopicId;
  chapter?: ChapterId;
  format?: ThreadFormat;
  hot?: boolean;
  page?: number;
};

const VALID_TOPICS = new Set<string>(TOPIK_OPTIONS.map((o) => o.id));
const VALID_LOKASI = new Set<string>(LOKASI_OPTIONS.map((o) => o.id));
const VALID_FORMATS = new Set<string>(FORMAT_OPTIONS.map((o) => o.id));

export function parseFilterFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): KomunitasFilter {
  const f: KomunitasFilter = {};
  const topic = typeof params.topic === 'string' ? params.topic : undefined;
  const chapter = typeof params.chapter === 'string' ? params.chapter : undefined;
  const format = typeof params.format === 'string' ? params.format : undefined;
  const hot = params.hot === 'true' || params.hot === '1';
  const pageStr = typeof params.page === 'string' ? params.page : undefined;

  if (topic && VALID_TOPICS.has(topic)) f.topic = topic as TopicId;
  if (chapter && VALID_LOKASI.has(chapter)) f.chapter = chapter as ChapterId;
  if (format && VALID_FORMATS.has(format)) f.format = format as ThreadFormat;
  if (hot) f.hot = true;
  if (pageStr) {
    const n = parseInt(pageStr, 10);
    if (Number.isFinite(n) && n >= 1) f.page = n;
  }
  return f;
}

export function buildFilterUrl(filter: KomunitasFilter): string {
  const params = new URLSearchParams();
  if (filter.topic) params.set('topic', filter.topic);
  if (filter.chapter) params.set('chapter', filter.chapter);
  if (filter.format) params.set('format', filter.format);
  if (filter.hot) params.set('hot', 'true');
  if (filter.page && filter.page > 1) params.set('page', String(filter.page));
  const qs = params.toString();
  return qs ? `/komunitas?${qs}` : '/komunitas';
}

export function toggleFilter<K extends keyof KomunitasFilter>(
  current: KomunitasFilter,
  key: K,
  value: KomunitasFilter[K],
): KomunitasFilter {
  const next: KomunitasFilter = { ...current };
  if (next[key] === value) {
    delete next[key];
  } else {
    next[key] = value;
  }
  delete next.page;
  return next;
}
