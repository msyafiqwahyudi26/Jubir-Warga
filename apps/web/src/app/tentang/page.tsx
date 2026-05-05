import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang',
  description:
    'Jubir Warga — rumah online warga muda Indonesia 17–39 tahun: ngumpul, bersuara, berkarya, belajar. Lagi spotlight Tagih Janji.',
};

export default function TentangPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <span className="font-hand text-jw-coral text-base" aria-hidden="true">
          — tentang kami
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Tentang Jubir Warga
        </h1>
        <p className="mt-3 font-display text-xl text-jw-ink italic">
          Suara warga, rumahnya di sini.
        </p>
      </header>

      <div className="space-y-5 text-jw-ink/90 leading-relaxed">
        <p>
          Jubir Warga adalah rumah online warga muda Indonesia 17–39 tahun. Tempat
          ngumpul, bersuara, berkarya, dan belajar bareng — soal apa pun yang
          ngaruh ke hidup warga sehari-hari, dari KRL nyangkut sampai Pasal 28E.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">Misi</h2>
        <p>
          Bantu anak muda sadar bahwa <strong>kebijakan pemerintah ngaruh ke
          hidup sehari-hari</strong> — dan bahwa suara mereka relevan. Kami percaya
          akuntabilitas adalah bentuk dukungan terbaik. Bukan oposisi, bukan
          partisan, bukan attack. Sejalan dengan agenda pembangunan pemerintah
          pusat.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Apa yang ada di sini
        </h2>
        <ul className="space-y-3 list-disc list-outside pl-5">
          <li>
            <strong className="text-jw-blue">Komunitas</strong> — diskusi, thread,
            pertanyaan dari warga buat warga.
          </li>
          <li>
            <strong className="text-jw-blue">Karya</strong> — tulisan, vlog,
            ilustrasi, podcast, zine warga.
          </li>
          <li>
            <strong className="text-jw-blue">Kelas</strong> — literasi kebijakan
            ringan, dipake langsung.
          </li>
          <li>
            <strong className="text-jw-blue">Aksi</strong> — petisi, polling,
            kampanye warga.
          </li>
          <li>
            <strong className="text-jw-blue">Tagih Janji</strong> — database publik
            janji pejabat, dianalisis AI, ditagih bareng-bareng.
          </li>
          <li>
            <strong className="text-jw-blue">Main</strong> — game harian Tebak
            Kata + Tebak Pejabat + Janji vs Realita.
          </li>
        </ul>

        <div className="mt-8 rounded-jw-lg border border-jw-coral/30 bg-jw-pill-coral-bg/30 p-5">
          <p className="font-hand text-lg text-jw-coral">— spotlight saat ini</p>
          <h3 className="font-display text-xl font-bold text-jw-blue mt-1">
            Sprint ini fokus exploit Tagih Janji
          </h3>
          <p className="mt-2 text-sm text-jw-ink/85 leading-relaxed">
            Setiap janji punya jejak. Kami pantau janji pejabat dari{' '}
            <strong>RPJMN, RPJMD, dan visi misi paslon</strong> di KPU,
            dianalisis AI, lalu ditagih bareng lewat dashboard publik + diskusi
            komunitas + game ringan. Karya, Kelas, Aksi, Komunitas tetap
            berkembang bertahap — Tagih cuma yang lagi dapet panggung utama.
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Verifikasi &amp; sumber
        </h2>
        <p>Khusus Tagih Janji, setiap entry punya badge transparency:</p>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>
            <strong className="text-jw-blue">Terverifikasi Kurator</strong> —
            direview manual oleh tim editorial Jubir Warga.
          </li>
          <li>
            <strong className="text-jw-blue">Kurasi AI</strong> — auto-generated
            dari pipeline AI, di-tag transparan.
          </li>
        </ul>
        <p>
          Sumber data: Bappenas (RPJMN), Pemprov (RPJMD), KPU (Visi Misi paslon),
          BPS (Indeks pembangunan), media mainstream Indonesia (Kompas, Tempo,
          Detik, Antara, CNN ID, Tirto, Kumparan). Detail lengkap di{' '}
          <Link href="/privasi" className="text-jw-coral font-semibold hover:underline">
            halaman Privasi
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Dari SPD Indonesia
        </h2>
        <p>
          Jubir Warga lahir dari <strong>SPD Indonesia (Sindikasi Pemilu &amp;
          Demokrasi)</strong> sebagai platform digital untuk anak muda. Sedang
          dalam proses pembentukan PT independen 2026. Pasca-PT, Jubir Warga
          otonom; SPD jadi partner.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">Kontak</h2>
        <ul className="space-y-1">
          <li>
            Pertanyaan umum:{' '}
            <a
              href="mailto:info@jubirwarga.id"
              className="text-jw-coral font-semibold hover:underline"
            >
              info@jubirwarga.id
            </a>
          </li>
          <li>
            Partnership / NGO / akademisi:{' '}
            <a
              href="mailto:partnerships@jubirwarga.id"
              className="text-jw-coral font-semibold hover:underline"
            >
              partnerships@jubirwarga.id
            </a>
          </li>
          <li>
            Press / media:{' '}
            <a
              href="mailto:press@jubirwarga.id"
              className="text-jw-coral font-semibold hover:underline"
            >
              press@jubirwarga.id
            </a>
          </li>
          <li>
            Instagram:{' '}
            <a
              href="https://instagram.com/jubirwarga.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jw-coral font-semibold hover:underline"
            >
              @jubirwarga.id
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
