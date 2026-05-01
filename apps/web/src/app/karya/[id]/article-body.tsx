type Block = { kind: 'p' | 'h2' | 'quote'; text: string };

function parseBlocks(body: string): Block[] {
  return body
    .split('\n\n')
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b): Block => {
      if (b.startsWith('## ')) return { kind: 'h2', text: b.slice(3).trim() };
      if (b.startsWith('> ')) return { kind: 'quote', text: b.slice(2).trim() };
      return { kind: 'p', text: b };
    });
}

function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIdx = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) out.push(text.slice(lastIdx, match.index));
    out.push(
      <strong key={key++} className="font-semibold text-jw-blue">
        {match[1]}
      </strong>,
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return out;
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = parseBlocks(body);

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">
        Tulisan belum tersedia. Penulis lagi finalisasi draft.
      </p>
    );
  }

  return (
    <article className="space-y-5 text-jw-ink leading-[1.75] text-base md:text-lg">
      {blocks.map((b, i) => {
        if (b.kind === 'h2') {
          return (
            <h2
              key={i}
              className="font-display text-2xl md:text-3xl font-bold text-jw-blue mt-10 mb-2"
            >
              {b.text}
            </h2>
          );
        }
        if (b.kind === 'quote') {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-jw-coral pl-5 my-6 font-display italic text-jw-ink/80 text-lg md:text-xl"
            >
              {renderInline(b.text)}
            </blockquote>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(b.text)}
          </p>
        );
      })}
    </article>
  );
}
