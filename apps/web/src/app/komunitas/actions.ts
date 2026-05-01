'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const voteSchema = z.object({
  threadId: z.string().uuid(),
  direction: z.enum(['up', 'down', 'unvote']),
});

const replySchema = z.object({
  threadId: z.string().uuid(),
  body: z
    .string()
    .trim()
    .min(2, 'Reply minimal 2 karakter')
    .max(4000, 'Maks 4000 karakter'),
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function voteThreadAction(formData: FormData): Promise<ActionResult> {
  const parsed = voteSchema.safeParse({
    threadId: formData.get('threadId'),
    direction: formData.get('direction'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'Input tidak valid' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/komunitas/${parsed.data.threadId}`);
  }

  const { threadId, direction } = parsed.data;

  if (direction === 'unvote') {
    const { error } = await supabase
      .from('thread_votes')
      .delete()
      .match({ thread_id: threadId, user_id: user.id });
    if (error) return { ok: false, error: error.message };
  } else {
    const vote = direction === 'up' ? 1 : -1;
    const { error } = await supabase
      .from('thread_votes')
      .upsert(
        { thread_id: threadId, user_id: user.id, vote },
        { onConflict: 'thread_id,user_id' },
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(`/komunitas/${threadId}`);
  revalidatePath('/komunitas');
  return { ok: true };
}

export async function submitReplyAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = replySchema.safeParse({
    threadId: formData.get('threadId'),
    body: formData.get('body'),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validasi gagal',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/komunitas/${parsed.data.threadId}`);
  }

  const { error } = await supabase.from('thread_replies').insert({
    thread_id: parsed.data.threadId,
    body: parsed.data.body,
    author_id: user.id,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/komunitas/${parsed.data.threadId}`);
  return { ok: true };
}
