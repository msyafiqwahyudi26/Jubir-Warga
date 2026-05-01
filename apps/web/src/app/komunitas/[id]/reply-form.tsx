'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitReplyAction, type ActionResult } from '../actions';

type Props = {
  threadId: string;
};

export function ReplyForm({ threadId }: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    submitReplyAction,
    null,
  );

  return (
    <form
      action={formAction}
      className="rounded-jw-lg border border-jw-line bg-white p-4"
    >
      <input type="hidden" name="threadId" value={threadId} />
      <label
        htmlFor="reply-body"
        className="block text-sm font-semibold text-jw-blue mb-2"
      >
        Tulis balasan
      </label>
      <textarea
        id="reply-body"
        name="body"
        rows={4}
        placeholder="Tambahin pemikiranmu, pertanyaan, atau pengalaman..."
        className="w-full rounded-jw-md border border-jw-line bg-jw-cream/40 p-3 text-sm text-jw-ink resize-y outline-none focus:border-jw-coral"
      />
      {state?.ok === false && (
        <div className="mt-2 text-xs text-jw-pill-coral-text bg-jw-pill-coral-bg rounded-jw-sm px-2 py-1">
          {state.error}
          {state.fieldErrors?.body && (
            <> · {state.fieldErrors.body.join(', ')}</>
          )}
        </div>
      )}
      {state?.ok === true && (
        <div className="mt-2 text-xs text-jw-pill-mint-text bg-jw-pill-mint-bg rounded-jw-sm px-2 py-1">
          Balasan terkirim. Terima kasih!
        </div>
      )}
      <div className="mt-3 flex items-center justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Mengirim...' : 'Kirim balasan'}
    </button>
  );
}
