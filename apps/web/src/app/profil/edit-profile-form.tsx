'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileAction, type ActionResult } from './actions';

type Props = {
  initialName: string;
  initialUsername: string;
  initialBio: string;
  initialChapterId: string;
};

const CHAPTER_OPTIONS = [
  { id: '', label: '— pilih chapter (opsional)' },
  { id: 'jakarta', label: 'Jakarta' },
  { id: 'bandung', label: 'Bandung Raya' },
  { id: 'malang', label: 'Malang Raya' },
  { id: 'surabaya', label: 'Surabaya' },
  { id: 'jogja', label: 'Yogyakarta' },
  { id: 'medan', label: 'Medan' },
  { id: 'makassar', label: 'Makassar' },
];

export function EditProfileForm({
  initialName,
  initialUsername,
  initialBio,
  initialChapterId,
}: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateProfileAction,
    null,
  );

  return (
    <form
      action={formAction}
      className="rounded-jw-lg border border-jw-line bg-white p-5 space-y-4"
    >
      <h3 className="font-display text-lg font-semibold text-jw-blue">
        Edit profil
      </h3>

      {state?.ok === true && (
        <div className="rounded-jw-md bg-jw-pill-mint-bg text-jw-pill-mint-text px-3 py-2 text-sm">
          Profil berhasil diperbarui.
        </div>
      )}
      {state?.ok === false && (
        <div className="rounded-jw-md bg-jw-pill-coral-bg text-jw-pill-coral-text px-3 py-2 text-sm">
          {state.error}
        </div>
      )}

      <Field
        label="Nama tampilan"
        name="name"
        defaultValue={initialName}
        required
        error={
          state?.ok === false ? state.fieldErrors?.name?.[0] : undefined
        }
      />
      <Field
        label="Username"
        name="username"
        defaultValue={initialUsername}
        required
        helper="3-20 karakter, lowercase / angka / underscore"
        error={
          state?.ok === false ? state.fieldErrors?.username?.[0] : undefined
        }
      />
      <Field
        label="Bio"
        name="bio"
        type="textarea"
        rows={3}
        defaultValue={initialBio}
        helper="Maks 280 karakter"
        error={state?.ok === false ? state.fieldErrors?.bio?.[0] : undefined}
      />
      <Field
        label="Chapter"
        name="chapter_id"
        type="select"
        defaultValue={initialChapterId}
        options={CHAPTER_OPTIONS}
        error={
          state?.ok === false ? state.fieldErrors?.chapter_id?.[0] : undefined
        }
      />

      <div className="flex items-center justify-end">
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
      className="rounded-jw-md bg-jw-coral text-white px-4 py-2 text-sm font-semibold hover:bg-jw-coral/90 disabled:opacity-50 transition"
    >
      {pending ? 'Menyimpan...' : 'Simpan perubahan'}
    </button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select';
  defaultValue?: string;
  required?: boolean;
  helper?: string;
  rows?: number;
  options?: { id: string; label: string }[];
  error?: string;
};

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  helper,
  rows,
  options,
  error,
}: FieldProps) {
  const baseCls = `w-full rounded-jw-md border bg-jw-cream/40 p-3 text-sm text-jw-ink outline-none focus:border-jw-coral ${
    error ? 'border-jw-coral' : 'border-jw-line'
  }`;
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-jw-blue mb-1.5">
        {label}
        {required && <span className="text-jw-coral ml-0.5">*</span>}
      </span>
      {type === 'textarea' ? (
        <textarea
          name={name}
          rows={rows ?? 3}
          defaultValue={defaultValue}
          required={required}
          className={`${baseCls} resize-y`}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          defaultValue={defaultValue ?? ''}
          className={baseCls}
        >
          {options?.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          required={required}
          className={baseCls}
        />
      )}
      {helper && !error && (
        <span className="block text-xs text-jw-muted mt-1">{helper}</span>
      )}
      {error && (
        <span className="block text-xs text-jw-pill-coral-text mt-1">
          {error}
        </span>
      )}
    </label>
  );
}
