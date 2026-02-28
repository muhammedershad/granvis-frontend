import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  CheckCircle,
  Circle,
  Clock,
  Eye,
  FileDown,
  MoreHorizontal,
  Send,
  XCircle,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { formatIndianCurrencyFull } from "@/lib/utils/currency";
import { type Invoice, InvoiceStatus } from "@/lib/api/invoicesApi";

interface InvoiceTableViewProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDownloadPdf: (invoiceId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700";
    case InvoiceStatus.SENT:
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    case InvoiceStatus.PAID:
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case InvoiceStatus.PARTIALLY_PAID:
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    case InvoiceStatus.OVERDUE:
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case InvoiceStatus.CANCELLED:
      return "bg-gray-200 text-gray-600 border-gray-300 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-600";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return <Circle className="w-3 h-3" />;
    case InvoiceStatus.SENT:
      return <Send className="w-3 h-3" />;
    case InvoiceStatus.PAID:
      return <CheckCircle className="w-3 h-3" />;
    case InvoiceStatus.PARTIALLY_PAID:
      return <Clock className="w-3 h-3" />;
    case InvoiceStatus.OVERDUE:
      return <AlertCircle className="w-3 h-3" />;
    case InvoiceStatus.CANCELLED:
      return <XCircle className="w-3 h-3" />;
    default:
      return <Circle className="w-3 h-3" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return "Draft";
    case InvoiceStatus.SENT:
      return "Sent";
    case InvoiceStatus.PAID:
      return "Paid";
    case InvoiceStatus.PARTIALLY_PAID:
      return "Partially Paid";
    case InvoiceStatus.OVERDUE:
      return "Overdue";
    case InvoiceStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
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

export function InvoiceTableView({
  invoices,
  onView,
  onDownloadPdf,
}: InvoiceTableViewProps) {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/40 dark:border-white/10">
              <TableHead className="text-muted-foreground">Invoice #</TableHead>
              <TableHead className="text-muted-foreground">Client</TableHead>
              <TableHead className="text-muted-foreground">Project</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Due Date</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Amount
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Paid
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Balance
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
                onClick={() => onView(invoice)}
              >
                <TableCell>
                  <p className="text-foreground font-medium">
                    {invoice.invoiceNumber}
                  </p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-foreground">
                      {invoice.client?.name || "Unknown Client"}
                    </p>
                    {invoice.client?.companyName && (
                      <p className="text-muted-foreground text-sm">
                        {invoice.client.companyName}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-foreground">
                    {invoice.project?.name || "Unknown Project"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-muted-foreground">
                    {formatDate(invoice.invoiceDate)}
                  </p>
                </TableCell>
                <TableCell>
                  <p
                    className={cn(
                      "text-sm",
                      invoice.status === InvoiceStatus.OVERDUE
                        ? "text-red-600 dark:text-red-400 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatDate(invoice.dueDate)}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="text-foreground font-medium">
                    {formatIndianCurrencyFull(invoice.netTotal)}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="text-green-600 dark:text-green-400">
                    {formatIndianCurrencyFull(invoice.paidAmount)}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <p
                    className={cn(
                      "font-medium",
                      invoice.balance > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatIndianCurrencyFull(invoice.balance)}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center space-x-1 w-fit",
                      getStatusColor(invoice.status)
                    )}
                  >
                    {getStatusIcon(invoice.status)}
                    <span>{getStatusLabel(invoice.status)}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(invoice);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadPdf(invoice.id);
                        }}
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
