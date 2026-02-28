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
import { Filter, Loader2, Search } from "lucide-react";
import { InvoiceStatus } from "@/lib/api/invoicesApi";

export interface InvoiceFilters {
  search: string;
  status: string;
}

interface InvoiceFiltersCardProps {
  filters: InvoiceFilters;
  debouncedSearchTerm: string;
  onFilterChange: (key: keyof InvoiceFilters, value: string) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS = [
  { value: InvoiceStatus.DRAFT, label: "Draft" },
  { value: InvoiceStatus.SENT, label: "Sent" },
  { value: InvoiceStatus.PAID, label: "Paid" },
  { value: InvoiceStatus.PARTIALLY_PAID, label: "Partially Paid" },
  { value: InvoiceStatus.OVERDUE, label: "Overdue" },
  { value: InvoiceStatus.CANCELLED, label: "Cancelled" },
];

export function InvoiceFiltersCard({
  filters,
  debouncedSearchTerm,
  onFilterChange,
  onClearFilters,
}: InvoiceFiltersCardProps) {
  return (
    <Card className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="relative space-y-4">
        <h3 className="text-foreground text-lg">Search & Filter Invoices</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by invoice number, client, project..."
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
                className="pl-10 pr-10 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 shadow-sm"
              />
              {filters.search && filters.search !== debouncedSearchTerm && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
              )}
            </div>
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-foreground shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={onClearFilters}
            className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 shadow-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
