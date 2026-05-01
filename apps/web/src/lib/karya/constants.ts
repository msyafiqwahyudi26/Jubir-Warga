import type { KaryaType } from '@jw/data/types';

export const TYPE_OPTIONS: {
  id: KaryaType;
  label: string;
  meta_label: string;
}[] = [
  { id: 'Tulisan', label: 'Tulisan', meta_label: 'mnt baca' },
  { id: 'Vlog', label: 'Vlog', meta_label: 'durasi' },
  { id: 'Ilustrasi', label: 'Ilustrasi', meta_label: 'panel' },
  { id: 'Podcast', label: 'Podcast', meta_label: 'durasi' },
  { id: 'Zine', label: 'Zine', meta_label: 'halaman' },
];

// Brand pill color per Karya type. Drives card placeholder bg + pill chip.
export type KaryaPillColor = 'blue' | 'coral' | 'mint' | 'marigold' | 'grey';

export const TYPE_PILL_COLOR: Record<KaryaType, KaryaPillColor> = {
  Tulisan: 'blue',
  Vlog: 'coral',
  Ilustrasi: 'mint',
  Podcast: 'marigold',
  Zine: 'grey',
};

// Tailwind class lookup. Listed explicitly so the JIT keeps the classes
// (dynamic `bg-jw-pill-${color}-bg` strings get tree-shaken otherwise).
export const PILL_CLASS: Record<KaryaPillColor, string> = {
  blue: 'bg-jw-pill-blue-bg text-jw-pill-blue-text',
  coral: 'bg-jw-pill-coral-bg text-jw-pill-coral-text',
  mint: 'bg-jw-pill-mint-bg text-jw-pill-mint-text',
  marigold: 'bg-jw-pill-marigold-bg text-jw-pill-marigold-text',
  grey: 'bg-jw-pill-grey-bg text-jw-pill-grey-text',
};
