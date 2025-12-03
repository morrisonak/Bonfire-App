import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "./ui/select";
import type { AgencyData, AgencyCategory } from "~/lib/types";
import { agencies as agencyConfig, categoryLabels } from "~/config/agencies";

interface AgencySelectorProps {
  agencies: AgencyData[];
  selected: string;
  onChange: (name: string) => void;
}

export function AgencySelector({
  agencies,
  selected,
  onChange,
}: AgencySelectorProps) {
  // Create a map of agency names to categories from config
  const categoryMap = new Map(
    agencyConfig.map((a) => [a.name, a.category])
  );

  // Group agencies by category
  const groupedAgencies = agencies.reduce(
    (acc, agency) => {
      const category = categoryMap.get(agency.name) || "state";

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(agency);
      return acc;
    },
    {} as Record<AgencyCategory, AgencyData[]>
  );

  // Sort categories for consistent display
  const sortedCategories = Object.keys(groupedAgencies).sort() as AgencyCategory[];

  // Calculate total projects across all agencies
  const totalProjects = agencies.reduce(
    (sum, agency) => sum + agency.projects.length,
    0
  );

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-72 bg-white shadow-md">
        <SelectValue placeholder="Select Agency" />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {/* All Agencies Option */}
        <SelectItem value="__all__" className="font-semibold">
          All Agencies ({totalProjects})
        </SelectItem>

        {/* Individual Agencies by Category */}
        {sortedCategories.map((category) => (
          <SelectGroup key={category}>
            <SelectLabel>{categoryLabels[category]}</SelectLabel>
            {groupedAgencies[category]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((agency) => (
                <SelectItem key={agency.name} value={agency.name}>
                  {agency.name} ({agency.projects.length})
                  {agency.error && " ⚠️"}
                </SelectItem>
              ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
