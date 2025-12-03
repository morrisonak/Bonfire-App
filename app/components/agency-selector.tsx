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
import { categoryLabels } from "~/config/agencies";

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
  // Group agencies by category
  const groupedAgencies = agencies.reduce(
    (acc, agency) => {
      // Find the category from the agencies config by matching name
      // For now, we'll need to determine category from the data
      // This will be properly handled when we integrate with the config
      const category = "state"; // Placeholder - will be properly typed

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(agency);
      return acc;
    },
    {} as Record<string, AgencyData[]>
  );

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-72 bg-white shadow-md">
        <SelectValue placeholder="Select Agency" />
      </SelectTrigger>
      <SelectContent>
        {agencies.map((agency) => (
          <SelectItem key={agency.name} value={agency.name}>
            {agency.name} ({agency.projects.length})
            {agency.error && " ⚠️"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
