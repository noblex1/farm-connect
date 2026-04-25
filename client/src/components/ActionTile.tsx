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
  <Link to={to} className={`group flex min-h-36 items-center gap-4 rounded-3xl border p-5 shadow-touch transition hover:-translate-y-1 hover:shadow-soft ${tones[tone]}`}>
    <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-card text-4xl shadow-touch">{emoji}</span>
    <span className="flex-1 text-2xl font-black leading-tight">{title}</span>
    <Icon className="size-8 text-primary transition group-hover:scale-110" aria-hidden="true" />
  </Link>
);
