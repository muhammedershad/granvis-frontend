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
import { ProjectFilters } from "../../types/project";

interface ProjectFiltersCardProps {
  filters: ProjectFilters;
  isFetching: boolean;
  types: string[];
  statuses: string[];
  priorities: string[];
  totalProjects: number;
  currentCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (newFilters: Partial<ProjectFilters>) => void;
  onClearFilters: () => void;
}

export function ProjectFiltersCard({
  filters,
  isFetching,
  types,
  statuses,
  priorities,
  totalProjects,
  currentCount,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}: ProjectFiltersCardProps) {
  return (
    <Card className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg">Search & Filter Projects</h3>
          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 shadow-sm"
              />
            </div>
          </div>

          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange({ type: value })}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ status: value })}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => onFilterChange({ priority: value })}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
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

        <div className="text-muted-foreground text-sm">
          Showing {currentCount} of {totalProjects} projects
        </div>
      </div>
    </Card>
  );
}
