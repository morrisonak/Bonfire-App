import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Project, AgencyData } from "~/lib/types";
import {
  formatCloseDate,
  getRelativeDate,
  isClosingSoon,
} from "~/lib/date-utils";

interface ProjectCardProps {
  project: Project;
  agencyData: AgencyData;
  showAgencyName?: boolean;
}

export function ProjectCard({
  project,
  agencyData,
  showAgencyName = false,
}: ProjectCardProps) {
  const department =
    agencyData.departments?.[project.DepartmentID]?.DepartmentName || "Unknown";
  const isUrgent = isClosingSoon(project.DateClose);

  return (
    <Card className="shadow-lg rounded-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 break-words">
              {project.ProjectName || "Unnamed Project"}
            </h2>
            {showAgencyName && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{agencyData.name}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isUrgent && (
              <Badge variant="destructive">Closing Soon</Badge>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300 text-right whitespace-nowrap">
              {formatCloseDate(project.DateClose)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {getRelativeDate(project.DateClose)}
            </span>
          </div>
        </div>

        <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
          <span>Reference ID: {project.ReferenceID || "N/A"}</span>
          <span>Department: {department}</span>
        </div>

        <div className="mt-2">
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <a
              href={`${agencyData.baseUrl}${project.ProjectID}`}
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
  );
}
