// PAGE: Privasi — Privacy Policy draft
// IIFE WRAP
(function() {

const CPV = window.C;
const { Pill: PVPill, Button: PVBtn } = window;

const BAGIAN = [
  { judul: '1. Data yang Kami Kumpulkan', isi: `Kami mengumpulkan data minimum yang diperlukan untuk operasional platform:
• **Identitas dasar:** nama tampilan, alamat email, nomor WhatsApp (jika kamu pakai OTP).
• **Profil opsional:** chapter regional, topik favorit, foto profil.
• **Konten yang kamu buat:** thread, komentar, karya, laporan, vote, tanda tangan petisi.
• **Data interaksi:** halaman yang kamu kunjungi (anonim, via Plausible Analytics — privacy-friendly).

Kami **TIDAK** mengumpulkan: NIK, KTP fisik, lokasi GPS real-time (kecuali kamu beri izin saat lapor), data biometrik, riwayat browsing di luar platform.` },
  { judul: '2. Cara Kami Menggunakan Data', isi: `• **Menjalankan layanan:** menampilkan thread/karya/janji yang relevan untuk kamu.
• **Komunikasi:** notifikasi saat ada balasan, update petisi yang kamu tanda tangani.
• **Riset internal & agregat:** memahami pola penggunaan untuk perbaikan produk. Tidak pernah dikaitkan dengan identitas individu.
• **Kepatuhan hukum:** jika ada permintaan resmi pengadilan/aparat sesuai prosedur sah.` },
  { judul: '3. Berbagi Data dengan Pihak Ketiga', isi: `Kami **TIDAK** menjual data kamu. Kami juga **TIDAK** memberikan data ke pengiklan.

Kami berbagi data hanya dengan:
• **Penyedia infrastruktur:** Hostinger (server), Cloudflare (CDN), Supabase (database) — di bawah kontrak data processor.
• **Mitra penelitian:** dalam bentuk agregat anonim, dengan persetujuan tertulis dan etika riset yang dipatuhi.
• **Aparat penegak hukum:** hanya jika ada surat resmi yang valid sesuai UU.` },
  { judul: '4. Hak-hakmu sebagai Pengguna', isi: `Kamu punya hak penuh atas datamu:
• **Akses:** lihat semua data yang kami simpan tentang kamu.
• **Koreksi:** ubah/perbarui data profil kapan saja.
• **Hapus:** delete akun + semua data terkait dalam 30 hari.
• **Portability:** download semua datamu dalam format JSON.
• **Withdraw consent:** cabut izin kapan saja, beberapa fitur mungkin nonaktif setelahnya.

Untuk mengeksekusi hak-hak ini, email **privacy@jubirwarga.id**.` },
  { judul: '5. Keamanan Data', isi: `• Semua koneksi dienkripsi via HTTPS (TLS 1.3).
• Database di-encrypt at rest.
• Password kamu di-hash dengan bcrypt (kami tidak pernah lihat password asli).
• Backup harian dengan retensi 30 hari.
• Audit security tahunan oleh pihak independen.

Insiden keamanan akan kami umumkan ke pengguna terdampak dalam 72 jam, sesuai standard GDPR.` },
  { judul: '6. Cookie & Tracking', isi: `Kami menggunakan cookie minimal:
• **Essential:** session login, preferensi UI (dark mode, bahasa).
• **Analytics:** Plausible Analytics — anonim, no fingerprinting, no cross-site tracking.

Tidak ada cookie iklan, tidak ada tracking pixel Facebook/Google. Kami juga tidak menggunakan localStorage untuk fingerprinting.` },
  { judul: '7. Perubahan Kebijakan', isi: `Kebijakan ini bisa berubah. Perubahan signifikan akan kami umumkan via email dan banner di platform minimal 30 hari sebelum berlaku.

Kebijakan ini terakhir diperbarui: **29 April 2026**.` },
  { judul: '8. Kontak', isi: `Pertanyaan, keluhan, atau permintaan terkait privasi:
• Email: **privacy@jubirwarga.id**
• Surat: SPD Indonesia, Jl. Cikini IV No.18, Menteng, Jakarta Pusat
• Data Protection Officer: ditunjuk per Q3 2026.

Kalau kamu tidak puas dengan respons kami, kamu bisa lapor ke Kominfo atau Komisi Informasi Pusat.` },
];

function Privasi({ onNavigate }) {
  return (
    <div>
      <section className="py-12 border-b" style={{ background: CPV.cream, borderColor: CPV.line }}>
        <div className="max-w-3xl mx-auto px-6">
          <button onClick={() => onNavigate('beranda')} className="text-sm mb-6" style={{ color: CPV.coral }}>← Kembali</button>
          <PVPill color="blue" className="mb-3">📜 KEBIJAKAN PRIVASI</PVPill>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ color: CPV.blue }}>
            Privasi kamu, prioritas kami.
          </h1>
          <p className="text-base" style={{ color: CPV.ink + '99' }}>
            Kami percaya partisipasi sipil yang sehat butuh trust. Trust dibangun dari transparansi soal data. Berikut yang kamu perlu tahu.
          </p>
          <p className="font-mono text-xs mt-4 opacity-70" style={{ color: CPV.ink }}>Versi 1.0 · Berlaku sejak 29 April 2026</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* TOC */}
          <div className="rounded-2xl border bg-white p-5 mb-8" style={{ borderColor: CPV.line }}>
            <p className="text-xs font-mono uppercase opacity-70 mb-2" style={{ color: CPV.ink }}>Daftar Isi</p>
            <ol className="text-sm space-y-1" style={{ color: CPV.blue }}>
              {BAGIAN.map((b, i) => (
                <li key={i}><a href={`#sec-${i}`} className="hover:underline">{b.judul}</a></li>
              ))}
            </ol>
          </div>

          {BAGIAN.map((b, i) => (
            <article key={i} id={`sec-${i}`} className="mb-10 scroll-mt-8">
              <h2 className="font-display font-bold text-xl md:text-2xl mb-3" style={{ color: CPV.blue }}>{b.judul}</h2>
              <div className="prose max-w-none text-sm leading-relaxed" style={{ color: CPV.ink }}>
                {b.isi.split('\n').map((line, j) => {
                  if (!line.trim()) return null;
                  if (line.startsWith('• ')) {
                    return <li key={j} className="ml-5 mb-2 list-disc" dangerouslySetInnerHTML={{__html: line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}} />;
                  }
                  return <p key={j} className="mb-3" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}} />;
                })}
              </div>
            </article>
          ))}

          {/* CTA */}
          <div className="rounded-2xl p-6 text-center" style={{ background: CPV.blue + '08', border: `1px dashed ${CPV.blue + '40'}` }}>
            <p className="font-display text-lg mb-3" style={{ color: CPV.blue }}>Ada pertanyaan atau ingin akses datamu?</p>
            <a href="mailto:privacy@jubirwarga.id" className="inline-block btn-base px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: CPV.coral, color: '#fff' }}>📧 Kontak privacy@jubirwarga.id</a>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Privasi });

})();
