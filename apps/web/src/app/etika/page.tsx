import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, Bot, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etika Komunitas',
  description:
    'Aturan diskusi + verification badge + AI verdict disclaimer Jubir Warga. Fact-grounded, non-partisan, hormati perbedaan pendapat.',
};

export default function EtikaPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <span className="font-hand text-jw-coral text-base" aria-hidden="true">
          — etika & editorial
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Etika Komunitas
        </h1>
        <p className="mt-3 text-base text-jw-ink/70">
          Aturan main biar rumah warga ini tetap nyaman buat ngumpul, bersuara,
          berkarya, belajar — plus cara kami review janji + verdict AI di Tagih
          Janji.
        </p>
      </header>

      <div className="space-y-5 text-jw-ink/90 leading-relaxed">
        <h2 className="font-display text-2xl font-bold text-jw-blue mt-2 mb-3">
          Verification badge (Tagih Janji)
        </h2>
        <p>
          Setiap janji + verdict di Jubir Warga punya badge transparency. Tujuannya simple — kamu
          bisa langsung tau seberapa jauh konten itu sudah dikalibrasi:
        </p>
        <div className="space-y-3 mt-4">
          <div className="rounded-jw-lg border border-jw-line bg-white p-4 flex gap-3">
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-jw-pill-mint-bg text-jw-pill-mint-text w-10 h-10"
              aria-hidden="true"
            >
              <CheckCircle2 size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-jw-blue">
                Terverifikasi Kurator
              </h3>
              <p className="text-sm text-jw-ink/80 mt-1">
                Direview manual oleh tim editorial Jubir Warga. Verdict + reasoning sudah
                dikalibrasi dengan dokumen sumber + konteks editorial. Bobot terberat dalam
                trust signal kami.
              </p>
            </div>
          </div>
          <div className="rounded-jw-lg border border-jw-line bg-white p-4 flex gap-3">
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-jw-pill-blue-bg text-jw-pill-blue-text w-10 h-10"
              aria-hidden="true"
            >
              <Bot size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-jw-blue">Kurasi AI</h3>
              <p className="text-sm text-jw-ink/80 mt-1">
                Auto-generated dari pipeline AI (embedding + LLM Claude). Di-tag transparan,
                masih dapat diakses publik tetapi belum melalui review manual. Cocok untuk
                signal awal, tidak final.
              </p>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          AI verdict disclaimer
        </h2>
        <div className="rounded-jw-lg border border-jw-marigold/30 bg-jw-pill-marigold-bg/40 p-5 flex gap-3">
          <AlertTriangle
            size={20}
            className="flex-shrink-0 text-jw-pill-marigold-text mt-0.5"
            aria-hidden
          />
          <div>
            <p className="text-sm text-jw-ink leading-relaxed">
              Verdict AI di Live Watch dibuat berdasarkan analisis dokumen publik —{' '}
              <strong>bukan tuduhan final</strong>. Tone non-accusatory. Kalau pejabat publik
              keberatan / mau klarifikasi, mereka berhak request right-of-reply yang akan kami
              tampilkan side-by-side dengan verdict. (Mekanisme right-of-reply dalam pengembangan
              Sprint 5+.)
            </p>
          </div>
        </div>
        <p className="mt-4">Verdict 4-tier yang kami pakai:</p>
        <ul className="space-y-2 list-disc list-outside pl-5">
          <li>
            <strong className="text-jw-pill-mint-text">Aligned</strong> — sesuai dengan dokumen
            sumber.
          </li>
          <li>
            <strong className="text-jw-pill-blue-text">Partial</strong> — sebagian sesuai, sebagian
            belum.
          </li>
          <li>
            <strong className="text-jw-pill-marigold-text">Drift</strong> — perlu klarifikasi
            (bukan langsung &ldquo;ingkar&rdquo;).
          </li>
          <li>
            <strong className="text-jw-pill-coral-text">Contradict</strong> — bertentangan dengan
            reference.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Komunitas guidelines
        </h2>
        <ul className="space-y-3 list-none pl-0">
          <li className="flex gap-3">
            <ShieldCheck
              size={20}
              className="flex-shrink-0 text-jw-mint mt-0.5"
              aria-hidden
            />
            <span>
              <strong className="text-jw-blue">Diskusi fact-grounded</strong> — argumen berdasar
              data, bukan attack personal.
            </span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck
              size={20}
              className="flex-shrink-0 text-jw-mint mt-0.5"
              aria-hidden
            />
            <span>
              <strong className="text-jw-blue">Hormati perbedaan pendapat</strong> — debat sehat
              boleh, attack pribadi nggak.
            </span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck
              size={20}
              className="flex-shrink-0 text-jw-mint mt-0.5"
              aria-hidden
            />
            <span>
              <strong className="text-jw-blue">Non-partisan</strong> — kami tidak endorse partai
              atau kandidat tertentu. Kontributor juga diharapkan menjaga distance ini.
            </span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck
              size={20}
              className="flex-shrink-0 text-jw-mint mt-0.5"
              aria-hidden
            />
            <span>
              <strong className="text-jw-blue">No hate speech / SARA / fitnah / hoaks</strong>.
              Konten yang melanggar akan dihapus.
            </span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck
              size={20}
              className="flex-shrink-0 text-jw-mint mt-0.5"
              aria-hidden
            />
            <span>
              <strong className="text-jw-blue">Akuntabilitas adalah dukungan</strong> — kami
              kritis pada fakta, bukan oposisi politis.
            </span>
          </li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">Moderasi</h2>
        <p>
          Setiap konten user-generated bisa dilaporkan via tombol &ldquo;laporan&rdquo; di setiap
          thread/reply. Tim editorial akan review dalam 1×24 jam. Aksi mungkin: warning, mute
          sementara, hapus konten, atau ban akun (untuk pelanggaran berat berulang).
        </p>

        <h2 className="font-display text-2xl font-bold text-jw-blue mt-10 mb-3">
          Banding & kontak
        </h2>
        <p>
          Kalau kamu kena moderasi dan merasa keliru, atau punya keberatan terhadap verdict AI
          tertentu, kirim ke{' '}
          <a
            href="mailto:info@jubirwarga.id"
            className="text-jw-coral font-semibold hover:underline"
          >
            info@jubirwarga.id
          </a>
          . Tim editorial akan respond dalam 3 hari kerja.
        </p>

        <p className="mt-6 text-sm text-jw-muted">
          Lihat juga:{' '}
          <Link href="/privasi" className="text-jw-coral font-semibold hover:underline">
            Privasi
          </Link>
          {' · '}
          <Link href="/syarat" className="text-jw-coral font-semibold hover:underline">
            Syarat &amp; Ketentuan
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
