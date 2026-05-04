import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const config: NextConfig = {
  reactStrictMode: true,
  // Note: typedRoutes belum support Turbopack di Next 15.0.3 — di-skip sampai stable.
  // Workspace package transpilation (penting karena @jw/data dipakai dari source langsung)
  transpilePackages: ['@jw/data'],

  images: {
    remotePatterns: [
      // Supabase storage
      { protocol: 'https', hostname: 'ifrautpvbhdbhieystxk.supabase.co' },
      // Avatar fallback (Gravatar/Dicebear/UI Avatars)
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },

  // Security + caching headers (mirror Phase 1 nginx config)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
};

export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG ?? 'spd-indonesia',
  project: process.env.SENTRY_PROJECT ?? 'jubir-warga-web',
  silent: !process.env.CI,
  sourcemaps: { disable: false },
  telemetry: false,
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});
