import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-jw-line px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-jw-blue">
            Jubir Warga
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
