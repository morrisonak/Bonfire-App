/**
 * Durable D1-backed cache for agency data.
 *
 * D1 is the source of truth read by the page loader: user requests only ever
 * read from here, never from bonfirehub directly. The background cache-warmer
 * (see `cache-warmer.ts`) is the only writer, populating rows slowly enough to
 * stay under bonfirehub's shared rate limit.
 */

import type { AgencyData } from "./types";

export interface CachedAgency {
  data: AgencyData;
  fetchedAt: number; // epoch ms when this row was last refreshed
}

interface AgencyCacheRow {
  agency_name: string;
  response_data: string;
  fetched_at: number;
}

/**
 * Read every cached agency in a single query, keyed by agency name.
 * Corrupt rows are skipped rather than failing the whole read.
 */
export async function readCachedAgencies(
  db: D1Database
): Promise<Map<string, CachedAgency>> {
  const map = new Map<string, CachedAgency>();
  try {
    const { results } = await db
      .prepare(
        "SELECT agency_name, response_data, fetched_at FROM agency_cache"
      )
      .all<AgencyCacheRow>();

    for (const row of results ?? []) {
      try {
        map.set(row.agency_name, {
          data: JSON.parse(row.response_data) as AgencyData,
          fetchedAt: row.fetched_at,
        });
      } catch {
        // Skip a row with unparseable JSON; the warmer will overwrite it.
      }
    }
  } catch (err) {
    console.warn("D1 read failed:", err);
  }
  return map;
}

/** Insert or update one agency's cached payload. */
export async function upsertAgencyCache(
  db: D1Database,
  data: AgencyData,
  ttlMs: number
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      `INSERT INTO agency_cache (agency_name, response_data, fetched_at, expires_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(agency_name) DO UPDATE SET
         response_data = excluded.response_data,
         fetched_at = excluded.fetched_at,
         expires_at = excluded.expires_at`
    )
    .bind(data.name, JSON.stringify(data), now, now + ttlMs)
    .run();
}
