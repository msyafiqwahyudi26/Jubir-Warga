export const PASPOR_PAGES = [
  { id: 'cover', label: 'Cover' },
  { id: 'identitas', label: 'Identitas' },
  { id: 'stempel', label: 'Stempel' },
  { id: 'visa', label: 'Visa' },
] as const;

export type PasporPageId = (typeof PASPOR_PAGES)[number]['id'];

export const PROFILE_TABS = [
  { id: 'ktp', label: 'KTP Warga' },
  { id: 'kontribusi', label: 'Kontribusi' },
  { id: 'pengaturan', label: 'Pengaturan' },
] as const;

export type ProfileTabId = (typeof PROFILE_TABS)[number]['id'];

// DiceBear identicon — deterministic SVG avatar per username. No upload
// required Sprint 3; replaceable Sprint 4 with Supabase Storage.
export function dicebearAvatarUrl(seed: string, size = 96): string {
  const safeSeed = encodeURIComponent(seed || 'warga');
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${safeSeed}&size=${size}`;
}
