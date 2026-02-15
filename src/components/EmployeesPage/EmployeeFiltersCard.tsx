import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter, Loader2, Search } from "lucide-react";
import { EmployeeFilters } from "../../types/employee";

interface EmployeeFiltersCardProps {
  filters: EmployeeFilters;
  debouncedSearchTerm: string;
  departments: string[];
  positions: string[];
  employmentStatuses: string[];
  employmentTypes: string[];
  onFilterChange: (key: keyof EmployeeFilters, value: string) => void;
  onClearFilters: () => void;
}

export function EmployeeFiltersCard({
  filters,
  debouncedSearchTerm,
  departments,
  employmentStatuses,
  employmentTypes,
  onFilterChange,
  onClearFilters,
}: EmployeeFiltersCardProps) {
  return (
    <Card className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative space-y-4">
        <h3 className="text-foreground text-lg">Search & Filter Employees</h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, phone number..."
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
                className="pl-10 pr-10 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 shadow-sm"
              />
              {filters.search && filters.search !== debouncedSearchTerm && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
              )}
            </div>
          </div>

          <Select
            value={filters.department}
            onValueChange={(value) => onFilterChange("department", value)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department.charAt(0).toUpperCase() + department.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.employmentStatus}
            onValueChange={(value) => onFilterChange("employmentStatus", value)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {employmentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.employmentType}
            onValueChange={(value) => onFilterChange("employmentType", value)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={onClearFilters}
            className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 shadow-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
