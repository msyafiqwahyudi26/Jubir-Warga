// ─────────────────────────────────────────────────────────
// Jubir Warga — Zod schemas (runtime validation untuk form)
// Pakai untuk validate input form (Lapor Baru, Submit Janji, dll)
// ─────────────────────────────────────────────────────────

import { z } from 'zod';

export const chapterIdSchema = z.enum(['jakarta','bandung','malang','surabaya','jogja','medan','makassar']);
export const topicIdSchema = z.enum(['politik','lingkungan','gender','mental','kerja','pendidikan','budaya','transport','lokal']);
export const threadFormatSchema = z.enum(['diskusi','tanya','pengalaman','polling','live']);
export const karyaTypeSchema = z.enum(['Tulisan','Vlog','Ilustrasi','Podcast','Zine']);
export const kelasLevelSchema = z.enum(['Pemula','Menengah','Lanjut']);
export const pejabatLevelSchema = z.enum(['Pusat','Provinsi','Kota','Kabupaten']);
export const janjiStatusSchema = z.enum(['Belum','Berjalan','Mandek','Ditepati','Diingkari']);
export const laporanCategorySchema = z.enum(['jalan','banjir','sampah','listrik','layanan','drainase','lain']);

// ── Form: Submit Thread ────────────────────────────────────
export const submitThreadSchema = z.object({
  title:     z.string().min(10, 'Judul minimal 10 karakter').max(200),
  body:      z.string().min(20, 'Body minimal 20 karakter').max(10000),
  topic_id:  topicIdSchema,
  chapter_id: chapterIdSchema.optional(),
  format:    threadFormatSchema.default('diskusi'),
});
export type SubmitThreadInput = z.infer<typeof submitThreadSchema>;

// ── Form: Submit Reply ─────────────────────────────────────
export const submitReplySchema = z.object({
  thread_id: z.string().uuid(),
  parent_id: z.string().uuid().optional(),
  body:      z.string().min(2, 'Reply minimal 2 karakter').max(5000),
});
export type SubmitReplyInput = z.infer<typeof submitReplySchema>;

// ── Form: Submit Karya ─────────────────────────────────────
export const submitKaryaSchema = z.object({
  type:    karyaTypeSchema,
  title:   z.string().min(10).max(200),
  body:    z.string().optional(),
  cover_url: z.string().url().optional(),
  meta:    z.string().optional(),
  tags:    z.array(z.string()).max(10).optional(),
});
export type SubmitKaryaInput = z.infer<typeof submitKaryaSchema>;

// ── Form: Submit Janji ─────────────────────────────────────
export const submitJanjiSchema = z.object({
  pejabat_id:   z.string().uuid(),
  topik:        z.string().min(2).max(50),
  janji_text:   z.string().min(30, 'Kutipan janji minimal 30 karakter').max(1000),
  source_url:   z.string().url('Sumber URL harus valid (mulai dengan http:// atau https://)'),
  source_quote: z.string().optional(),
  deadline:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline format YYYY-MM-DD').optional(),
});
export type SubmitJanjiInput = z.infer<typeof submitJanjiSchema>;

// ── Form: Submit Laporan ───────────────────────────────────
export const submitLaporanSchema = z.object({
  category:    laporanCategorySchema,
  title:       z.string().min(10, 'Judul minimal 10 karakter').max(200),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter').max(2000),
  location:    z.string().min(3).max(200),
  city:        chapterIdSchema,
  photo_url:   z.string().url().optional(),
  is_anonim:   z.boolean().default(false),
});
export type SubmitLaporanInput = z.infer<typeof submitLaporanSchema>;

// ── Form: Submit Petisi (init) ─────────────────────────────
export const submitPetisiSchema = z.object({
  title:    z.string().min(20).max(200),
  summary:  z.string().min(50).max(500),
  body:     z.string().min(100).max(10000),
  icon:     z.string().max(4).optional(),
  target:   z.number().int().min(100).max(1000000),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags:     z.array(z.string()).max(5),
});
export type SubmitPetisiInput = z.infer<typeof submitPetisiSchema>;

// ── Form: Update Profile ───────────────────────────────────
export const updateProfileSchema = z.object({
  name:       z.string().min(2).max(80),
  username:   z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/i, 'Username: huruf, angka, dash, underscore'),
  bio:        z.string().max(280).optional(),
  chapter_id: chapterIdSchema.optional(),
  avatar_url: z.string().url().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ── Form: Vote Polling ─────────────────────────────────────
export const votePollingSchema = z.object({
  polling_id: z.string().uuid(),
  option_id:  z.string().min(1),
});
export type VotePollingInput = z.infer<typeof votePollingSchema>;
