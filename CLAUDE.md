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
├── root.tsx                    # Root layout with ErrorBoundary
├── routes.ts                   # Route configuration
├── routes/
│   └── home.tsx               # Main opportunities browser (~130 lines)
├── components/
│   ├── navbar.tsx             # Navigation with dark mode toggle
│   ├── agency-selector.tsx    # Grouped agency dropdown
│   ├── search-filters.tsx     # Search, filter, and sort controls
│   ├── project-card.tsx       # Opportunity card with badges
│   ├── project-list.tsx       # List container
│   ├── loading-skeleton.tsx   # Loading states
│   └── ui/                    # shadcn/ui primitives
├── config/
│   └── agencies.ts            # 50+ agency configurations by category
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── utils.ts               # cn() utility
│   ├── date-utils.ts          # Date formatting and calculations
│   ├── project-utils.ts       # Filtering and sorting
│   ├── api-client.ts          # Bonfire Hub API calls
│   ├── export-utils.ts        # CSV export functionality
│   └── use-dark-mode.ts       # Dark mode hook
└── app.css                    # Global styles
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

### Application-Specific Features

**Agency Configuration** (`app/config/agencies.ts`):
- 50+ agencies organized by category (state, county, city, university, etc.)
- Each agency has: name, apiUrl, baseUrl, category
- Categories enable grouped dropdowns and filtering

**Data Fetching** (`app/lib/api-client.ts`):
- `fetchAllAgencies()` - Fetches all agencies in parallel with `Promise.allSettled()`
- Error handling per agency (failures don't block successful fetches)
- Returns `AgencyData[]` with projects, departments, and error states

**Filtering & Sorting** (`app/lib/project-utils.ts`):
- `filterProjects()` - Search by project name, reference ID, description
- `filterByClosingDate()` - Filter by days until close (3, 7, 14, 30)
- `sortProjects()` - Sort by close date, open date, agency name
- All filters and sorts are composable

**Date Utilities** (`app/lib/date-utils.ts`):
- `formatCloseDate()` - Human-readable dates
- `getRelativeDate()` - "in 3 days", "tomorrow", etc.
- `isClosingSoon()` - Urgency detection (< 3 days)
- `getDaysUntilClose()` - Calculate remaining days

**Export** (`app/lib/export-utils.ts`):
- `exportProjectsToCSV()` - Export filtered results to CSV
- Includes: agency, project name, reference ID, department, dates, link
- Downloads as `opportunities-YYYY-MM-DD.csv`

**Dark Mode** (`app/lib/use-dark-mode.ts`):
- `useDarkMode()` hook with localStorage persistence
- Respects system preference as default
- Toggles `dark` class on document root

**View Modes**:
- Single agency view: View projects from one agency
- All agencies view: Browse all opportunities across all agencies
- Agency name shown on cards in "All Agencies" mode

**Pagination**:
- Initial load: 20 items
- "Load More" button for additional 20 items
- Auto-reset when filters change
- Improves performance with large datasets

**SSR Configuration**: Server-side rendering enabled in `react-router.config.ts`

## Type Safety

- Strict mode enabled in `tsconfig.json`
- Always run `bun run typecheck` (or `npm run typecheck`) before commits to catch type errors
- React Router auto-generates route types when typecheck runs
- Route component props are typed via `Route.LoaderArgs`, `Route.MetaArgs`, etc. from `./+types/[route-name]`
