'use client';

import { useEffect, useState, useTransition } from 'react';
import { ExternalLink, Sparkles, Flame, Target } from 'lucide-react';
import {
  ALIGNMENT_STATUSES,
  STORAGE_KEY,
  VERDICT_OPTIONS,
  type AlignmentStatus,
  scoreForGuess,
} from '@/lib/main/janji-vs-realita/constants';
import {
  appendResult,
  calculateAccuracy,
  calculateStreak,
  findResult,
  loadScore,
  saveScore,
  type ScoreState,
} from '@/lib/main/janji-vs-realita/score-calculator';
import { todayKey } from '@/lib/main/janji-vs-realita/janji-of-day';
import { submitJanjiVsRealitaScoreAction } from './actions';

type Props = {
  janjiId: string;
  janjiText: string;
  topik: string | null;
  pejabatNama: string | null;
  pejabatJabatan: string | null;
  truthVerdict: AlignmentStatus;
  reasoning: string;
  sourceUrl: string | null;
  sourcePage: number | null;
  editorialStatus: 'verified_curator' | 'curated_ai';
};

type GamePhase = 'predict' | 'reveal';

const EMPTY: ScoreState = { version: 1, history: [] };

export function GameClient({
  janjiId,
  janjiText,
  topik,
  pejabatNama,
  pejabatJabatan,
  truthVerdict,
  reasoning,
  sourceUrl,
  sourcePage,
  editorialStatus,
}: Props) {
  const [phase, setPhase] = useState<GamePhase>('predict');
  const [picked, setPicked] = useState<AlignmentStatus | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [score, setScore] = useState<ScoreState>(EMPTY);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Hydrate from localStorage. Kalau hari ini sudah main, skip ke reveal.
  useEffect(() => {
    const storage = window.localStorage;
    const loaded = loadScore(storage, STORAGE_KEY);
    setScore(loaded);
    const today = findResult(loaded, todayKey());
    if (today && today.janjiId === janjiId) {
      setPicked(today.guess);
      setPhase('reveal');
    }
    setHydrated(true);
  }, [janjiId]);

  const handlePick = (verdict: AlignmentStatus) => {
    if (phase !== 'predict' || picked) return;
    setPicked(verdict);
    setPhase('reveal');

    const correct = verdict === truthVerdict;
    const date = todayKey();
    const newScore = appendResult(score, {
      date,
      guess: verdict,
      correct,
      janjiId,
    });
    setScore(newScore);
    saveScore(window.localStorage, STORAGE_KEY, newScore);

    // Server sync (best-effort). Anonymous-OK; logged-in saves to leaderboard.
    const fd = new FormData();
    fd.set('score', String(scoreForGuess(correct)));
    fd.set('attempts', '1');
    fd.set('won', String(correct));
    startTransition(async () => {
      const result = await submitJanjiVsRealitaScoreAction(fd);
      if (!result.ok) setSubmitMessage(result.error);
      else setSubmitMessage(null);
    });
  };

  const correctOpt = VERDICT_OPTIONS.find((v) => v.id === truthVerdict);
  const pickedOpt = picked
    ? VERDICT_OPTIONS.find((v) => v.id === picked)
    : null;
  const isCorrect = picked === truthVerdict;

  const streak = hydrated ? calculateStreak(score) : 0;
  const acc = hydrated ? calculateAccuracy(score) : { total: 0, correct: 0, pct: 0 };

  return (
    <div data-testid="janji-vs-realita-game">
      {/* Janji card — yang lagi di-tebak */}
      <article className="rounded-jw-lg border border-jw-line bg-white p-5 mb-6">
        <header className="flex items-start gap-3 flex-wrap mb-3">
          {topik && (
            <span className="inline-flex items-center rounded-jw-sm bg-jw-pill-blue-bg text-jw-blue text-xs font-semibold px-2 py-0.5">
              {topik}
            </span>
          )}
          {pejabatNama && (
            <span className="text-xs text-jw-muted">
              {pejabatJabatan ? `${pejabatJabatan} · ` : ''}
              <span className="font-semibold text-jw-blue">{pejabatNama}</span>
            </span>
          )}
        </header>
        <p className="font-display text-lg md:text-xl font-semibold text-jw-blue leading-snug">
          {janjiText}
        </p>
      </article>

      {/* Predict phase: 4-verdict button */}
      {phase === 'predict' && hydrated && (
        <>
          <p className="text-sm text-jw-ink/70 mb-3">
            Menurut kamu, janji vs realita-nya gimana?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Pilih verdict">
            {VERDICT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={false}
                onClick={() => handlePick(opt.id)}
                className={`rounded-jw-md border-2 ${opt.pillBorder} ${opt.pillBg} ${opt.pillText} px-4 py-3 text-left transition active:scale-[0.97] hover:shadow-jw-md min-h-[64px] flex flex-col gap-0.5`}
              >
                <span className="font-display font-bold text-base">{opt.label}</span>
                <span className="text-xs opacity-80">{opt.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Reveal phase */}
      {phase === 'reveal' && pickedOpt && correctOpt && (
        <RevealPanel
          isCorrect={isCorrect}
          pickedOpt={pickedOpt}
          correctOpt={correctOpt}
          reasoning={reasoning}
          sourceUrl={sourceUrl}
          sourcePage={sourcePage}
          editorialStatus={editorialStatus}
        />
      )}

      {/* Stats footer (always shown post-hydration) */}
      {hydrated && score.history.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatCard
            Icon={Flame}
            label="Streak"
            value={`${streak} hari`}
            accent="text-jw-coral"
          />
          <StatCard
            Icon={Target}
            label="Akurasi"
            value={`${acc.pct}%`}
            sub={`${acc.correct}/${acc.total} tebakan`}
            accent="text-jw-blue"
          />
        </div>
      )}

      {submitMessage && (
        <div className="mt-4 rounded-jw-md bg-jw-pill-coral-bg border border-jw-coral/30 px-3 py-2 text-sm text-jw-pill-coral-text">
          {submitMessage}
        </div>
      )}
    </div>
  );
}

function RevealPanel({
  isCorrect,
  pickedOpt,
  correctOpt,
  reasoning,
  sourceUrl,
  sourcePage,
  editorialStatus,
}: {
  isCorrect: boolean;
  pickedOpt: (typeof VERDICT_OPTIONS)[number];
  correctOpt: (typeof VERDICT_OPTIONS)[number];
  reasoning: string;
  sourceUrl: string | null;
  sourcePage: number | null;
  editorialStatus: 'verified_curator' | 'curated_ai';
}) {
  return (
    <div>
      {/* Verdict pills — picked vs correct side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <article
          className={`rounded-jw-md border-2 ${pickedOpt.pillBorder} ${pickedOpt.pillBg} ${pickedOpt.pillText} px-4 py-3 ${
            !isCorrect ? 'opacity-70 line-through' : ''
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
            Tebakan kamu
          </p>
          <p className="font-display font-bold text-base">{pickedOpt.label}</p>
        </article>
        <article
          className={`rounded-jw-md border-2 ${correctOpt.pillBorder} ${correctOpt.pillBg} ${correctOpt.pillText} px-4 py-3`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
            Verdict kurator
          </p>
          <p className="font-display font-bold text-base">{correctOpt.label}</p>
        </article>
      </div>

      {/* Outcome banner */}
      <div
        className={`mt-4 rounded-jw-md border px-4 py-3 ${
          isCorrect
            ? 'bg-jw-pill-mint-bg text-jw-pill-mint-text border-jw-mint/30'
            : 'bg-jw-pill-marigold-bg text-jw-pill-marigold-text border-jw-marigold/30'
        }`}
      >
        <p className="inline-flex items-center gap-2 font-semibold">
          <Sparkles size={14} aria-hidden />
          {isCorrect ? 'Tepat! Tebakan kamu cocok kurator.' : 'Beda dari kurator — bukan berarti salah, beda perspektif boleh.'}
        </p>
      </div>

      {/* Reasoning */}
      <article className="mt-4 rounded-jw-lg border border-jw-line bg-white p-5">
        <header className="flex items-center gap-2 mb-2">
          <span className="font-hand text-jw-coral text-sm">— alasan</span>
          <VerificationBadge status={editorialStatus} />
        </header>
        <p className="text-sm text-jw-ink leading-relaxed whitespace-pre-line">
          {reasoning}
        </p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-jw-coral hover:underline"
          >
            Sumber dokumen
            {sourcePage != null && ` · hal. ${sourcePage}`}
            <ExternalLink size={12} aria-hidden />
          </a>
        )}
      </article>
    </div>
  );
}

function VerificationBadge({
  status,
}: {
  status: 'verified_curator' | 'curated_ai';
}) {
  // Spec #34 admin layer akan provide reusable badge — sementara inline.
  if (status === 'verified_curator') {
    return (
      <span className="inline-flex items-center rounded-jw-sm bg-jw-pill-mint-bg text-jw-pill-mint-text text-[10px] font-semibold px-2 py-0.5">
        Terverifikasi Kurator
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-jw-sm bg-jw-pill-blue-bg text-jw-blue text-[10px] font-semibold px-2 py-0.5">
      Kurasi AI
    </span>
  );
}

function StatCard({
  Icon,
  label,
  value,
  sub,
  accent,
}: {
  Icon: typeof Flame;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-3">
      <div className="flex items-center gap-1.5 text-xs text-jw-muted">
        <Icon size={12} aria-hidden className={accent} />
        {label}
      </div>
      <p className="mt-1 font-mono font-bold text-jw-blue text-xl leading-none">
        {value}
      </p>
      {sub && <p className="text-[10px] text-jw-muted mt-1">{sub}</p>}
    </article>
  );
}

// Re-export for tests / future consumers.
export { ALIGNMENT_STATUSES };
