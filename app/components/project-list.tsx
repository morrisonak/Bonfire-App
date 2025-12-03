import { ProjectCard } from "./project-card";
import type { Project, AgencyData } from "~/lib/types";

interface ProjectListProps {
  projects: Project[];
  agencyData: AgencyData;
  isLoading?: boolean;
  showAgencyName?: boolean;
}

export function ProjectList({
  projects,
  agencyData,
  isLoading = false,
  showAgencyName = false,
}: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <p className="text-center text-gray-500">Loading opportunities...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <p className="text-center text-gray-500">
          {agencyData.error
            ? "No data available due to loading error."
            : "No projects found."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.ProjectID}
          project={project}
          agencyData={agencyData}
          showAgencyName={showAgencyName}
        />
      ))}
    </div>
  );
}
