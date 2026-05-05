'use server';

/**
 * Server Actions untuk editorial moderation /admin/janji/[id].
 *
 * Each action:
 *   1. requireAdmin() — RLS layer 1 (redirect non-admin)
 *   2. Zod-validate input — RLS layer 2 (typed boundary)
 *   3. Update janji editorial_* fields
 *   4. Insert ke editorial_review log (audit trail)
 *   5. revalidatePath /admin/janji + /tagih/[id] (downstream cache)
 *
 * RLS at DB level: "Admin can verify janji" policy (existing 0001) +
 * "admins_write_review_log" (new 0004) gate the writes.
 */
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from './role-check';
import { logEditorialReview } from './audit-logger';
import {
  ALIGNMENT_STATUSES,
  EDITORIAL_STATUSES,
  type AlignmentStatus,
  type EditorialStatus,
} from './types';

export type ModerationActionState = {
  ok: boolean;
  message: string;
};

const approveSchema = z.object({
  janjiId: z.string().uuid(),
  editorialStatus: z.enum(EDITORIAL_STATUSES),
  notes: z.string().max(500).optional(),
});

const modifySchema = z.object({
  janjiId: z.string().uuid(),
  alignmentStatus: z.enum(ALIGNMENT_STATUSES),
  alignmentReasoning: z.string().min(20).max(2000),
  sourceDocUrl: z.string().url().optional().or(z.literal('')),
  sourceDocPage: z.coerce.number().int().min(1).optional().or(z.literal('')),
  editorialStatus: z.enum(EDITORIAL_STATUSES),
  notes: z.string().max(500).optional(),
});

const rejectSchema = z.object({
  janjiId: z.string().uuid(),
  notes: z.string().min(10).max(500),
});

type JanjiUpdatePayload = {
  alignment_status?: AlignmentStatus;
  alignment_reasoning?: string;
  source_doc_url?: string | null;
  source_doc_page?: number | null;
  editorial_status?: EditorialStatus;
  editorial_reviewer_id?: string;
  editorial_reviewed_at?: string;
};

async function updateJanji(janjiId: string, payload: JanjiUpdatePayload) {
  const supabase = await createClient();
  // Cast `as never` — alignment/editorial fields belum di Database type sampai
  // post-migration typegen. RLS + check constraint enforce shape di DB level.
  const { error } = await (
    supabase.from('janji') as unknown as {
      update: (v: JanjiUpdatePayload) => {
        eq: (
          col: string,
          v: string,
        ) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update(payload)
    .eq('id', janjiId);
  return error;
}

/**
 * Approve action — set editorial_status (verified_curator atau curated_ai)
 * tanpa edit alignment fields. Quick action button.
 */
export async function approveJanjiAction(
  _prev: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const ctx = await requireAdmin();

  const parsed = approveSchema.safeParse({
    janjiId: formData.get('janjiId'),
    editorialStatus: formData.get('editorialStatus'),
    notes: formData.get('notes') ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: 'Input tidak valid: ' + parsed.error.message };
  }

  const updErr = await updateJanji(parsed.data.janjiId, {
    editorial_status: parsed.data.editorialStatus,
    editorial_reviewer_id: ctx.userId,
    editorial_reviewed_at: new Date().toISOString(),
  });
  if (updErr) {
    return { ok: false, message: 'Gagal update janji: ' + updErr.message };
  }

  const log = await logEditorialReview({
    reviewerId: ctx.userId,
    targetType: 'janji',
    targetId: parsed.data.janjiId,
    action: 'approve',
    notes: parsed.data.notes ?? null,
  });
  if (!log.ok) {
    return {
      ok: false,
      message:
        'Janji updated tapi gagal log audit trail: ' + log.error,
    };
  }

  revalidatePath(`/admin/janji/${parsed.data.janjiId}`);
  revalidatePath('/admin/janji');
  revalidatePath(`/tagih/${parsed.data.janjiId}`);
  return { ok: true, message: 'Janji diapprove dan dicatat di audit log.' };
}

/**
 * Modify action — set alignment + reasoning + source doc + editorial status.
 * Full edit form submission.
 */
export async function modifyJanjiAction(
  _prev: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const ctx = await requireAdmin();

  const raw = {
    janjiId: formData.get('janjiId'),
    alignmentStatus: formData.get('alignmentStatus'),
    alignmentReasoning: formData.get('alignmentReasoning'),
    sourceDocUrl: formData.get('sourceDocUrl') ?? '',
    sourceDocPage: formData.get('sourceDocPage') ?? '',
    editorialStatus: formData.get('editorialStatus'),
    notes: formData.get('notes') ?? undefined,
  };
  const parsed = modifySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: 'Input tidak valid: ' + parsed.error.message };
  }

  const payload: JanjiUpdatePayload = {
    alignment_status: parsed.data.alignmentStatus,
    alignment_reasoning: parsed.data.alignmentReasoning,
    source_doc_url:
      parsed.data.sourceDocUrl && parsed.data.sourceDocUrl !== ''
        ? parsed.data.sourceDocUrl
        : null,
    source_doc_page:
      typeof parsed.data.sourceDocPage === 'number'
        ? parsed.data.sourceDocPage
        : null,
    editorial_status: parsed.data.editorialStatus,
    editorial_reviewer_id: ctx.userId,
    editorial_reviewed_at: new Date().toISOString(),
  };

  const updErr = await updateJanji(parsed.data.janjiId, payload);
  if (updErr) {
    return { ok: false, message: 'Gagal update janji: ' + updErr.message };
  }

  const log = await logEditorialReview({
    reviewerId: ctx.userId,
    targetType: 'janji',
    targetId: parsed.data.janjiId,
    action: 'modify',
    notes: parsed.data.notes ?? null,
  });
  if (!log.ok) {
    return {
      ok: false,
      message: 'Janji updated tapi gagal log audit: ' + log.error,
    };
  }

  revalidatePath(`/admin/janji/${parsed.data.janjiId}`);
  revalidatePath('/admin/janji');
  revalidatePath(`/tagih/${parsed.data.janjiId}`);
  return { ok: true, message: 'Janji diupdate dan dicatat di audit log.' };
}

/**
 * Reject action — flag janji sebagai bermasalah. Tidak hapus row, hanya log
 * + reset editorial_status ke pending sampai bisa di-review ulang.
 */
export async function rejectJanjiAction(
  _prev: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const ctx = await requireAdmin();

  const parsed = rejectSchema.safeParse({
    janjiId: formData.get('janjiId'),
    notes: formData.get('notes'),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Notes minimal 10 karakter — jelasin kenapa di-reject.',
    };
  }

  const updErr = await updateJanji(parsed.data.janjiId, {
    editorial_status: 'pending',
    editorial_reviewer_id: ctx.userId,
    editorial_reviewed_at: new Date().toISOString(),
  });
  if (updErr) {
    return { ok: false, message: 'Gagal update janji: ' + updErr.message };
  }

  const log = await logEditorialReview({
    reviewerId: ctx.userId,
    targetType: 'janji',
    targetId: parsed.data.janjiId,
    action: 'reject',
    notes: parsed.data.notes,
  });
  if (!log.ok) {
    return {
      ok: false,
      message: 'Janji updated tapi gagal log audit: ' + log.error,
    };
  }

  revalidatePath(`/admin/janji/${parsed.data.janjiId}`);
  revalidatePath('/admin/janji');
  return { ok: true, message: 'Janji di-reject dan dicatat di audit log.' };
}
