"use client";

import { Loader2, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import type { Invoice } from "@/lib/api/invoicesApi";
import { useGetPaymentsByInvoiceQuery } from "@/lib/api/paymentsApi";
import { PaymentMethod } from "@/types/payment";

interface PaymentHistoryModalProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (dateStr?: string | null) => {
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

const getMethodLabel = (method?: PaymentMethod | string): string => {
  const labels: Record<string, string> = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    cheque: "Cheque",
    upi: "UPI",
    neft: "NEFT",
    rtgs: "RTGS",
    other: "Other",
  };
  return method ? labels[method] || method : "-";
};

export function PaymentHistoryModal({
  invoice,
  open,
  onClose,
}: PaymentHistoryModalProps) {
  const { data: payments = [], isLoading } = useGetPaymentsByInvoiceQuery(
    invoice.id,
    { skip: !open }
  );

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
        </DialogHeader>

        {/* Invoice Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invoice</span>
            <span className="font-medium text-foreground">
              {invoice.invoiceNumber}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-foreground">
              {formatCurrency(invoice.netTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paid</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {formatCurrency(invoice.paidAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="text-yellow-600 dark:text-yellow-400">
              {formatCurrency(invoice.balance)}
            </span>
          </div>
        </div>

        {/* Payments Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="mx-auto h-10 w-10 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">
              No payments recorded for this invoice yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Recorded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(payment.paidDate || payment.invoiceDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {getMethodLabel(payment.method)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[120px] text-sm text-muted-foreground">
                      {payment.transactionReference ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate cursor-default">
                                {payment.transactionReference}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-xs break-all"
                            >
                              {payment.transactionReference}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[120px] text-sm text-muted-foreground">
                      {payment.notes ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate cursor-default">
                                {payment.notes}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-xs break-all"
                            >
                              {payment.notes}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {payment.createdBy || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Total Summary */}
        {payments.length > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {payments.length} payment
              {payments.length > 1 ? "s" : ""} recorded
            </span>
            <span className="text-sm font-medium text-foreground">
              Total: {formatCurrency(totalPaid)}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
