import { KategoriTransport } from './emoji/kategori-transport';
import { KategoriPangan } from './emoji/kategori-pangan';
import { StatusDitepati } from './emoji/status-ditepati';
import { StatusMandek } from './emoji/status-mandek';
import { ReaksiLove } from './emoji/reaksi-love';

const EMOJIS = {
  'kategori-transport': KategoriTransport,
  'kategori-pangan': KategoriPangan,
  'status-ditepati': StatusDitepati,
  'status-mandek': StatusMandek,
  'reaksi-love': ReaksiLove,
} as const;

export type JWEmojiName = keyof typeof EMOJIS;

type Props = {
  name: JWEmojiName;
  size?: number;
  className?: string;
};

export function JWEmoji({ name, size = 24, className }: Props) {
  const Emoji = EMOJIS[name];
  if (!Emoji) return null;
  return <Emoji size={size} className={className} />;
}
