'use client';

/**
 * JanjiEditForm — Client form untuk /admin/janji/[id].
 *
 * Renders 3 form sections:
 *   1. Modify (full edit alignment + reasoning + source doc)
 *   2. Approve (quick action — set editorial_status only)
 *   3. Reject (flag dengan notes mandatory)
 *
 * Setiap section punya useActionState sendiri biar feedback per-action
 * gak cross-pollute. Submit button per form pakai useFormStatus untuk
 * pending state.
 */
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  approveJanjiAction,
  modifyJanjiAction,
  rejectJanjiAction,
  type ModerationActionState,
} from '@/lib/admin/moderation-actions';
import {
  ALIGNMENT_LABELS,
  ALIGNMENT_STATUSES,
  EDITORIAL_STATUSES,
  type AlignmentStatus,
  type EditorialStatus,
} from '@/lib/admin/types';
import { VerificationBadge } from './badge-verification';

const INITIAL_STATE: ModerationActionState = { ok: false, message: '' };

type Props = {
  janjiId: string;
  janjiText: string;
  currentAlignment: AlignmentStatus | null;
  currentReasoning: string | null;
  currentSourceDocUrl: string | null;
  currentSourceDocPage: number | null;
  currentEditorialStatus: EditorialStatus;
};

function FeedbackBanner({ state }: { state: ModerationActionState }) {
  if (!state.message) return null;
  const isOk = state.ok;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-jw-md px-3 py-2 text-sm mt-3 ${
        isOk
          ? 'bg-jw-pill-mint-bg text-jw-pill-mint-text'
          : 'bg-jw-pill-coral-bg text-jw-pill-coral-text'
      }`}
    >
      {state.message}
    </div>
  );
}

function SubmitButton({
  label,
  variant = 'primary',
}: {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const { pending } = useFormStatus();
  const styles =
    variant === 'primary'
      ? 'bg-jw-coral text-white hover:bg-jw-coral/90'
      : variant === 'danger'
        ? 'bg-jw-red text-white hover:bg-jw-red/90'
        : 'bg-jw-blue text-jw-cream hover:bg-jw-blue/90';
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-jw-md px-4 py-2 text-sm font-semibold transition ${styles} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {pending ? 'Memproses…' : label}
    </button>
  );
}

export function JanjiEditForm(props: Props) {
  const [modifyState, modifyAction] = useActionState(
    modifyJanjiAction,
    INITIAL_STATE,
  );
  const [approveState, approveAction] = useActionState(
    approveJanjiAction,
    INITIAL_STATE,
  );
  const [rejectState, rejectAction] = useActionState(
    rejectJanjiAction,
    INITIAL_STATE,
  );

  return (
    <div className="space-y-8">
      {/* Current state preview */}
      <section className="rounded-jw-lg border border-jw-line bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-jw-blue">
          Status saat ini
        </h2>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <VerificationBadge status={props.currentEditorialStatus} />
          {props.currentAlignment && (
            <span className="text-sm text-jw-ink/80">
              Alignment:{' '}
              <strong className="text-jw-blue">
                {ALIGNMENT_LABELS[props.currentAlignment]}
              </strong>
            </span>
          )}
        </div>
        {props.currentReasoning && (
          <p className="mt-3 text-sm text-jw-ink/80 leading-relaxed whitespace-pre-wrap">
            {props.currentReasoning}
          </p>
        )}
      </section>

      {/* Modify form (full edit) */}
      <section className="rounded-jw-lg border border-jw-line bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-jw-blue">
          Edit penuh — alignment + reasoning + sumber
        </h2>
        <form action={modifyAction} className="mt-4 space-y-4">
          <input type="hidden" name="janjiId" value={props.janjiId} />

          <div>
            <label
              htmlFor="alignmentStatus"
              className="block text-sm font-semibold text-jw-blue mb-1"
            >
              Alignment status <span className="text-jw-coral">*</span>
            </label>
            <select
              id="alignmentStatus"
              name="alignmentStatus"
              required
              defaultValue={props.currentAlignment ?? ''}
              className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
            >
              <option value="" disabled>
                — pilih alignment —
              </option>
              {ALIGNMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} — {ALIGNMENT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="alignmentReasoning"
              className="block text-sm font-semibold text-jw-blue mb-1"
            >
              Reasoning <span className="text-jw-coral">*</span>
              <span className="ml-2 text-xs font-normal text-jw-muted">
                (20-2000 karakter)
              </span>
            </label>
            <textarea
              id="alignmentReasoning"
              name="alignmentReasoning"
              required
              rows={6}
              minLength={20}
              maxLength={2000}
              defaultValue={props.currentReasoning ?? ''}
              placeholder="Jelasin gimana janji ini di-cross-check dengan dokumen resmi (RPJMN/RPJMD/Visi Misi). Sebut bagian/halaman dokumen yang relevan."
              className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm leading-relaxed font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-3">
            <div>
              <label
                htmlFor="sourceDocUrl"
                className="block text-sm font-semibold text-jw-blue mb-1"
              >
                URL dokumen sumber{' '}
                <span className="text-xs font-normal text-jw-muted">
                  (opsional)
                </span>
              </label>
              <input
                id="sourceDocUrl"
                name="sourceDocUrl"
                type="url"
                defaultValue={props.currentSourceDocUrl ?? ''}
                placeholder="https://bappenas.go.id/rpjmn-2025-2029.pdf"
                className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sourceDocPage"
                className="block text-sm font-semibold text-jw-blue mb-1"
              >
                Halaman
              </label>
              <input
                id="sourceDocPage"
                name="sourceDocPage"
                type="number"
                min={1}
                defaultValue={props.currentSourceDocPage ?? ''}
                className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="modifyEditorialStatus"
              className="block text-sm font-semibold text-jw-blue mb-1"
            >
              Editorial status <span className="text-jw-coral">*</span>
            </label>
            <select
              id="modifyEditorialStatus"
              name="editorialStatus"
              required
              defaultValue={props.currentEditorialStatus}
              className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
            >
              {EDITORIAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="modifyNotes"
              className="block text-sm font-semibold text-jw-blue mb-1"
            >
              Notes audit{' '}
              <span className="text-xs font-normal text-jw-muted">
                (opsional, max 500)
              </span>
            </label>
            <textarea
              id="modifyNotes"
              name="notes"
              rows={2}
              maxLength={500}
              className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SubmitButton label="Simpan perubahan" variant="primary" />
          </div>
          <FeedbackBanner state={modifyState} />
        </form>
      </section>

      {/* Approve quick action */}
      <section className="rounded-jw-lg border border-jw-line bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-jw-blue">
          Approve cepat — set verification badge
        </h2>
        <p className="mt-1 text-sm text-jw-muted">
          Pakai kalau alignment + reasoning udah benar, tinggal naikin
          editorial_status.
        </p>
        <form action={approveAction} className="mt-4 flex flex-wrap gap-3">
          <input type="hidden" name="janjiId" value={props.janjiId} />
          <select
            name="editorialStatus"
            defaultValue="verified_curator"
            className="rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
            aria-label="Editorial status yang akan di-set"
          >
            <option value="verified_curator">Terverifikasi Kurator</option>
            <option value="curated_ai">Kurasi AI</option>
          </select>
          <input
            type="text"
            name="notes"
            placeholder="Notes (opsional)"
            maxLength={500}
            className="flex-1 min-w-[200px] rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
          />
          <SubmitButton label="Approve" variant="secondary" />
        </form>
        <FeedbackBanner state={approveState} />
      </section>

      {/* Reject form */}
      <section className="rounded-jw-lg border border-jw-line bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-jw-blue">
          Reject — kembalikan ke pending dengan catatan
        </h2>
        <p className="mt-1 text-sm text-jw-muted">
          Pakai kalau ada masalah — wajib jelasin di notes.
        </p>
        <form action={rejectAction} className="mt-4 space-y-3">
          <input type="hidden" name="janjiId" value={props.janjiId} />
          <textarea
            name="notes"
            required
            rows={3}
            minLength={10}
            maxLength={500}
            placeholder="Kenapa di-reject? (10-500 karakter, wajib)"
            className="w-full rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm"
          />
          <SubmitButton label="Reject" variant="danger" />
        </form>
        <FeedbackBanner state={rejectState} />
      </section>
    </div>
  );
}
