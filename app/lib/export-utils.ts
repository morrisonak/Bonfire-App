/**
 * Export utility functions
 */

import type { Project, AgencyData } from "./types";

interface ProjectWithAgency {
  project: Project;
  agencyData: AgencyData;
}

/**
 * Convert projects to CSV format
 * @param projectsWithAgency - Array of projects with their agency data
 * @returns CSV string
 */
export function exportToCSV(projectsWithAgency: ProjectWithAgency[]): string {
  // CSV headers
  const headers = [
    "Agency",
    "Project Name",
    "Reference ID",
    "Department",
    "Close Date",
    "Days Until Close",
    "Portal Link",
  ];

  // CSV rows
  const rows = projectsWithAgency.map(({ project, agencyData }) => {
    const department =
      agencyData.departments[project.DepartmentID]?.DepartmentName || "Unknown";
    const closeDate = project.DateClose
      ? new Date(project.DateClose).toLocaleDateString()
      : "N/A";
    const daysUntil = project.DateClose
      ? Math.ceil(
          (new Date(project.DateClose).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : "N/A";
    const link = `${agencyData.baseUrl}${project.ProjectID}`;

    return [
      agencyData.name,
      project.ProjectName,
      project.ReferenceID,
      department,
      closeDate,
      daysUntil,
      link,
    ];
  });

  // Escape CSV values
  const escapeCsvValue = (value: string | number): string => {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV
  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download CSV file
 * @param csvContent - CSV string content
 * @param filename - Filename for download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export projects to CSV and download
 * @param projectsWithAgency - Array of projects with their agency data
 */
export function exportProjectsToCSV(
  projectsWithAgency: ProjectWithAgency[]
): void {
  const csvContent = exportToCSV(projectsWithAgency);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `opportunities-${timestamp}.csv`;

  downloadCSV(csvContent, filename);
}

/**
 * Convert agency data to JSON export format
 * @param agencyDataList - Array of agency data
 * @returns JSON object with all solicitations
 */
export function exportToJSON(agencyDataList: AgencyData[]) {
  const solicitations = agencyDataList.flatMap((agency) =>
    agency.projects.map((project) => ({
      agency: agency.name,
      projectName: project.ProjectName,
      referenceId: project.ReferenceID,
      department:
        agency.departments[project.DepartmentID]?.DepartmentName || "Unknown",
      closeDate: project.DateClose,
      portalLink: `${agency.baseUrl}${project.ProjectID}`,
    }))
  );

  return {
    exportedAt: new Date().toISOString(),
    totalCount: solicitations.length,
    solicitations,
  };
}

/**
 * Download JSON file
 * @param data - Data to export
 * @param filename - Filename for download
 */
export function downloadJSON(data: object, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export all solicitations to JSON and download
 * @param agencyDataList - Array of agency data
 */
export function exportAllToJSON(agencyDataList: AgencyData[]): void {
  const data = exportToJSON(agencyDataList);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `solicitations-${timestamp}.json`;

  downloadJSON(data, filename);
}
