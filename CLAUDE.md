# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Pokédex web app built on Next.js (App Router) consuming the public PokéAPI. Currently a fresh scaffold — only `app/page.tsx`, `app/layout.tsx`, and `app/globals.css` exist; the structure described in `AGENTS.md` (`src/`, `components/`, `lib/`, `types/`) is the **target**, not the current state.

The full set of stack constraints, architectural rules, and the prescribed directory layout live in `AGENTS.md` — read it before adding code. Highlights:

- Default to React Server Components; isolate `'use client'` to interactive leaves.
- Pre-render the detail route via `generateStaticParams()` (Gen 1 = first 151).
- Use `next/image` and configure `images.remotePatterns` for `raw.githubusercontent.com` before referencing sprites.
- Map Pokémon types to Tailwind classes via a static lookup — never build class names like `` `bg-${type}-500` `` (Tailwind v4 cannot detect them).

## Commands

```bash
npm run dev      # next dev — local dev server on :3000
npm run build    # next build — production build
npm start        # next start — serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

No test framework is configured. If adding tests, ask which runner to wire up rather than assuming Jest/Vitest.

## Stack

- Next.js **16.2.6** (App Router) — see "Next.js version" warning below
- React **19.2.4**
- TypeScript 5, `strict: true`, path alias `@/*` → `./*` (project root, not `src/`)
- Tailwind CSS **v4** via `@tailwindcss/postcss` (no `tailwind.config.*` — config lives in `app/globals.css` using v4 conventions)
- ESLint 9 flat config (`eslint.config.mjs`)

## Next.js version — read the bundled docs

Per `AGENTS.md`: this Next.js (16.2.6) has breaking changes vs. what's likely in training data. Authoritative docs ship inside the package:

```
node_modules/next/dist/docs/
├── 01-app/         # App Router (use this)
├── 02-pages/       # Pages Router (do not use)
├── 03-architecture/
└── 04-community/
```

Before writing code that touches a Next API (route handlers, `generateStaticParams`, `next/image`, caching, middleware, metadata, fonts, etc.), open the matching file under `01-app/` and follow it. Heed deprecation notices.

## Architectural notes for future work

- **Data layer**: a single `lib/pokeapi.ts` should own all PokéAPI calls (native `fetch` + Next caching). No Axios / React Query.
- **List → detail flow**: PokéAPI's list endpoint returns only `name` + `url`; resolve sprites/types server-side with `Promise.all` before passing typed props to client components.
- **Type safety**: API response shapes belong in `types/index.ts`; component props must be typed explicitly.
- **Styling**: utility classes only, no inline styles; type-color mapping via lookup object.
