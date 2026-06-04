# Pokémon Search ⚡

A small Pokédex built to explore **TanStack Query** caching patterns. Browse Pokémon with infinite pagination, search by name, view detailed stats, and save favorites that persist across reloads. Data comes from the free [PokéAPI](https://pokeapi.co/).

## Features

- **Pokédex list** — loads 20 Pokémon at a time with a "Load more" button (`useInfiniteQuery`).
- **Debounced search** (300ms) — looks up a Pokémon by exact name via a keyed query (`['pokemon', term]`); each term becomes its own cache entry, and results are shared with the details page.
- **Details screen** — official artwork, types, abilities, height/weight, and animated base-stat bars.
- **Favorites** — toggle from any card or the details page; persisted to `localStorage` and shared app-wide via context.
- **React Query Devtools** — inspect the cache live in development.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [React 19](https://react.dev/) + [React Compiler](https://react.dev/learn/react-compiler) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vite.dev/) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI components | [shadcn/ui](https://ui.shadcn.com/) + [lucide-react](https://lucide.dev/) |
| API | [PokéAPI](https://pokeapi.co/) |
| Package manager | [pnpm](https://pnpm.io/) |

## Getting started

**Prerequisites:** Node.js 20+ and [pnpm](https://pnpm.io/installation).

```bash
# Install dependencies
pnpm install

# Start the dev server (http://localhost:5173)
pnpm dev

# Type-check and build for production
pnpm build

# Preview the production build
pnpm preview

# Lint
pnpm lint
```

## Project structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Input)
│   ├── Layout.tsx       # App shell with nav + <Outlet />
│   └── PokemonCard.tsx  # Reusable card with favorite toggle
├── hooks/
│   ├── usePokemon.ts    # useInfiniteQuery list + useQuery by name/id
│   └── useDebounce.ts   # Generic debounce hook
├── lib/
│   ├── api.ts           # PokéAPI fetchers, types, and helpers
│   ├── favorites.tsx    # FavoritesProvider + useFavorites (localStorage)
│   └── utils.ts         # cn() class-name helper
├── pages/
│   ├── PokemonListPage.tsx     # List + search + load more
│   ├── PokemonDetailsPage.tsx  # Stats, types, abilities
│   └── FavoritesPage.tsx       # Saved Pokémon (useQueries)
├── router.tsx           # Route definitions
└── main.tsx             # Providers (Query, Favorites, Router) + entry
```

## How it works

- **Caching** — the `QueryClient` is configured with a 60s `staleTime`, so revisiting a screen or re-searching a recent term serves from cache instead of refetching.
- **Shared cache keys** — search and the details page both use `['pokemon', name]`, so searching a Pokémon and then opening it is an instant cache hit.
- **Infinite pagination** — `getNextPageParam` reads PokéAPI's `next` field and derives the next offset from the number of loaded pages.
- **Favorites** — stored as a list of names under `localStorage` key `pokemon-search:favorites` and exposed through a context so every screen stays in sync.

## Routes

| Path | Screen |
| --- | --- |
| `/` | Pokédex list |
| `/pokemon/:name` | Pokémon details |
| `/favorites` | Saved favorites |

## Acknowledgements

- Pokémon data from [PokéAPI](https://pokeapi.co/).
- UI primitives from [shadcn/ui](https://ui.shadcn.com/).

> This is a personal learning project and is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.
