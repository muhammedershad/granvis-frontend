"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Invoice } from "@/lib/api/invoicesApi";
import { useCreateInvoicePaymentMutation } from "@/lib/api/paymentsApi";
import { PaymentMethod } from "@/types/payment";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";
import { dateToUTC, utcToDate } from "@/lib/utils/date";

interface RecordPaymentModalProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: PaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
  { value: PaymentMethod.UPI, label: "UPI" },
  { value: PaymentMethod.CASH, label: "Cash" },
  { value: PaymentMethod.CHEQUE, label: "Cheque" },
  { value: PaymentMethod.NEFT, label: "NEFT" },
  { value: PaymentMethod.RTGS, label: "RTGS" },
  { value: PaymentMethod.OTHER, label: "Other" },
];

export function RecordPaymentModal({
  invoice,
  open,
  onClose,
}: RecordPaymentModalProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [createInvoicePayment, { isLoading }] =
    useCreateInvoicePaymentMutation();

  const remainingBalance = invoice.netTotal - invoice.paidAmount;

  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [method, setMethod] = useState<PaymentMethod>(
    PaymentMethod.BANK_TRANSFER
  );
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");

  const parsedAmount = parseFloat(amount) || 0;
  const isAmountValid = parsedAmount > 0 && parsedAmount <= remainingBalance;

  const handleSubmit = async () => {
    if (!isAmountValid || !paymentDate) {
      return;
    }

    try {
      await createInvoicePayment({
        invoiceId: invoice.id,
        amount: parsedAmount,
        paymentDate,
        method,
        transactionReference: transactionReference || undefined,
        notes: notes || undefined,
        createdBy: user
          ? `${user.firstName} ${user.lastName}`.trim()
          : "System",
        createdById: user?._id,
      }).unwrap();

      toast.success("Payment recorded successfully");
      onClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to record payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-xl xl:max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
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
            <span className="text-muted-foreground">Already Paid</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {formatCurrency(invoice.paidAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium border-t border-border pt-1.5">
            <span className="text-muted-foreground">Remaining Balance</span>
            <span className="text-yellow-600 dark:text-yellow-400">
              {formatCurrency(remainingBalance)}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-amount">
              Payment Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="payment-amount"
              type="number"
              min="0.01"
              max={remainingBalance}
              step="0.01"
              placeholder={`Max: ${formatCurrency(remainingBalance)}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {parsedAmount > remainingBalance && (
              <p className="text-xs text-red-500">
                Amount cannot exceed remaining balance of{" "}
                {formatCurrency(remainingBalance)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Payment Date <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={utcToDate(paymentDate)}
              onDateChange={(date) => setPaymentDate(dateToUTC(date))}
              placeholder="Select payment date"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Mode</Label>
            <Select
              value={method}
              onValueChange={(v) => setMethod(v as PaymentMethod)}
            >
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    {pm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-reference">Transaction Reference</Label>
            <Input
              id="payment-reference"
              placeholder="e.g., UTR number, cheque number"
              maxLength={100}
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              className="overflow-hidden text-ellipsis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-notes">Notes</Label>
            <Textarea
              id="payment-notes"
              placeholder="Optional notes"
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="[field-sizing:fixed] max-h-24 overflow-y-auto break-all custom-scrollbar"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isAmountValid || !paymentDate || isLoading}
            className="max-w-[200px] overflow-hidden"
            title={
              parsedAmount > 0
                ? `Record ${formatCurrency(parsedAmount)}`
                : undefined
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Recording...
              </>
            ) : (
              <span className="truncate">
                {`Record ${parsedAmount > 0 ? formatCurrency(parsedAmount) : "Payment"}`}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
