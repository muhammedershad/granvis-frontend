"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Building2,
  Grid3X3,
  List,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Project,
  ProjectFilters,
  ProjectSort,
  ProjectViewType,
} from "../../types/project";
import { cn } from "../ui/utils";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "@/lib/api/projectsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { ProjectStatsCards } from "./ProjectStatsCards";
import { ProjectFiltersCard } from "./ProjectFiltersCard";
import { ProjectCardView } from "./ProjectCardView";
import { ProjectTableView } from "./ProjectTableView";
import { ProjectPagination } from "./ProjectPagination";

const ITEMS_PER_PAGE = 8;

interface ProjectsPageProps {
  onProjectSelect?: (projectId: string) => void;
}

function buildURLParams(
  filters: ProjectFilters,
  page: number,
  sort: ProjectSort
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.type !== "all") {
    params.set("type", filters.type);
  }
  if (filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.priority !== "all") {
    params.set("priority", filters.priority);
  }
  if (filters.projectManager) {
    params.set("projectManager", filters.projectManager);
  }
  if (page > 1) {
    params.set("page", page.toString());
  }
  if (sort.field !== "createdAt") {
    params.set("sortBy", sort.field);
  }
  if (sort.direction !== "desc") {
    params.set("sortOrder", sort.direction);
  }

  return params;
}

// eslint-disable-next-line complexity
export function ProjectsPageContent({ onProjectSelect }: ProjectsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<ProjectViewType>("cards");
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    client: "",
    projectManager: "",
  });
  const [sort, setSort] = useState<ProjectSort>({
    field: "createdAt",
    direction: "desc",
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectName: string | null;
  }>({
    isOpen: false,
    projectId: null,
    projectName: null,
  });

  const debouncedSearchTerm = useDebounce(filters.search, 500);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    const urlFilters: ProjectFilters = {
      search: searchParams.get("search") || "",
      type: searchParams.get("type") || "all",
      status: searchParams.get("status") || "all",
      priority: searchParams.get("priority") || "all",
      client: "",
      projectManager: searchParams.get("projectManager") || "",
    };
    setFilters(urlFilters);

    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }

    const sortField = searchParams.get("sortBy");
    const sortDir = searchParams.get("sortOrder");
    if (sortField) {
      setSort({
        field: sortField as keyof Project,
        direction: (sortDir as "asc" | "desc") || "desc",
      });
    }

    setIsInitialMount(false);
  }, [searchParams]);

  useEffect(() => {
    if (!isInitialMount) {
      setCurrentPage(1);
      const updatedFilters = { ...filters, search: debouncedSearchTerm };
      updateURLParams(updatedFilters, 1);
    }
  }, [debouncedSearchTerm]);

  const updateURLParams = (
    newFilters: ProjectFilters,
    page: number = 1,
    newSort?: ProjectSort
  ) => {
    const sortToUse = newSort || sort;
    const params = buildURLParams(newFilters, page, sortToUse);
    const queryString = params.toString();
    router.push(queryString ? `/projects?${queryString}` : "/projects");
  };

  const { data, isLoading, isFetching, error } = useGetProjectsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm || undefined,
    type: filters.type !== "all" ? filters.type : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    priority: filters.priority !== "all" ? filters.priority : undefined,
    projectManager: filters.projectManager || undefined,
    sortBy: sort.field as
      | "createdAt"
      | "name"
      | "startDate"
      | "totalBudget"
      | "progressPercentage"
      | "priority"
      | "status",
    sortOrder: sort.direction,
  });

  const [deleteProject] = useDeleteProjectMutation();

  const projects = useMemo(() => data?.data || [], [data?.data]);
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const types = ["Villa", "Commercial", "Interior", "Landscape"];
  const statuses = [
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled",
  ];
  const priorities = ["Low", "Medium", "High", "Critical"];

  const stats = useMemo(() => {
    const total = pagination?.total || 0;
    const inProgress = projects.filter(
      (p) => p.status === "In Progress"
    ).length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const onHold = projects.filter((p) => p.status === "On Hold").length;
    const totalBudget = projects.reduce(
      (sum, p) => sum + (p.totalBudget || 0),
      0
    );
    const avgProgress =
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) /
              projects.length
          )
        : 0;

    return { total, inProgress, completed, onHold, totalBudget, avgProgress };
  }, [projects, pagination]);

  const openDeleteConfirmation = (projectId: string, projectName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      projectId,
      projectName,
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      projectId: null,
      projectName: null,
    });
  };

  const handleDeleteProject = async () => {
    if (!deleteConfirmation.projectId) {
      return;
    }

    try {
      await deleteProject(deleteConfirmation.projectId).unwrap();
      closeDeleteConfirmation();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    updateURLParams(updatedFilters, 1);
  };

  const handleSort = (field: keyof Project) => {
    const newSort = {
      field,
      direction: (sort.field === field && sort.direction === "asc"
        ? "desc"
        : "asc") as "asc" | "desc",
    };
    setSort(newSort);
    setCurrentPage(1);
    updateURLParams(filters, 1, newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(filters, page);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      type: "all",
      status: "all",
      priority: "all",
      client: "",
      projectManager: "",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateURLParams(clearedFilters, 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-3 text-lg text-muted-foreground">
          Loading projects...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-xl bg-red-50/70 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-8">
        <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
          <p className="text-lg font-medium">
            Failed to load projects. Please try again later.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground">Project Management</h1>
          <p className="text-muted-foreground">
            Track and manage your architectural projects
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-white/20 dark:bg-white/5 rounded-lg p-1 border border-white/30 dark:border-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
            <Button
              variant={viewType === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("cards")}
              className={cn(
                "px-3",
                viewType === "cards"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("table")}
              className={cn(
                "px-3",
                viewType === "table"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => router.push("/admin/projects/new")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <ProjectStatsCards stats={stats} />

      <ProjectFiltersCard
        filters={filters}
        isFetching={isFetching && !isLoading}
        types={types}
        statuses={statuses}
        priorities={priorities}
        totalProjects={pagination?.total || 0}
        currentCount={projects.length}
        onSearchChange={(value) =>
          setFilters((prev) => ({ ...prev, search: value }))
        }
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {!isLoading && !error && projects.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-16">
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Building2 className="w-16 h-16 opacity-50" />
            <h3 className="text-xl font-semibold">No projects found</h3>
            <p>Try adjusting your filters or create a new project</p>
          </div>
        </Card>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <>
          {viewType === "cards" ? (
            <ProjectCardView
              projects={projects}
              onSelect={onProjectSelect || (() => {})}
              onDelete={openDeleteConfirmation}
            />
          ) : (
            <ProjectTableView
              projects={projects}
              onSelect={onProjectSelect || (() => {})}
              onDelete={openDeleteConfirmation}
              sortField={sort.field}
              sortDirection={sort.direction}
              onSort={handleSort}
            />
          )}

          {totalPages > 1 && (
            <ProjectPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <AlertDialog
        open={deleteConfirmation.isOpen}
        onOpenChange={closeDeleteConfirmation}
      >
        <AlertDialogContent className="backdrop-blur-xl bg-white/95 dark:bg-black/95 border-white/20 dark:border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteConfirmation.projectName}
              </span>
              ?
              <br />
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground hover:bg-white/80 dark:hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
