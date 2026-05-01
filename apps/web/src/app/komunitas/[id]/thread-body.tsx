export function ThreadBody({ body }: { body: string }) {
  const paragraphs = body.split('\n\n').filter(Boolean);
  if (paragraphs.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">
        Thread ini gak punya body. Mungkin cuma judul yang penting.
      </p>
    );
  }
  return (
    <div className="space-y-4 text-jw-ink leading-relaxed">
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderInline(p)}
        </p>
      ))}
    </div>
  );
}

// Lightweight markdown — only **bold** for now. Mirror of NalaMessageBubble's
// renderInline; kept local to avoid an early shared-utility abstraction.
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
