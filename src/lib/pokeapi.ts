import type {
  PokemonDetail,
  PokemonListResponse,
  PokemonSummary,
  PokemonTypeName,
} from "@/src/types";

const API_BASE = "https://pokeapi.co/api/v2";
const FALLBACK_SPRITE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

const FETCH_OPTIONS: RequestInit = {
  next: { revalidate: 86_400 },
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, FETCH_OPTIONS);
  if (!response.ok) {
    throw new Error(
      `PokéAPI request failed (${response.status} ${response.statusText}): ${url}`,
    );
  }
  return (await response.json()) as T;
}

export function getOfficialArtwork(detail: PokemonDetail): string {
  return (
    detail.sprites.other["official-artwork"]?.front_default ??
    detail.sprites.front_default ??
    FALLBACK_SPRITE
  );
}

export function toSummary(detail: PokemonDetail): PokemonSummary {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: getOfficialArtwork(detail),
    types: detail.types
      .toSorted((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name as PokemonTypeName),
  };
}

export async function fetchPokemonDetail(
  nameOrId: string | number,
): Promise<PokemonDetail> {
  return fetchJson<PokemonDetail>(`${API_BASE}/pokemon/${nameOrId}`);
}

export async function fetchPokemonList(
  limit: number,
  offset = 0,
): Promise<PokemonListResponse> {
  return fetchJson<PokemonListResponse>(
    `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
  );
}

export async function fetchPokemonGrid(
  limit = 151,
  offset = 0,
): Promise<PokemonSummary[]> {
  const list = await fetchPokemonList(limit, offset);
  const details = await Promise.all(
    list.results.map((resource) => fetchPokemonDetail(resource.name)),
  );
  return details.map(toSummary).toSorted((a, b) => a.id - b.id);
}

export async function fetchGenerationOneNames(): Promise<string[]> {
  const list = await fetchPokemonList(151, 0);
  return list.results.map((resource) => resource.name);
}
