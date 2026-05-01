'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';
import { getMockResponse } from '@/lib/nala/mock-responses';

export function NalaComposer() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useNalaStore((s) => s.addMessage);
  const setResponding = useNalaStore((s) => s.setResponding);
  const isResponding = useNalaStore((s) => s.isResponding);

  // Auto-resize textarea up to a max height.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isResponding) return;
    addMessage({ role: 'user', content: trimmed });
    setText('');
    setResponding(true);
    await new Promise((r) => setTimeout(r, 800));
    const { content, citations } = getMockResponse(trimmed);
    addMessage({ role: 'nala', content, citations });
    setResponding(false);
  };

  const canSend = text.trim().length > 0 && !isResponding;

  return (
    <div className="border-t border-jw-line p-3 bg-jw-cream">
      <div className="flex items-end gap-2 rounded-jw-lg border border-jw-line bg-white p-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Tanya Nala apa aja..."
          rows={1}
          disabled={isResponding}
          aria-label="Pesan untuk Nala"
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-snug max-h-32 px-1 py-1.5 text-jw-ink placeholder:text-jw-muted disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Kirim pesan"
          className="p-2 rounded-jw-md bg-jw-coral text-white hover:bg-jw-coral/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Send size={16} aria-hidden />
        </button>
      </div>
      {isResponding && (
        <div className="mt-2 px-1 text-xs text-jw-muted flex items-center gap-1.5">
          <span className="inline-flex gap-0.5" aria-hidden>
            <span
              className="w-1.5 h-1.5 rounded-full bg-jw-coral animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-jw-coral animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-jw-coral animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </span>
          Nala lagi mikir...
        </div>
      )}
    </div>
  );
}
