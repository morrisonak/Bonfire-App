import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { filterProjects, sortProjects, filterByClosingDate } from "~/lib/project-utils";
import type { Project } from "~/lib/types";

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    ProjectID: "1",
    ProjectName: "Test Project",
    ReferenceID: "REF-001",
    DepartmentID: "dept-1",
    DateClose: "2025-06-20T00:00:00Z",
    ...overrides,
  };
}

describe("filterProjects", () => {
  const projects: Project[] = [
    makeProject({ ProjectID: "1", ProjectName: "Road Construction", ReferenceID: "RFP-2025-001" }),
    makeProject({
      ProjectID: "2",
      ProjectName: "IT Services",
      ReferenceID: "RFQ-2025-002",
      Description: "Cloud migration and infrastructure support",
    }),
    makeProject({ ProjectID: "3", ProjectName: "Park Maintenance", ReferenceID: "BID-2025-003" }),
  ];

  it("returns all projects when search is empty", () => {
    expect(filterProjects(projects, "")).toHaveLength(3);
    expect(filterProjects(projects, "   ")).toHaveLength(3);
  });

  it("filters by project name (case-insensitive)", () => {
    const result = filterProjects(projects, "road");
    expect(result).toHaveLength(1);
    expect(result[0].ProjectName).toBe("Road Construction");
  });

  it("filters by reference ID", () => {
    const result = filterProjects(projects, "RFQ-2025");
    expect(result).toHaveLength(1);
    expect(result[0].ReferenceID).toBe("RFQ-2025-002");
  });

  it("filters by description", () => {
    const result = filterProjects(projects, "cloud migration");
    expect(result).toHaveLength(1);
    expect(result[0].ProjectName).toBe("IT Services");
  });

  it("returns empty array when nothing matches", () => {
    expect(filterProjects(projects, "xyz-no-match")).toHaveLength(0);
  });

  it("handles projects with undefined fields gracefully", () => {
    const sparseProjects = [
      makeProject({ ProjectName: undefined as unknown as string, Description: undefined }),
    ];
    // Should not throw
    const result = filterProjects(sparseProjects, "anything");
    expect(result).toHaveLength(0);
  });

  it("matches partial strings", () => {
    const result = filterProjects(projects, "maint");
    expect(result).toHaveLength(1);
    expect(result[0].ProjectName).toBe("Park Maintenance");
  });
});

describe("sortProjects", () => {
  const projects: Project[] = [
    makeProject({
      ProjectID: "1",
      ProjectName: "Bravo Project",
      DepartmentID: "dept-b",
      DateClose: "2025-06-20T00:00:00Z",
      DateOpen: "2025-06-01T00:00:00Z",
    }),
    makeProject({
      ProjectID: "2",
      ProjectName: "Alpha Project",
      DepartmentID: "dept-a",
      DateClose: "2025-06-15T00:00:00Z",
      DateOpen: "2025-06-05T00:00:00Z",
    }),
    makeProject({
      ProjectID: "3",
      ProjectName: "Charlie Project",
      DepartmentID: "dept-c",
      DateClose: "2025-06-25T00:00:00Z",
      DateOpen: "2025-05-20T00:00:00Z",
    }),
  ];

  it("sorts by close date ascending", () => {
    const result = sortProjects(projects, "close-date-asc");
    expect(result[0].ProjectName).toBe("Alpha Project");
    expect(result[2].ProjectName).toBe("Charlie Project");
  });

  it("sorts by close date descending", () => {
    const result = sortProjects(projects, "close-date-desc");
    expect(result[0].ProjectName).toBe("Charlie Project");
    expect(result[2].ProjectName).toBe("Alpha Project");
  });

  it("sorts by open date ascending", () => {
    const result = sortProjects(projects, "open-date-asc");
    expect(result[0].ProjectName).toBe("Charlie Project");
    expect(result[2].ProjectName).toBe("Alpha Project");
  });

  it("sorts by open date descending", () => {
    const result = sortProjects(projects, "open-date-desc");
    expect(result[0].ProjectName).toBe("Alpha Project");
    expect(result[2].ProjectName).toBe("Charlie Project");
  });

  it("sorts by agency-name (project name via localeCompare)", () => {
    const result = sortProjects(projects, "agency-name");
    // Verify all projects are returned and none are lost
    expect(result).toHaveLength(3);
    const names = result.map((p) => p.ProjectName);
    expect(names).toContain("Alpha Project");
    expect(names).toContain("Bravo Project");
    expect(names).toContain("Charlie Project");
  });

  it("sorts by department", () => {
    const result = sortProjects(projects, "department");
    expect(result[0].DepartmentID).toBe("dept-a");
    expect(result[1].DepartmentID).toBe("dept-b");
    expect(result[2].DepartmentID).toBe("dept-c");
  });

  it("does not mutate the original array", () => {
    const original = [...projects];
    sortProjects(projects, "close-date-asc");
    expect(projects).toEqual(original);
  });

  it("handles missing DateClose gracefully in ascending sort", () => {
    const withMissing = [
      makeProject({ ProjectID: "a", DateClose: "2025-06-10T00:00:00Z" }),
      makeProject({ ProjectID: "b", DateClose: undefined as unknown as string }),
    ];
    const result = sortProjects(withMissing, "close-date-asc");
    // Undefined DateClose treated as Infinity, so it sorts last
    expect(result[0].ProjectID).toBe("a");
  });

  it("handles missing DateClose gracefully in descending sort", () => {
    const withMissing = [
      makeProject({ ProjectID: "a", DateClose: "2025-06-10T00:00:00Z" }),
      makeProject({ ProjectID: "b", DateClose: undefined as unknown as string }),
    ];
    const result = sortProjects(withMissing, "close-date-desc");
    // Undefined DateClose treated as 0 in desc, so it sorts last
    expect(result[0].ProjectID).toBe("a");
  });

  it("returns original order for unknown sort option", () => {
    // biome-ignore lint/suspicious/noExplicitAny: testing unknown sort option
    const result = sortProjects(projects, "unknown" as any);
    expect(result[0].ProjectID).toBe("1");
    expect(result[1].ProjectID).toBe("2");
    expect(result[2].ProjectID).toBe("3");
  });
});

describe("filterByClosingDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const projects: Project[] = [
    makeProject({ ProjectID: "1", DateClose: "2025-06-16T00:00:00Z" }), // 1 day
    makeProject({ ProjectID: "2", DateClose: "2025-06-20T00:00:00Z" }), // 5 days
    makeProject({ ProjectID: "3", DateClose: "2025-06-30T00:00:00Z" }), // 15 days
    makeProject({ ProjectID: "4", DateClose: "2025-07-15T00:00:00Z" }), // 30 days
    makeProject({ ProjectID: "5", DateClose: "2025-06-10T00:00:00Z" }), // past
  ];

  it("returns all projects when days is undefined", () => {
    expect(filterByClosingDate(projects)).toHaveLength(5);
  });

  it("returns only projects closing today when days is 0", () => {
    // days=0 means only projects closing today (daysUntil >= 0 && daysUntil <= 0)
    const result = filterByClosingDate(projects, 0);
    expect(result).toHaveLength(0); // none of the test projects close on 2025-06-15
  });

  it("filters to projects closing within 3 days", () => {
    const result = filterByClosingDate(projects, 3);
    expect(result).toHaveLength(1);
    expect(result[0].ProjectID).toBe("1");
  });

  it("filters to projects closing within 7 days", () => {
    const result = filterByClosingDate(projects, 7);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.ProjectID)).toContain("1");
    expect(result.map((p) => p.ProjectID)).toContain("2");
  });

  it("filters to projects closing within 30 days", () => {
    const result = filterByClosingDate(projects, 30);
    expect(result).toHaveLength(4);
    // Should exclude the past project
    expect(result.map((p) => p.ProjectID)).not.toContain("5");
  });

  it("excludes projects that have already closed", () => {
    const result = filterByClosingDate(projects, 365);
    expect(result.map((p) => p.ProjectID)).not.toContain("5");
  });
});
