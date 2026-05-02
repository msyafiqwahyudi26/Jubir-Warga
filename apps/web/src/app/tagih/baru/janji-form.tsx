'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitJanjiAction, type ActionResult } from '../actions';

type PejabatOption = {
  id: string;
  nama: string;
  jabatan: string | null;
  partai: string | null;
};

type Props = {
  pejabatOptions: PejabatOption[];
};

export function JanjiForm({ pejabatOptions }: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    submitJanjiAction,
    null,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-jw-lg border border-jw-line bg-white p-6"
    >
      {state?.ok === true && (
        <div className="rounded-jw-md bg-jw-pill-mint-bg text-jw-pill-mint-text px-3 py-2 text-sm">
          Janji terkirim. Akan direview admin sebelum tampil publik (panel
          moderasi Sprint 4).
        </div>
      )}
      {state?.ok === false && (
        <div className="rounded-jw-md bg-jw-pill-coral-bg text-jw-pill-coral-text px-3 py-2 text-sm">
          {state.error}
        </div>
      )}

      <Field
        label="Pejabat"
        name="pejabat_id"
        type="select"
        options={pejabatOptions}
        error={state?.ok === false ? state.fieldErrors?.pejabat_id?.[0] : undefined}
        required
      />
      <Field
        label="Topik"
        name="topik"
        type="text"
        placeholder="Mis. Transportasi publik, Pendidikan, Lingkungan"
        error={state?.ok === false ? state.fieldErrors?.topik?.[0] : undefined}
        required
      />
      <Field
        label="Kutipan janji"
        name="janji_text"
        type="textarea"
        rows={4}
        placeholder='Mis. "Kami akan menambah armada KRL 30% dalam 2 tahun..."'
        error={
          state?.ok === false ? state.fieldErrors?.janji_text?.[0] : undefined
        }
        required
        helper="Minimal 30 karakter, maksimal 1000."
      />
      <Field
        label="Konteks lengkap (opsional)"
        name="source_quote"
        type="textarea"
        rows={3}
        placeholder="Konteks atau paragraf lengkap dari sumber, kalau perlu"
        error={
          state?.ok === false ? state.fieldErrors?.source_quote?.[0] : undefined
        }
      />
      <Field
        label="URL sumber"
        name="source_url"
        type="url"
        placeholder="https://..."
        error={
          state?.ok === false ? state.fieldErrors?.source_url?.[0] : undefined
        }
        helper="Link ke pemberitaan, video, atau pernyataan resmi."
      />
      <Field
        label="Deadline (opsional)"
        name="deadline"
        type="date"
        error={
          state?.ok === false ? state.fieldErrors?.deadline?.[0] : undefined
        }
      />

      <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
        <p className="text-xs text-jw-muted">
          Status awal: <span className="font-semibold text-jw-blue">Belum</span>{' '}
          (pending review admin).
        </p>
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
      className="rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 disabled:opacity-50 transition"
    >
      {pending ? 'Mengirim...' : 'Submit janji'}
    </button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'url' | 'date' | 'select';
  options?: PejabatOption[];
  placeholder?: string;
  rows?: number;
  required?: boolean;
  helper?: string;
  error?: string;
};

function Field({
  label,
  name,
  type,
  options,
  placeholder,
  rows,
  required,
  helper,
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
          placeholder={placeholder}
          required={required}
          className={`${baseCls} resize-y`}
        />
      ) : type === 'select' ? (
        <select name={name} required={required} className={baseCls} defaultValue="">
          <option value="" disabled>
            Pilih pejabat...
          </option>
          {options?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
              {p.jabatan ? ` — ${p.jabatan}` : ''}
              {p.partai ? ` (${p.partai})` : ''}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
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
