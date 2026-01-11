import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
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
  Users,
  Phone,
  Mail,
  Globe,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Grid3X3,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { AddClientForm } from "./AddClientForm";
import { Client, ClientFilters, ClientSort, ClientViewType } from "../types/client";
import { cn } from "./ui/utils";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useGetClientsQuery, useDeleteClientMutation, useGetClientStatisticsQuery } from "@/lib/api/clientsApi";
import { formatIndianCurrency } from "@/lib/utils/currency";

const ITEMS_PER_PAGE = 8;

interface ClientsPageProps {
  onClientSelect?: (clientId: string) => void;
}

export function ClientsPage({ onClientSelect }: ClientsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<ClientViewType>("cards");
  const [filters, setFilters] = useState<ClientFilters>({
    search: "",
    companyType: "all",
    status: "all",
    priority: "all",
    architecturalStyle: "all",
    source: "all"
  });
  const [sort, setSort] = useState<ClientSort>({
    field: "name",
    direction: "asc"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Debounce search term to reduce API calls while typing
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const urlFilters: ClientFilters = {
      search: searchParams.get('search') || "",
      status: searchParams.get('status') || "all",
      priority: searchParams.get('priority') || "all",
      architecturalStyle: searchParams.get('architecturalStyle') || "all",
      companyType: searchParams.get('companyType') || "all",
      source: searchParams.get('source') || "all"
    };
    setFilters(urlFilters);

    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      // Search is still being typed, don't reset page yet
      return;
    }
    if (currentPage !== 1 && filters.search) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, currentPage, filters.search]);

  // Build API filter params (exclude "all" values) and include pagination
  const apiFilters = useMemo(() => {
    const params: Record<string, string | number> = {};
    // Use debounced search term for API calls
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filters.status !== "all") params.status = filters.status;
    if (filters.priority !== "all") params.priority = filters.priority;
    if (filters.architecturalStyle !== "all") params.architecturalStyle = filters.architecturalStyle;
    if (filters.companyType !== "all") params.companyType = filters.companyType;
    if (filters.source !== "all") params.source = filters.source;
    params.page = currentPage;
    params.limit = ITEMS_PER_PAGE;
    return params;
  }, [debouncedSearchTerm, filters.status, filters.priority, filters.architecturalStyle, filters.companyType, filters.source, currentPage]);

  // Fetch clients with filters and pagination
  const { data: clientsResponse, isLoading, error } = useGetClientsQuery(apiFilters);

  // Extract clients from paginated response - wrapped in useMemo to prevent unnecessary re-renders
  const clients = useMemo(() => clientsResponse?.data || [], [clientsResponse?.data]);
  const totalClients = clientsResponse?.total || 0;
  const totalPages = clientsResponse?.totalPages || 1;

  // Fetch statistics
  const { data: apiStats } = useGetClientStatisticsQuery();

  // Delete client mutation
  const [deleteClient] = useDeleteClientMutation();

  // Get unique values for filter options from API statistics (not from filtered clients)
  const statuses = useMemo(() => {
    if (apiStats?.byStatus) {
      return Object.keys(apiStats.byStatus);
    }
    // Fallback to predefined statuses
    return ["Potential Lead", "Active", "On Hold", "Inactive", "Former Client"];
  }, [apiStats?.byStatus]);

  const priorities = useMemo(() => {
    if (apiStats?.byPriority) {
      return Object.keys(apiStats.byPriority);
    }
    // Fallback to predefined priorities
    return ["Low", "Medium", "High", "VIP"];
  }, [apiStats?.byPriority]);

  const architecturalStyles = useMemo(() => {
    if (apiStats?.byArchitecturalStyle) {
      return Object.keys(apiStats.byArchitecturalStyle);
    }
    // Fallback to predefined architectural styles
    return [
      "Modern",
      "Contemporary",
      "Traditional",
      "Industrial",
      "Scandinavian",
      "Minimalist",
      "Mediterranean",
      "Sustainable",
      "Art Deco",
      "Colonial",
      "Craftsman",
      "Victorian",
      "Mid-Century Modern"
    ];
  }, [apiStats?.byArchitecturalStyle]);

  // Always use API statistics (not affected by pagination)
  const stats = useMemo(() => {
    if (apiStats) {
      return {
        total: apiStats.totalClients,
        active: apiStats.activeClients,
        potential: apiStats.potentialClients,
        vip: apiStats.vipClients,
        low: apiStats.byPriority?.Low || 0,
        medium: apiStats.byPriority?.Medium || 0,
        high: apiStats.byPriority?.High || 0
      };
    }

    // Fallback to default values
    return {
      total: 0,
      active: 0,
      potential: 0,
      vip: 0,
      low: 0,
      medium: 0,
      high: 0
    };
  }, [apiStats]);

  // Update URL with current filters
  const updateURLParams = (newFilters: ClientFilters, page: number = 1) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.status !== 'all') params.set('status', newFilters.status);
    if (newFilters.priority !== 'all') params.set('priority', newFilters.priority);
    if (newFilters.architecturalStyle !== 'all') params.set('architecturalStyle', newFilters.architecturalStyle);
    if (newFilters.companyType !== 'all') params.set('companyType', newFilters.companyType);
    if (newFilters.source !== 'all') params.set('source', newFilters.source);
    if (page > 1) params.set('page', page.toString());

    const queryString = params.toString();
    router.push(queryString ? `/clients?${queryString}` : '/clients');
  };

  // API handles filtering and pagination, so we use clients directly
  const paginatedClients = clients;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Potential": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Inactive": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "Former": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-3 h-3" />;
      case "Potential": return <Clock className="w-3 h-3" />;
      case "Inactive": return <AlertCircle className="w-3 h-3" />;
      case "Former": return <AlertCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-500/20 text-gray-400";
      case "Medium": return "bg-blue-500/20 text-blue-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "VIP": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "VIP": return <Star className="w-3 h-3" />;
      case "High": return <TrendingUp className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleSort = (field: keyof Client) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (field: keyof Client) => {
    if (sort.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sort.direction === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleAddClientSuccess = () => {
    // Close the dialog after successful creation
    setIsAddDialogOpen(false);
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete).unwrap();

      // Show success toast
      toast.success("Client deleted successfully!", {
        description: "The client has been archived and can be restored later if needed.",
      });

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (error) {
      console.error('Failed to delete client:', error);

      // Show error toast
      toast.error("Failed to delete client", {
        description: "An error occurred while deleting the client. Please try again.",
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleFilterChange = (key: keyof ClientFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    updateURLParams(newFilters, 1);
  };

  const handleClearFilters = () => {
    const clearedFilters: ClientFilters = {
      search: "",
      companyType: "all",
      status: "all",
      priority: "all",
      architecturalStyle: "all",
      source: "all"
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateURLParams(clearedFilters, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(filters, page);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
            <p className="text-muted-foreground">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-red-500/30">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">Error Loading Clients</h3>
              <p className="text-muted-foreground">
                {(error as { data?: { message?: string } })?.data?.message || 'Failed to load clients. Please try again later.'}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage your clients and their project relationships</p>
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25">
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/90 dark:bg-black/90 border-white/30 dark:border-white/10 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Client</DialogTitle>
              </DialogHeader>
              <AddClientForm onSuccess={handleAddClientSuccess} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-purple-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Clients</p>
              <p className="text-foreground text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 to-emerald-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 shadow-lg shadow-green-200/50 dark:shadow-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active Clients</p>
              <p className="text-foreground text-2xl">{stats.active}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-pink-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">VIP Clients</p>
              <p className="text-foreground text-2xl">{stats.vip}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/60 to-orange-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-500/20">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Potential</p>
              <p className="text-foreground text-2xl">{stats.potential}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 to-green-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/20">
              <ArrowDown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Low Priority</p>
              <p className="text-foreground text-2xl">{stats.low}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 to-amber-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/20">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Medium Priority</p>
              <p className="text-foreground text-2xl">{stats.medium}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 to-rose-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 shadow-lg shadow-red-200/50 dark:shadow-red-500/20">
              <ArrowUp className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">High Priority</p>
              <p className="text-foreground text-2xl">{stats.high}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="relative space-y-4">
          <h3 className="text-foreground text-lg">Search & Filter Clients</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-10 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 shadow-sm"
                />
                {/* Show loading spinner when search is being debounced */}
                {filters.search && filters.search !== debouncedSearchTerm && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
                )}
              </div>
            </div>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
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

            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
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

            <Select value={filters.architecturalStyle} onValueChange={(value) => handleFilterChange('architecturalStyle', value)}>
              <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
                <SelectValue placeholder="Architectural Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {architecturalStyles.map(style => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 shadow-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Pagination Info */}
      {totalClients > 0 && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalClients)} of {totalClients} clients
          </p>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      {/* Clients Display */}
      {viewType === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedClients.map((client) => (
            <Card 
              key={client.id} 
              className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl dark:hover:shadow-black/70 cursor-pointer"
              onClick={() => onClientSelect?.(client.id)}
            >
              {/* Light theme gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-blue-50/40 to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
              
              {/* Dark theme gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 group-hover:opacity-100 transition-opacity"></div>
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-white/40 dark:border-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/30">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-foreground text-base">{client.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{client.companyName}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onClientSelect?.(client.id);
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDeleteClick(client.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <Badge className={cn("flex items-center space-x-1", getStatusColor(client.status))}>
                    {getStatusIcon(client.status)}
                    <span>{client.status}</span>
                  </Badge>
                  <Badge className={cn("flex items-center space-x-1", getPriorityColor(client.priority))}>
                    {getPriorityIcon(client.priority)}
                    <span>{client.priority}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.phone}</span>
                  </div>
                  {client.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={client.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate flex items-center space-x-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-white/40 dark:border-white/10">
                  <div>
                    <p className="text-muted-foreground">Project Value</p>
                    <p className="text-foreground">{formatIndianCurrency(client.totalProjectValue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projects</p>
                    <p className="text-foreground">{client.projectsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Pagination for Cards View */}
      {viewType === "cards" && totalPages > 1 && (
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

      {/* Table View */}
      {viewType === "table" && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/40 dark:border-white/10">
                  <TableHead className="text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    >
                      Client {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Company</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Projects</TableHead>
                  <TableHead className="text-muted-foreground">Value</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
                    onClick={() => onClientSelect?.(client.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 border-2 border-white/40 dark:border-white/10 shadow-sm">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-foreground">{client.name}</p>
                          <p className="text-muted-foreground text-sm">{client.primaryContact.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{client.companyName}</p>
                        <p className="text-muted-foreground text-sm">{client.industry}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">{client.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("flex items-center space-x-1 w-fit", getStatusColor(client.status))}>
                        {getStatusIcon(client.status)}
                        <span>{client.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("flex items-center space-x-1 w-fit", getPriorityColor(client.priority))}>
                        {getPriorityIcon(client.priority)}
                        <span>{client.priority}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground">
                        <p>{client.projectsCount} total</p>
                        <p className="text-sm text-muted-foreground">
                          {client.activeProjects} active, {client.completedProjects} done
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatIndianCurrency(client.totalProjectValue)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onClientSelect?.(client.id);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteClick(client.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/40 dark:border-white/10">
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

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
          )}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the client. The client data will be archived and can be restored later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}