import { useLoaderData } from "react-router";
import { useState } from "react";
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
import { ProjectList } from "~/components/project-list";

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

  const selectedAgency = data.find(
    (agency) => agency.name === selectedAgencyName
  );

  // Filter and sort projects
  const filteredProjects = selectedAgency
    ? sortProjects(
        filterByClosingDate(
          filterProjects(selectedAgency.projects, search),
          closingWithinDays
        ),
        sortBy
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar selectedAgency={selectedAgency} />

      <main className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
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
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <strong>Warning:</strong> Could not load data for{" "}
            {selectedAgency.name}. Error: {selectedAgency.error}
          </div>
        )}

        {/* Project List */}
        {selectedAgency && (
          <ProjectList
            projects={filteredProjects}
            agencyData={selectedAgency}
          />
        )}
      </main>
    </div>
  );
}
