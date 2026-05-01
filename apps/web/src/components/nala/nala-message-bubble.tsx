import type { Message } from '@/lib/nala/types';
import { NalaMascot } from './nala-mascot';

type Props = {
  message: Message;
};

export function NalaMessageBubble({ message }: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-jw-lg border border-jw-line bg-jw-pill-blue-bg px-3.5 py-2.5 text-sm leading-relaxed text-jw-ink whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  const lines = message.content.split('\n');

  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0 mt-0.5">
        <NalaMascot expression="mentor" size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-jw-lg border border-jw-line bg-white px-3.5 py-2.5 text-sm leading-relaxed text-jw-ink space-y-2">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            return (
              <p key={idx} className="whitespace-pre-wrap">
                {renderInline(line)}
              </p>
            );
          })}
        </div>
        {message.citations && message.citations.length > 0 && (
          <ol className="mt-2 space-y-1 text-xs text-jw-muted">
            {message.citations.map((c) => (
              <li key={c.index} className="flex gap-1.5">
                <span className="font-mono text-jw-coral">[{c.index}]</span>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-jw-coral truncate"
                  >
                    {c.title}
                  </a>
                ) : (
                  <span>{c.title}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// Light-touch markdown: **bold** and [n] citation refs. We deliberately avoid a
// full parser — Sprint 2 mock copy is curated, so this is enough.
function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[\d+\])/g;
  let lastIdx = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      out.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      out.push(
        <strong key={key++} className="font-semibold text-jw-blue">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      out.push(
        <sup key={key++} className="font-mono text-jw-coral">
          {token}
        </sup>,
      );
    }
    lastIdx = match.index + token.length;
  }
  if (lastIdx < text.length) {
    out.push(text.slice(lastIdx));
  }
  return out;
}
