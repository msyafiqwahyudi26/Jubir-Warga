'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          padding: '40px 20px',
          fontFamily: 'system-ui, sans-serif',
          background: '#FFFAEE',
          color: '#2A2D3A',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#1A2256', fontSize: '24px' }}>Maaf, ada error sistem.</h1>
        <p>Tim Jubir Warga akan segera benerin. Coba refresh halaman.</p>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            background: '#E8632B',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Balik ke beranda
        </button>
      </body>
    </html>
  );
}
