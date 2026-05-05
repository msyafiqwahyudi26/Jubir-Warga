/**
 * RegionTag — small uppercase pill yang nandain level pemerintahan
 * (PUSAT/PROVINSI/KOTA).
 *
 * Per Spec #34 visual parity Wave 1, step 4. Wrapper kecil di atas
 * <Pill tone="grey"> dengan typography tweak (10px tracking-wide bold).
 */
import { Pill } from './pill';

export type RegionLevel = 'nasional' | 'provinsi' | 'kabupaten_kota';

const REGION_LABEL: Record<RegionLevel, string> = {
  nasional: 'PUSAT',
  provinsi: 'PROVINSI',
  kabupaten_kota: 'KOTA',
};

export function RegionTag({
  level,
  className = '',
}: {
  level: RegionLevel;
  className?: string;
}) {
  return (
    <Pill
      tone="grey"
      className={`text-[10px] font-bold tracking-wide ${className}`}
    >
      {REGION_LABEL[level]}
    </Pill>
  );
}

export function isRegionLevel(v: string | null | undefined): v is RegionLevel {
  return v === 'nasional' || v === 'provinsi' || v === 'kabupaten_kota';
}
