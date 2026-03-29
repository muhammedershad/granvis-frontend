"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { AlertCircle, Grid3X3, List, Loader2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Client,
  ClientFilters,
  ClientSort,
  ClientViewType,
} from "@/types/client";
import { cn } from "@/components/ui/utils";
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

const ITEMS_PER_PAGE = 12;

const DEFAULT_FILTERS: ClientFilters = {
  search: "",
  companyType: "all",
  status: "all",
  priority: "all",
  architecturalStyle: "all",
  source: "all",
};

const DEFAULT_STATUSES = [
  "Potential Lead",
  "Active",
  "On Hold",
  "Inactive",
  "Former Client",
];
const DEFAULT_PRIORITIES = ["Low", "Medium", "High", "VIP"];
const DEFAULT_ARCHITECTURAL_STYLES = [
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
  "Other",
];

const DEFAULT_STATS = {
  total: 0,
  active: 0,
  potential: 0,
  vip: 0,
  low: 0,
  medium: 0,
  high: 0,
};

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

function hasActiveFilters(filters: ClientFilters): boolean {
  return !!(
    filters.search ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.architecturalStyle !== "all" ||
    filters.companyType !== "all" ||
    filters.source !== "all"
  );
}

function ClientsLoadingState() {
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

function ClientsErrorState({ error }: { error: unknown }) {
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

function ClientsEmptyState({
  filters,
  onClearFilters,
}: {
  filters: ClientFilters;
  onClearFilters: () => void;
}) {
  const filtersActive = hasActiveFilters(filters);
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No Clients Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {filtersActive
            ? "No clients match your current filters. Try adjusting your search criteria."
            : "No clients have been added yet. Start by adding your first client."}
        </p>
        {filtersActive && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-300 dark:border-purple-700"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
}

function ClientListView({
  clients,
  viewType,
  onClientSelect,
  onDelete,
  sort,
  onSort,
}: {
  clients: Client[];
  viewType: ClientViewType;
  onClientSelect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  sort: ClientSort;
  onSort: (field: keyof Client) => void;
}) {
  if (viewType === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onSelect={onClientSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <ClientTableView
      clients={clients}
      onSelect={onClientSelect}
      onDelete={onDelete}
      sortField={sort.field}
      sortDirection={sort.direction}
      onSort={onSort}
    />
  );
}

export function ClientsPageContent({ onClientSelect }: ClientsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });
  const [viewType, setViewType] = useState<ClientViewType>("cards");
  const [filters, setFilters] = useState<ClientFilters>(() => ({
    search: searchParams.get("search") || "",
    companyType: searchParams.get("companyType") || "all",
    status: searchParams.get("status") || "all",
    priority: searchParams.get("priority") || "all",
    architecturalStyle: searchParams.get("architecturalStyle") || "all",
    source: searchParams.get("source") || "all",
  }));
  const [sort, setSort] = useState<ClientSort>({
    field: "name",
    direction: "asc",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Sync dropdown filters & page from URL (browser back/forward).
  // Search is never synced from URL — the input is the source of truth.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: searchParams.get("status") || "all",
      priority: searchParams.get("priority") || "all",
      architecturalStyle: searchParams.get("architecturalStyle") || "all",
      companyType: searchParams.get("companyType") || "all",
      source: searchParams.get("source") || "all",
    }));

    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      return;
    }
    if (currentPage !== 1 && filters.search) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, currentPage, filters.search]);

  // Update URL after debounce without triggering Next.js navigation.
  // Using replaceState avoids component remount that would reset the search input.
  useEffect(() => {
    const urlFilters = { ...filters, search: debouncedSearchTerm };
    const params = buildURLParams(urlFilters, currentPage);
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, "", newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only update URL on debounced search, not every keystroke
  }, [debouncedSearchTerm, currentPage, pathname]);

  const apiFilters = useMemo(
    () => buildApiFilters(filters, debouncedSearchTerm, currentPage),
    [filters, debouncedSearchTerm, currentPage]
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
    return apiStats?.byStatus
      ? Object.keys(apiStats.byStatus)
      : DEFAULT_STATUSES;
  }, [apiStats?.byStatus]);

  const priorities = useMemo(() => {
    return apiStats?.byPriority
      ? Object.keys(apiStats.byPriority)
      : DEFAULT_PRIORITIES;
  }, [apiStats?.byPriority]);

  const architecturalStyles = useMemo(() => {
    if (!apiStats?.byArchitecturalStyle) {
      return DEFAULT_ARCHITECTURAL_STYLES;
    }
    const apiStyles = Object.keys(apiStats.byArchitecturalStyle).filter(
      (style) => style !== "Unknown"
    );
    return Array.from(new Set([...DEFAULT_ARCHITECTURAL_STYLES, ...apiStyles]));
  }, [apiStats?.byArchitecturalStyle]);

  const stats = useMemo(() => {
    if (!apiStats) {
      return DEFAULT_STATS;
    }
    return {
      total: apiStats.totalClients,
      active: apiStats.activeClients,
      potential: apiStats.potentialClients,
      vip: apiStats.vipClients,
      low: apiStats.byPriority?.Low || 0,
      medium: apiStats.byPriority?.Medium || 0,
      high: apiStats.byPriority?.High || 0,
    };
  }, [apiStats]);

  const updateURLParams = useCallback(
    (newFilters: ClientFilters, page: number = 1) => {
      const params = buildURLParams(newFilters, page);
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [router, pathname]
  );

  const handleSort = useCallback((field: keyof Client) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleDeleteClick = useCallback((clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
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
    } catch (err) {
      console.error("Failed to delete client:", err);

      toast.error("Failed to delete client", {
        description:
          "An error occurred while deleting the client. Please try again.",
      });
    }
  }, [clientToDelete, deleteClient]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  }, []);

  const handleFilterChange = useCallback(
    (key: keyof ClientFilters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        if (key !== "search") {
          setCurrentPage(1);
          updateURLParams(newFilters, 1);
        }
        return newFilters;
      });
    },
    [updateURLParams]
  );

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    updateURLParams(DEFAULT_FILTERS, 1);
  }, [updateURLParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURLParams(filters, page);
    },
    [updateURLParams, filters]
  );

  const selectHandler =
    onClientSelect ||
    ((clientId: string) => {
      router.push(`${pathname}/${clientId}`);
    });

  if (isLoading) {
    return <ClientsLoadingState />;
  }

  if (error) {
    return <ClientsErrorState error={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-foreground">Client Management</h1>
            <p className="text-muted-foreground">
              Manage your clients and their project relationships
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
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
            onClick={() => router.push(`${pathname}/new`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
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

      {clients.length === 0 ? (
        <ClientsEmptyState
          filters={filters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <ClientListView
          clients={clients}
          viewType={viewType}
          onClientSelect={selectHandler}
          onDelete={handleDeleteClick}
          sort={sort}
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
