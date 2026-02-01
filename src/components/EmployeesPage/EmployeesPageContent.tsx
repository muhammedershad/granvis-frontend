import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { AlertCircle, Grid3X3, List, Loader2, Plus } from "lucide-react";
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
  Employee,
  EmployeeFilters,
  EmployeeSort,
  EmployeeViewType,
} from "../../types/employee";
import { cn } from "../ui/utils";
import { toast } from "sonner";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/lib/api/employeesApi";
import { EmployeeStatsCards } from "./EmployeeStatsCards";
import { EmployeeFiltersCard } from "./EmployeeFiltersCard";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeTableView } from "./EmployeeTableView";
import { EmployeePagination } from "./EmployeePagination";

const ITEMS_PER_PAGE = 8;

interface EmployeesPageProps {
  onEmployeeSelect?: (employeeId: string) => void;
}

function hasActiveFilters(filters: EmployeeFilters): boolean {
  return (
    !!filters.search ||
    filters.department !== "all" ||
    filters.employmentStatus !== "all" ||
    filters.employmentType !== "all" ||
    filters.position !== "all"
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: unknown }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information
          </p>
        </div>
      </div>

      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-red-300/50 dark:border-red-500/30 shadow-xl shadow-red-200/30 dark:shadow-red-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-orange-50/40 to-red-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="relative p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Error Loading Employees
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {(error as { data?: { message?: string } })?.data?.message ||
              "Failed to load employees. Please try again later."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
          >
            Retry
          </Button>
        </div>
      </Card>
    </div>
  );
}

function EmployeeListSection({
  employees,
  filters,
  viewType,
  sort,
  onSelect,
  onDelete,
  onSort,
  onClearFilters,
}: {
  employees: Employee[];
  filters: EmployeeFilters;
  viewType: EmployeeViewType;
  sort: EmployeeSort;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSort: (field: keyof Employee) => void;
  onClearFilters: () => void;
}) {
  if (employees.length === 0) {
    return <EmptyState filters={filters} onClearFilters={onClearFilters} />;
  }

  if (viewType === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <EmployeeTableView
      employees={employees}
      onSelect={onSelect}
      onDelete={onDelete}
      sortField={sort.field}
      sortDirection={sort.direction}
      onSort={onSort}
    />
  );
}

function EmptyState({
  filters,
  onClearFilters,
}: {
  filters: EmployeeFilters;
  onClearFilters: () => void;
}) {
  const active = hasActiveFilters(filters);
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No Employees Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {active
            ? "No employees match your current filters. Try adjusting your search criteria."
            : "No employees have been added yet. Start by adding your first employee."}
        </p>
        {active && (
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

function buildApiFilters(
  filters: EmployeeFilters,
  debouncedSearchTerm: string,
  currentPage: number
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  if (debouncedSearchTerm) {
    params.search = debouncedSearchTerm;
  }
  if (filters.department !== "all") {
    params.department = filters.department;
  }
  if (filters.employmentStatus !== "all") {
    params.employmentStatus = filters.employmentStatus;
  }
  if (filters.employmentType !== "all") {
    params.employmentType = filters.employmentType;
  }
  if (filters.position !== "all") {
    params.position = filters.position;
  }
  params.page = currentPage;
  params.limit = ITEMS_PER_PAGE;

  return params;
}

function buildURLParams(
  filters: EmployeeFilters,
  page: number = 1
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.department !== "all") {
    params.set("department", filters.department);
  }
  if (filters.employmentStatus !== "all") {
    params.set("employmentStatus", filters.employmentStatus);
  }
  if (filters.employmentType !== "all") {
    params.set("employmentType", filters.employmentType);
  }
  if (filters.position !== "all") {
    params.set("position", filters.position);
  }
  if (page > 1) {
    params.set("page", page.toString());
  }

  return params;
}

export function EmployeesPageContent({ onEmployeeSelect }: EmployeesPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<EmployeeViewType>("cards");
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department: "all",
    position: "all",
    employmentStatus: "all",
    employmentType: "all",
  });
  const [sort, setSort] = useState<EmployeeSort>({
    field: "name",
    direction: "asc",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(filters.search, 1000);

  useEffect(() => {
    const urlFilters: EmployeeFilters = {
      search: searchParams.get("search") || "",
      department: searchParams.get("department") || "all",
      position: searchParams.get("position") || "all",
      employmentStatus: searchParams.get("employmentStatus") || "all",
      employmentType: searchParams.get("employmentType") || "all",
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

  // Update URL when debounced search term changes or when page/other filters change
  useEffect(() => {
    const newFilters = { ...filters, search: debouncedSearchTerm };
    updateURLParams(newFilters, currentPage);
  }, [
    debouncedSearchTerm,
    currentPage,
    filters.department,
    filters.position,
    filters.employmentStatus,
    filters.employmentType,
  ]);

  const apiFilters = useMemo(
    () => ({
      ...buildApiFilters(filters, debouncedSearchTerm, currentPage),
      includeStats: true, // Include statistics in the listing API response
    }),
    [
      filters.department,
      filters.position,
      filters.employmentStatus,
      filters.employmentType,
      debouncedSearchTerm,
      currentPage,
    ]
  );

  const {
    data: employeesResponse,
    isLoading,
    error,
  } = useGetEmployeesQuery(apiFilters);

  const employees = useMemo(
    () => employeesResponse?.data || [],
    [employeesResponse?.data]
  );
  const totalEmployees = employeesResponse?.total || 0;
  const totalPages = employeesResponse?.totalPages || 1;

  // Use statistics from the listing API response (reduces API calls)
  // Keep the separate statistics endpoint as fallback for backwards compatibility
  const apiStats = employeesResponse?.statistics;

  const [deleteEmployee] = useDeleteEmployeeMutation();

  const departments = useMemo(() => {
    if (apiStats?.byDepartment) {
      return Object.keys(apiStats.byDepartment);
    }
    return [
      "architecture",
      "interior",
      "landscape",
      "construction",
      "drafting",
      "accountant",
      "admin",
      "marketing",
    ];
  }, [apiStats?.byDepartment]);

  const positions = useMemo(() => {
    return ["all"];
  }, []);

  const employmentStatuses = useMemo(() => {
    if (apiStats?.byEmploymentStatus) {
      return Object.keys(apiStats.byEmploymentStatus);
    }
    return ["Active", "Inactive", "On Leave", "Terminated"];
  }, [apiStats?.byEmploymentStatus]);

  const employmentTypes = useMemo(() => {
    if (apiStats?.byEmploymentType) {
      return Object.keys(apiStats.byEmploymentType);
    }
    return ["Full-time", "Part-time", "Contract", "Intern"];
  }, [apiStats?.byEmploymentType]);

  const stats = useMemo(() => {
    if (apiStats) {
      return {
        total: apiStats.totalEmployees,
        active: apiStats.activeEmployees,
        inactive: apiStats.inactiveEmployees,
        onLeave: apiStats.onLeaveEmployees,
        terminated: apiStats.terminatedEmployees,
      };
    }

    return {
      total: 0,
      active: 0,
      inactive: 0,
      onLeave: 0,
      terminated: 0,
    };
  }, [apiStats]);

  const updateURLParams = (newFilters: EmployeeFilters, page: number = 1) => {
    const params = buildURLParams(newFilters, page);
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSort = (field: keyof Employee) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) {
      return;
    }

    try {
      await deleteEmployee(employeeToDelete).unwrap();

      toast.success("Employee deleted successfully!", {
        description: "The employee has been removed from the system.",
      });

      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Failed to delete employee:", error);

      toast.error("Failed to delete employee", {
        description:
          "An error occurred while deleting the employee. Please try again.",
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    // Don't update URL here - let the useEffect handle it with proper debouncing
  };

  const handleClearFilters = () => {
    const clearedFilters: EmployeeFilters = {
      search: "",
      department: "all",
      position: "all",
      employmentStatus: "all",
      employmentType: "all",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    // Don't update URL here - let the useEffect handle it
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Don't update URL here - let the useEffect handle it
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information
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
            onClick={() => router.push(`${pathname}/new`)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <EmployeeStatsCards stats={stats} />

      <EmployeeFiltersCard
        filters={filters}
        debouncedSearchTerm={debouncedSearchTerm}
        departments={departments}
        positions={positions}
        employmentStatuses={employmentStatuses}
        employmentTypes={employmentTypes}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {totalEmployees > 0 && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalEmployees)} of{" "}
            {totalEmployees} employees
          </p>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      <EmployeeListSection
        employees={employees}
        filters={filters}
        viewType={viewType}
        sort={sort}
        onSelect={onEmployeeSelect || ((id) => router.push(`/admin/employees/${id}`))}
        onDelete={handleDeleteClick}
        onSort={handleSort}
        onClearFilters={handleClearFilters}
      />

      {totalPages > 1 && (
        <EmployeePagination
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
              This action will delete the employee. This action cannot be
              undone.
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
