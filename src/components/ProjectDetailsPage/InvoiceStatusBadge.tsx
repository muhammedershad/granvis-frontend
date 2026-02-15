import { Badge } from "../ui/badge";
import { InvoiceStatus } from "@/lib/api/invoicesApi";
import {
  InvoicingStatus,
  getInvoicingStatusBadgeColor,
} from "./invoiceMockData";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus | InvoicingStatus;
  type?: "invoice" | "milestone";
}

function getInvoiceStatusBadgeVariant(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30";
    case InvoiceStatus.SENT:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
    case InvoiceStatus.PAID:
      return "bg-green-500/20 text-green-400 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
    case InvoiceStatus.PARTIALLY_PAID:
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30";
    case InvoiceStatus.OVERDUE:
      return "bg-red-500/20 text-red-400 border-red-500/30 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
    case InvoiceStatus.CANCELLED:
      return "bg-gray-500/20 text-gray-500 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-500 dark:border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

const getStatusLabel = (
  status: InvoiceStatus | InvoicingStatus,
  type?: "invoice" | "milestone"
): string => {
  if (type === "milestone") {
    const statusLabels: Record<InvoicingStatus, string> = {
      not_invoiced: "Not Invoiced",
      partially_invoiced: "Partially Invoiced",
      fully_invoiced: "Fully Invoiced",
    };
    return statusLabels[status as InvoicingStatus] || status;
  }

  const statusLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: "Draft",
    [InvoiceStatus.SENT]: "Sent",
    [InvoiceStatus.PAID]: "Paid",
    [InvoiceStatus.PARTIALLY_PAID]: "Partially Paid",
    [InvoiceStatus.OVERDUE]: "Overdue",
    [InvoiceStatus.CANCELLED]: "Cancelled",
  };
  return statusLabels[status as InvoiceStatus] || status;
};

export function InvoiceStatusBadge({
  status,
  type = "invoice",
}: InvoiceStatusBadgeProps) {
  const badgeClass =
    type === "milestone"
      ? getInvoicingStatusBadgeColor(status as InvoicingStatus)
      : getInvoiceStatusBadgeVariant(status as InvoiceStatus);

  return <Badge className={badgeClass}>{getStatusLabel(status, type)}</Badge>;
}
