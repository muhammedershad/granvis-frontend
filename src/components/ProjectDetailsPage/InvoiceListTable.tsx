import { Edit2, Trash2, Eye, FileText } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { Invoice } from "./invoiceMockData";

interface InvoiceListTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onView?: (invoice: Invoice) => void;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDiscount = (invoice: Invoice): string => {
  if (invoice.discountValue === 0) {
    return '-';
  }
  if (invoice.discountType === 'percentage') {
    return `${invoice.discountValue}% (${formatCurrency(invoice.discountAmount)})`;
  }
  return formatCurrency(invoice.discountAmount);
};

export function InvoiceListTable({
  invoices,
  onEdit,
  onDelete,
  onView,
}: InvoiceListTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-foreground font-medium mb-2">
          No Invoices Yet
        </h3>
        <p className="text-muted-foreground text-sm">
          Create your first invoice to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-right">Paid Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(invoice.netTotal)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDiscount(invoice)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(invoice.paidAmount)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {invoice.balance > 0 && (
                  <span className="text-orange-600 dark:text-orange-400">
                    {formatCurrency(invoice.balance)}
                  </span>
                )}
                {invoice.balance === 0 && (
                  <span className="text-green-600 dark:text-green-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} type="invoice" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(invoice)}
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {invoice.status === 'draft' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(invoice)}
                        title="Edit Invoice"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          if (confirm(`Delete invoice ${invoice.invoiceNumber}?`)) {
                            onDelete(invoice.id);
                          }
                        }}
                        title="Delete Invoice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {invoice.status !== 'draft' && (
                    <div className="text-xs text-muted-foreground italic px-2">
                      {invoice.status === 'sent' ? 'Sent' : 'Paid'}
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
