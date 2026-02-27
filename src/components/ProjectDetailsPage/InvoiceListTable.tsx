import {
  Download,
  Edit2,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { Invoice, InvoiceStatus } from "@/lib/api/invoicesApi";

interface InvoiceListTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onDownload: (invoice: Invoice) => void;
  downloadingInvoiceId?: string | null;
  onMarkAsSent?: (invoice: Invoice) => void;
  onCancel?: (invoice: Invoice) => void;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

function confirmAction(message: string, action: () => void) {
  // eslint-disable-next-line no-alert
  if (window.confirm(message)) {
    action();
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDiscount = (invoice: Invoice): string => {
  if (invoice.discountValue === 0) {
    return "-";
  }
  if (invoice.discountType === "percentage") {
    return `${invoice.discountValue}% (${formatCurrency(invoice.discountAmount)})`;
  }
  return formatCurrency(invoice.discountAmount);
};

function hasDropdownActions(invoice: Invoice): boolean {
  const s = invoice.status;
  return (
    s === InvoiceStatus.DRAFT ||
    s === InvoiceStatus.SENT ||
    s === InvoiceStatus.PARTIALLY_PAID ||
    s === InvoiceStatus.OVERDUE
  );
}

export function InvoiceListTable({
  invoices,
  onView,
  onEdit,
  onDelete,
  onDownload,
  downloadingInvoiceId,
  onMarkAsSent,
  onCancel,
}: InvoiceListTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-foreground font-medium mb-2">No Invoices Yet</h3>
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
                <div className="flex items-center justify-end gap-1">
                  {/* View Invoice (all statuses) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(invoice)}
                    title="View Invoice"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Download PDF (non-draft) */}
                  {invoice.status !== InvoiceStatus.DRAFT && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDownload(invoice)}
                      disabled={downloadingInvoiceId === invoice.id}
                      title="Download PDF"
                    >
                      {downloadingInvoiceId === invoice.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {/* Edit (draft only) */}
                  {invoice.status === InvoiceStatus.DRAFT && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(invoice)}
                      title="Edit Invoice"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Actions dropdown */}
                  {hasDropdownActions(invoice) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="More Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Mark as Sent (draft only) */}
                        {invoice.status === InvoiceStatus.DRAFT &&
                          onMarkAsSent && (
                            <DropdownMenuItem
                              onClick={() => onMarkAsSent(invoice)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Mark as Sent
                            </DropdownMenuItem>
                          )}

                        {/* Cancel (non-paid, non-cancelled) */}
                        {invoice.status !== InvoiceStatus.PAID &&
                          invoice.status !== InvoiceStatus.CANCELLED &&
                          onCancel && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  confirmAction(
                                    `Cancel invoice ${invoice.invoiceNumber}?`,
                                    () => onCancel(invoice)
                                  )
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Invoice
                              </DropdownMenuItem>
                            </>
                          )}

                        {/* Delete (draft only) */}
                        {invoice.status === InvoiceStatus.DRAFT && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() =>
                                confirmAction(
                                  `Delete invoice ${invoice.invoiceNumber}?`,
                                  () => onDelete(invoice.id)
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Invoice
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
