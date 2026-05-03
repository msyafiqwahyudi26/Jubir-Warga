'use client';

import { useEffect, useState, useTransition } from 'react';
import { Trophy } from 'lucide-react';
import { submitGameScoreAction } from '../actions';

type Choice = {
  id: string;
  nama: string;
};

type Props = {
  targetId: string;
  targetNama: string;
  targetPhotoUrl: string | null;
  clues: string[]; // 3 string, progressively revealed
  choices: Choice[]; // 4 entries, includes target
};

type GameStatus = 'playing' | 'won' | 'lost';

const STORAGE_KEY = 'jw-tebak-pejabat';

type StoredState = {
  date: string;
  picked: string[];
  status: GameStatus;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadStored(): StoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.date !== todayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStored(state: StoredState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const MAX_CLUES = 3;

export function TebakPejabatGame({
  targetId,
  targetNama,
  targetPhotoUrl,
  clues,
  choices,
}: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hydrated, setHydrated] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setPicked(stored.picked);
      setStatus(stored.status);
    }
    setHydrated(true);
  }, []);

  const cluesUsed = Math.min(MAX_CLUES, picked.length + 1);
  const wrongs = picked.filter((id) => id !== targetId).length;

  // Photo blur reduces with each clue revealed: 16px → 8px → 4px → 0
  const blurPx = Math.max(0, 16 - cluesUsed * 5);

  const handlePick = (choiceId: string) => {
    if (status !== 'playing' || picked.includes(choiceId)) return;

    const nextPicked = [...picked, choiceId];
    const correct = choiceId === targetId;
    let nextStatus: GameStatus = 'playing';
    if (correct) {
      nextStatus = 'won';
    } else if (nextPicked.length >= choices.length) {
      // Out of choices without correct → lost.
      nextStatus = 'lost';
    }

    setPicked(nextPicked);
    setStatus(nextStatus);
    saveStored({
      date: todayKey(),
      picked: nextPicked,
      status: nextStatus,
    });

    if (nextStatus !== 'playing') {
      const won = nextStatus === 'won';
      const cluesUsedAtEnd = Math.min(MAX_CLUES, nextPicked.length);
      const wrongsAtEnd = nextPicked.filter((id) => id !== targetId).length;
      const score = won
        ? Math.max(0, 100 - cluesUsedAtEnd * 10 - wrongsAtEnd * 5)
        : 0;
      const fd = new FormData();
      fd.set('game', 'tebak-pejabat');
      fd.set('score', String(score));
      fd.set('attempts', String(nextPicked.length));
      fd.set('won', String(won));
      startTransition(async () => {
        const result = await submitGameScoreAction(fd);
        if (!result.ok) setSubmitMessage(result.error);
        else setSubmitMessage(null);
      });
    }
  };

  return (
    <div data-testid="tebak-pejabat-game">
      {/* Photo */}
      <div className="rounded-jw-lg border border-jw-line bg-white p-5 mb-5">
        <div className="aspect-square w-40 mx-auto rounded-jw-md bg-jw-pill-blue-bg/40 flex items-center justify-center overflow-hidden">
          {hydrated && targetPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={targetPhotoUrl}
              alt={status === 'playing' ? 'Foto pejabat (disamarkan)' : `Foto ${targetNama}`}
              className="w-full h-full object-cover"
              style={{
                filter:
                  status !== 'playing' ? 'none' : `blur(${blurPx}px)`,
                transition: 'filter 400ms',
              }}
            />
          ) : (
            <span className="text-4xl font-display font-bold text-jw-blue/30">?</span>
          )}
        </div>

        <ul className="mt-4 space-y-2">
          {clues.slice(0, cluesUsed).map((clue, i) => (
            <li
              key={i}
              className="text-sm text-jw-ink rounded-jw-sm bg-jw-cream/40 border border-jw-line px-3 py-2"
            >
              <span className="font-semibold text-jw-coral mr-2">
                Clue {i + 1}:
              </span>
              {clue}
            </li>
          ))}
        </ul>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {choices.map((c) => {
          const isPicked = picked.includes(c.id);
          const isCorrect = isPicked && c.id === targetId;
          const isWrong = isPicked && c.id !== targetId;
          const cls = isCorrect
            ? 'border-jw-mint bg-jw-pill-mint-bg text-jw-pill-mint-text'
            : isWrong
              ? 'border-jw-coral bg-jw-pill-coral-bg text-jw-pill-coral-text line-through opacity-60'
              : 'border-jw-line bg-white text-jw-blue hover:border-jw-coral';
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handlePick(c.id)}
              disabled={status !== 'playing' || isPicked}
              className={`rounded-jw-md border px-4 py-3 text-sm font-semibold text-left transition disabled:cursor-not-allowed ${cls}`}
            >
              {c.nama}
            </button>
          );
        })}
      </div>

      {status === 'won' && (
        <Banner
          tone="success"
          title="Yes! Kamu kenal beliau."
          body={`${cluesUsed} clue · ${wrongs} salah · skor ${Math.max(
            0,
            100 - cluesUsed * 10 - wrongs * 5,
          )}`}
        />
      )}
      {status === 'lost' && (
        <Banner
          tone="fail"
          title="Belum kena hari ini."
          body={`Pejabatnya: ${targetNama}. Balik besok!`}
        />
      )}
      {submitMessage && (
        <Banner tone="fail" title="Catatan dari server" body={submitMessage} />
      )}
    </div>
  );
}

function Banner({
  tone,
  title,
  body,
}: {
  tone: 'success' | 'fail';
  title: string;
  body: string;
}) {
  const cls =
    tone === 'success'
      ? 'bg-jw-pill-mint-bg text-jw-pill-mint-text border-jw-mint/30'
      : 'bg-jw-pill-coral-bg text-jw-pill-coral-text border-jw-coral/30';
  return (
    <div className={`mt-5 rounded-jw-md border px-4 py-3 ${cls}`}>
      <p className="inline-flex items-center gap-2 font-semibold">
        <Trophy size={14} aria-hidden /> {title}
      </p>
      <p className="text-sm mt-0.5">{body}</p>
    </div>
  );
}
