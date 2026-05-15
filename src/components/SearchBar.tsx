"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { PokemonSummary, PokemonTypeName } from "@/src/types";
import PokemonCard from "@/src/components/PokemonCard";
import PokemonListRow from "@/src/components/PokemonListRow";
import TypeBadge from "@/src/components/TypeBadge";

type ViewMode = "grid" | "list";

interface SearchBarProps {
  pokemon: PokemonSummary[];
}

const ALL_TYPES_VALUE = "all";

function uniqueTypes(pokemon: PokemonSummary[]): PokemonTypeName[] {
  const set = new Set<PokemonTypeName>();
  for (const entry of pokemon) {
    for (const type of entry.types) {
      set.add(type);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function renderResults({
  filtered,
  viewMode,
}: {
  filtered: PokemonSummary[];
  viewMode: ViewMode;
}) {
  if (filtered.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        No Pokémon match those filters.
      </p>
    );
  }
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filtered.map((entry, index) => (
          <PokemonCard key={entry.id} pokemon={entry} priority={index < 6} />
        ))}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {filtered.map((entry, index) => (
        <li key={entry.id}>
          <PokemonListRow pokemon={entry} priority={index < 6} />
        </li>
      ))}
    </ul>
  );
}

export default function SearchBar({ pokemon }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string>(ALL_TYPES_VALUE);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const deferredQuery = useDeferredValue(query);

  const availableTypes = useMemo(() => uniqueTypes(pokemon), [pokemon]);

  const filtered = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    return pokemon.filter((entry) => {
      const matchesType =
        activeType === ALL_TYPES_VALUE ||
        entry.types.includes(activeType as PokemonTypeName);
      if (!matchesType) return false;
      if (!normalized) return true;
      if (entry.name.toLowerCase().includes(normalized)) return true;
      return String(entry.id) === normalized;
    });
  }, [pokemon, deferredQuery, activeType]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex w-full max-w-md flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or Pokédex number..."
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-base text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </label>
        <div className="flex items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {filtered.length} / {pokemon.length} Pokémon
          </p>
          <div
            role="group"
            aria-label="View mode"
            className="inline-flex rounded-full border border-zinc-300 bg-white p-1 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-900"
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={`rounded-full px-3 py-1 transition ${
                viewMode === "grid"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`rounded-full px-3 py-1 transition ${
                viewMode === "list"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveType(ALL_TYPES_VALUE)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            activeType === ALL_TYPES_VALUE
              ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          All
        </button>
        {availableTypes.map((type) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(isActive ? ALL_TYPES_VALUE : type)}
              className={`rounded-full transition ${
                isActive ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 dark:ring-offset-zinc-950" : "opacity-80 hover:opacity-100"
              }`}
              aria-pressed={isActive}
            >
              <TypeBadge type={type} />
            </button>
          );
        })}
      </div>

      {renderResults({ filtered, viewMode })}
    </div>
  );
}
