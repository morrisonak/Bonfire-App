/**
 * API client for fetching Bonfire Hub data
 */

import type { Agency, AgencyData, Department, Project } from "./types";

const FETCH_TIMEOUT_MS = 10_000;
const KV_TTL_SECONDS = 300; // 5 minutes

/**
 * Fetch data for a single agency
 * @param agency - Agency configuration
 * @returns Agency data with projects and departments
 */
export async function fetchAgencyData(agency: Agency): Promise<AgencyData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(agency.apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json, text/plain, */*",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`Failed to fetch data for ${agency.name}: ${response.status}`);
      return {
        name: agency.name,
        baseUrl: agency.baseUrl,
        projects: [],
        departments: {},
        error: `HTTP ${response.status}`,
      };
    }

    const data: Record<string, unknown> = await response.json();

    // Validate response shape
    if (!data || typeof data !== "object" || !data.payload) {
      console.warn(`Unexpected API response structure for ${agency.name}`);
      return {
        name: agency.name,
        baseUrl: agency.baseUrl,
        projects: [],
        departments: {},
        error: "Unexpected API response structure",
      };
    }

    // Safely extract data with fallbacks
    const payload = data.payload as Record<string, unknown>;
    const projects: Project[] = payload.projects
      ? Object.values(payload.projects as Record<string, Project>)
      : [];
    const departments = (payload.departments as Record<string, Department>) || {};

    return {
      name: agency.name,
      baseUrl: agency.baseUrl,
      projects,
      departments,
      error: null,
    };
  } catch (fetchError) {
    if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
      console.warn(`Request timed out for ${agency.name} after ${FETCH_TIMEOUT_MS}ms`);
      return {
        name: agency.name,
        baseUrl: agency.baseUrl,
        projects: [],
        departments: {},
        error: `Request timed out after ${FETCH_TIMEOUT_MS / 1000}s`,
      };
    }
    console.warn(`Error fetching ${agency.name}:`, fetchError);
    return {
      name: agency.name,
      baseUrl: agency.baseUrl,
      projects: [],
      departments: {},
      error: fetchError instanceof Error ? fetchError.message : "Unknown error",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch agency data with KV cache-first strategy
 */
async function fetchAgencyWithCache(
  agency: Agency,
  kv: KVNamespace
): Promise<AgencyData> {
  const cacheKey = `agency:${agency.name}`;

  try {
    const cached = await kv.get(cacheKey, "text");
    if (cached) {
      return JSON.parse(cached) as AgencyData;
    }
  } catch (err) {
    console.warn(`KV read failed for ${agency.name}:`, err);
  }

  const result = await fetchAgencyData(agency);

  // Only cache successful results (no error or has projects)
  if (!result.error && result.projects.length > 0) {
    try {
      await kv.put(cacheKey, JSON.stringify(result), {
        expirationTtl: KV_TTL_SECONDS,
      });
    } catch (err) {
      console.warn(`KV write failed for ${agency.name}:`, err);
    }
  }

  return result;
}

/**
 * Fetch data for multiple agencies
 * @param agencies - Array of agency configurations
 * @param kv - Optional KV namespace for caching
 * @returns Array of agency data (successful fetches only)
 */
export async function fetchAllAgencies(
  agencies: Agency[],
  kv?: KVNamespace
): Promise<AgencyData[]> {
  try {
    const results = await Promise.allSettled(
      agencies.map((agency) =>
        kv ? fetchAgencyWithCache(agency, kv) : fetchAgencyData(agency)
      )
    );

    // Filter out failed results and return successful ones
    const successfulResults = results
      .filter(
        (result): result is PromiseFulfilledResult<AgencyData> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    // Ensure we have at least some data
    if (successfulResults.length === 0) {
      throw new Error("Failed to fetch data from any agency");
    }

    return successfulResults;
  } catch (error) {
    console.error("Error fetching agencies:", error);
    throw error;
  }
}
