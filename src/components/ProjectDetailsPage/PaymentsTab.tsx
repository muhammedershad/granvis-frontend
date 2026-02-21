"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  History,
  Loader2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Project } from "@/types/project";
import {
  Invoice,
  InvoiceStatus,
  InvoiceSummary,
  useGetInvoiceSummaryQuery,
  useGetInvoicesByProjectQuery,
} from "@/lib/api/invoicesApi";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { RecordPaymentModal } from "./RecordPaymentModal";
import { PaymentHistoryModal } from "./PaymentHistoryModal";

interface PaymentsTabProps {
  project: Project;
  onNavigateToInvoices?: () => void;
}

type StatusFilter = "all" | "paid" | "pending" | "overdue";

const STATUS_FILTERS = [
  { key: "all" as const, label: "All" },
  { key: "paid" as const, label: "Paid" },
  { key: "pending" as const, label: "Pending" },
  { key: "overdue" as const, label: "Overdue" },
];

const formatCurrency = (amount: number | undefined) => {
  if (!amount && amount !== 0) {
    return "₹0";
  }
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) {
    return "-";
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function filterInvoices(invoices: Invoice[], filter: StatusFilter): Invoice[] {
  return invoices.filter((invoice) => {
    if (
      invoice.status === InvoiceStatus.DRAFT ||
      invoice.status === InvoiceStatus.CANCELLED
    ) {
      return false;
    }

    switch (filter) {
      case "paid":
        return invoice.status === InvoiceStatus.PAID;
      case "pending":
        return (
          invoice.status === InvoiceStatus.SENT ||
          invoice.status === InvoiceStatus.PARTIALLY_PAID
        );
      case "overdue":
        return invoice.status === InvoiceStatus.OVERDUE;
      default:
        return true;
    }
  });
}

function SummaryCards({
  summary,
  isLoading,
}: {
  summary?: InvoiceSummary;
  isLoading: boolean;
}) {
  const cards = [
    {
      label: "Total Invoiced",
      value: summary?.totalAmount,
      icon: Wallet,
      gradient:
        "from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      subtitle: undefined as string | undefined,
    },
    {
      label: "Total Received",
      value: summary?.paidAmount,
      icon: CheckCircle,
      gradient:
        "from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      subtitle:
        summary && summary.totalAmount > 0
          ? `${summary.percentageCompleted}% collected`
          : undefined,
      subtitleColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending Amount",
      value: summary?.pendingAmount,
      icon: Clock,
      gradient:
        "from-yellow-500/[0.02] to-orange-500/[0.02] dark:from-yellow-400/[0.05] dark:to-orange-400/[0.05]",
      iconBg: "bg-yellow-500/10 border-yellow-500/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      subtitle: undefined as string | undefined,
    },
    {
      label: "Overdue Amount",
      value: summary?.overdueAmount,
      icon: AlertTriangle,
      gradient:
        "from-red-500/[0.02] to-rose-500/[0.02] dark:from-red-400/[0.05] dark:to-rose-400/[0.05]",
      iconBg: "bg-red-500/10 border-red-500/20",
      iconColor: "text-red-600 dark:text-red-400",
      subtitle:
        summary && summary.overdueCount > 0
          ? `${summary.overdueCount} invoice${summary.overdueCount > 1 ? "s" : ""} overdue`
          : undefined,
      subtitleColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
            />
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <>
                      <p className="text-xl text-foreground font-medium">
                        {formatCurrency(card.value)}
                      </p>
                      {card.subtitle && (
                        <p className={`text-xs ${card.subtitleColor ?? ""}`}>
                          {card.subtitle}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function InvoiceTableRow({
  invoice,
  onRecordPayment,
  onViewHistory,
}: {
  invoice: Invoice;
  onRecordPayment: (inv: Invoice) => void;
  onViewHistory: (inv: Invoice) => void;
}) {
  const balanceClass =
    invoice.balance > 0
      ? "text-yellow-600 dark:text-yellow-400 font-medium"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(invoice.netTotal)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(invoice.paidAmount)}
      </TableCell>
      <TableCell className="text-right">
        <span className={balanceClass}>{formatCurrency(invoice.balance)}</span>
      </TableCell>
      <TableCell>
        <InvoiceStatusBadge status={invoice.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          {invoice.status !== InvoiceStatus.PAID && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRecordPayment(invoice)}
              className="h-8 px-2 text-xs"
            >
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              Record Payment
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewHistory(invoice)}
            className="h-8 px-2 text-xs"
          >
            <History className="h-3.5 w-3.5 mr-1" />
            History
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PaymentsTab({
  project,
  onNavigateToInvoices,
}: PaymentsTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentModalInvoice, setPaymentModalInvoice] =
    useState<Invoice | null>(null);
  const [historyModalInvoice, setHistoryModalInvoice] =
    useState<Invoice | null>(null);

  const { data: summary, isLoading: summaryLoading } =
    useGetInvoiceSummaryQuery(project.id);
  const { data: invoices = [], isLoading: invoicesLoading } =
    useGetInvoicesByProjectQuery(project.id);

  const filteredInvoices = filterInvoices(invoices, statusFilter);
  const isLoading = summaryLoading || invoicesLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Project Payments
          </h2>
          <p className="text-sm text-muted-foreground">
            Track invoice payments and financial summary
          </p>
        </div>
        <Button
          onClick={onNavigateToInvoices}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg shadow-green-500/25"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} isLoading={summaryLoading} />

      {/* Progress Bar */}
      {summary && summary.totalAmount > 0 && (
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Payment Progress
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {summary.percentageCompleted}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(summary.percentageCompleted, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(summary.paidAmount)} received
              </span>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(summary.totalAmount)} total
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Payment Table */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]" />
        <CardContent className="relative p-4">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">
              Invoice Payment Tracker
            </h3>
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === filter.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <EmptyState filter={statusFilter} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <InvoiceTableRow
                      key={invoice.id}
                      invoice={invoice}
                      onRecordPayment={setPaymentModalInvoice}
                      onViewHistory={setHistoryModalInvoice}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <RecordPaymentModal
          invoice={paymentModalInvoice}
          open={!!paymentModalInvoice}
          onClose={() => setPaymentModalInvoice(null)}
        />
      )}

      {/* Payment History Modal */}
      {historyModalInvoice && (
        <PaymentHistoryModal
          invoice={historyModalInvoice}
          open={!!historyModalInvoice}
          onClose={() => setHistoryModalInvoice(null)}
        />
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: StatusFilter }) {
  const title =
    filter === "all" ? "No Invoices Found" : `No ${filter} invoices`;
  const description =
    filter === "all"
      ? "Create an invoice to start tracking payments."
      : "No invoices match the selected filter.";

  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-foreground font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
