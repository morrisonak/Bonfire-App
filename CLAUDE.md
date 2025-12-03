# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 application that displays open procurement opportunities from multiple Bonfire Hub agency portals. The app uses server-side rendering (SSR) and is built with TypeScript, TailwindCSS v4, and shadcn/ui components.

## Development Commands

This project uses **Bun** as the package manager (`bun.lockb` present). You can use either `bun` or `npm` commands:

```bash
# Install dependencies
bun install

# Start development server (runs on http://localhost:5173)
bun run dev
# or: npm run dev

# Type checking (generates React Router types and runs TypeScript compiler)
bun run typecheck
# or: npm run typecheck

# Production build
bun run build
# or: npm run build

# Start production server
bun start
# or: npm start
```

## Architecture

### React Router v7 Configuration

- **Routes**: Defined in `app/routes.ts` using the `@react-router/dev/routes` API (not file-based routing)
- **Route modules**: Live in `app/routes/` directory (e.g., `app/routes/home.tsx`)
- **Type generation**: React Router auto-generates route types in `.react-router/types/` directory
- **Route typing**: Import types from `./+types/[route-name]` for loaders, meta, and components

### Project Structure

```
app/
├── root.tsx              # Root layout with ErrorBoundary and global Layout
├── routes.ts             # Route configuration (not file-based routing)
├── routes/               # Route components
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   └── utils.ts         # cn() utility for className merging
└── app.css              # Global styles with Tailwind directives
```

### Key Patterns

**Loaders for data fetching**: Use `loader` functions for server-side data fetching. Type with `Route.LoaderArgs` from route-specific types:

```typescript
export async function loader({ request }: Route.LoaderArgs) {
  // Server-side data fetching
  return data;
}
```

**Meta tags**: Export a `meta` function typed with `Route.MetaArgs`:

```typescript
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Title" },
    { name: "description", content: "..." }
  ];
}
```

**Path aliases**: Use `~/` prefix to import from the `app/` directory:
- `~/components/ui/button` → `app/components/ui/button.tsx`
- `~/lib/utils` → `app/lib/utils.ts`

### UI Components

This project uses shadcn/ui components styled with TailwindCSS. Configuration in `components.json`:
- Style: "new-york"
- Components are in `app/components/ui/`
- Use `cn()` utility from `~/lib/utils` for conditional className merging
- Icons from `lucide-react`

### Application-Specific

**Agency data fetching**: The main feature fetches procurement opportunities from multiple Bonfire Hub APIs. Agency configurations are in `app/routes/home.tsx` with:
- `apiUrl`: Bonfire Hub API endpoint
- `baseUrl`: Portal URL for linking to opportunities
- All data is fetched server-side in the `loader` function using `Promise.all()`

**SSR enabled**: Server-side rendering is enabled in `react-router.config.ts`. Disable by setting `ssr: false` for SPA mode.

## Type Safety

- Strict mode enabled in `tsconfig.json`
- Always run `bun run typecheck` (or `npm run typecheck`) before commits to catch type errors
- React Router auto-generates route types when typecheck runs
- Route component props are typed via `Route.LoaderArgs`, `Route.MetaArgs`, etc. from `./+types/[route-name]`
