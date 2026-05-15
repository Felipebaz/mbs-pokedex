import Image from "next/image";
import Link from "next/link";
import type { PokemonSummary } from "@/src/types";
import TypeBadge from "@/src/components/TypeBadge";

interface PokemonListRowProps {
  pokemon: PokemonSummary;
  priority?: boolean;
}

function formatId(id: number): string {
  return `#${id.toString().padStart(3, "0")}`;
}

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function PokemonListRow({
  pokemon,
  priority = false,
}: PokemonListRowProps) {
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative h-16 w-16 shrink-0">
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.name}
          fill
          sizes="64px"
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          priority={priority}
        />
      </div>

      <span className="w-14 font-mono text-sm text-zinc-500 dark:text-zinc-400">
        {formatId(pokemon.id)}
      </span>

      <h3 className="flex-1 truncate text-lg font-semibold capitalize text-zinc-900 dark:text-zinc-50">
        {formatName(pokemon.name)}
      </h3>

      <div className="hidden flex-wrap items-center justify-end gap-1 sm:flex">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  );
}
