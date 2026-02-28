"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  type Invoice,
  useGenerateInvoicePdfMutation,
  useGetGlobalInvoiceSummaryQuery,
  useGetInvoicesQuery,
} from "@/lib/api/invoicesApi";
import { InvoiceStatsCards } from "./InvoiceStatsCards";
import { type InvoiceFilters, InvoiceFiltersCard } from "./InvoiceFiltersCard";
import { InvoiceTableView } from "./InvoiceTableView";
import { InvoicePagination } from "./InvoicePagination";

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: InvoiceFilters = {
  search: "",
  status: "all",
};

function InvoicesLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading invoices...</p>
        </div>
      </div>
    </div>
  );
}

function InvoicesErrorState({ error }: { error: unknown }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-red-500/30">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">
              Error Loading Invoices
            </h3>
            <p className="text-muted-foreground">
              {(error as { data?: { message?: string } })?.data?.message ||
                "Failed to load invoices. Please try again later."}
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

function InvoicesEmptyState({
  filters,
  onClearFilters,
}: {
  filters: InvoiceFilters;
  onClearFilters: () => void;
}) {
  const hasFilters = !!(filters.search || filters.status !== "all");
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No Invoices Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {hasFilters
            ? "No invoices match your current filters. Try adjusting your search criteria."
            : "No invoices have been created yet. Create your first invoice from a project page."}
        </p>
        {hasFilters && (
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

export function InvoicesSectionContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS);

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      return;
    }
    if (currentPage !== 1 && filters.search) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, currentPage, filters.search]);

  // Build API params
  const apiParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }
    if (filters.status !== "all") {
      params.status = filters.status;
    }
    return params;
  }, [currentPage, debouncedSearchTerm, filters.status]);

  // Fetch invoices
  const {
    data: invoicesResponse,
    isLoading,
    error,
  } = useGetInvoicesQuery(apiParams);

  // Fetch global summary
  const { data: summary, isLoading: summaryLoading } =
    useGetGlobalInvoiceSummaryQuery();

  // PDF generation
  const [generatePdf] = useGenerateInvoicePdfMutation();

  const invoices = useMemo(
    () => invoicesResponse?.data || [],
    [invoicesResponse?.data]
  );
  const totalInvoices = invoicesResponse?.total || 0;
  const totalPages = invoicesResponse?.totalPages || 1;

  const handleFilterChange = useCallback(
    (key: keyof InvoiceFilters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        if (key !== "search") {
          setCurrentPage(1);
        }
        return newFilters;
      });
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleViewInvoice = useCallback(
    (invoice: Invoice) => {
      // Navigate to the project's invoice preview page
      const basePath = pathname.replace(/\/payments$/, "");
      router.push(
        `${basePath}/projects/${invoice.projectId}/invoices/preview?invoiceId=${invoice.id}`
      );
    },
    [router, pathname]
  );

  const handleDownloadPdf = useCallback(
    async (invoiceId: string) => {
      try {
        const result = await generatePdf(invoiceId).unwrap();
        if (result.pdfUrl) {
          window.open(result.pdfUrl, "_blank");
        }
        toast.success("Invoice PDF generated successfully");
      } catch {
        toast.error("Failed to generate PDF");
      }
    },
    [generatePdf]
  );

  if (isLoading) {
    return <InvoicesLoadingState />;
  }

  if (error) {
    return <InvoicesErrorState error={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <InvoiceStatsCards summary={summary} isLoading={summaryLoading} />

      {/* Filters */}
      <InvoiceFiltersCard
        filters={filters}
        debouncedSearchTerm={debouncedSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Result count */}
      {totalInvoices > 0 && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalInvoices)} of{" "}
            {totalInvoices} invoices
          </p>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      {/* Table or Empty State */}
      {invoices.length === 0 ? (
        <InvoicesEmptyState
          filters={filters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <InvoiceTableView
          invoices={invoices}
          onView={handleViewInvoice}
          onDownloadPdf={handleDownloadPdf}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <InvoicePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
