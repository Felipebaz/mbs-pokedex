<div align="center">

# Pokédex

### Gotta fetch 'em all — server-rendered.

<a href="#"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"></a>
<a href="#"><img alt="React" src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=000000"></a>
<a href="#"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></a>
<a href="#"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white"></a>
<a href="#"><img alt="PokéAPI" src="https://img.shields.io/badge/PokéAPI-v2-DC0A2D?style=for-the-badge"></a>

</div>

<div align="center">

</div>

---

## What is this?

Server-rendered Pokédex for **Generation I** (Bulbasaur → Mew). Static-generated at build time, hydrated only where interactivity matters. No client-side API calls. No spinner-fest. Just HTML.

<table>
<tr>
<td width="50%">

### Grid view
Sprite, ID, name, type badges — six-up on desktop, two-up on mobile.

</td>
<td width="50%">

### List view
Horizontal rows with the same data, denser scan-friendly layout. Toggle in the header.

</td>
</tr>
<tr>
<td width="50%">

### Search + filter
Substring match on name or exact Pokédex ID. Filter chips for every type that appears in the loaded set.

</td>
<td width="50%">

### Detail page
Official artwork, height, weight, type badges, and base-stat progress bars. One static HTML per Pokémon.

</td>
</tr>
</table>

---

## Type palette

Each type maps to an explicit Tailwind class — **no dynamic `bg-${type}-500` strings** (Tailwind v4 can't see those at build time).

<div align="center">

![normal](https://img.shields.io/badge/normal-A8A77A?style=flat-square&labelColor=A8A77A)
![fire](https://img.shields.io/badge/fire-EE8130?style=flat-square&labelColor=EE8130)
![water](https://img.shields.io/badge/water-6390F0?style=flat-square&labelColor=6390F0)
![electric](https://img.shields.io/badge/electric-F7D02C?style=flat-square&labelColor=F7D02C)
![grass](https://img.shields.io/badge/grass-7AC74C?style=flat-square&labelColor=7AC74C)
![ice](https://img.shields.io/badge/ice-96D9D6?style=flat-square&labelColor=96D9D6)
![fighting](https://img.shields.io/badge/fighting-C22E28?style=flat-square&labelColor=C22E28)
![poison](https://img.shields.io/badge/poison-A33EA1?style=flat-square&labelColor=A33EA1)
![ground](https://img.shields.io/badge/ground-E2BF65?style=flat-square&labelColor=E2BF65)
![flying](https://img.shields.io/badge/flying-A98FF3?style=flat-square&labelColor=A98FF3)
![psychic](https://img.shields.io/badge/psychic-F95587?style=flat-square&labelColor=F95587)
![bug](https://img.shields.io/badge/bug-A6B91A?style=flat-square&labelColor=A6B91A)
![rock](https://img.shields.io/badge/rock-B6A136?style=flat-square&labelColor=B6A136)
![ghost](https://img.shields.io/badge/ghost-735797?style=flat-square&labelColor=735797)
![dragon](https://img.shields.io/badge/dragon-6F35FC?style=flat-square&labelColor=6F35FC)
![dark](https://img.shields.io/badge/dark-705746?style=flat-square&labelColor=705746)
![steel](https://img.shields.io/badge/steel-B7B7CE?style=flat-square&labelColor=B7B7CE)
![fairy](https://img.shields.io/badge/fairy-D685AD?style=flat-square&labelColor=D685AD)

</div>

> **Note**: The badge colors above are the canonical Pokémon type colors. The app uses Tailwind's nearest equivalents to stay in the design system — see `src/components/TypeBadge.tsx`.

---

## Stack

| Layer | Choice | Why |
|------:|:-------|:----|
| Framework | **Next.js 16** (App Router) | Server Components by default, SSG for detail pages, image optimization. |
| Language | **TypeScript 5** (strict) | API responses typed from `openapi.json`, no `any` in component props. |
| Styling | **Tailwind CSS v4** | Utility-first; v4 config lives inside `app/globals.css`. |
| Data | **Native `fetch`** + Next caching | No Axios, no React Query. One file owns PokéAPI (`src/lib/pokeapi.ts`). |
| Source | **[PokéAPI v2](https://pokeapi.co)** | Free, public, no key. |

---

## Architecture

```
Build time:
  ┌─────────────────────────────────────────────────────┐
  │ generateStaticParams() → /pokemon?limit=151          │
  │   → [{ name: 'bulbasaur' }, ..., { name: 'mew' }]    │
  │   → 151 static HTML files generated                  │
  └─────────────────────────────────────────────────────┘

Home page (Server Component):
  ┌─────────────────────────────────────────────────────┐
  │ fetchPokemonGrid(151)                                │
  │   1. /pokemon?limit=151        (1 request)           │
  │   2. Promise.all(151 details)  (parallel fan-out)    │
  │   3. → PokemonSummary[]                              │
  └─────────────────────────────────────────────────────┘

Runtime:
  ┌─────────────────────────────────────────────────────┐
  │ User hits "/"                                        │
  │   → Pre-rendered HTML served                         │
  │   → Only <SearchBar /> hydrates ('use client')       │
  │   → Click card → static HTML for /pokemon/{name}     │
  └─────────────────────────────────────────────────────┘
```

### Directory layout

```
src/
├── app/
│   ├── page.tsx              # Home (Server Component)
│   ├── pokemon/[name]/
│   │   └── page.tsx          # Detail page (SSG, 151 routes)
│   ├── layout.tsx            # Root layout, fonts, shell
│   └── globals.css           # Tailwind v4 directives + theme
├── components/
│   ├── TypeBadge.tsx         # Static type → Tailwind class map
│   ├── PokemonCard.tsx       # Grid cell (Server Component)
│   ├── PokemonListRow.tsx    # List row (Server Component)
│   └── SearchBar.tsx         # Search + filters + view toggle ('use client')
├── lib/
│   └── pokeapi.ts            # Native fetch client, all PokéAPI calls
└── types/
    └── index.ts              # Strict types from openapi.json
```

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server on `:3000` with Turbopack. |
| `npm run build` | Production build. Pre-renders all 151 detail pages. |
| `npm start` | Serve the production build. |
| `npm run lint` | ESLint flat config (`eslint-config-next`). |

---

## Conventions

- **Server Components by default.** `'use client'` only on interactive leaves (`SearchBar`).
- **Data lives in one file.** All PokéAPI calls flow through `src/lib/pokeapi.ts`. No fetches from client components.
- **Types from the wire format.** Anything coming from PokéAPI is typed in `src/types/index.ts` against `openapi.json`.
- **Tailwind classes are literal.** Never build class names with template strings — Tailwind v4 only ships classes it can see at build time.
- **Versioning.** SemVer per `AGENTS.md` §5. Every shipped change bumps `package.json` and lands in `CHANGELOG.md`.

---

## Project docs

- [`AGENTS.md`](./AGENTS.md) — stack constraints, architectural rules, directory contract.
- [`CLAUDE.md`](./CLAUDE.md) — guidance for Claude Code sessions.
- [`CHANGELOG.md`](./CHANGELOG.md) — Keep-a-Changelog history, SemVer.

---

<div align="center">

**Data: [PokéAPI](https://pokeapi.co)** · Pokémon and Pokémon character names are trademarks of Nintendo.

</div>
