import type { PokemonTypeName } from "@/src/types";

const TYPE_CLASSES: Record<PokemonTypeName, string> = {
  normal: "bg-stone-400 text-stone-50 border-stone-500",
  fire: "bg-orange-500 text-orange-50 border-orange-600",
  water: "bg-blue-500 text-blue-50 border-blue-600",
  electric: "bg-yellow-400 text-yellow-900 border-yellow-500",
  grass: "bg-green-500 text-green-50 border-green-600",
  ice: "bg-cyan-300 text-cyan-900 border-cyan-400",
  fighting: "bg-red-700 text-red-50 border-red-800",
  poison: "bg-purple-500 text-purple-50 border-purple-600",
  ground: "bg-amber-600 text-amber-50 border-amber-700",
  flying: "bg-indigo-300 text-indigo-900 border-indigo-400",
  psychic: "bg-pink-500 text-pink-50 border-pink-600",
  bug: "bg-lime-500 text-lime-50 border-lime-600",
  rock: "bg-yellow-700 text-yellow-50 border-yellow-800",
  ghost: "bg-violet-700 text-violet-50 border-violet-800",
  dragon: "bg-indigo-700 text-indigo-50 border-indigo-800",
  dark: "bg-neutral-700 text-neutral-50 border-neutral-800",
  steel: "bg-slate-400 text-slate-900 border-slate-500",
  fairy: "bg-pink-300 text-pink-900 border-pink-400",
};

const UNKNOWN_TYPE_CLASS = "bg-zinc-500 text-zinc-50 border-zinc-600";

function classesFor(type: string): string {
  return TYPE_CLASSES[type as PokemonTypeName] ?? UNKNOWN_TYPE_CLASS;
}

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export default function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const sizeClasses =
    size === "md"
      ? "px-3 py-1 text-sm"
      : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${sizeClasses} ${classesFor(type)}`}
    >
      {type}
    </span>
  );
}
