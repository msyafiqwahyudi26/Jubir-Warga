// PAGE: Syarat — Terms of Service draft
// IIFE WRAP
(function() {

const CSY = window.C;
const { Pill: SYPill } = window;

const PASAL = [
  { judul: '1. Penerimaan Syarat', isi: `Dengan mendaftar atau menggunakan platform Jubir Warga (jubir.spdindonesia.org dan turunannya), kamu menyatakan setuju dengan syarat-syarat berikut. Jika tidak setuju, mohon untuk tidak menggunakan platform.

Syarat ini berlaku untuk pengguna umur **17 tahun ke atas**. Pengguna 13-16 tahun boleh akses dengan persetujuan tertulis orang tua/wali. Pengguna di bawah 13 tahun tidak diizinkan.` },
  { judul: '2. Akun Pengguna', isi: `• Kamu bertanggung jawab atas keamanan akun & password kamu.
• Akun bersifat personal — tidak boleh dijual, disewakan, atau dibagikan.
• Kami berhak suspend/hapus akun yang melanggar Syarat tanpa pemberitahuan, dengan sebab yang jelas.
• Kamu boleh hapus akun kapan saja via Pengaturan → Hapus Akun.` },
  { judul: '3. Konten yang Kamu Buat', isi: `Konten yang kamu post (thread, karya, komentar, laporan, vote) tetap menjadi **milik kamu**. Tapi kamu memberikan kami lisensi non-eksklusif, royalty-free, untuk:
• Menampilkan di platform Jubir Warga.
• Membagikan secara terbatas untuk promosi platform (dengan kredit jelas).
• Menggunakan dalam bentuk agregat/anonim untuk riset publik.

Kamu **menjamin** bahwa konten yang kamu post:
• Bukan plagiarisme atau melanggar hak cipta orang lain.
• Tidak mengandung kebencian rasial, agama, gender, atau ajakan kekerasan.
• Tidak hoaks atau disinformasi yang dapat membahayakan publik.
• Tidak melanggar privasi orang lain (doxing, share data tanpa izin).` },
  { judul: '4. Konten yang Dilarang', isi: `Konten berikut akan dihapus dan akun kamu bisa di-suspend:
• **Hate speech:** ujaran kebencian berbasis SARA, gender, orientasi seksual, disabilitas.
• **Disinformasi:** sengaja sebar berita palsu yang sudah dibantah otoritas kredibel.
• **Pelecehan:** stalking, bullying, ancaman fisik atau pencemaran nama baik.
• **Spam:** posting berulang tidak relevan, bot promosi, MLM/skema piramida.
• **Konten dewasa eksplisit:** termasuk gambar/video tidak senonoh.
• **Aktivitas ilegal:** narkoba, perdagangan manusia, penipuan, hacking.
• **Konten politik partisan koruptif:** smear campaign tanpa fakta, fitnah pejabat.

Pelanggaran berat bisa di-laporkan ke aparat sesuai UU ITE & UU Pers.` },
  { judul: '5. Moderasi & Penegakan', isi: `Moderasi dilakukan secara hibrida:
• **Auto-filter:** ML model untuk hate speech, spam, dan disinformasi dasar.
• **Komunitas:** sistem flag/report dari pengguna lain.
• **Tim moderator:** review manual untuk kasus ambigu.

Setiap penghapusan konten/suspend akun akan disertai alasan. Kamu bisa **banding** dalam 14 hari ke moderation@jubirwarga.id, dengan SLA respons 7 hari.

Penilaian akhir ada di tim moderator, mengacu pada Pedoman Komunitas yang transparan.` },
  { judul: '6. Pembayaran (untuk Kelas Berbayar)', isi: `• Harga kelas tertera di halaman kelas masing-masing, sudah termasuk pajak.
• Pembayaran via Midtrans (kartu kredit, QRIS, transfer bank, e-wallet).
• Refund 100% dalam 7 hari pertama setelah pembelian, atau setelah modul 1 selesai (mana yang lebih dulu).
• Kelas gratis tersedia melalui beasiswa — apply via form di halaman kelas.` },
  { judul: '7. Tanggung Jawab Platform', isi: `Jubir Warga adalah platform community-driven. Kami:
• **Tidak menjamin** kebenaran absolut setiap konten yang dibuat pengguna (termasuk klaim janji yang dilaporkan).
• **Berusaha** memverifikasi sumber data publik (janji pejabat, statistik, dll.) sebaik kami bisa.
• **Tidak bertanggung jawab** atas keputusan/aksi yang kamu ambil berdasarkan konten di platform.

Semua keputusan hukum, finansial, atau medis sebaiknya konsultasi dengan profesional bersertifikat.` },
  { judul: '8. Kekayaan Intelektual Platform', isi: `Branding "Jubir Warga", logo, mascot Nala, dan UI design adalah milik SPD Indonesia / PT Jubir Warga (dalam pembentukan). Tidak boleh digunakan tanpa izin tertulis.

Kode open source (jika dirilis nanti) akan tunduk pada lisensi MIT atau Apache 2.0 — diumumkan terpisah.` },
  { judul: '9. Perubahan Syarat', isi: `Syarat ini bisa berubah. Perubahan mayor (yang mengurangi hak kamu) akan diumumkan via email + banner platform 30 hari sebelum berlaku.

Penggunaan platform setelah tanggal efektif dianggap sebagai persetujuan terhadap syarat baru.` },
  { judul: '10. Hukum yang Berlaku & Penyelesaian Sengketa', isi: `Syarat ini tunduk pada hukum Republik Indonesia. Sengketa yang timbul akan diselesaikan secara musyawarah dulu.

Jika tidak tercapai dalam 60 hari, sengketa diselesaikan melalui Pengadilan Negeri Jakarta Pusat.` },
  { judul: '11. Kontak', isi: `Pertanyaan terkait syarat ini:
• Email umum: **hello@jubirwarga.id**
• Legal: **legal@jubirwarga.id**
• Moderasi: **moderation@jubirwarga.id**

Surat: SPD Indonesia, Jl. Cikini IV No.18, Menteng, Jakarta Pusat 10330.` },
];

function Syarat({ onNavigate }) {
  return (
    <div>
      <section className="py-12 border-b" style={{ background: CSY.cream, borderColor: CSY.line }}>
        <div className="max-w-3xl mx-auto px-6">
          <button onClick={() => onNavigate('beranda')} className="text-sm mb-6" style={{ color: CSY.coral }}>← Kembali</button>
          <SYPill color="blue" className="mb-3">📋 SYARAT & KETENTUAN</SYPill>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ color: CSY.blue }}>
            Syarat Penggunaan Jubir Warga
          </h1>
          <p className="text-base" style={{ color: CSY.ink + '99' }}>
            Aturan main supaya platform tetap aman, sehat, dan inklusif. Bahasa kami sederhana — kalau ada yang kurang jelas, tanyakan.
          </p>
          <p className="font-mono text-xs mt-4 opacity-70" style={{ color: CSY.ink }}>Versi 1.0 · Berlaku sejak 29 April 2026</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* TL;DR */}
          <div className="rounded-2xl p-5 mb-8" style={{ background: CSY.coral + '0E', border: `1px dashed ${CSY.coral + '66'}` }}>
            <p className="font-hand text-base mb-2" style={{ color: CSY.coral }}>TL;DR untuk yang gak punya waktu baca semua</p>
            <ul className="text-sm space-y-1" style={{ color: CSY.ink }}>
              <li>✓ Konten kamu, milik kamu. Kami cuma display & promote.</li>
              <li>✓ Hate speech, disinformasi, spam = dihapus + suspend.</li>
              <li>✓ Refund 7 hari untuk kelas berbayar.</li>
              <li>✓ Akun bisa kamu hapus kapan saja, semua data ikut hilang.</li>
              <li>✓ Sengketa: musyawarah dulu, baru pengadilan kalau gagal.</li>
            </ul>
          </div>

          {PASAL.map((p, i) => (
            <article key={i} id={`pasal-${i}`} className="mb-8">
              <h2 className="font-display font-bold text-xl md:text-2xl mb-3" style={{ color: CSY.blue }}>{p.judul}</h2>
              <div className="prose max-w-none text-sm leading-relaxed" style={{ color: CSY.ink }}>
                {p.isi.split('\n').map((line, j) => {
                  if (!line.trim()) return null;
                  if (line.startsWith('• ')) {
                    return <li key={j} className="ml-5 mb-2 list-disc" dangerouslySetInnerHTML={{__html: line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}} />;
                  }
                  return <p key={j} className="mb-3" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}} />;
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Syarat });

})();
