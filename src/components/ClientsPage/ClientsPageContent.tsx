import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { AlertCircle, Grid3X3, List, Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import { AddClientForm } from "../AddClientForm";
import {
  Client,
  ClientFilters,
  ClientSort,
  ClientViewType,
} from "../../types/client";
import { cn } from "../ui/utils";
import { toast } from "sonner";
import {
  useDeleteClientMutation,
  useGetClientStatisticsQuery,
  useGetClientsQuery,
} from "@/lib/api/clientsApi";
import { ClientStatsCards } from "./ClientStatsCards";
import { ClientFiltersCard } from "./ClientFiltersCard";
import { ClientCard } from "./ClientCard";
import { ClientTableView } from "./ClientTableView";
import { ClientPagination } from "./ClientPagination";

const ITEMS_PER_PAGE = 8;

interface ClientsPageProps {
  onClientSelect?: (clientId: string) => void;
}

function buildApiFilters(
  filters: ClientFilters,
  debouncedSearchTerm: string,
  currentPage: number
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  if (debouncedSearchTerm) {
    params.search = debouncedSearchTerm;
  }
  if (filters.status !== "all") {
    params.status = filters.status;
  }
  if (filters.priority !== "all") {
    params.priority = filters.priority;
  }
  if (filters.architecturalStyle !== "all") {
    params.architecturalStyle = filters.architecturalStyle;
  }
  if (filters.companyType !== "all") {
    params.companyType = filters.companyType;
  }
  if (filters.source !== "all") {
    params.source = filters.source;
  }
  params.page = currentPage;
  params.limit = ITEMS_PER_PAGE;

  return params;
}

function buildURLParams(
  filters: ClientFilters,
  page: number = 1
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.priority !== "all") {
    params.set("priority", filters.priority);
  }
  if (filters.architecturalStyle !== "all") {
    params.set("architecturalStyle", filters.architecturalStyle);
  }
  if (filters.companyType !== "all") {
    params.set("companyType", filters.companyType);
  }
  if (filters.source !== "all") {
    params.set("source", filters.source);
  }
  if (page > 1) {
    params.set("page", page.toString());
  }

  return params;
}

// eslint-disable-next-line complexity
export function ClientsPageContent({ onClientSelect }: ClientsPageProps) {
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
    source: "all",
  });
  const [sort, setSort] = useState<ClientSort>({
    field: "name",
    direction: "asc",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  useEffect(() => {
    const urlFilters: ClientFilters = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      priority: searchParams.get("priority") || "all",
      architecturalStyle: searchParams.get("architecturalStyle") || "all",
      companyType: searchParams.get("companyType") || "all",
      source: searchParams.get("source") || "all",
    };
    setFilters(urlFilters);

    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      return;
    }
    if (currentPage !== 1 && filters.search) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, currentPage, filters.search]);

  const apiFilters = useMemo(
    () => buildApiFilters(filters, debouncedSearchTerm, currentPage),
    [
      debouncedSearchTerm,
      filters.status,
      filters.priority,
      filters.architecturalStyle,
      filters.companyType,
      filters.source,
      currentPage,
    ]
  );

  const {
    data: clientsResponse,
    isLoading,
    error,
  } = useGetClientsQuery(apiFilters);

  const clients = useMemo(
    () => clientsResponse?.data || [],
    [clientsResponse?.data]
  );
  const totalClients = clientsResponse?.total || 0;
  const totalPages = clientsResponse?.totalPages || 1;

  const { data: apiStats } = useGetClientStatisticsQuery();
  const [deleteClient] = useDeleteClientMutation();

  const statuses = useMemo(() => {
    if (apiStats?.byStatus) {
      return Object.keys(apiStats.byStatus);
    }
    return ["Potential Lead", "Active", "On Hold", "Inactive", "Former Client"];
  }, [apiStats?.byStatus]);

  const priorities = useMemo(() => {
    if (apiStats?.byPriority) {
      return Object.keys(apiStats.byPriority);
    }
    return ["Low", "Medium", "High", "VIP"];
  }, [apiStats?.byPriority]);

  const architecturalStyles = useMemo(() => {
    if (apiStats?.byArchitecturalStyle) {
      return Object.keys(apiStats.byArchitecturalStyle);
    }
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
      "Mid-Century Modern",
    ];
  }, [apiStats?.byArchitecturalStyle]);

  const stats = useMemo(() => {
    if (apiStats) {
      return {
        total: apiStats.totalClients,
        active: apiStats.activeClients,
        potential: apiStats.potentialClients,
        vip: apiStats.vipClients,
        low: apiStats.byPriority?.Low || 0,
        medium: apiStats.byPriority?.Medium || 0,
        high: apiStats.byPriority?.High || 0,
      };
    }

    return {
      total: 0,
      active: 0,
      potential: 0,
      vip: 0,
      low: 0,
      medium: 0,
      high: 0,
    };
  }, [apiStats]);

  const updateURLParams = (newFilters: ClientFilters, page: number = 1) => {
    const params = buildURLParams(newFilters, page);
    const queryString = params.toString();
    router.push(queryString ? `/clients?${queryString}` : "/clients");
  };

  const handleSort = (field: keyof Client) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddClientSuccess = () => {
    setIsAddDialogOpen(false);
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) {
      return;
    }

    try {
      await deleteClient(clientToDelete).unwrap();

      toast.success("Client deleted successfully!", {
        description:
          "The client has been archived and can be restored later if needed.",
      });

      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (error) {
      console.error("Failed to delete client:", error);

      toast.error("Failed to delete client", {
        description:
          "An error occurred while deleting the client. Please try again.",
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
    setCurrentPage(1);
    updateURLParams(newFilters, 1);
  };

  const handleClearFilters = () => {
    const clearedFilters: ClientFilters = {
      search: "",
      companyType: "all",
      status: "all",
      priority: "all",
      architecturalStyle: "all",
      source: "all",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateURLParams(clearedFilters, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(filters, page);
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-red-500/30">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">
                Error Loading Clients
              </h3>
              <p className="text-muted-foreground">
                {(error as { data?: { message?: string } })?.data?.message ||
                  "Failed to load clients. Please try again later."}
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
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground">Client Management</h1>
          <p className="text-muted-foreground">
            Manage your clients and their project relationships
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

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25">
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/90 dark:bg-black/90 border-white/30 dark:border-white/10 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Add New Client
                </DialogTitle>
              </DialogHeader>
              <AddClientForm
                onSuccess={handleAddClientSuccess}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ClientStatsCards stats={stats} />

      <ClientFiltersCard
        filters={filters}
        debouncedSearchTerm={debouncedSearchTerm}
        statuses={statuses}
        priorities={priorities}
        architecturalStyles={architecturalStyles}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {totalClients > 0 && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalClients)} of{" "}
            {totalClients} clients
          </p>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      {viewType === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onSelect={onClientSelect || (() => {})}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <ClientTableView
          clients={clients}
          onSelect={onClientSelect || (() => {})}
          onDelete={handleDeleteClick}
          sortField={sort.field}
          sortDirection={sort.direction}
          onSort={handleSort}
        />
      )}

      {totalPages > 1 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the client. The client data will be
              archived and can be restored later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
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
