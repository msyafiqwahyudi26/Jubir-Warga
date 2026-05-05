import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description:
    'Syarat penggunaan Jubir Warga untuk warga muda Indonesia — termasuk AI verdict disclaimer dan tanggung jawab kontribusi.',
};

export default function SyaratPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <span className="font-hand text-jw-coral text-base" aria-hidden="true">
          — syarat &amp; ketentuan
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Syarat &amp; Ketentuan
        </h1>
        <p className="mt-2 text-sm text-jw-muted">
          Versi beta · 2026-05-05. Akan direvisi sebelum launch publik Juni 2026.
        </p>
      </header>

      <div className="space-y-5 text-jw-ink/90 leading-relaxed">
        <h2 className="font-display text-2xl font-bold text-jw-blue mt-2 mb-3">
          1. Tentang layanan
        </h2>
        <p>
          Jubir Warga adalah rumah online warga muda Indonesia 17–39 tahun:
          tempat ngumpul, bersuara, berkarya, belajar. Saat ini dalam tahap beta,
          dan lagi spotlight fitur <strong>Tagih Janji</strong> — database janji
          pejabat dari RPJMN/RPJMD/Visi Misi yang dianalisis AI dan ditagih
          bareng-bareng. Karya, Kelas, Aksi, Komunitas tetap berkembang
          bertahap. Operator: SPD Indonesia, dalam proses pembentukan PT
          independen 2026.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          2. Akun &amp; identitas
        </h2>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>Kamu wajib berusia ≥ 17 tahun untuk akun penuh. Sub-brand Warga Muda (12-18) terpisah, akses lewat program Muda Berdampak.</li>
          <li>Identitas yang kamu daftarkan harus benar. Akun palsu / impersonasi pejabat akan kami banned.</li>
          <li>Kamu bertanggung jawab menjaga kerahasiaan password.</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          3. Konten kamu (UGC)
        </h2>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>Kamu tetap pemilik hak cipta atas konten yang kamu submit.</li>
          <li>
            Kamu kasih kami lisensi non-eksklusif untuk menampilkan konten kamu di platform Jubir
            Warga selama akun aktif. Kalau kamu hapus akun, konten privat hilang; kontribusi
            publik (thread, karya, lapor janji yang sudah verified) tetap, tapi identitas
            di-anonim.
          </li>
          <li>Konten harus mematuhi <Link href="/etika" className="text-jw-coral font-semibold hover:underline">Etika Komunitas</Link>.</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          4. AI verdict &amp; data resmi — disclaimer
        </h2>
        <p>
          Verdict AI yang kami sajikan dibuat dari analisis dokumen publik (RPJMN, RPJMD, Visi
          Misi, kutipan media). <strong>Verdict bukan tuduhan final, bukan vonis hukum,</strong>{' '}
          dan tidak boleh dipakai sebagai bukti tunggal di proses litigasi atau kampanye negatif.
          Verdict 4-tier (aligned / partial / drift / contradict) adalah indikator alignment, bukan
          penilaian moral.
        </p>
        <p>
          Pejabat publik berhak mengajukan klarifikasi atau bantahan, yang akan kami tampilkan
          side-by-side dengan verdict (mekanisme right-of-reply dalam pengembangan).
        </p>
        <p>
          Data dokumen resmi yang kami pakai bersumber dari penyelenggara publik (Bappenas, KPU,
          BPS, Pemprov) — kalau ada koreksi sumber resmi, kami akan update database secepat
          mungkin.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          5. Yang dilarang
        </h2>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>Hate speech, SARA, fitnah, hoaks, dan ajakan kekerasan.</li>
          <li>Spam, scraping otomatis, atau exploit teknis platform.</li>
          <li>Endorsement partai atau kandidat tertentu lewat platform — Jubir Warga non-partisan.</li>
          <li>Doxing pengguna lain.</li>
          <li>Membuat akun ulang setelah ban (evasion).</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          6. Penghentian akun
        </h2>
        <p>
          Kami berhak menangguhkan atau menghentikan akun yang melanggar Syarat ini, tanpa
          pemberitahuan dulu untuk pelanggaran berat (hoaks, doxing, SARA). Untuk pelanggaran
          ringan, biasanya kami warning dulu.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          7. Beta status &amp; tanggung jawab
        </h2>
        <p>
          Layanan masih beta. Bisa ada bug, downtime, atau perubahan fitur tanpa notifikasi
          panjang. Kami usaha kasih notice bermakna, tapi tidak ada SLA komersial. Kalau ada
          kehilangan data karena bug kami, kami akan usaha pulihkan tapi tidak menjamin.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          8. Hukum yang berlaku
        </h2>
        <p>
          Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan via mediasi dulu,
          baru ke pengadilan kalau gagal. Yurisdiksi di Jakarta Selatan.
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">9. Kontak</h2>
        <p>
          Pertanyaan tentang syarat:{' '}
          <a
            href="mailto:info@jubirwarga.id"
            className="text-jw-coral font-semibold hover:underline"
          >
            info@jubirwarga.id
          </a>
          .
        </p>

        <p className="mt-6 text-sm text-jw-muted">
          Lihat juga:{' '}
          <Link href="/privasi" className="text-jw-coral font-semibold hover:underline">
            Privasi
          </Link>
          {' · '}
          <Link href="/etika" className="text-jw-coral font-semibold hover:underline">
            Etika Komunitas
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
