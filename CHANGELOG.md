# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [1.1.0] - 2026-05-15

### Added
- `src/types/index.ts` — strict TypeScript models for PokéAPI list/detail responses, sprite/type/stat shapes, and the `PokemonSummary` view model used by the grid.
- `src/lib/pokeapi.ts` — native `fetch` client with Next.js `revalidate` caching, `fetchPokemonList`, `fetchPokemonDetail`, `fetchPokemonGrid` (Promise.all server-side fan-out for sprites and types), `fetchGenerationOneNames`, and `getOfficialArtwork` helper.
- `src/components/TypeBadge.tsx` — static lookup mapping all 18 Pokémon types to explicit Tailwind background/text/border classes, with `sm`/`md` sizes.
- `src/components/PokemonCard.tsx` — Server Component card showing padded Pokédex ID, official artwork via `next/image`, name, and type badges, linking to the detail route.
- `src/components/SearchBar.tsx` — Client Component grid controller with deferred text search (name or ID) and type-chip filters, rendering the filtered `PokemonCard` grid.
- `src/app/page.tsx` — home Server Component that fetches the first 151 Pokémon and mounts the search/grid UI.
- `src/app/pokemon/[name]/page.tsx` — pre-rendered detail page using `generateStaticParams()` (Gen 1) with height/weight, type badges, and animated base-stat progress bars; includes `generateMetadata` and 404 handling.
- `next.config.ts` — `images.remotePatterns` entry allowing `raw.githubusercontent.com/PokeAPI/sprites/**` for `next/image`.

### Changed
- Migrated the App Router from root `app/` to `src/app/` to match the directory layout prescribed in `AGENTS.md`.

## [1.0.0] - 2026-05-15

### Added
- Initial project baseline: Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4.
- `AGENTS.md` with stack constraints, architectural rules, and directory layout.
- `CLAUDE.md` guidance for future Claude Code sessions.
- Versioning & changelog protocol (AGENTS.md §5).
