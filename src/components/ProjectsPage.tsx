import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
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
  MapPin,
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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AddProjectForm } from "./AddProjectForm";
import { Project, ProjectFilters, ProjectSort, ProjectViewType } from "../types/project";
import { cn } from "./ui/utils";

// Mock project data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Modern Villa Residence",
    description: "Luxury 4-bedroom villa with contemporary design and sustainable features",
    client: "John & Sarah Williams",
    clientEmail: "williams@email.com",
    clientPhone: "+1 (555) 123-4567",
    type: "Villa",
    category: "Luxury Residential",
    status: "In Progress",
    priority: "High",
    startDate: "2024-01-15",
    endDate: "2024-08-30",
    deadline: "2024-09-15",
    estimatedDuration: 240,
    totalBudget: 850000,
    spentAmount: 420000,
    remainingBudget: 430000,
    progressPercentage: 65,
    currentPhase: "Interior Construction",
    milestones: [],
    projectManager: "John Doe",
    teamMembers: ["Sarah Johnson", "Michael Chen"],
    location: {
      address: "123 Hillcrest Drive",
      city: "Beverly Hills",
      state: "CA",
      country: "USA"
    },
    tags: ["Luxury", "Sustainable", "Contemporary"],
    documents: [],
    images: [],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
    createdBy: "John Doe"
  },
  {
    id: "2",
    name: "Downtown Office Complex",
    description: "15-story commercial building with mixed-use spaces",
    client: "Metro Development Corp",
    clientEmail: "contact@metrodev.com",
    clientPhone: "+1 (555) 234-5678",
    type: "Commercial",
    category: "Office Building",
    status: "Planning",
    priority: "Critical",
    startDate: "2024-03-01",
    endDate: "2025-12-31",
    deadline: "2026-01-31",
    estimatedDuration: 670,
    totalBudget: 15000000,
    spentAmount: 1200000,
    remainingBudget: 13800000,
    progressPercentage: 15,
    currentPhase: "Design Development",
    milestones: [],
    projectManager: "Emily Rodriguez",
    teamMembers: ["James Wilson", "Lisa Thompson"],
    location: {
      address: "456 Main Street",
      city: "New York",
      state: "NY",
      country: "USA"
    },
    tags: ["Commercial", "High-rise", "Mixed-use"],
    documents: [],
    images: [],
    createdAt: "2024-02-20",
    updatedAt: "2024-02-25",
    createdBy: "Emily Rodriguez"
  },
  {
    id: "3",
    name: "Boutique Hotel Interior",
    description: "Complete interior design for 50-room boutique hotel",
    client: "Luxury Hospitality Group",
    clientEmail: "projects@luxuryhotels.com",
    clientPhone: "+1 (555) 345-6789",
    type: "Interior",
    category: "Hospitality Design",
    status: "Completed",
    priority: "Medium",
    startDate: "2023-06-01",
    endDate: "2023-12-15",
    deadline: "2023-12-31",
    estimatedDuration: 195,
    totalBudget: 2500000,
    spentAmount: 2450000,
    remainingBudget: 50000,
    progressPercentage: 100,
    currentPhase: "Project Completed",
    milestones: [],
    projectManager: "Sarah Johnson",
    teamMembers: ["Amanda Lee", "David Martinez"],
    location: {
      address: "789 Ocean Avenue",
      city: "Miami",
      state: "FL",
      country: "USA"
    },
    tags: ["Hospitality", "Luxury", "Coastal"],
    documents: [],
    images: [],
    createdAt: "2023-05-15",
    updatedAt: "2023-12-20",
    createdBy: "Sarah Johnson"
  },
  {
    id: "4",
    name: "University Campus Landscape",
    description: "Master landscape plan for 200-acre university campus",
    client: "State University",
    clientEmail: "facilities@stateuniv.edu",
    clientPhone: "+1 (555) 456-7890",
    type: "Landscape",
    category: "Educational Campus",
    status: "On Hold",
    priority: "Low",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    deadline: "2025-04-15",
    estimatedDuration: 365,
    totalBudget: 5500000,
    spentAmount: 800000,
    remainingBudget: 4700000,
    progressPercentage: 25,
    currentPhase: "Phase 1 - Master Planning",
    milestones: [],
    projectManager: "Michael Chen",
    teamMembers: ["Lisa Thompson", "James Wilson"],
    location: {
      address: "University Campus",
      city: "Austin",
      state: "TX",
      country: "USA"
    },
    tags: ["Educational", "Landscape", "Sustainable"],
    documents: [],
    images: [],
    createdAt: "2024-03-15",
    updatedAt: "2024-03-20",
    createdBy: "Michael Chen"
  },
  {
    id: "5",
    name: "Eco-Friendly Townhomes",
    description: "Sustainable residential development with 12 townhomes",
    client: "Green Living Communities",
    clientEmail: "info@greenliving.com",
    clientPhone: "+1 (555) 567-8901",
    type: "Villa",
    category: "Sustainable Housing",
    status: "In Progress",
    priority: "Medium",
    startDate: "2024-02-01",
    endDate: "2024-10-31",
    deadline: "2024-11-30",
    estimatedDuration: 270,
    totalBudget: 3200000,
    spentAmount: 1400000,
    remainingBudget: 1800000,
    progressPercentage: 45,
    currentPhase: "Foundation & Structure",
    milestones: [],
    projectManager: "Lisa Thompson",
    teamMembers: ["John Doe", "Amanda Lee"],
    location: {
      address: "555 Green Valley Road",
      city: "Portland",
      state: "OR",
      country: "USA"
    },
    tags: ["Sustainable", "Residential", "Community"],
    documents: [],
    images: [],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
    createdBy: "Lisa Thompson"
  }
];

const ITEMS_PER_PAGE = 8;

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
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
    field: "name",
    direction: "asc"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get unique values for filter options
  const types = [...new Set(projects.map(proj => proj.type))];
  const statuses = [...new Set(projects.map(proj => proj.status))];
  const priorities = [...new Set(projects.map(proj => proj.priority))];
  const clients = [...new Set(projects.map(proj => proj.client))];
  const projectManagers = [...new Set(projects.map(proj => proj.projectManager))];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === "In Progress").length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const onHold = projects.filter(p => p.status === "On Hold").length;
    const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
    const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progressPercentage, 0) / total);

    return { total, inProgress, completed, onHold, totalBudget, avgProgress };
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        project.name.toLowerCase().includes(searchTerm) ||
        project.client.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm);

      const matchesType = filters.type === "all" || project.type === filters.type;
      const matchesStatus = filters.status === "all" || project.status === filters.status;
      const matchesPriority = filters.priority === "all" || project.priority === filters.priority;
      const matchesClient = !filters.client || project.client === filters.client;
      const matchesProjectManager = !filters.projectManager || project.projectManager === filters.projectManager;

      return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesClient && matchesProjectManager;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, filters, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const handleSort = (field: keyof Project) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (field: keyof Project) => {
    if (sort.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sort.direction === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleAddProject = (newProject: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, project]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(proj => proj.id !== projectId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-white/90">Project Management</h1>
          <p className="text-white/60">Track and manage your architectural projects</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <Button
              variant={viewType === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("cards")}
              className={cn(
                "px-3",
                viewType === "cards" 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                  : "text-white/70 hover:text-white"
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
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                  : "text-white/70 hover:text-white"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white/90">Create New Project</DialogTitle>
              </DialogHeader>
              <AddProjectForm onSubmit={handleAddProject} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Projects</p>
              <p className="text-white/90 text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">In Progress</p>
              <p className="text-white/90 text-2xl">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Completed</p>
              <p className="text-white/90 text-2xl">{stats.completed}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
              <Pause className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">On Hold</p>
              <p className="text-white/90 text-2xl">{stats.onHold}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Budget</p>
              <p className="text-white/90 text-xl">${(stats.totalBudget / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Avg Progress</p>
              <p className="text-white/90 text-2xl">{stats.avgProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-black/20 border-white/10 backdrop-blur-xl">
        <div className="space-y-4">
          <h3 className="text-white/90 text-lg">Search & Filter Projects</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
            
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
              onClick={() => setFilters({ search: "", type: "all", status: "all", priority: "all", client: "", projectManager: "" })}
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          
          {filteredAndSortedProjects.length !== projects.length && (
            <div className="text-white/60 text-sm">
              Showing {filteredAndSortedProjects.length} of {projects.length} projects
            </div>
          )}
        </div>
      </Card>

      {/* Projects Display */}
      {viewType === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProjects.map((project) => {
            const TypeIcon = getTypeIcon(project.type);
            return (
              <Card key={project.id} className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <CardTitle className="text-white/90 text-base">{project.name}</CardTitle>
                        <p className="text-white/60 text-sm">{project.client}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-400"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge className={cn("flex items-center space-x-1", getStatusColor(project.status))}>
                      {getStatusIcon(project.status)}
                      <span>{project.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <p className="text-white/60 text-sm line-clamp-2">{project.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white/90">{project.progressPercentage}%</span>
                    </div>
                    <Progress 
                      value={project.progressPercentage} 
                      className="h-2 bg-white/10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-white/40" />
                      <span className="text-white/70">${(project.totalBudget / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <span className="text-white/70">{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-white/40" />
                      <span className="text-white/70">{project.teamMembers.length + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span className="text-white/70">{project.location.city}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 text-white/70 hover:text-white"
                    >
                      Project {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-white/70">Type</TableHead>
                  <TableHead className="text-white/70">Client</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Progress</TableHead>
                  <TableHead className="text-white/70">Budget</TableHead>
                  <TableHead className="text-white/70">Deadline</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.map((project) => {
                  const TypeIcon = getTypeIcon(project.type);
                  return (
                    <TableRow key={project.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <TypeIcon className="w-4 h-4 text-white/70" />
                          </div>
                          <div>
                            <p className="text-white/90">{project.name}</p>
                            <p className="text-white/50 text-sm">{project.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-white/70">
                          {project.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/70">{project.client}</TableCell>
                      <TableCell>
                        <Badge className={cn("flex items-center space-x-1 w-fit", getStatusColor(project.status))}>
                          {getStatusIcon(project.status)}
                          <span>{project.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={project.progressPercentage} className="w-16 h-2" />
                          <span className="text-white/70 text-sm">{project.progressPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70">
                        ${(project.totalBudget / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell className="text-white/70">
                        {new Date(project.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-400"
                              onClick={() => handleDeleteProject(project.id)}
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
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <div className="text-white/60 text-sm">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProjects.length)} of {filteredAndSortedProjects.length} projects
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="text-white/70 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}