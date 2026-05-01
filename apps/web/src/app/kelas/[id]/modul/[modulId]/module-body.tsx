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

type Props = {
  videoUrl: string | null;
  transcript: string | null;
};

export function ModuleBody({ videoUrl, transcript }: Props) {
  const blocks = transcript ? parseBlocks(transcript) : [];

  return (
    <div className="space-y-6">
      {videoUrl && (
        <div className="rounded-jw-lg border border-dashed border-jw-line bg-jw-cream/40 p-6 text-center">
          <p className="text-sm font-semibold text-jw-blue">
            Video player segera tersedia (Sprint 4)
          </p>
          <p className="text-xs text-jw-muted mt-1">
            Untuk sekarang, baca transcript di bawah.
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-semibold text-jw-coral hover:underline"
          >
            Buka video di sumber asli ↗
          </a>
        </div>
      )}

      {blocks.length === 0 ? (
        <p className="text-sm text-jw-muted italic">
          Materi modul ini lagi disusun. Cek lagi nanti.
        </p>
      ) : (
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
      )}
    </div>
  );
}
