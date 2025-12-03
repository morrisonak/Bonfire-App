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

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-72 bg-white shadow-md">
        <SelectValue placeholder="Select Agency" />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
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
