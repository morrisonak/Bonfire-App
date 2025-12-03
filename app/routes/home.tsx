import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import type { SortOption } from "~/lib/types";
import { agencies } from "~/config/agencies";
import { fetchAllAgencies } from "~/lib/api-client";
import {
  filterProjects,
  sortProjects,
  filterByClosingDate,
} from "~/lib/project-utils";
import { Navbar } from "~/components/navbar";
import { AgencySelector } from "~/components/agency-selector";
import { SearchFilters } from "~/components/search-filters";
import { ProjectCard } from "~/components/project-card";
import { Button } from "~/components/ui/button";
import { exportProjectsToCSV } from "~/lib/export-utils";
import { Download } from "lucide-react";

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

// --- Server-side Loader ---
export async function loader() {
  const results = await fetchAllAgencies(agencies);
  return results;
}

// --- React Component ---
export default function Home() {
  const data = useLoaderData<typeof loader>();

  const [selectedAgencyName, setSelectedAgencyName] = useState(
    data[0]?.name || ""
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("close-date-asc");
  const [closingWithinDays, setClosingWithinDays] = useState<number | undefined>(
    undefined
  );
  const [displayCount, setDisplayCount] = useState(20);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(20);
  }, [selectedAgencyName, search, sortBy, closingWithinDays]);

  // Handle "All Agencies" view
  const isAllAgenciesView = selectedAgencyName === "__all__";

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

  // Filter and sort projects
  const filteredProjectsWithAgency = sortProjects(
    filterByClosingDate(
      projectsWithAgency
        .filter(({ project }) =>
          filterProjects([project], search).length > 0
        )
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar selectedAgency={selectedAgency} />

      <main className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Open Opportunities
        </h1>

        {/* Agency Selector */}
        <div className="flex justify-center">
          <AgencySelector
            agencies={data}
            selected={selectedAgencyName}
            onChange={setSelectedAgencyName}
          />
        </div>

        {/* Search, Filter, and Sort Controls */}
        <div className="flex justify-center">
          <SearchFilters
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            closingWithinDays={closingWithinDays}
            onClosingWithinDaysChange={setClosingWithinDays}
          />
        </div>

        {/* Error Display */}
        {selectedAgency?.error && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded">
            <strong>Warning:</strong> Could not load data for{" "}
            {selectedAgency.name}. Error: {selectedAgency.error}
          </div>
        )}

        {/* Results Count and Export */}
        {filteredProjectsWithAgency.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {Math.min(displayCount, filteredProjectsWithAgency.length)} of{" "}
              {filteredProjectsWithAgency.length}{" "}
              {filteredProjectsWithAgency.length === 1 ? "opportunity" : "opportunities"}
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
        {filteredProjectsWithAgency.length > 0 ? (
          <>
            <div className="flex flex-col gap-6 mt-6">
              {filteredProjectsWithAgency
                .slice(0, displayCount)
                .map(({ project, agencyData }) => (
                  <ProjectCard
                    key={`${agencyData.name}-${project.ProjectID}`}
                    project={project}
                    agencyData={agencyData}
                    showAgencyName={isAllAgenciesView}
                  />
                ))}
            </div>

            {/* Load More Button */}
            {displayCount < filteredProjectsWithAgency.length && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setDisplayCount((prev) => prev + 20)}
                  variant="outline"
                  className="px-8"
                >
                  Load More ({filteredProjectsWithAgency.length - displayCount}{" "}
                  remaining)
                </Button>
              </div>
            )}
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
