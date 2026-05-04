'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="font-hand text-jw-coral text-2xl mb-2">— ada yang error</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue mb-3">
        Hmm, ada yang nggak beres.
      </h1>
      <p className="text-base text-jw-ink/70 max-w-md mb-6">
        Aku udah catat error-nya buat tim Jubir Warga. Sementara itu, kamu bisa coba refresh atau balik ke beranda.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition active:scale-[0.97]"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="rounded-jw-md border border-jw-line bg-white px-4 py-2 text-sm font-semibold text-jw-ink hover:bg-jw-pill-grey-bg transition"
        >
          Balik ke beranda
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className="mt-6 text-xs text-jw-muted font-mono">
          Error digest: {error.digest}
        </p>
      )}
    </div>
  );
}
