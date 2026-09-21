import {
  Globe2,
  Users,
  GraduationCap,
  Handshake,
  BookOpen,
  TrendingUp,
  Heart,
  MapPin,
  Calendar,
  Mail,
  Lightbulb,
  MessageCircle,
  HandHeart,
  Users2,
  Map,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  globe: Globe2,
  users: Users,
  graduation: GraduationCap,
  handshake: Handshake,
  book: BookOpen,
  trending: TrendingUp,
  heart: Heart,
  pin: MapPin,
  calendar: Calendar,
  mail: Mail,
  lightbulb: Lightbulb,
  message: MessageCircle,
  handheart: HandHeart,
  users2: Users2,
  map: Map,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

export function getIcon(key: string | undefined | null): LucideIcon {
  if (key && key in ICONS) return ICONS[key as IconKey];
  return ICONS.globe;
}
