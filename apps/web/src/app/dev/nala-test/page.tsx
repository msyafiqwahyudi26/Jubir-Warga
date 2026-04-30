import { NalaMascot, type NalaExpression } from '@/components/nala/nala-mascot';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { JwLogo } from '@/components/jw-logo';
import { SquigglyUnderline } from '@/components/decor/squiggly-underline';
import { AnnotationTag } from '@/components/decor/annotation-tag';
import { DashedIllustrationFrame } from '@/components/decor/dashed-illustration-frame';
import { HeroBacaDokumen } from '@/components/illustrations/hero-baca-dokumen';

const EXPRESSIONS: NalaExpression[] = ['curious', 'excited', 'mentor', 'thinking', 'confident'];
const SIZES = [70, 120, 200];

export default function DevAuditPage() {
  return (
    <main className="min-h-screen bg-jw-cream p-8 pb-32">
      <h1 className="font-display text-3xl font-bold text-jw-blue">
        Spec #4 — checkpoint 2 (logo + 1st illustration)
      </h1>

      {/* ── JwLogo ─────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
          JwLogo — 4 sizes, 2 variants
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-jw-lg bg-white border border-jw-line p-8 flex flex-col gap-6 items-start">
            <span className="text-xs uppercase tracking-wider text-jw-ink/60">Default (blue on cream)</span>
            <JwLogo size={20} />
            <JwLogo size={32} />
            <JwLogo size={48} />
            <JwLogo size={64} />
            <JwLogo size={32} withSquiggly={false} />
          </div>
          <div className="rounded-jw-lg bg-jw-blue p-8 flex flex-col gap-6 items-start">
            <span className="text-xs uppercase tracking-wider text-jw-cream/60">Cream (on dark bg)</span>
            <JwLogo size={20} variant="cream" />
            <JwLogo size={32} variant="cream" />
            <JwLogo size={48} variant="cream" />
            <JwLogo size={64} variant="cream" />
            <JwLogo size={32} variant="cream" withSquiggly={false} />
          </div>
        </div>
      </section>

      {/* ── HeroBacaDokumen ────────────────────────────── */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
          HeroBacaDokumen — style anchor
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-jw-lg bg-white border border-jw-line p-6">
            <span className="text-xs text-jw-ink/60">size=200 on white</span>
            <div className="mt-2">
              <HeroBacaDokumen size={200} />
            </div>
          </div>
          <div className="rounded-jw-lg bg-jw-cream border border-jw-line p-6">
            <span className="text-xs text-jw-ink/60">size=280 on cream</span>
            <div className="mt-2">
              <HeroBacaDokumen size={280} />
            </div>
          </div>
          <DashedIllustrationFrame ratio="4/3" className="bg-white">
            <span className="absolute top-2 left-3 text-xs text-jw-ink/60">in DashedFrame</span>
            <HeroBacaDokumen size={240} />
          </DashedIllustrationFrame>
        </div>
      </section>

      {/* ── Decor sanity ───────────────────────────────── */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">Decor sanity</h2>
        <div className="rounded-jw-lg bg-white border border-jw-line p-8 flex flex-col gap-6">
          <div>
            <span className="font-display text-3xl font-bold text-jw-blue">Pasal 28E</span>
            <SquigglyUnderline width={180} />
          </div>
          <div className="flex gap-4 items-center">
            <AnnotationTag text="kamu juga bisa!" rotation={-4} />
            <AnnotationTag text="baca!" rotation={3} color="marigold" arrowDirection="right" />
            <AnnotationTag text="ini penting" rotation={-2} arrowDirection="none" />
          </div>
        </div>
      </section>

      {/* ── NalaMascot regression — quick re-check ─────── */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
          NalaMascot regression — 3 sizes × 5 expressions × 2 instances
        </h2>
        {SIZES.map((size) => (
          <div key={size} className="mt-6">
            <h3 className="text-sm font-mono text-jw-ink/60">size={size}</h3>
            <div className="grid grid-cols-5 gap-4 mt-2">
              {EXPRESSIONS.map((exp) => (
                <div key={exp} className="rounded-jw-md border border-jw-line bg-white p-3 flex flex-col items-center">
                  <div className="flex gap-2 items-end">
                    <NalaMascot expression={exp} size={size} />
                    <NalaMascot expression={exp} size={size} />
                  </div>
                  <span className="font-hand text-jw-coral mt-2 text-base">{exp}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Floating Nala trigger — bottom-right */}
      <NalaTriggerButton context="tentang halaman ini" />
    </main>
  );
}
