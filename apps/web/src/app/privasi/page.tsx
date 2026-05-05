import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privasi & Data',
  description:
    'Kebijakan privasi Jubir Warga + transparansi sumber data (RPJMN, RPJMD, Visi Misi paslon, media mainstream).',
};

export default function PrivasiPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <span className="font-hand text-jw-coral text-base" aria-hidden="true">
          — privasi
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Privasi &amp; Data
        </h1>
        <p className="mt-2 text-sm text-jw-muted">
          Versi beta · 2026-05-05. Akan diaudit ulang sebelum launch publik Juni 2026.
        </p>
      </header>

      <div className="space-y-5 text-jw-ink/90 leading-relaxed">
        <p>
          Jubir Warga adalah rumah online warga muda Indonesia — dan rumah harus
          aman. Halaman ini ngejelasin data apa aja yang kami kumpul dari kamu,
          serta sumber data dari luar (RPJMN, RPJMD, media) yang kami pakai
          untuk fitur Tagih Janji yang lagi spotlight.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Sumber data janji (transparency)
        </h2>
        <p>
          Khusus fitur <strong>Tagih Janji</strong>, data janji pejabat berasal dari
          sumber publik dan resmi. Transparansi sumber adalah syarat utama
          platform.
        </p>

        <h3 className="font-display text-lg font-semibold text-jw-blue mt-6 mb-2">
          Dokumen resmi pemerintah
        </h3>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>
            <strong className="text-jw-blue">RPJMN</strong> (Bappenas) — Rencana Pembangunan Jangka
            Menengah Nasional. Dokumen publik di{' '}
            <a
              href="https://www.bappenas.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jw-coral font-semibold hover:underline"
            >
              bappenas.go.id
            </a>
            .
          </li>
          <li>
            <strong className="text-jw-blue">RPJMD</strong> (Pemprov / Pemkab / Pemkot) — rencana
            pembangunan per region.
          </li>
          <li>
            <strong className="text-jw-blue">Visi Misi paslon</strong> (KPU) — komitmen kampanye saat
            pemilu/pilkada. Dokumen publik di{' '}
            <a
              href="https://infopemilu.kpu.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jw-coral font-semibold hover:underline"
            >
              infopemilu.kpu.go.id
            </a>
            .
          </li>
          <li>
            <strong className="text-jw-blue">Indeks BPS</strong> — IPM, IDH, IPMD untuk konteks
            indikator pembangunan.
          </li>
        </ul>

        <h3 className="font-display text-lg font-semibold text-jw-blue mt-6 mb-2">
          Media mainstream Indonesia (Live Watch source)
        </h3>
        <p>
          Kompas, Tempo, Detik, Antara, CNN Indonesia, Tirto, Kumparan — di-scrape untuk pernyataan
          kebijakan pejabat publik. Hanya kutipan langsung yang dikutip dalam jumlah wajar (fair
          use); full artikel selalu link ke source asli. Kalau kamu pemilik konten dan keberatan,
          email{' '}
          <a
            href="mailto:info@jubirwarga.id"
            className="text-jw-coral font-semibold hover:underline"
          >
            info@jubirwarga.id
          </a>{' '}
          untuk takedown.
        </p>

        <h3 className="font-display text-lg font-semibold text-jw-blue mt-6 mb-2">
          Lapor warga (UGC)
        </h3>
        <p>
          Pengguna terdaftar dapat lapor janji baru lewat fitur{' '}
          <Link href="/tagih/baru" className="text-jw-coral font-semibold hover:underline">
            Lapor Janji
          </Link>
          . Setiap submission masuk ke moderasi editorial sebelum publish ke dashboard publik.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Privasi kamu sebagai pengguna
        </h2>

        <h3 className="font-display text-lg font-semibold text-jw-blue mt-6 mb-2">
          Data yang kami simpan
        </h3>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>
            Akun: email, username, nomor HP (kalau diberikan), password (di-hash, tidak pernah
            plaintext).
          </li>
          <li>
            Aktivitas: thread + reply, vote, sign petisi, submit janji, score game. Disimpan tied
            ke akun kamu untuk profil publik.
          </li>
          <li>
            Telemetri minimal: pageview anonim via self-host Umami (no third-party cookie, no
            cross-site tracking).
          </li>
        </ul>

        <h3 className="font-display text-lg font-semibold text-jw-blue mt-6 mb-2">
          Yang TIDAK kami lakukan
        </h3>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>Tidak jual data ke pihak ketiga.</li>
          <li>Tidak pasang iklan tracker (Facebook Pixel, Google Ads, dll).</li>
          <li>Tidak share data ke partai politik atau aparat tanpa surat resmi pengadilan.</li>
          <li>
            Tidak log percakapan kamu dengan Nala (saat ini mock; saat live AI nanti, kebijakan
            akan diupdate dengan disclosure eksplisit).
          </li>
        </ul>

        <h3 className="font-display text-lg font-semibold text-jw-blue mt-6 mb-2">
          Hak kamu
        </h3>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>Akses + export semua datamu (request via email).</li>
          <li>Hapus akun + semua kontribusi (kontribusi anonim tetap, identitas dihapus).</li>
          <li>Koreksi data profil kapan saja di{' '}
            <Link href="/profil" className="text-jw-coral font-semibold hover:underline">
              halaman profil
            </Link>
            .
          </li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Kontak privasi
        </h2>
        <p>
          Pertanyaan, request akses/hapus data, atau report kebocoran:{' '}
          <a
            href="mailto:info@jubirwarga.id"
            className="text-jw-coral font-semibold hover:underline"
          >
            info@jubirwarga.id
          </a>
          .
        </p>
      </div>
    </article>
  );
}
