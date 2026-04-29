import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface ActionTileProps {
  to: string;
  icon: LucideIcon;
  emoji: string;
  title: string;
  tone?: "leaf" | "warm" | "earth";
}

const tones = {
  leaf: "bg-surface-leaf",
  warm: "bg-surface-warm",
  earth: "bg-earth-soft",
};

export const ActionTile = ({ to, icon: Icon, emoji, title, tone = "leaf" }: ActionTileProps) => (
  <Link to={to} className={`group flex min-h-28 sm:min-h-32 md:min-h-36 items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border p-3 sm:p-4 md:p-5 shadow-touch transition hover:-translate-y-1 hover:shadow-soft ${tones[tone]}`}>
    <span className="grid size-12 sm:size-14 md:size-16 shrink-0 place-items-center rounded-2xl sm:rounded-3xl bg-card text-3xl sm:text-4xl shadow-touch">{emoji}</span>
    <span className="flex-1 text-lg sm:text-xl md:text-2xl font-black leading-tight">{title}</span>
    <Icon className="size-6 sm:size-7 md:size-8 text-primary transition group-hover:scale-110" aria-hidden="true" />
  </Link>
);
