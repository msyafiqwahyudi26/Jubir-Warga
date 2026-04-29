import type { Metadata, Viewport } from 'next';
import { Inter, Vollkorn, Caveat, Fira_Code } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const vollkorn = Vollkorn({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  weight: ['400', '600', '700'],
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.jubir.spdindonesia.org'),
  title: {
    default: 'Jubir Warga — Suara warga, rumahnya di sini.',
    template: '%s · Jubir Warga',
  },
  description:
    'Rumah online anak muda Indonesia 17–39 tahun: ngumpul, bersuara, berkarya, belajar.',
  applicationName: 'Jubir Warga',
  authors: [{ name: 'SPD Indonesia' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Jubir Warga — Suara warga, rumahnya di sini.',
    description: 'Rumah online anak muda Indonesia: ngumpul, bersuara, berkarya, belajar.',
    siteName: 'Jubir Warga',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jubir Warga',
    description: 'Suara warga, rumahnya di sini.',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon-180.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1A2256',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${vollkorn.variable} ${caveat.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
