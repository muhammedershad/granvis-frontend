"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Building2,
  FolderKanban,
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
  useGetProjectStatisticsQuery,
  useGetProjectsQuery,
} from "@/lib/api/projectsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/store/hooks";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProjectStatsCards } from "./ProjectStatsCards";
import { ProjectFiltersCard } from "./ProjectFiltersCard";
import { ProjectCardView } from "./ProjectCardView";
import { ProjectTableView } from "./ProjectTableView";
import { ProjectPagination } from "./ProjectPagination";

const ITEMS_PER_PAGE = 12;

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      <span className="ml-3 text-lg text-muted-foreground">
        Loading projects...
      </span>
    </div>
  );
}

function ErrorState() {
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

function EmptyState() {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-16">
      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Building2 className="w-16 h-16 opacity-50" />
        <h3 className="text-xl font-semibold">No projects found</h3>
        <p>Try adjusting your filters or create a new project</p>
      </div>
    </Card>
  );
}

interface PageHeaderProps {
  viewType: ProjectViewType;
  setViewType: (type: ProjectViewType) => void;
  onNewProject: () => void;
}

function PageHeader({ viewType, setViewType, onNewProject }: PageHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <FolderKanban className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-foreground">Project Management</h1>
          <p className="text-muted-foreground">
            Track and manage your architectural projects
          </p>
        </div>
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
          onClick={onNewProject}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
    </div>
  );
}

interface DeleteConfirmationState {
  isOpen: boolean;
  projectId: string | null;
  projectName: string | null;
}

function useDeleteConfirmation() {
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      isOpen: false,
      projectId: null,
      projectName: null,
    });

  const openDeleteConfirmation = useCallback(
    (projectId: string, projectName: string) => {
      setDeleteConfirmation({
        isOpen: true,
        projectId,
        projectName,
      });
    },
    []
  );

  const closeDeleteConfirmation = useCallback(() => {
    setDeleteConfirmation({
      isOpen: false,
      projectId: null,
      projectName: null,
    });
  }, []);

  return {
    deleteConfirmation,
    openDeleteConfirmation,
    closeDeleteConfirmation,
  };
}

function useURLFiltersSync(
  projectsBasePath: string,
  searchParams: URLSearchParams
) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
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
  const [isInitialMount, setIsInitialMount] = useState(true);

  const debouncedSearchTerm = useDebounce(filters.search, 500);

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

  const updateURLParams = useCallback(
    (newFilters: ProjectFilters, page: number = 1, newSort?: ProjectSort) => {
      const sortToUse = newSort || sort;
      const params = buildURLParams(newFilters, page, sortToUse);
      const queryString = params.toString();
      router.push(
        queryString ? `${projectsBasePath}?${queryString}` : projectsBasePath
      );
    },
    [sort, router, projectsBasePath]
  );

  useEffect(() => {
    if (!isInitialMount) {
      setCurrentPage(1);
      const updatedFilters = { ...filters, search: debouncedSearchTerm };
      updateURLParams(updatedFilters, 1);
    }
  }, [debouncedSearchTerm, filters, isInitialMount, updateURLParams]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<ProjectFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      setCurrentPage(1);
      updateURLParams(updatedFilters, 1);
    },
    [filters, updateURLParams]
  );

  const handleSort = useCallback(
    (field: keyof Project) => {
      const newSort = {
        field,
        direction: (sort.field === field && sort.direction === "asc"
          ? "desc"
          : "asc") as "asc" | "desc",
      };
      setSort(newSort);
      setCurrentPage(1);
      updateURLParams(filters, 1, newSort);
    },
    [sort, filters, updateURLParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURLParams(filters, page);
    },
    [filters, updateURLParams]
  );

  const handleClearFilters = useCallback(() => {
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
  }, [updateURLParams]);

  return {
    currentPage,
    filters,
    sort,
    debouncedSearchTerm,
    setFilters,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleClearFilters,
  };
}

interface ProjectsPageProps {
  onProjectSelect?: (projectId: string) => void;
  /** Base path for project details navigation. Defaults to "/projects" */
  projectsBasePath?: string;
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

function buildProjectQuery({
  currentPage,
  debouncedSearchTerm,
  filters,
  sort,
  shouldFilterByUser,
  userId,
}: {
  currentPage: number;
  debouncedSearchTerm: string;
  filters: ProjectFilters;
  sort: ProjectSort;
  shouldFilterByUser: boolean;
  userId?: string;
}) {
  return {
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
    userId: shouldFilterByUser ? userId : undefined,
  };
}

function computeProjectStats(statisticsData?: {
  totalProjects?: number;
  byStatus?: Array<{ _id: string; count: number }>;
}) {
  const total = statisticsData?.totalProjects ?? 0;
  const byStatus = statisticsData?.byStatus || [];

  const getStatusCount = (status: string) => {
    const found = byStatus.find((s) => s._id === status);
    return found?.count ?? 0;
  };

  return {
    total,
    planning: getStatusCount("Planning"),
    inProgress: getStatusCount("In Progress"),
    onHold: getStatusCount("On Hold"),
    completed: getStatusCount("Completed"),
    cancelled: getStatusCount("Cancelled"),
  };
}

export function ProjectsPageContent({
  onProjectSelect,
  projectsBasePath = "/projects",
}: ProjectsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewType, setViewType] = useState<ProjectViewType>("cards");

  const {
    currentPage,
    filters,
    sort,
    debouncedSearchTerm,
    setFilters,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleClearFilters,
  } = useURLFiltersSync(projectsBasePath, searchParams);

  const authUser = useAppSelector((state) => state.auth.user);
  const shouldFilterByUser =
    authUser?.role === IAuthRoles.EMPLOYEE ||
    authUser?.role === IAuthRoles.MANAGER;

  const {
    deleteConfirmation,
    openDeleteConfirmation,
    closeDeleteConfirmation,
  } = useDeleteConfirmation();

  const handleProjectSelect = useCallback(
    (projectId: string) => {
      if (onProjectSelect) {
        onProjectSelect(projectId);
      } else {
        router.push(`${projectsBasePath}/${projectId}`);
      }
    },
    [onProjectSelect, projectsBasePath, router]
  );

  const { data, isLoading, isFetching, error } = useGetProjectsQuery(
    buildProjectQuery({
      currentPage,
      debouncedSearchTerm,
      filters,
      sort,
      shouldFilterByUser,
      userId: authUser?._id,
    })
  );

  const [deleteProject] = useDeleteProjectMutation();

  const { data: statisticsData } = useGetProjectStatisticsQuery();

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

  const stats = useMemo(
    () => computeProjectStats(statisticsData),
    [statisticsData]
  );

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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        viewType={viewType}
        setViewType={setViewType}
        onNewProject={() => router.push("/admin/projects/new")}
      />

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

      {projects.length === 0 && <EmptyState />}

      {projects.length > 0 && (
        <>
          {viewType === "cards" ? (
            <ProjectCardView
              projects={projects}
              onSelect={handleProjectSelect}
              onDelete={openDeleteConfirmation}
            />
          ) : (
            <ProjectTableView
              projects={projects}
              onSelect={handleProjectSelect}
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
