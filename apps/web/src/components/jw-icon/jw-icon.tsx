import { HomeIcon } from './icons/home';
import { MessageIcon } from './icons/message';
import { UserIcon } from './icons/user';
import { SearchIcon } from './icons/search';
import { BellIcon } from './icons/bell';

const ICONS = {
  home: HomeIcon,
  message: MessageIcon,
  user: UserIcon,
  search: SearchIcon,
  bell: BellIcon,
} as const;

export type JWIconName = keyof typeof ICONS;

type Props = {
  name: JWIconName;
  size?: number;
  className?: string;
  color?: string;
};

export function JWIcon({ name, size = 20, className, color = 'currentColor' }: Props) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} color={color} />;
}
