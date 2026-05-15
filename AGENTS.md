# `AGENTS.md` — AI Assistant Instructions & Project Context

This document contains explicit rules, tech-stack constraints, and architectural guidelines tailored for this project. The AI assistant must strictly follow these instructions when writing code, refactoring, or generating documentation.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
---

## 🛠️ 1. Core Stack Constraints

- **Framework:** Next.js (Modern App Router structure).
- **Language:** TypeScript (Strict typing required for all API responses and component props).
- **Styling:** Tailwind CSS (utility-first, responsive design, explicit semantic theme color mapping).
- **Icons:** `lucide-react`.
- **Data Fetching:** Native `fetch` with Next.js caching and server-side optimization. No unneeded external heavy state/fetching libraries (like Axios or React Query) unless explicitly requested.

---

## 🏗️ 2. Architectural Rules & Best Practices

### 2.1 React Server Components (RSC) vs. Client Components (`'use client'`)
- **Default to Server Components:** All layouts, pages, and heavy data fetching blocks must be Server Components by default to optimize performance and reduce client-side bundle sizes.
- **Client Component Isolation:** Use `'use client'` strictly for interactive, leaf-node components (e.g., search inputs, active filters, tabs, modal triggers).
- **Data Passing:** Fetch data at the Server Component level and pass clean, structured props down to interactive Client Components.

### 2.2 Data Fetching Strategy (PokéAPI Specifics)
- **Home/Grid Page:** Fetch the initial list via a Server Component. Since the primary endpoint (`/pokemon?limit=20`) only provides names and URLs, use `Promise.all` on the server to resolve high-resolution sprites and types before rendering the page.
- **Static Site Generation (SSG):** For the individual detail page (`/app/pokemon/[name]/page.tsx`), you **must** implement `generateStaticParams()` to pre-render the target generation (e.g., Generation 1 - first 151 Pokémon) at build time for instant loads.
- **Image Optimization:** Always use the Next.js `<Image />` component. Configure `images.remotePatterns` in `next.config.js` to securely allow images from `raw.githubusercontent.com`.

### 2.3 Styling Standards & Theming
- Avoid inline styles. Rely entirely on Tailwind CSS utility classes.
- Implement a clean mapping of Pokémon types (e.g., fire, water, grass) to explicit background, text, and border classes. Use a utility function or a lookup object instead of dynamically constructing class names like `bg-${type}-500` (which prevents Tailwind from purging or parsing correctly).

---

## 🗂️ 3. Standardized Directory Structure

The AI assistant must respect the following directory architecture. Do not introduce alternative patterns unless explicitly aligned beforehand:

```text
src/
├── app/
│   ├── page.tsx               # Home: Contains the main shell, structural filters, and grid
│   ├── pokemon/[name]/        
│   │   └── page.tsx           # Detail view: Pre-rendered individual Pokémon page
│   ├── layout.tsx             # Global structural layout (Navbar, Footer, HTML skeleton)
│   └── globals.css            # Tailwind configuration imports and base styles
├── components/                # Atomic and composite UI components
│   ├── ui/                    # Reusable primitive UI atoms (buttons, progress bars)
│   ├── PokemonCard.tsx        # Isolated Pokémon representation
│   ├── PokemonGrid.tsx        # Grid controller layout
│   ├── SearchBar.tsx          # Client-side input filter
│   ├── TypeBadge.tsx          # Explicit color badges per type
│   └── StatsBar.tsx           # Animated or structural status metrics
├── lib/                       # API clients, helpers, and pure functions
│   └── pokeapi.ts             # Dedicated data fetching client for pokeapi.co
└── types/                     # Strongly typed interfaces
    └── index.ts               # Pokémon API models and app state specifications