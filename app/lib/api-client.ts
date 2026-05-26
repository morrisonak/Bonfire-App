/**
 * API client for fetching a single Bonfire Hub agency's data.
 *
 * All agency portals share one Cloudflare-protected `*.bonfirehub.com` backend
 * with a strict, shared rate limit. Requests from Cloudflare Workers' datacenter
 * IPs get HTTP 429 once that limit is exceeded. We therefore never fetch on a
 * user request — the background cache-warmer (`cache-warmer.ts`) calls this one
 * agency at a time, slowly, and the page loader reads only from D1.
 *
 * Note: 429 is deliberately NOT retried here. Retrying immediately just spends
 * more of the shared rate budget and makes the limiting worse; the warmer backs
 * off instead.
 */

import type { Agency, AgencyData, Department, Project } from "./types";

const FETCH_TIMEOUT_MS = 12_000;
const RETRIABLE_STATUS_CODES = [502, 503, 504];

// A realistic browser User-Agent plus the headers the portal's own XHR sends.
const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Accept-Language": "en-US,en;q=0.9",
  "X-Requested-With": "XMLHttpRequest",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      await sleep(500);
      return fetch(url, options);
    }
    return response;
  } catch (_error) {
    await sleep(500);
    return fetch(url, options);
  }
}

/**
 * Fetch data for a single agency.
 *
 * Never throws — failures are returned as an `AgencyData` with `error` set, so
 * callers can decide whether to cache (only success should be cached).
 */
export async function fetchAgencyData(agency: Agency): Promise<AgencyData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  const failure = (error: string): AgencyData => ({
    name: agency.name,
    baseUrl: agency.baseUrl,
    projects: [],
    departments: {},
    error,
  });

  try {
    const response = await fetchWithRetry(agency.apiUrl, {
      headers: { ...BROWSER_HEADERS, Referer: agency.baseUrl },
      signal: controller.signal,
    });

    if (!response.ok) {
      // 429 = shared rate limit; 403 = Cloudflare bot-protection challenge.
      const error =
        response.status === 429
          ? "Rate limited (HTTP 429)"
          : response.status === 403
            ? "Blocked by bot protection (HTTP 403)"
            : `HTTP ${response.status}`;
      console.warn(`Failed to fetch data for ${agency.name}: ${error}`);
      return failure(error);
    }

    const data: Record<string, unknown> = await response.json();

    if (!data || typeof data !== "object" || !data.payload) {
      console.warn(`Unexpected API response structure for ${agency.name}`);
      return failure("Unexpected API response structure");
    }

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
      return failure(`Request timed out after ${FETCH_TIMEOUT_MS / 1000}s`);
    }
    console.warn(`Error fetching ${agency.name}:`, fetchError);
    return failure(fetchError instanceof Error ? fetchError.message : "Unknown error");
  } finally {
    clearTimeout(timeoutId);
  }
}
