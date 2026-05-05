import Link from 'next/link';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { HeroBacaDokumen } from '@/components/illustrations/hero-baca-dokumen';
import { SquigglyUnderline } from '@/components/decor/squiggly-underline';
import { AnnotationTag } from '@/components/decor/annotation-tag';

// Spec #32+33 Beranda hero — DUAL-LAYER framing (Mas clarification 2026-05-05):
//   Layer 1 (brand-wide):    "Suara warga, rumahnya di sini." (tagline yang
//                            tetap di seluruh app — ekosistem 6 fitur).
//   Layer 2 (Sprint 4 spot): "Setiap janji punya jejak."     (Tagih Janji
//                            jadi pilar yang di-spotlight di sprint ini).
//
// Tone: Gen Z hangat. Tagih bukan pengganti ekosistem — cuma yang lagi
// dikerjain dalam.
export function HeroTagihSpotlight() {
  return (
    <section className="border-b border-jw-line py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <span
              className="font-hand text-lg text-jw-coral"
              aria-hidden="true"
            >
              — jubir warga
            </span>
            <h1 className="font-display font-bold mt-2 leading-tight text-jw-blue text-4xl md:text-5xl lg:text-6xl">
              Suara warga,
              <br />
              <em>rumahnya di sini.</em>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-jw-ink/80">
              Ngumpul, bersuara, berkarya, belajar — bareng warga muda Indonesia
              17–39 tahun.
            </p>

            {/* Sprint 4 spotlight — di-emphasize via card kecil, tone hangat */}
            <div className="mt-7 rounded-jw-lg border border-jw-coral/30 bg-jw-pill-coral-bg/30 p-4 md:p-5">
              <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-coral text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                spotlight
              </span>
              <p className="mt-2 font-display text-xl md:text-2xl text-jw-blue leading-snug">
                Hari ini kita mulai dari{' '}
                <span className="relative inline-block text-jw-coral">
                  <em>Tagih Janji.</em>
                  <span className="absolute left-0 right-0 -bottom-1.5">
                    <SquigglyUnderline width={170} thickness={3} />
                  </span>
                </span>
              </p>
              <p className="mt-2 font-hand text-lg text-jw-coral">
                Setiap janji punya jejak.
              </p>
              <p className="mt-2 text-sm text-jw-ink/75 leading-relaxed">
                Pantau bareng — janji pejabat dari RPJMN/RPJMD &amp; visi misi
                paslon, dianalisis AI, ditagih bareng-bareng.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/tagih"
                  className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-jw-coral/90 transition active:scale-[0.97] duration-200"
                >
                  Tagih sekarang <ArrowRight size={14} aria-hidden />
                </Link>
                <Link
                  href="/main/janji-vs-realita"
                  className="inline-flex items-center gap-1.5 rounded-jw-md border border-jw-line bg-white px-5 py-2.5 text-sm font-semibold text-jw-blue hover:bg-jw-pill-grey-bg transition"
                >
                  <Gamepad2 size={14} aria-hidden /> Main Janji vs Realita
                </Link>
              </div>
            </div>

            <p className="mt-5 text-sm text-jw-muted">
              Atau{' '}
              <Link
                href="/komunitas"
                className="font-semibold text-jw-coral hover:underline"
              >
                ngumpul di Komunitas
              </Link>{' '}
              dulu — yang lagi rame minggu ini ada di bawah.
            </p>
          </div>

          <div className="hidden md:block relative w-80">
            <HeroBacaDokumen size={320} />
            <span className="absolute -top-1 right-2">
              <AnnotationTag
                text="audit santai"
                rotation={-6}
                arrowDirection="left"
              />
            </span>
            <span className="absolute -bottom-2 left-2">
              <AnnotationTag
                text="kamu juga bisa"
                rotation={4}
                color="marigold"
                arrowDirection="none"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
