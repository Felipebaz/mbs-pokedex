import Image from "next/image";
import Link from "next/link";
import type { PokemonSummary } from "@/src/types";
import TypeBadge from "@/src/components/TypeBadge";

interface PokemonCardProps {
  pokemon: PokemonSummary;
  priority?: boolean;
}

function formatId(id: number): string {
  return `#${id.toString().padStart(3, "0")}`;
}

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="self-end font-mono text-xs text-zinc-500 dark:text-zinc-400">
        {formatId(pokemon.id)}
      </span>
      <div className="relative h-32 w-32">
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.name}
          fill
          sizes="(min-width: 1024px) 128px, (min-width: 640px) 25vw, 40vw"
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          priority={priority}
        />
      </div>
      <h3 className="text-lg font-semibold capitalize text-zinc-900 dark:text-zinc-50">
        {formatName(pokemon.name)}
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  );
}
