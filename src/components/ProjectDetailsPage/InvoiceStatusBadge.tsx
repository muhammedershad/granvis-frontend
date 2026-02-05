import { Badge } from "../ui/badge";
import {
  InvoiceStatus,
  InvoicingStatus,
  getInvoiceStatusBadgeVariant,
  getInvoicingStatusBadgeColor,
} from "./invoiceMockData";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus | InvoicingStatus;
  type?: 'invoice' | 'milestone';
}

const getStatusLabel = (status: InvoiceStatus | InvoicingStatus, type?: 'invoice' | 'milestone'): string => {
  if (type === 'milestone') {
    // Invoicing status labels
    const statusLabels: Record<InvoicingStatus, string> = {
      not_invoiced: 'Not Invoiced',
      partially_invoiced: 'Partially Invoiced',
      fully_invoiced: 'Fully Invoiced',
    };
    return statusLabels[status as InvoicingStatus] || status;
  }

  // Invoice status labels
  const statusLabels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
  };
  return statusLabels[status as InvoiceStatus] || status;
};

export function InvoiceStatusBadge({ status, type = 'invoice' }: InvoiceStatusBadgeProps) {
  const badgeClass = type === 'milestone'
    ? getInvoicingStatusBadgeColor(status as InvoicingStatus)
    : getInvoiceStatusBadgeVariant(status as InvoiceStatus);

  return (
    <Badge className={badgeClass}>
      {getStatusLabel(status, type)}
    </Badge>
  );
}
