import { ExternalLink } from 'lucide-react';

type Props = {
  topik: string | null;
  janjiText: string;
  sourceQuote: string | null;
  sourceUrl: string | null;
  deadline: string | null;
};

export function JanjiBody({
  topik,
  janjiText,
  sourceQuote,
  sourceUrl,
  deadline,
}: Props) {
  return (
    <div className="space-y-5">
      {topik && (
        <p className="text-xs uppercase tracking-wider text-jw-muted font-semibold">
          Topik:{' '}
          <span className="text-jw-blue">{topik}</span>
        </p>
      )}
      <blockquote className="border-l-4 border-jw-coral pl-5 font-display italic text-jw-ink/90 text-xl md:text-2xl leading-snug">
        {janjiText}
      </blockquote>
      {sourceQuote && (
        <p className="text-sm text-jw-ink/70 leading-relaxed whitespace-pre-wrap">
          {sourceQuote}
        </p>
      )}
      <div className="flex items-center gap-4 text-xs text-jw-muted flex-wrap">
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-jw-coral hover:underline"
          >
            <ExternalLink size={11} aria-hidden /> Sumber kutipan
          </a>
        )}
        {deadline && (
          <span>
            Deadline:{' '}
            <span className="font-semibold text-jw-blue">{deadline}</span>
          </span>
        )}
      </div>
    </div>
  );
}
