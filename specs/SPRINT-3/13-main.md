# Spec #13 — Main games (Tebak Kata + Tebak Pejabat)

**Sprint**: 3
**Owner**: Claude Code (executor instance #1) · audited oleh planner
**Estimasi**: 1.5-2.5 jam
**Dependency**: Spec #6, #6.5, pattern dari #7-#12
**Decisions Mas (approved 2026-05-01):**
1. ✅ Tebak Kata Hari Ini (Wordle-clone) — port dari Phase 1 dengan anti-pattern fix ("civic" → "warga", "Citizen" → "Tebak Kata")
2. ✅ Game #2: **Tebak Pejabat** — leverage 14 pejabat seed real dengan foto + clue + 4-choice
3. ✅ Daily streak + leaderboard top 3 — game tracking via `game_scores` table

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual (anti-pattern: "civic" + "Citizen" banned)
2. `apps/legacy/src/pages/main/Index.jsx` — Phase 1 reference (Tebak Kata UI + leaderboard)
3. `apps/legacy/src/pages/main/TebakKata.jsx` — Phase 1 game logic
4. `specs/SPRINT-3/07-12` — pattern Server+Client split + auth gate
5. `packages/data/src/queries.ts` — game_scores related (kalau ada) atau direct supabase
6. `packages/data/src/types.ts` — `GameScore`, `GameType`, `Pejabat`

---

## Goal

Port halaman Main dari Phase 1 ke Phase 2 dengan 2 daily game:
- **Tebak Kata Hari Ini** (Wordle-clone) — 5 huruf, 6 percobaan, kata terkait warga/demokrasi
- **Tebak Pejabat** (Game #2 baru) — foto pejabat blurred + 3 clue + 4 multiple choice, leverage 14 pejabat seed
- **Daily streak** indicator + **Top 3 leaderboard** per game

Setelah spec ini selesai:
- Header nav "Main" jalan
- Daily game cycle (Tebak Kata + Tebak Pejabat) functional
- Score tracked di `game_scores` table (Sprint 4 add achievement badge)
- Streak tampil di header user (Sprint 4 polish)

🚨 **Anti-pattern Phase 1 yang HARUS di-fix:**
- "Citizen Wordle" → **"Tebak Kata Hari Ini"** (Tebak kata 5 huruf · 6 percobaan)
- "Kata civic 5 huruf" → **"Kata warga 5 huruf"**
- Emoji "🎮 Game Hari Ini" + "🔥 5 hari streak" → Lucide Gamepad2 + Flame icon

---

## File yang dibuat

```
apps/web/src/app/main/
├── page.tsx                            Index — Server, hero + 2 game card + leaderboard
├── tebak-kata/
│   ├── page.tsx                        Tebak Kata page Server
│   ├── tebak-kata-game.tsx             Client — Wordle game state + tile grid + keyboard
│   └── leaderboard-tebak-kata.tsx      Server — Top 3 hari ini
├── tebak-pejabat/
│   ├── page.tsx                        Tebak Pejabat page Server
│   ├── tebak-pejabat-game.tsx          Client — Foto blur + clue + 4-choice
│   └── leaderboard-tebak-pejabat.tsx   Server — Top 3 hari ini

apps/web/src/lib/main/
├── constants.ts                        WORDS_OF_DAY (50 kata 5-huruf), KEYBOARD_LAYOUT (QWERTY ID)
├── word-of-day.ts                      pickWordOfDay(date) deterministic dari WORDS_OF_DAY
├── pejabat-of-day.ts                   pickPejabatOfDay(date, pejabatList) deterministic
└── streak.ts                           calculateStreak(scores[]) consecutive days

apps/web/src/app/main/
└── actions.ts                          submitGameScoreAction (Zod, insert game_scores)

apps/web/src/__tests__/
├── word-of-day.test.ts                 Test deterministic + cover 365 days
├── pejabat-of-day.test.ts              Test deterministic
├── streak.test.ts                      Test consecutive days calculation
└── tebak-kata-game.test.tsx            Test win/lose/keyboard input
```

## File yang diubah

```
apps/web/src/components/site-header.tsx
  — Verify nav "Main" href={'/main'} match (mungkin sudah benar)
```

---

## Step-by-step

### 1. Constants — kata-kata 5 huruf brand-aligned

**`apps/web/src/lib/main/constants.ts`:**

```ts
/**
 * 50+ kata 5-huruf brand-aligned (warga, demokrasi, partisipasi, lokal context).
 * Sprint 4 expand jadi 365+ kata (1 tahun rotation).
 */
export const WORDS_OF_DAY: string[] = [
  'WARGA', 'PILIH', 'JANJI', 'LURAH', 'KAMPUS',  // 5-huruf actually KAMPUS=6, filter
  'KOTAJ', 'SUARA', 'PESAN', 'AKSII', 'HUKUM',
  // ... TODO Claude Code: pilih 50 kata 5-huruf relevan, valid Bahasa Indonesia
  // Topik: politik dasar (PILIH, SUARA, JANJI, PILEG, PILGUB), 
  //        komunitas (WARGA, KAMPUS via filter, FORUM, GROUP via skip),
  //        aksi (PETIS via filter, AKSII, LAPOR), 
  //        media (BERITA via filter, KORAN via filter, RADIO),
  //        umum (RUMAH, TANAH, NEGARA via filter), dll.
  // VALIDATION: semua harus tepat 5 huruf, uppercase, no spasi/special char.
];

export const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const MAX_ATTEMPTS = 6;
export const WORD_LENGTH = 5;
```

### 2. Word picker deterministic per day

**`apps/web/src/lib/main/word-of-day.ts`:**

```ts
import { WORDS_OF_DAY } from './constants';

/**
 * Deterministic word picker — same date = same word for all users.
 * Sprint 4: replace dengan DB-tracked daily_word table biar admin bisa override.
 */
export function pickWordOfDay(date: Date): string {
  // Days since 2026-01-01 reference
  const epoch = new Date('2026-01-01T00:00:00Z').getTime();
  const dayIndex = Math.floor((date.getTime() - epoch) / (1000 * 60 * 60 * 24));
  return WORDS_OF_DAY[Math.abs(dayIndex) % WORDS_OF_DAY.length];
}

export function todayWord(): string {
  return pickWordOfDay(new Date());
}
```

**`apps/web/src/lib/main/pejabat-of-day.ts`:**

```ts
import type { Pejabat } from '@jw/data/types';

export function pickPejabatOfDay(date: Date, pejabatList: Pejabat[]): Pejabat | null {
  if (pejabatList.length === 0) return null;
  const epoch = new Date('2026-01-01T00:00:00Z').getTime();
  const dayIndex = Math.floor((date.getTime() - epoch) / (1000 * 60 * 60 * 24));
  return pejabatList[Math.abs(dayIndex) % pejabatList.length] ?? null;
}
```

### 3. Streak calculator

**`apps/web/src/lib/main/streak.ts`:**

```ts
import type { GameScore } from '@jw/data/types';

/**
 * Hitung consecutive days play (any game) sebagai streak.
 * Skip 1 hari = reset streak ke 0.
 */
export function calculateStreak(scores: GameScore[]): number {
  if (scores.length === 0) return 0;
  const dates = new Set(
    scores.map((s) => new Date(s.played_at).toISOString().slice(0, 10))
  );
  let streak = 0;
  const today = new Date();
  for (let offset = 0; offset < 365; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
    } else if (offset > 0) {
      break;
    } else {
      // Today gak main yet — start counting from yesterday
      continue;
    }
  }
  return streak;
}
```

### 4. Server Action

**`apps/web/src/app/main/actions.ts`:**

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const submitSchema = z.object({
  game:     z.enum(['tebak-kata', 'tebak-pejabat']),
  score:    z.coerce.number().int().min(0).max(100),
  attempts: z.coerce.number().int().min(1).max(10),
  won:      z.coerce.boolean(),
});

export async function submitGameScoreAction(formData: FormData) {
  const parsed = submitSchema.safeParse({
    game:     formData.get('game'),
    score:    formData.get('score'),
    attempts: formData.get('attempts'),
    won:      formData.get('won') === 'true',
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/main/${parsed.data.game}`);
  }

  // Check kalau hari ini udah play (one-game-per-day)
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await supabase
    .from('game_scores')
    .select('id')
    .eq('user_id', user.id)
    .eq('game', parsed.data.game)
    .gte('played_at', today)
    .maybeSingle();

  if (existing) {
    return { ok: false, error: 'Hari ini sudah dimainkan, balik besok!' };
  }

  const { error } = await supabase
    .from('game_scores')
    .insert({ ...parsed.data, user_id: user.id });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/main/${parsed.data.game}`);
  revalidatePath('/main');
  return { ok: true };
}
```

### 5. Index page

**`apps/web/src/app/main/page.tsx`:**

```tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Gamepad2, Flame, Trophy, ArrowRight } from 'lucide-react';
import { calculateStreak } from '@/lib/main/streak';
import { todayWord } from '@/lib/main/word-of-day';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export default async function MainPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let streak = 0;
  if (user) {
    const { data: scores } = await supabase
      .from('game_scores')
      .select('played_at')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(60);
    streak = calculateStreak(scores ?? []);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-jw-line pb-6">
        <div>
          <span className="font-hand text-jw-coral text-base">— main bareng</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
            Main
          </h1>
          <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
            Ringan, harian, tetap ada bobotnya.
          </p>
        </div>
        {user && (
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 text-jw-coral">
              <Flame size={20} aria-hidden />
              <span className="font-mono font-bold text-2xl">{streak}</span>
            </div>
            <p className="text-xs text-jw-muted">hari berturut-turut</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tebak Kata */}
        <Link
          href="/main/tebak-kata"
          className="group rounded-jw-xl bg-jw-blue text-jw-cream p-6 hover:bg-jw-blue-soft transition flex flex-col"
        >
          <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-cream/15 text-jw-cream text-xs font-bold px-2 py-0.5 self-start">
            <Gamepad2 size={11} aria-hidden /> GAME HARI INI
          </span>
          <h2 className="font-display text-2xl font-bold mt-3 leading-tight">
            Tebak Kata Hari Ini
          </h2>
          <p className="text-sm opacity-80 mt-2">
            Tebak kata warga 5 huruf · 6 percobaan
          </p>
          <span className="inline-flex items-center gap-1 mt-auto pt-4 text-sm font-semibold text-jw-coral">
            Main sekarang <ArrowRight size={14} aria-hidden />
          </span>
        </Link>

        {/* Tebak Pejabat */}
        <Link
          href="/main/tebak-pejabat"
          className="group rounded-jw-xl bg-jw-coral text-white p-6 hover:bg-jw-coral/90 transition flex flex-col"
        >
          <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-white/15 text-white text-xs font-bold px-2 py-0.5 self-start">
            <Trophy size={11} aria-hidden /> GAME #2
          </span>
          <h2 className="font-display text-2xl font-bold mt-3 leading-tight">
            Tebak Pejabat
          </h2>
          <p className="text-sm opacity-90 mt-2">
            Foto blur + 3 clue · 4 pilihan
          </p>
          <span className="inline-flex items-center gap-1 mt-auto pt-4 text-sm font-semibold text-jw-cream">
            Main sekarang <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
      </div>

      <NalaTriggerButton context="tentang Main" />
    </div>
  );
}

export const metadata = { title: 'Main — Jubir Warga' };
```

### 6. Tebak Kata page + game

**`apps/web/src/app/main/tebak-kata/page.tsx`:** Server, fetch leaderboard top 3 + render game (Client) + leaderboard.

**`tebak-kata-game.tsx`** (Client) — Wordle game logic:
- State: guesses[], currentGuess, gameStatus (playing/won/lost)
- Tile grid 6x5 dengan flip animation per row
- Virtual keyboard (QWERTY)
- Color coding: hijau (correct + position), kuning (correct, wrong position), abu (wrong)
- On win/lose: submit score via `submitGameScoreAction`
- Persist state ke localStorage (key per date) — gak bisa main 2x sehari di same browser

**`leaderboard-tebak-kata.tsx`** (Server) — Top 3 hari ini:
```tsx
const today = new Date().toISOString().slice(0, 10);
const { data } = await supabase
  .from('game_scores')
  .select('user_id, score, attempts, profiles(name, username, chapter_id)')
  .eq('game', 'tebak-kata')
  .gte('played_at', today)
  .order('attempts', { ascending: true })
  .limit(3);
```
Render: 3 row dengan rank icon (Lucide Trophy/Medal/Award untuk 1/2/3), nama + chapter + score.

### 7. Tebak Pejabat page + game

**`apps/web/src/app/main/tebak-pejabat/page.tsx`:** Server, fetch list pejabat dari `pejabat` table, pickPejabatOfDay, render game (Client) + leaderboard.

**`tebak-pejabat-game.tsx`** (Client):
- State: revealedClues (1-3), selectedAnswer, gameStatus
- Foto pejabat blurred (CSS `filter: blur(20px)` initial, reduce per clue)
- 3 clue progressively revealed: jabatan → level → topik fokus
- 4 multiple choice (1 correct + 3 random dari pejabat list)
- Score: 100 - (10 * clues_used) - (5 * wrong_attempts)
- On answer: submit via Server Action

**`leaderboard-tebak-pejabat.tsx`** (Server) — mirror Tebak Kata leaderboard.

### 8. Tests

- **`word-of-day.test.ts`** — same date = same word, different date = different (sample 7 days), modulo coverage
- **`pejabat-of-day.test.ts`** — deterministic + null on empty list
- **`streak.test.ts`** — consecutive days, skip-day reset, today-not-yet-counted
- **`tebak-kata-game.test.tsx`** — win scenario, lose scenario, keyboard input handling

---

## Acceptance checklist

- [ ] `/main` render: hero + 2 game card + streak indicator (kalau logged in)
- [ ] Tebak Kata card link ke `/main/tebak-kata`
- [ ] Tebak Pejabat card link ke `/main/tebak-pejabat`
- [ ] `/main/tebak-kata` render: tile grid 6x5 + virtual keyboard + leaderboard
- [ ] Tebak Kata: keyboard click input, ENTER submit, BACKSPACE delete
- [ ] Tile color coding: hijau (correct+pos), kuning (correct+wrong pos), abu (wrong)
- [ ] Win/lose: modal/toast tampil + submit score
- [ ] Anti-pattern fixed: "Tebak Kata Hari Ini" + "Kata warga 5 huruf" (NO "civic", NO "Citizen")
- [ ] One-game-per-day: state persist localStorage + server check
- [ ] Anonymous: bisa main, tapi score gak tersimpan + redirect kalau coba submit
- [ ] `/main/tebak-pejabat` render: foto blurred + 3 clue progressive + 4 choice
- [ ] Tebak Pejabat: leverage pejabat real seed (14 dari DB)
- [ ] Score formula: 100 - (10*clues) - (5*wrong)
- [ ] Leaderboard top 3 per game render dengan Trophy/Medal/Award icon
- [ ] Streak indicator di /main: Lucide Flame + count
- [ ] Header nav "Main" link jalan
- [ ] Floating "Tanya Nala tentang Main" coral pill
- [ ] `pnpm test` pass dengan 4 test baru → total 159+
- [ ] `pnpm typecheck` + `pnpm lint` pass

## Out of scope (defer Sprint 4+)

- ❌ Daily admin override word/pejabat — Sprint 4 (DB table `daily_word_override`)
- ❌ Achievement badge auto-award (streak milestone) — Sprint 4
- ❌ Multi-language word set — post-launch
- ❌ Game #3+ (Pasal Match, Janji Trivia) — Sprint 4-5
- ❌ Streak indicator di header user (di luar /main) — Sprint 4 polish
- ❌ Share game result (Wordle-style emoji grid) — Sprint 4 (custom SVG emoji ready dulu)
- ❌ Notification "Game Hari Ini sudah keluar" — Sprint 4

## Notes untuk planner audit

Aku akan audit:
- File 12 baru sesuai
- "civic" + "Citizen" 0 occurrences di rendered HTML
- Tebak Kata mechanics correct (color coding, keyboard, state)
- Tebak Pejabat leverage pejabat real seed (14 entries)
- Idempotency one-game-per-day (localStorage + server check)
- Score formula correct
- Test count tambah 4 jadi 159+

## Commit message

```
feat(main): port Main page dengan Tebak Kata + Tebak Pejabat games

- /main — hero + 2 game card + streak indicator (Flame icon)
- /main/tebak-kata — Wordle-clone 5 huruf 6 percobaan, virtual keyboard,
  tile color coding hijau/kuning/abu, leaderboard top 3
- /main/tebak-pejabat — foto blurred + 3 clue progressive + 4 multiple choice,
  leverage 14 pejabat real seed
- submitGameScoreAction: Zod-validated, one-game-per-day enforce
- streak calculator: consecutive days play
- Anti-pattern fixed: "Citizen Wordle" → "Tebak Kata Hari Ini",
  "Kata civic 5 huruf" → "Kata warga 5 huruf"
- 4 test baru: word-of-day, pejabat-of-day, streak, tebak-kata-game
- Per Spec #13 + decisions Mas (Tebak Pejabat leverage pejabat seed)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add apps/web/src/app/main/ apps/web/src/lib/main/ \
        apps/web/src/__tests__/{word-of-day,pejabat-of-day,streak,tebak-kata-game}.test.* \
        specs/SPRINT-3/13-main.md
```

## Coordinate paralel dengan Window 2 (Mock Nala)

**Strict file ownership — JANGAN edit file Mock Nala scope:**
- ❌ `apps/web/src/lib/nala/mock-responses.ts` (Window 2 ownership)
- ❌ `apps/web/src/__tests__/lib-nala-mock-responses.test.ts` (Window 2)
- ❌ `apps/web/src/components/nala/nala-prompts.ts` (Window 2 mungkin edit)

✅ Boleh import `NalaTriggerButton` dari `components/nala/` (just import, no modify).

Coordinate timing push: pull dulu sebelum push, kalau Mock Nala udah commit, rebase clean.
