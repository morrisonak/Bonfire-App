import { useLoaderData, useSearchParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/home";
import type { SortOption } from "~/lib/types";
import { agencies } from "~/config/agencies";
import { fetchAllAgencies } from "~/lib/api-client";
import { filterProjects, sortProjects, filterByClosingDate } from "~/lib/project-utils";
import { Navbar } from "~/components/navbar";
import { AgencySelector } from "~/components/agency-selector";
import { SearchFilters } from "~/components/search-filters";
import { ProjectCard } from "~/components/project-card";
import { Button } from "~/components/ui/button";
import { exportProjectsToCSV } from "~/lib/export-utils";
import { Download } from "lucide-react";
import { PaginationControls } from "~/components/pagination-controls";

// --- Meta Tags ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Open Opportunities" },
    {
      name: "description",
      content: "View open procurement opportunities from multiple agencies.",
    },
  ];
}

function clampInt(value: number, { min, max }: { min: number; max: number }) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function parseSort(value: string | null): SortOption {
  if (value === "close-date-asc" || value === "close-date-desc" || value === "agency-name") {
    return value;
  }
  return "close-date-asc";
}

// --- Server-side Loader ---
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const agency = url.searchParams.get("agency") ?? "all";
  const q = url.searchParams.get("q") ?? "";
  const sortBy = parseSort(url.searchParams.get("sort"));

  const withinRaw = url.searchParams.get("within");
  const closingWithinDays = withinRaw ? Number(withinRaw) : undefined;

  const pageRaw = Number(url.searchParams.get("page") ?? "1");
  const page = clampInt(pageRaw, { min: 1, max: 9999 });

  const pageSizeRaw = Number(url.searchParams.get("pageSize") ?? "20");
  const pageSize = clampInt(pageSizeRaw, { min: 5, max: 200 });

  const results = await fetchAllAgencies(agencies);

  return {
    results,
    state: {
      agency,
      q,
      sortBy,
      closingWithinDays,
      page,
      pageSize,
    },
  };
}

// --- React Component ---
export default function Home() {
  const { results: data, state: defaultState } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the source of truth; loader state gives SSR defaults.
  const selectedAgencyName = searchParams.get("agency") ?? defaultState.agency;
  const searchFromURL = searchParams.get("q") ?? defaultState.q;
  const sortBy = parseSort(searchParams.get("sort") ?? defaultState.sortBy);

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(searchFromURL);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local input when URL changes (e.g. back/forward navigation)
  useEffect(() => {
    setSearchInput(searchFromURL);
  }, [searchFromURL]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const withinRaw = searchParams.get("within");
  const closingWithinDays = withinRaw
    ? Number(withinRaw)
    : defaultState.closingWithinDays;

  const page = clampInt(Number(searchParams.get("page") ?? defaultState.page), {
    min: 1,
    max: 9999,
  });
  const pageSize = clampInt(
    Number(searchParams.get("pageSize") ?? defaultState.pageSize),
    { min: 5, max: 200 }
  );

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);

    if (!value || value.trim() === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    // If any filter changes, reset page.
    if (["agency", "q", "sort", "within", "pageSize"].includes(key)) {
      next.set("page", "1");
    }

    setSearchParams(next, { replace: false });
  };

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next, { replace: false });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to update URL after 300ms
    debounceTimerRef.current = setTimeout(() => {
      setParam("q", value);
    }, 300);
  };

  // Handle "All Agencies" view
  const isAllAgenciesView = selectedAgencyName === "all";

  const selectedAgency = isAllAgenciesView
    ? undefined
    : data.find((agency) => agency.name === selectedAgencyName);

  // Get projects to display (either from single agency or all agencies)
  const projectsWithAgency = isAllAgenciesView
    ? data.flatMap((agency) =>
        agency.projects.map((project) => ({
          project,
          agencyData: agency,
        }))
      )
    : selectedAgency
      ? selectedAgency.projects.map((project) => ({
          project,
          agencyData: selectedAgency,
        }))
      : [];

  // Filter and sort projects (use URL search, not local input)
  const filteredProjectsWithAgency = sortProjects(
    filterByClosingDate(
      projectsWithAgency
        .filter(({ project }) => filterProjects([project], searchFromURL).length > 0)
        .map(({ project }) => project),
      closingWithinDays
    ),
    sortBy
  ).map((project) => {
    const agencyData = projectsWithAgency.find(
      (p) => p.project.ProjectID === project.ProjectID
    )?.agencyData;
    return { project, agencyData: agencyData! };
  });

  const total = filteredProjectsWithAgency.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clampInt(page, { min: 1, max: totalPages });

  const startIndex = (safePage - 1) * pageSize;
  const endIndexExclusive = Math.min(startIndex + pageSize, total);

  const paged = filteredProjectsWithAgency.slice(startIndex, endIndexExclusive);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar selectedAgency={selectedAgency} allAgencies={data} />

      <main className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Open Opportunities
        </h1>

        {/* Agency Selector */}
        <div className="flex justify-center">
          <AgencySelector
            agencies={data}
            selected={selectedAgencyName}
            onChange={(val) => setParam("agency", val)}
          />
        </div>

        {/* Search, Filter, and Sort Controls */}
        <div className="flex justify-center">
          <SearchFilters
            search={searchInput}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortChange={(val) => setParam("sort", val)}
            closingWithinDays={closingWithinDays}
            onClosingWithinDaysChange={(val) =>
              setParam("within", val === undefined ? undefined : String(val))
            }
          />
        </div>

        {/* Error Display */}
        {selectedAgency?.error && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded">
            <strong>Warning:</strong> Could not load data for {" "}
            {selectedAgency.name}. Error: {selectedAgency.error}
          </div>
        )}

        {/* Results Count and Export */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1}-{endIndexExclusive} of {total}{" "}
              {total === 1 ? "opportunity" : "opportunities"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportProjectsToCSV(filteredProjectsWithAgency)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        )}

        {/* Project List */}
        {total > 0 ? (
          <>
            <div className="flex flex-col gap-6 mt-6">
              {paged.map(({ project, agencyData }) => (
                <ProjectCard
                  key={`${agencyData.name}-${project.ProjectID}`}
                  project={project}
                  agencyData={agencyData}
                  showAgencyName={isAllAgenciesView}
                />
              ))}
            </div>

            <PaginationControls
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No projects found matching your filters.
          </p>
        )}
      </main>
    </div>
  );
}
