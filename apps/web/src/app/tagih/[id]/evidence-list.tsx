import { ExternalLink, FileText, Image, Video, BarChart3, Link as LinkIcon } from 'lucide-react';
import type { Database } from '@jw/data/types';

type EvidenceRow = Database['public']['Tables']['janji_evidence']['Row'];

const TYPE_ICON = {
  foto: Image,
  dokumen: FileText,
  video: Video,
  data: BarChart3,
  link: LinkIcon,
} as const;

const TYPE_LABEL = {
  foto: 'Foto',
  dokumen: 'Dokumen',
  video: 'Video',
  data: 'Data',
  link: 'Link',
} as const;

type EvidenceType = keyof typeof TYPE_ICON;

function isEvidenceType(v: string | null | undefined): v is EvidenceType {
  return typeof v === 'string' && v in TYPE_ICON;
}

export function EvidenceList({ evidence }: { evidence: EvidenceRow[] }) {
  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— bukti</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          {evidence.length} bukti tercatat
        </h3>
      </header>
      {evidence.length === 0 ? (
        <p className="text-sm text-jw-muted italic">
          Belum ada bukti. Warga bisa kirim bukti via fitur Lapor Sprint 4.
        </p>
      ) : (
        <ul className="space-y-2">
          {evidence.map((ev) => {
            const t = isEvidenceType(ev.type) ? ev.type : 'link';
            const Icon = TYPE_ICON[t];
            return (
              <li
                key={ev.id}
                className="flex items-start gap-3 rounded-jw-sm border border-jw-line bg-jw-cream/40 p-3"
              >
                <Icon
                  size={16}
                  aria-hidden
                  className="text-jw-coral flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-jw-blue">
                    {ev.title ?? TYPE_LABEL[t]}
                  </p>
                  {ev.source && (
                    <p className="text-xs text-jw-muted">
                      Sumber: {ev.source}
                    </p>
                  )}
                </div>
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka bukti ${ev.title ?? TYPE_LABEL[t]} di tab baru`}
                    className="flex-shrink-0 text-jw-coral hover:underline text-xs font-semibold inline-flex items-center gap-1"
                  >
                    Buka <ExternalLink size={11} aria-hidden />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
