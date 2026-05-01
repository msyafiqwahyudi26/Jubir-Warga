'use client';

import { NALA_SUGGESTIONS } from './nala-prompts';
import { useNalaStore } from '@/lib/nala/store';
import { getMockResponse } from '@/lib/nala/mock-responses';

type Props = {
  className?: string;
};

export function NalaPromptChips({ className }: Props) {
  const mode = useNalaStore((s) => s.mode);
  const addMessage = useNalaStore((s) => s.addMessage);
  const setResponding = useNalaStore((s) => s.setResponding);
  const isResponding = useNalaStore((s) => s.isResponding);

  const prompts = NALA_SUGGESTIONS.filter((p) => p.mode === mode).slice(0, 4);

  const handleClick = async (text: string) => {
    if (isResponding) return;
    addMessage({ role: 'user', content: text });
    setResponding(true);
    await new Promise((r) => setTimeout(r, 800));
    const { content, citations } = getMockResponse(text);
    addMessage({ role: 'nala', content, citations });
    setResponding(false);
  };

  return (
    <div className={`grid grid-cols-1 gap-2 ${className ?? ''}`}>
      {prompts.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => handleClick(p.text)}
          disabled={isResponding}
          className="text-left rounded-jw-md border border-jw-line bg-white px-3 py-2.5 text-sm text-jw-ink hover:border-jw-coral hover:bg-jw-pill-coral-bg/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {p.text}
        </button>
      ))}
    </div>
  );
}
