/**
 * Background cache warmer.
 *
 * Invoked from the Worker's scheduled (cron) handler. Each run fetches a small
 * rotating batch of agencies ONE AT A TIME with pacing, so the steady request
 * rate to the shared `*.bonfirehub.com` backend stays under its rate limit
 * (which a burst of parallel requests trips, returning HTTP 429). Successful
 * fetches are written to D1; the page loader reads only from there.
 *
 * A cursor in KV remembers where the previous run stopped, so successive cron
 * ticks cycle through every agency. With BATCH=5 and a 1-minute cron, all ~70
 * agencies are refreshed roughly every 14 minutes.
 */

import { agencies } from "../config/agencies";
import { fetchAgencyData } from "./api-client";
import { upsertAgencyCache } from "./cache-store";

const WARM_BATCH_SIZE = 5; // agencies fetched per cron tick
const BASE_DELAY_MS = 1_500; // pause between requests within a run
const BACKOFF_429_MS = 8_000; // longer pause once we see a rate-limit response
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // bookkeeping TTL on the D1 row
const CURSOR_KEY = "warmer:cursor";

/** Minimal env shape the warmer needs (structurally compatible with `Env`). */
interface WarmerEnv {
  KV: KVNamespace;
  DB: D1Database;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function warmCache(env: WarmerEnv): Promise<void> {
  const total = agencies.length;
  if (total === 0) return;

  // Where did the last run leave off?
  let cursor = 0;
  try {
    const raw = await env.KV.get(CURSOR_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    if (Number.isFinite(parsed) && parsed >= 0) cursor = parsed % total;
  } catch (err) {
    console.warn("warmCache: cursor read failed:", err);
  }

  const batch = Math.min(WARM_BATCH_SIZE, total);
  let delay = BASE_DELAY_MS;
  let attempted = 0;
  let cached = 0;
  let rateLimited = 0;

  for (let i = 0; i < batch; i++) {
    const agency = agencies[(cursor + i) % total];
    const result = await fetchAgencyData(agency);
    attempted++;

    if (!result.error) {
      try {
        await upsertAgencyCache(env.DB, result, CACHE_TTL_MS);
        cached++;
      } catch (err) {
        console.warn(`warmCache: D1 upsert failed for ${agency.name}:`, err);
      }
    } else if (result.error.includes("429")) {
      // Shared rate limit hit — slow down for the rest of this run.
      rateLimited++;
      delay = BACKOFF_429_MS;
    }

    // Pace before the next request (no need to wait after the last one).
    if (i < batch - 1) await sleep(delay);
  }

  const next = (cursor + batch) % total;
  try {
    await env.KV.put(CURSOR_KEY, String(next));
  } catch (err) {
    console.warn("warmCache: cursor write failed:", err);
  }

  console.log(
    `warmCache: cursor ${cursor}->${next} | attempted ${attempted} | cached ${cached} | rateLimited ${rateLimited}`
  );
}
