type Props = {
  text: string;
  rotation?: number;
  color?: 'coral' | 'marigold';
  arrowDirection?: 'left' | 'right' | 'none';
  className?: string;
};

const COLOR_CLASS: Record<NonNullable<Props['color']>, string> = {
  coral: 'text-jw-coral',
  marigold: 'text-jw-marigold',
};

export function AnnotationTag({
  text,
  rotation = -4,
  color = 'coral',
  arrowDirection = 'left',
  className,
}: Props) {
  return (
    <span
      className={[
        'inline-block font-hand text-base md:text-lg leading-none whitespace-nowrap',
        COLOR_CLASS[color],
        className ?? '',
      ].join(' ')}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {arrowDirection === 'left' && '← '}
      {text}
      {arrowDirection === 'right' && ' →'}
    </span>
  );
}
