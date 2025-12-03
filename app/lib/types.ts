/**
 * Type definitions for the Bonfire procurement opportunities application
 */

export type AgencyCategory =
  | "federal"
  | "state"
  | "county"
  | "city"
  | "university"
  | "healthcare"
  | "transit"
  | "utility"
  | "regional"
  | "international";

export interface Agency {
  name: string;
  apiUrl: string;
  baseUrl: string;
  category: AgencyCategory;
}

export interface Project {
  ProjectID: string;
  ProjectName: string;
  ReferenceID: string;
  DepartmentID: string;
  DateClose: string;
  DateOpen?: string;
  Description?: string;
}

export interface Department {
  DepartmentID: string;
  DepartmentName: string;
}

export interface AgencyData {
  name: string;
  baseUrl: string;
  projects: Project[];
  departments: Record<string, Department>;
  error: string | null;
}

export type SortOption =
  | "close-date-asc"
  | "close-date-desc"
  | "open-date-asc"
  | "open-date-desc"
  | "agency-name"
  | "department";

export interface FilterState {
  search: string;
  closingWithinDays?: number;
  departments: string[];
  categories: AgencyCategory[];
}
