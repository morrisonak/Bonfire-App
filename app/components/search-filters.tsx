import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import type { SortOption } from "~/lib/types";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  closingWithinDays?: number;
  onClosingWithinDaysChange: (value: number | undefined) => void;
}

export function SearchFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  closingWithinDays,
  onClosingWithinDaysChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
      <Input
        placeholder="Search by name, ID, or description..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search opportunities"
        className="flex-1 bg-white dark:bg-gray-900 shadow-md border-gray-300 dark:border-gray-700"
      />

      <Select
        value={closingWithinDays?.toString() || "all"}
        onValueChange={(value) =>
          onClosingWithinDaysChange(value === "all" ? undefined : Number(value))
        }
      >
        <SelectTrigger className="w-full md:w-48 bg-white dark:bg-gray-900 shadow-md border-gray-300 dark:border-gray-700">
          <SelectValue placeholder="Closing within..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All dates</SelectItem>
          <SelectItem value="3">Next 3 days</SelectItem>
          <SelectItem value="7">Next week</SelectItem>
          <SelectItem value="14">Next 2 weeks</SelectItem>
          <SelectItem value="30">Next month</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-full md:w-48 bg-white dark:bg-gray-900 shadow-md border-gray-300 dark:border-gray-700">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="close-date-asc">Closing Soon</SelectItem>
          <SelectItem value="close-date-desc">Closing Latest</SelectItem>
          <SelectItem value="agency-name">Agency Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
