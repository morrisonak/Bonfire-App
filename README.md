# Bonfire App

A procurement opportunity aggregator that pulls open solicitations from 50+ government and public agency portals powered by Bonfire Hub. Search, filter, sort, and export opportunities across federal, state, county, city, university, healthcare, transit, and utility agencies.

## Features

- **Multi-Agency Aggregation** - Fetches open opportunities from 50+ agencies in a single view
- **Search & Filter** - Search by project name, reference ID, or description; filter by days until close, category, or agency
- **Sorting** - Sort by close date, open date, agency name, or department
- **Export** - Download results as CSV or JSON
- **Agency Categories** - Federal, State, County, City, University, Healthcare, Transit, Utility, Regional, International
- **Edge Caching** - KV-backed 5-minute cache per agency for fast repeat loads
- **Dark Mode** - System-aware with manual toggle
- **Responsive** - Mobile and desktop layouts

## Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) with SSR
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) (edge compute)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **Cache**: [Cloudflare KV](https://developers.cloudflare.com/kv/)
- **UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Language**: TypeScript 5.7 (strict mode)
- **Package Manager**: [Bun](https://bun.sh/)
- **Linting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.0+
- A [Cloudflare](https://cloudflare.com/) account (for D1 and KV)

### Installation

```bash
bun install
```

### Database Setup

```bash
wrangler d1 migrations apply bonfire-cache
```

### Development

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production

```bash
bun run build
bun run deploy
```

## Project Structure

```
app/
  routes/
    home.tsx              # Main opportunities browser
  components/
    navbar.tsx            # Navigation with dark mode toggle
    agency-selector.tsx   # Grouped agency dropdown
    search-filters.tsx    # Search, filter, sort controls
    project-card.tsx      # Opportunity card
    pagination-controls.tsx
    ui/                   # shadcn/ui primitives
  config/
    agencies.ts           # 50+ agency configurations
  lib/
    api-client.ts         # Bonfire Hub API client with KV caching
    project-utils.ts      # Filtering and sorting logic
    date-utils.ts         # Date formatting
    export-utils.ts       # CSV/JSON export
    types.ts              # TypeScript interfaces
workers/
  app.ts                  # Cloudflare Workers entry point
migrations/
  0001_cache_schema.sql   # D1 schema
```

## License

MIT
