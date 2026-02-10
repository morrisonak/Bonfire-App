/**
 * API client for fetching Bonfire Hub data
 */

import type { Agency, AgencyData, Department, Project } from "./types";

const FETCH_TIMEOUT_MS = 10_000;
const KV_TTL_SECONDS = 300; // 5 minutes
const RETRIABLE_STATUS_CODES = [429, 502, 503, 504];

const isValidProject = (p: unknown): p is Project => {
  if (!p || typeof p !== "object") return false;
  const obj = p as Record<string, unknown>;
  return typeof obj.ProjectID === "string" && typeof obj.ProjectName === "string";
};

const isValidDepartment = (d: unknown): d is Department => {
  if (!d || typeof d !== "object") return false;
  const obj = d as Record<string, unknown>;
  return (
    typeof obj.DepartmentID === "string" &&
    typeof obj.DepartmentName === "string"
  );
};

async function fetchWithRetry(
  url: string,
  options: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (RETRIABLE_STATUS_CODES.includes(response.status)) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetch(url, options);
    }
    return response;
  } catch (_error) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return fetch(url, options);
  }
}

/**
 * Fetch data for a single agency
 * @param agency - Agency configuration
 * @returns Agency data with projects and departments
 */
export async function fetchAgencyData(agency: Agency): Promise<AgencyData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetchWithRetry(agency.apiUrl, {
      headers: {
        "User-Agent": "BonfireApp/1.0 (procurement-aggregator)",
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
      ? Object.values(payload.projects as Record<string, unknown>).filter(isValidProject)
      : [];
    const rawDepartments = (payload.departments as Record<string, unknown>) || {};
    const departments: Record<string, Department> = {};
    for (const [key, value] of Object.entries(rawDepartments)) {
      if (isValidDepartment(value)) {
        departments[key] = value;
      }
    }

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

  // Cache all successful results (including zero-project agencies)
  if (!result.error) {
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
