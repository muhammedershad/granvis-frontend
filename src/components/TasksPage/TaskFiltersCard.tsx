"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import {
  TaskPriority,
  TaskProjectRef,
  TaskQueryParams,
  TaskStatus,
  TaskUserRef,
} from "@/types/task";

interface TaskFiltersCardProps {
  filters: TaskQueryParams;
  onFiltersChange: (filters: TaskQueryParams) => void;
  projects?: TaskProjectRef[];
  teamMembers?: TaskUserRef[];
  showProjectFilter?: boolean;
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  all: { label: "All Priorities", color: "" },
  [TaskPriority.LOW]: { label: "Low", color: "text-slate-600" },
  [TaskPriority.MEDIUM]: { label: "Medium", color: "text-blue-600" },
  [TaskPriority.HIGH]: { label: "High", color: "text-orange-600" },
  [TaskPriority.URGENT]: { label: "Urgent", color: "text-red-600" },
};

const sortOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
  { value: "status", label: "Status" },
];

// eslint-disable-next-line complexity -- presentational component with many filter dropdowns
export function TaskFiltersCard({
  filters,
  onFiltersChange,
  projects = [],
  teamMembers = [],
  showProjectFilter = true,
}: TaskFiltersCardProps) {
  const hasActiveFilters =
    filters.search ||
    (filters.status && filters.status !== "all") ||
    (filters.priority && filters.priority !== "all") ||
    (filters.assignedTo && filters.assignedTo !== "all") ||
    (filters.project && filters.project !== "all");

  const updateFilter = (key: keyof TaskQueryParams, value: string) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      priority: "all",
      assignedTo: "all",
      project: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: filters.limit,
    });
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative space-y-4">
        <h3 className="text-foreground text-lg">Search & Filter Tasks</h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks by title, description..."
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 shadow-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status || "all"}
            onValueChange={(v) => updateFilter("status", v)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={TaskStatus.REVIEW}>In Review</SelectItem>
              <SelectItem value={TaskStatus.DONE}>Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority || "all"}
            onValueChange={(v) => updateFilter("priority", v)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  <span className={config.color}>{config.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          {teamMembers.length > 0 && (
            <Select
              value={filters.assignedTo || "all"}
              onValueChange={(v) => updateFilter("assignedTo", v)}
            >
              <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 shadow-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Project Filter */}
          {showProjectFilter && projects.length > 0 && (
            <Select
              value={filters.project || "all"}
              onValueChange={(v) => updateFilter("project", v)}
            >
              <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select
            value={filters.sortBy || "createdAt"}
            onValueChange={(v) => updateFilter("sortBy", v)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm"
            onClick={() =>
              updateFilter(
                "sortOrder",
                filters.sortOrder === "asc" ? "desc" : "asc"
              )
            }
          >
            {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
