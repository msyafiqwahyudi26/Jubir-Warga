'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

export function ShareProfileButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== 'undefined'
      ? new URL(`/u/${username}`, window.location.origin).toString()
      : `/u/${username}`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `Profil @${username} — Jubir Warga`,
          url: fullUrl,
        });
        return;
      } catch {
        // User canceled / unsupported — fall through to copy.
      }
    }
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked — silently fail.
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm font-semibold text-jw-blue hover:bg-jw-pill-blue-bg transition"
      >
        <Share2 size={14} aria-hidden /> Bagikan
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Salin link profil"
        className="inline-flex items-center gap-1.5 rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm font-semibold text-jw-blue hover:bg-jw-pill-blue-bg transition"
      >
        {copied ? (
          <>
            <Check size={14} aria-hidden /> Tersalin
          </>
        ) : (
          <>
            <LinkIcon size={14} aria-hidden /> Salin link
          </>
        )}
      </button>
    </div>
  );
}
