import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TypeBadge from "@/src/components/TypeBadge";
import {
  fetchGenerationOneNames,
  fetchPokemonDetail,
  getOfficialArtwork,
} from "@/src/lib/pokeapi";
import type { PokemonStat } from "@/src/types";

interface DetailRouteParams {
  name: string;
}

interface DetailPageProps {
  params: Promise<DetailRouteParams>;
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const MAX_STAT_VALUE = 200;

export async function generateStaticParams(): Promise<DetailRouteParams[]> {
  const names = await fetchGenerationOneNames();
  return names.map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { name } = await params;
  const title = `${name.charAt(0).toUpperCase()}${name.slice(1)} — Pokédex`;
  return {
    title,
    description: `Stats, types, and artwork for ${name}.`,
  };
}

async function loadDetail(name: string) {
  try {
    return await fetchPokemonDetail(name);
  } catch {
    return null;
  }
}

function formatId(id: number): string {
  return `#${id.toString().padStart(3, "0")}`;
}

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function StatRow({ stat }: { stat: PokemonStat }) {
  const label = STAT_LABELS[stat.stat.name] ?? stat.stat.name;
  const pct = Math.min(100, Math.round((stat.base_stat / MAX_STAT_VALUE) * 100));
  return (
    <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[7rem_4rem_1fr] sm:items-center sm:gap-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
        {stat.base_stat}
      </span>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="progressbar"
        aria-valuenow={stat.base_stat}
        aria-valuemin={0}
        aria-valuemax={MAX_STAT_VALUE}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function PokemonDetailPage({ params }: DetailPageProps) {
  const { name } = await params;
  const detail = await loadDetail(name);
  if (!detail) {
    notFound();
  }

  const artwork = getOfficialArtwork(detail);
  const heightMeters = detail.height / 10;
  const weightKilos = detail.weight / 10;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8">
      <Link
        href="/"
        className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to Pokédex
      </Link>

      <section className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-sm">
            <Image
              src={artwork}
              alt={detail.name}
              fill
              sizes="(min-width: 768px) 28rem, 80vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
              {formatId(detail.id)}
            </span>
            <h1 className="text-4xl font-bold capitalize text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {formatName(detail.name)}
            </h1>
            <div className="flex flex-wrap gap-2">
              {detail.types.map((slot) => (
                <TypeBadge key={slot.type.name} type={slot.type.name} size="md" />
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1 rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Height
              </dt>
              <dd className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {heightMeters.toFixed(1)} m
              </dd>
            </div>
            <div className="flex flex-col gap-1 rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Weight
              </dt>
              <dd className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {weightKilos.toFixed(1)} kg
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Base Stats
            </h2>
            <div className="flex flex-col gap-3">
              {detail.stats.map((stat) => (
                <StatRow key={stat.stat.name} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
