import type { ReactNode } from 'react';

type Ratio = '4/3' | '1/1' | '3/4';

type Props = {
  children: ReactNode;
  ratio?: Ratio;
  className?: string;
};

const RATIO_CLASS: Record<Ratio, string> = {
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
};

export function DashedIllustrationFrame({
  children,
  ratio = '4/3',
  className,
}: Props) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-3xl',
        'border-2 border-dashed border-jw-line',
        'bg-jw-blue/[0.04]',
        'flex flex-col items-center justify-center',
        RATIO_CLASS[ratio],
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
