import type { NextConfig } from 'next';

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

export default config;
