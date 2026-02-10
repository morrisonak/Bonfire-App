/**
 * Project utility functions for filtering and sorting
 */

import type { Project, SortOption } from "./types";
import { getDaysUntilClose } from "./date-utils";

/**
 * Filter projects by search query
 * @param projects - Array of projects
 * @param search - Search query string
 * @returns Filtered projects
 */
export function filterProjects(projects: Project[], search: string): Project[] {
  if (!search.trim()) return projects;

  const query = search.toLowerCase();
  return projects.filter((project) => {
    return (
      project.ProjectName?.toLowerCase().includes(query) ||
      project.ReferenceID?.toLowerCase().includes(query) ||
      project.Description?.toLowerCase().includes(query)
    );
  });
}

/**
 * Sort projects by specified option
 * @param projects - Array of projects
 * @param sortBy - Sort option
 * @returns Sorted projects
 */
export function sortProjects(
  projects: Project[],
  sortBy: SortOption
): Project[] {
  const sorted = [...projects];

  switch (sortBy) {
    case "close-date-asc":
      return sorted.sort((a, b) => {
        const dateA = a.DateClose ? new Date(a.DateClose).getTime() : Infinity;
        const dateB = b.DateClose ? new Date(b.DateClose).getTime() : Infinity;
        return dateA - dateB;
      });

    case "close-date-desc":
      return sorted.sort((a, b) => {
        const dateA = a.DateClose ? new Date(a.DateClose).getTime() : 0;
        const dateB = b.DateClose ? new Date(b.DateClose).getTime() : 0;
        return dateB - dateA;
      });

    case "open-date-asc":
      return sorted.sort((a, b) => {
        const dateA = a.DateOpen ? new Date(a.DateOpen).getTime() : Infinity;
        const dateB = b.DateOpen ? new Date(b.DateOpen).getTime() : Infinity;
        return dateA - dateB;
      });

    case "open-date-desc":
      return sorted.sort((a, b) => {
        const dateA = a.DateOpen ? new Date(a.DateOpen).getTime() : 0;
        const dateB = b.DateOpen ? new Date(b.DateOpen).getTime() : 0;
        return dateB - dateA;
      });

    case "department":
      return sorted.sort((a, b) =>
        (a.DepartmentID || "").localeCompare(b.DepartmentID || "")
      );

    default:
      return sorted;
  }
}

/**
 * Filter projects by closing date range
 * @param projects - Array of projects
 * @param days - Number of days (only show projects closing within this timeframe)
 * @returns Filtered projects
 */
export function filterByClosingDate(
  projects: Project[],
  days?: number
): Project[] {
  if (days == null) return projects;

  return projects.filter((project) => {
    const daysUntil = getDaysUntilClose(project.DateClose);
    return daysUntil >= 0 && daysUntil <= days;
  });
}

/**
 * Group projects by department
 * @param projects - Array of projects
 * @returns Projects grouped by department ID
 */
export function groupByDepartment(
  projects: Project[]
): Record<string, Project[]> {
  return projects.reduce(
    (acc, project) => {
      const deptId = project.DepartmentID || "unknown";
      if (!acc[deptId]) {
        acc[deptId] = [];
      }
      acc[deptId].push(project);
      return acc;
    },
    {} as Record<string, Project[]>
  );
}
