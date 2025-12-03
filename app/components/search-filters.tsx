import { Input } from "./ui/input";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function SearchFilters({ search, onSearchChange }: SearchFiltersProps) {
  return (
    <Input
      placeholder="Search by project name..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-72 bg-white shadow-md"
    />
  );
}
