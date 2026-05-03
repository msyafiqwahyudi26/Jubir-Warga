'use client';

import { useEffect, useState, useTransition } from 'react';
import { Gamepad2 } from 'lucide-react';
import {
  KEYBOARD_LAYOUT,
  MAX_ATTEMPTS,
  WORD_LENGTH,
  evaluateGuess,
  scoreForAttempt,
  type TileState,
} from '@/lib/main/constants';
import { todayKey } from '@/lib/main/word-of-day';
import { submitGameScoreAction } from '../actions';

type GameStatus = 'playing' | 'won' | 'lost';

type StoredState = {
  date: string;
  guesses: string[];
  status: GameStatus;
};

const STORAGE_KEY = 'jw-tebak-kata';

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
    // storage blocked — fail silent
  }
}

type Props = {
  answer: string;
};

export function TebakKataGame({ answer }: Props) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hydrated, setHydrated] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Hydrate from localStorage on first client render only.
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setGuesses(stored.guesses);
      setStatus(stored.status);
    }
    setHydrated(true);
  }, []);

  const handleSubmitGuess = (finalGuess: string) => {
    const nextGuesses = [...guesses, finalGuess];
    let nextStatus: GameStatus = 'playing';
    if (finalGuess === answer) nextStatus = 'won';
    else if (nextGuesses.length >= MAX_ATTEMPTS) nextStatus = 'lost';

    setGuesses(nextGuesses);
    setCurrent('');
    setStatus(nextStatus);
    saveStored({
      date: todayKey(),
      guesses: nextGuesses,
      status: nextStatus,
    });

    if (nextStatus !== 'playing') {
      const won = nextStatus === 'won';
      const attempts = nextGuesses.length;
      const score = won ? scoreForAttempt(attempts) : 0;
      const fd = new FormData();
      fd.set('game', 'tebak-kata');
      fd.set('score', String(score));
      fd.set('attempts', String(attempts));
      fd.set('won', String(won));
      startTransition(async () => {
        const result = await submitGameScoreAction(fd);
        if (!result.ok) setSubmitMessage(result.error);
        else setSubmitMessage(null);
      });
    }
  };

  const handleKey = (key: string) => {
    if (status !== 'playing') return;
    if (key === 'ENTER') {
      if (current.length !== WORD_LENGTH) return;
      handleSubmitGuess(current);
    } else if (key === 'BACKSPACE') {
      setCurrent((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      setCurrent((prev) =>
        prev.length < WORD_LENGTH ? prev + key : prev,
      );
    }
  };

  // Physical keyboard listener.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      const k = e.key.toUpperCase();
      if (k === 'ENTER' || k === 'BACKSPACE' || /^[A-Z]$/.test(k)) {
        e.preventDefault();
        handleKey(k);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, guesses]);

  // Compute per-key best state for keyboard color hint.
  const keyState: Record<string, TileState> = {};
  for (const g of guesses) {
    const evald = evaluateGuess(g, answer);
    for (let i = 0; i < g.length; i++) {
      const letter = g[i]!;
      const state = evald[i]!;
      const prev = keyState[letter];
      if (state === 'correct') keyState[letter] = 'correct';
      else if (state === 'present' && prev !== 'correct')
        keyState[letter] = 'present';
      else if (!prev && state === 'absent') keyState[letter] = 'absent';
    }
  }

  return (
    <div data-testid="tebak-kata-game">
      <Grid
        guesses={guesses}
        current={hydrated && status === 'playing' ? current : ''}
        answer={answer}
      />
      <Keyboard onKey={handleKey} keyState={keyState} disabled={status !== 'playing'} />

      {status === 'won' && (
        <Banner
          tone="success"
          title="Mantap! Tebakan tepat."
          body={`${guesses.length}/${MAX_ATTEMPTS} percobaan · skor ${scoreForAttempt(
            guesses.length,
          )}`}
        />
      )}
      {status === 'lost' && (
        <Banner
          tone="fail"
          title="Belum kena hari ini."
          body={`Jawabannya: ${answer}. Balik besok!`}
        />
      )}
      {submitMessage && (
        <Banner tone="fail" title="Catatan dari server" body={submitMessage} />
      )}
    </div>
  );
}

function Grid({
  guesses,
  current,
  answer,
}: {
  guesses: string[];
  current: string;
  answer: string;
}) {
  const rows: { letters: string[]; states: TileState[] }[] = [];
  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    const guess = guesses[r];
    if (guess !== undefined) {
      rows.push({
        letters: guess.split(''),
        states: evaluateGuess(guess, answer),
      });
    } else if (r === guesses.length) {
      const padded = current
        .padEnd(WORD_LENGTH, ' ')
        .split('')
        .map((c) => (c === ' ' ? '' : c));
      rows.push({
        letters: padded,
        states: padded.map((c) => (c ? 'pending' : 'empty')) as TileState[],
      });
    } else {
      rows.push({
        letters: Array.from({ length: WORD_LENGTH }, () => ''),
        states: Array.from({ length: WORD_LENGTH }, () => 'empty') as TileState[],
      });
    }
  }

  return (
    <div className="grid gap-1.5 mb-5" role="grid" aria-label="Tile grid">
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-5 gap-1.5">
          {row.letters.map((ch, c) => (
            <Tile key={c} letter={ch} state={row.states[c] ?? 'empty'} />
          ))}
        </div>
      ))}
    </div>
  );
}

const TILE_CLASS: Record<TileState, string> = {
  correct: 'bg-jw-pill-mint-bg text-jw-pill-mint-text border-jw-mint',
  present: 'bg-jw-pill-marigold-bg text-jw-pill-marigold-text border-jw-marigold',
  absent: 'bg-jw-pill-grey-bg text-jw-muted border-jw-line',
  pending: 'bg-white text-jw-blue border-jw-blue/40',
  empty: 'bg-white text-jw-blue border-jw-line',
};

function Tile({ letter, state }: { letter: string; state: TileState }) {
  return (
    <div
      role="gridcell"
      data-state={state}
      className={`aspect-square flex items-center justify-center rounded-jw-sm border-2 font-display text-2xl font-bold uppercase ${TILE_CLASS[state]}`}
    >
      {letter}
    </div>
  );
}

function Keyboard({
  onKey,
  keyState,
  disabled,
}: {
  onKey: (k: string) => void;
  keyState: Record<string, TileState>;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5" aria-label="Keyboard virtual">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((k) => {
            const isSpecial = k === 'ENTER' || k === 'BACKSPACE';
            const state = keyState[k];
            const stateCls = state ? TILE_CLASS[state] : 'bg-white';
            return (
              <button
                key={k}
                type="button"
                onClick={() => onKey(k)}
                disabled={disabled}
                aria-label={k}
                className={`rounded-jw-sm border border-jw-line text-xs font-semibold py-2.5 transition disabled:opacity-50 ${stateCls} ${
                  isSpecial ? 'px-3 min-w-[60px]' : 'px-2 min-w-[28px] sm:min-w-[34px]'
                }`}
              >
                {k === 'BACKSPACE' ? '⌫' : k}
              </button>
            );
          })}
        </div>
      ))}
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
        <Gamepad2 size={14} aria-hidden /> {title}
      </p>
      <p className="text-sm mt-0.5">{body}</p>
    </div>
  );
}
