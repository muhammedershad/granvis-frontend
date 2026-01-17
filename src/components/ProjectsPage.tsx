'use client';
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  Plus,
  Filter,

  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Building2,
  Home,
  Palette,
  TreePine,
  Calendar,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Pause,
  X,
  Grid3X3,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import { Project, ProjectFilters, ProjectSort, ProjectViewType } from "../types/project";
import { cn } from "./ui/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation
} from "@/lib/api/projectsApi";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 8;

interface ProjectsPageProps {
  onProjectSelect?: (projectId: string) => void;
}

export function ProjectsPage({ onProjectSelect }: ProjectsPageProps) {
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
    projectManager: ""
  });
  const [sort, setSort] = useState<ProjectSort>({
    field: "createdAt",
    direction: "desc"
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectName: string | null;
  }>({
    isOpen: false,
    projectId: null,
    projectName: null
  });

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(filters.search, 500);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const urlFilters: ProjectFilters = {
      search: searchParams.get('search') || "",
      type: searchParams.get('type') || "all",
      status: searchParams.get('status') || "all",
      priority: searchParams.get('priority') || "all",
      client: "",
      projectManager: searchParams.get('projectManager') || ""
    };
    setFilters(urlFilters);

    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }

    const sortField = searchParams.get('sortBy');
    const sortDir = searchParams.get('sortOrder');
    if (sortField) {
      setSort({
        field: sortField as keyof Project,
        direction: (sortDir as 'asc' | 'desc') || 'desc'
      });
    }

    setIsInitialMount(false);
  }, [searchParams]);

  // Reset to page 1 and update URL when debounced search term changes
  useEffect(() => {
    if (!isInitialMount) {
      setCurrentPage(1);
      const updatedFilters = { ...filters, search: debouncedSearchTerm };
      updateURLParams(updatedFilters, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Function to update URL params
  const updateURLParams = (newFilters: ProjectFilters, page: number = 1, newSort?: ProjectSort) => {
    const params = new URLSearchParams();

    // Add filters to URL only if they're not default values
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.type !== "all") params.set('type', newFilters.type);
    if (newFilters.status !== "all") params.set('status', newFilters.status);
    if (newFilters.priority !== "all") params.set('priority', newFilters.priority);
    if (newFilters.projectManager) params.set('projectManager', newFilters.projectManager);

    // Add page if not first page
    if (page > 1) params.set('page', page.toString());

    // Add sort if not default
    const sortToUse = newSort || sort;
    if (sortToUse.field !== 'createdAt') params.set('sortBy', sortToUse.field);
    if (sortToUse.direction !== 'desc') params.set('sortOrder', sortToUse.direction);

    const queryString = params.toString();
    router.push(queryString ? `/projects?${queryString}` : '/projects');
  };

  // RTK Query hooks - use debounced search term
  const { data, isLoading, isFetching, error } = useGetProjectsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm || undefined,
    type: filters.type !== "all" ? filters.type : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    priority: filters.priority !== "all" ? filters.priority : undefined,
    projectManager: filters.projectManager || undefined,
    sortBy: sort.field as 'createdAt' | 'name' | 'startDate' | 'totalBudget' | 'progressPercentage' | 'priority' | 'status',
    sortOrder: sort.direction,
  });


  const [deleteProject] = useDeleteProjectMutation();

  const projects = useMemo(() => data?.data || [], [data?.data]);
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // Filter options - using hardcoded values since we're filtering server-side
  const types = ["Villa", "Commercial", "Interior", "Landscape"];
  const statuses = ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"];
  const priorities = ["Low", "Medium", "High", "Critical"];

  // Calculate statistics from server data
  const stats = useMemo(() => {
    const total = pagination?.total || 0;
    const inProgress = projects.filter(p => p.status === "In Progress").length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const onHold = projects.filter(p => p.status === "On Hold").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
    const avgProgress = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / projects.length)
      : 0;

    return { total, inProgress, completed, onHold, totalBudget, avgProgress };
  }, [projects, pagination]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Villa": return Home;
      case "Commercial": return Building2;
      case "Interior": return Palette;
      case "Landscape": return TreePine;
      default: return Building2;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "In Progress": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "On Hold": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Completed": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Planning": return <Clock className="w-3 h-3" />;
      case "In Progress": return <TrendingUp className="w-3 h-3" />;
      case "On Hold": return <Pause className="w-3 h-3" />;
      case "Completed": return <CheckCircle className="w-3 h-3" />;
      case "Cancelled": return <X className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-500/20 text-gray-400";
      case "Medium": return "bg-blue-500/20 text-blue-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "Critical": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSortIcon = (field: keyof Project) => {
    if (sort.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sort.direction === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };



  const openDeleteConfirmation = (projectId: string, projectName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      projectId,
      projectName
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      projectId: null,
      projectName: null
    });
  };

  const handleDeleteProject = async () => {
    if (!deleteConfirmation.projectId) return;

    try {
      await deleteProject(deleteConfirmation.projectId).unwrap();
      closeDeleteConfirmation();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Reset to first page when filters change
  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    updateURLParams(updatedFilters, 1);
  };

  // Reset to first page when sort changes
  const handleSort = (field: keyof Project) => {
    const newSort = {
      field,
      direction: (sort.field === field && sort.direction === "asc" ? "desc" : "asc") as 'asc' | 'desc'
    };
    setSort(newSort);
    setCurrentPage(1);
    updateURLParams(filters, 1, newSort);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(filters, page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground">Project Management</h1>
          <p className="text-muted-foreground">Track and manage your architectural projects</p>
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
          
          {/* <Button variant="outline" className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button> */}
          
        <Button 
            onClick={() => router.push('/admin/projects/new')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Projects</p>
              <p className="text-foreground text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 to-emerald-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 shadow-lg shadow-green-200/50 dark:shadow-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">In Progress</p>
              <p className="text-foreground text-2xl">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-pink-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="text-foreground text-2xl">{stats.completed}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/60 to-orange-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-500/20">
              <Pause className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">On Hold</p>
              <p className="text-foreground text-2xl">{stats.onHold}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 to-blue-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-200/50 dark:shadow-cyan-500/20">
              <DollarSign className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Budget</p>
              <p className="text-foreground text-xl">${(stats.totalBudget / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-purple-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-500/20">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Avg Progress</p>
              <p className="text-foreground text-2xl">{stats.avgProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-lg">Search & Filter Projects</h3>
            {isFetching && !isLoading && (
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
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 shadow-sm"
                />
              </div>
            </div>
            
            <Select value={filters.type} onValueChange={(value) => handleFilterChange({ type: value })}>
              <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.status} onValueChange={(value) => handleFilterChange({ status: value })}>
              <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange({ priority: value })}>
              <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                const clearedFilters = { search: "", type: "all", status: "all", priority: "all", client: "", projectManager: "" };
                setFilters(clearedFilters);
                setCurrentPage(1);
                updateURLParams(clearedFilters, 1);
              }}
              className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 shadow-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          
          {pagination && (
            <div className="text-muted-foreground text-sm">
              Showing {projects.length} of {pagination.total} projects
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-3 text-lg text-muted-foreground">Loading projects...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="backdrop-blur-xl bg-red-50/70 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-8">
          <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            <p className="text-lg font-medium">Failed to load projects. Please try again later.</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-16">
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Building2 className="w-16 h-16 opacity-50" />
            <h3 className="text-xl font-semibold">No projects found</h3>
            <p>Try adjusting your filters or create a new project</p>
          </div>
        </Card>
      )}

      {/* Projects Display */}
      {!isLoading && !error && projects.length > 0 && (
        <>
      {viewType === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => {
            const TypeIcon = getTypeIcon(project.type);
            return (
              <Card 
                key={project.id} 
                className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl dark:hover:shadow-black/70 cursor-pointer"
                onClick={() => onProjectSelect?.(project.id)}
              >
                {/* Project Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  {project.images && project.images.length > 0 ? (
                    <ImageWithFallback
                      src={project.images[0]}
                      alt={project.name}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 opacity-50" />
                    </div>
                  )}
                  {/* Image overlay with project type icon */}
                  <div className="absolute top-3 left-3 p-2 bg-white/90 dark:bg-black/60 rounded-lg backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-lg">
                    <TypeIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {/* Status badge on image */}
                  <div className="absolute top-3 right-3">
                    <Badge className={cn("shadow-lg backdrop-blur-sm border", getStatusColor(project.status))}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{project.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Light theme gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-blue-50/40 to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
                
                {/* Dark theme gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 group-hover:opacity-100 transition-opacity"></div>
                
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-foreground text-base mb-1">{project.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{project.client}</p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirmation(project.id, project.name);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm text-foreground">{project.progressPercentage}%</span>
                    </div>
                    <Progress 
                      value={project.progressPercentage} 
                      className="h-2 bg-white/50 dark:bg-white/10"
                    />
                  </div>

                  {/* Project details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">${(project.totalBudget / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  {/* Priority and tags */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.teamMembers.length + 1}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // Table View
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <CardContent className="relative p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5">
                  <TableHead className="text-foreground w-[200px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 text-left justify-start text-foreground"
                    >
                      Project Name
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-foreground">Client</TableHead>
                  <TableHead className="text-foreground">Type</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Priority</TableHead>
                  <TableHead className="text-foreground">Progress</TableHead>
                  <TableHead className="text-foreground">Budget</TableHead>
                  <TableHead className="text-foreground">Deadline</TableHead>
                  <TableHead className="text-foreground w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const TypeIcon = getTypeIcon(project.type);
                  return (
                    <TableRow 
                      key={project.id} 
                      className="border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer"
                      onClick={() => onProjectSelect?.(project.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {project.images && project.images.length > 0 && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 dark:border-white/10">
                              <ImageWithFallback
                                src={project.images[0]}
                                alt={project.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-foreground">{project.name}</p>
                              <p className="text-sm text-muted-foreground">{project.category}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{project.client}</TableCell>
                      <TableCell className="text-foreground">{project.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progressPercentage} className="w-16 h-2" />
                          <span className="text-sm text-foreground">{project.progressPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">${(project.totalBudget / 1000000).toFixed(1)}M</TableCell>
                      <TableCell className="text-foreground">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteConfirmation(project.id, project.name);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

          <div className="relative px-6 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {/* Show page numbers with smart truncation */}
                {(() => {
                  const pages = [];
                  const showPages = 5; // Number of page buttons to show
                  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                  const endPage = Math.min(totalPages, startPage + showPages - 1);

                  // Adjust if we're near the end
                  if (endPage - startPage < showPages - 1) {
                    startPage = Math.max(1, endPage - showPages + 1);
                  }

                  // First page
                  if (startPage > 1) {
                    pages.push(
                      <PaginationItem key={1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                          isActive={currentPage === 1}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <PaginationItem key="ellipsis-start">
                          <span className="px-3 py-2 text-muted-foreground">...</span>
                        </PaginationItem>
                      );
                    }
                  }

                  // Page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i);
                          }}
                          isActive={currentPage === i}
                        >
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <PaginationItem key="ellipsis-end">
                          <span className="px-3 py-2 text-muted-foreground">...</span>
                        </PaginationItem>
                      );
                    }
                    pages.push(
                      <PaginationItem key={totalPages}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                          isActive={currentPage === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return pages;
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={closeDeleteConfirmation}>
        <AlertDialogContent className="backdrop-blur-xl bg-white/95 dark:bg-black/95 border-white/20 dark:border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">{deleteConfirmation.projectName}</span>?
              <br />
              This action cannot be undone. This will permanently delete the project and all associated data.
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