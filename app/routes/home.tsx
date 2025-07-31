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
  // Federal/State Agencies
  {
    name: "Washington State Department of Enterprise Services",
    apiUrl: "https://deswa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://deswa.bonfirehub.com/opportunities/",
  },
  {
    name: "Utah Public Procurement Place (U3P)",
    apiUrl: "https://utah.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://utah.bonfirehub.com/opportunities/",
  },
  {
    name: "Delaware Office of Management and Budget",
    apiUrl: "https://gss.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://gss.bonfirehub.com/opportunities/",
  },
  {
    name: "Texas Workforce Commission",
    apiUrl: "https://twc-texas-gov.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://twc-texas-gov.bonfirehub.com/opportunities/",
  },

  // Counties
  {
    name: "Galveston County, TX",
    apiUrl: "https://galvestoncountytx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://galvestoncountytx.bonfirehub.com/opportunities/",
  },
  {
    name: "Suffolk County, NY",
    apiUrl: "https://suffolkcountyny.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://suffolkcountyny.bonfirehub.com/opportunities/",
  },
  {
    name: "Boulder County, CO",
    apiUrl: "https://bouldercounty.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://bouldercounty.bonfirehub.com/opportunities/",
  },
  {
    name: "Walker County, TX",
    apiUrl: "https://co-walker-tx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://co-walker-tx.bonfirehub.com/opportunities/",
  },
  {
    name: "Columbia County, GA",
    apiUrl: "https://columbiacountyga.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://columbiacountyga.bonfirehub.com/opportunities/",
  },
  {
    name: "Williamson County, TX",
    apiUrl: "https://wilco.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://wilco.bonfirehub.com/opportunities/",
  },
  {
    name: "County of Sussex",
    apiUrl: "https://sussex.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://sussex.bonfirehub.com/opportunities/",
  },
  {
    name: "County of Wake, NC",
    apiUrl: "https://wake.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://wake.bonfirehub.com/opportunities/",
  },
  {
    name: "Cook County, IL",
    apiUrl: "https://cookcountyil.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cookcountyil.bonfirehub.com/opportunities/",
  },
  {
    name: "Johnson County, TX",
    apiUrl: "https://johnsoncountytx.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://johnsoncountytx.bonfirehub.com/opportunities/",
  },
  {
    name: "Montgomery County, PA",
    apiUrl: "https://montcopa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://montcopa.bonfirehub.com/opportunities/",
  },
  {
    name: "Brazoria County, TX",
    apiUrl: "https://brazoriacounty.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://brazoriacounty.bonfirehub.com/opportunities/",
  },

  // Cities
  {
    name: "City of Seattle, WA",
    apiUrl: "https://cityofseattle.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cityofseattle.bonfirehub.com/opportunities/",
  },
  {
    name: "Charlotte, NC",
    apiUrl: "https://charlottenc.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://charlottenc.bonfirehub.com/opportunities/",
  },
  {
    name: "City of Alpharetta, GA",
    apiUrl: "https://cityofalpharetta.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cityofalpharetta.bonfirehub.com/opportunities/",
  },
  {
    name: "City of Dallas, TX",
    apiUrl: "https://dallascityhall.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://dallascityhall.bonfirehub.com/opportunities/",
  },
  {
    name: "City of Fort Worth, TX",
    apiUrl: "https://fortworthtexas.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://fortworthtexas.bonfirehub.com/opportunities/",
  },
  {
    name: "Paradise Valley, AZ",
    apiUrl: "https://paradisevalleyaz.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://paradisevalleyaz.bonfirehub.com/opportunities/",
  },

  // Universities/Educational Institutions
  {
    name: "University of Massachusetts",
    apiUrl: "https://umass.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://umass.bonfirehub.com/opportunities/",
  },
  {
    name: "NC State University",
    apiUrl: "https://ncsu.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ncsu.bonfirehub.com/opportunities/",
  },
  {
    name: "Rice University, TX",
    apiUrl: "https://rice-edu.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://rice-edu.bonfirehub.com/opportunities/",
  },
  {
    name: "Bridgewater State University",
    apiUrl: "https://bridgew.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://bridgew.bonfirehub.com/opportunities/",
  },
  {
    name: "Southern Oregon University",
    apiUrl: "https://sou.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://sou.bonfirehub.com/opportunities/",
  },
  {
    name: "University of Texas Rio Grande Valley",
    apiUrl: "https://utrgv.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://utrgv.bonfirehub.com/opportunities/",
  },
  {
    name: "Chicago Public Schools",
    apiUrl: "https://cps.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cps.bonfirehub.com/opportunities/",
  },
  {
    name: "Douglas County School System, GA",
    apiUrl: "https://dcssga.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://dcssga.bonfirehub.com/opportunities/",
  },
  {
    name: "Education Service Center Region 10, TX",
    apiUrl: "https://region10.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://region10.bonfirehub.com/opportunities/",
  },

  // Healthcare Systems
  {
    name: "University Health",
    apiUrl: "https://universityhealth.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://universityhealth.bonfirehub.com/opportunities/",
  },

  // Housing Authorities
  {
    name: "Housing Authority Prince George's County",
    apiUrl: "https://hapgcprocurement.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://hapgcprocurement.bonfirehub.com/opportunities/",
  },

  // Transportation/Transit Authorities
  {
    name: "Metropolitan Transit Authority of Harris County (METRO)",
    apiUrl: "https://ridemetro.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ridemetro.bonfirehub.com/opportunities/",
  },
  {
    name: "Trinity Metro",
    apiUrl: "https://ridetm.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://ridetm.bonfirehub.com/opportunities/",
  },
  {
    name: "Long Island Power Authority",
    apiUrl: "https://lipower.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://lipower.bonfirehub.com/opportunities/",
  },

  // Utilities/Water Authorities
  {
    name: "Eastern Municipal Water District",
    apiUrl: "https://emwd.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://emwd.bonfirehub.com/opportunities/",
  },
  {
    name: "Beaufort-Jasper Water & Sewer Authority",
    apiUrl: "https://bjwsa.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://bjwsa.bonfirehub.com/opportunities/",
  },

  // Regional Planning/Development Agencies
  {
    name: "Kentuckiana Regional Planning & Development Agency (KIPDA)",
    apiUrl: "https://kipda.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://kipda.bonfirehub.com/opportunities/",
  },
  {
    name: "MRSC Rosters - Municipal Research and Services Center",
    apiUrl: "https://mrscrosters.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://mrscrosters.bonfirehub.com/opportunities/",
  },

  // Multi-State/Regional Consortiums
  {
    name: "PennBid (Pennsylvania)",
    apiUrl: "https://pennbid.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://pennbid.bonfirehub.com/opportunities/",
  },

  // International Governments
  {
    name: "Cayman Islands Government",
    apiUrl: "https://cayman.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://cayman.bonfirehub.com/opportunities/",
  },
  {
    name: "Barbados Government",
    apiUrl: "https://gov-bb.bonfirehub.com/PublicPortal/getOpenPublicOpportunitiesSectionData",
    baseUrl: "https://gov-bb.bonfirehub.com/opportunities/",
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
