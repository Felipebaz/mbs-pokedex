import SearchBar from "@/src/components/SearchBar";
import { fetchPokemonGrid } from "@/src/lib/pokeapi";

export const metadata = {
  title: "Pokédex — Generation I",
  description:
    "Browse, search, and filter the original 151 Pokémon. Built with Next.js App Router and the PokéAPI.",
};

export default async function HomePage() {
  const pokemon = await fetchPokemonGrid(151);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Generation I
        </p>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Pokédex
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          The first 151 Pokémon, pre-rendered with the Next.js App Router and
          served from the public PokéAPI.
        </p>
      </header>

      <SearchBar pokemon={pokemon} />
    </main>
  );
}
