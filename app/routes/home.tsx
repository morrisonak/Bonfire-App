import { useLoaderData } from "react-router";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import type { Route } from "./+types/home";

// --- Meta Tags ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Open Opportunities" },
    { name: "description", content: "View open procurement opportunities from multiple agencies." },
  ];
}

// --- Agency Config ---
const agencies = [
  {
    name: "Metra",
    apiUrl: "https://metra.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://metra.bonfirehub.com/opportunities/",
  },
  {
    name: "SMART",
    apiUrl: "https://sonomamarintrain.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://sonomamarintrain.bonfirehub.com/opportunities/",
  },
  {
    name: "Harris County Texas",
    apiUrl: "https://harriscountytx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://harriscountytx.bonfirehub.com/opportunities/",
  },
  {
    name: "Texas Department of Transportation",
    apiUrl: "https://txdot.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://txdot.bonfirehub.com/opportunities/",
  },
];

// --- Server-side Loader ---
export async function loader({ request }: Route.LoaderArgs) {
  const results = await Promise.all(
    agencies.map(async (agency) => {
      const response = await fetch(agency.apiUrl);
      if (!response.ok) {
        throw new Response(`Failed to fetch data for ${agency.name}`, { status: 500 });
      }
      const data = await response.json();
      return {
        name: agency.name,
        baseUrl: agency.baseUrl,
        projects: Object.values(data.payload.projects),
        departments: data.payload.departments,
      };
    })
  );

  return results;
}

// --- React Component ---
export default function Home() {
  const data = useLoaderData<typeof loader>();

  const [selectedAgencyName, setSelectedAgencyName] = useState(data[0]?.name || "");
  const [search, setSearch] = useState("");

  const selectedAgency = data.find((agency) => agency.name === selectedAgencyName);

  const filteredProjects = selectedAgency
  ? selectedAgency.projects
      .filter((project) =>
        project.ProjectName.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.DateClose);
        const dateB = new Date(b.DateClose);

        // Sort by closest DateClose (ascending order)
        return dateA.getTime() - dateB.getTime();
      })
  : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="w-full border-b bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
          <div className="text-xl font-bold tracking-tight text-primary">
            The Hot List
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a
              href="/"
              className="hover:text-primary transition-colors font-medium"
            >
              Home
            </a>
            {selectedAgency && (
              <a
                href={selectedAgency.baseUrl.replace("/opportunities/", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors font-medium"
              >
                {selectedAgency.name} Portal
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Open Opportunities</h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Select value={selectedAgencyName} onValueChange={setSelectedAgencyName} className="bg-white shadow-md rounded-lg p-2">
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select Agency" />
            </SelectTrigger>
            <SelectContent>
              {data.map((agency) => (
                <SelectItem key={agency.name} value={agency.name}>
                  {agency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search by project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 bg-white shadow-md rounded-lg p-2"
          />
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-6 mt-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-500">No projects found.</p>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.ProjectID} className="shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">{project.ProjectName}</h2>
                    <span className="text-sm text-gray-500">
                      Closes: {new Date(project.DateClose).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col text-sm text-gray-500">
                    <span>Reference ID: {project.ReferenceID}</span>
                    <span>Department: {selectedAgency?.departments[project.DepartmentID]?.DepartmentName || "Unknown"}</span>
                  </div>

                  <div className="mt-2">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary"
                      asChild
                    >
                      <a
                        href={`${selectedAgency.baseUrl}${project.ProjectID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
