import { useEffect, useReducer, useState } from "react";
import { Calendar, FileText } from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import { MilestoneSelectionTable } from "./MilestoneSelectionTable";
import { InvoiceSummaryPanel } from "./InvoiceSummaryPanel";
import {
  MilestoneWithInvoicing,
  calculateMilestoneInvoicingStatus,
  initialInvoiceFormState,
  invoiceFormReducer,
} from "./invoiceMockData";
import { Invoice } from "@/lib/api/invoicesApi";
import { useGetMilestonesByProjectQuery } from "@/lib/api/milestonesApi";
import { toast } from "sonner";

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  projectId: string;
  existingInvoices: Invoice[];
  onSave: (invoice: Invoice) => void;
}

export function InvoiceFormDialog({
  open,
  onOpenChange,
  invoice,
  projectId,
  existingInvoices,
  onSave,
}: InvoiceFormDialogProps) {
  const [state, dispatch] = useReducer(
    invoiceFormReducer,
    initialInvoiceFormState
  );
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set()
  );

  // Fetch milestones for the project
  const { data: milestonesData = [], isLoading: isLoadingMilestones } =
    useGetMilestonesByProjectQuery(projectId, {
      skip: !projectId || !open,
    });

  // Calculate invoicing status for each milestone
  const milestonesWithStatus: MilestoneWithInvoicing[] = milestonesData.map(
    (milestone) => {
      // Filter out the current invoice being edited to avoid double-counting
      const invoicesToConsider = existingInvoices.filter(
        (inv) => inv.id !== invoice?.id
      );

      // Calculate based on existing finalized invoices
      const { status, totalBilled, remainingAmount } =
        calculateMilestoneInvoicingStatus(milestone, invoicesToConsider);

      return {
        ...milestone,
        invoicingStatus: status,
        totalBilled,
        remainingToBill: remainingAmount,
      };
    }
  );

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      if (invoice) {
        // Load existing invoice for editing
        dispatch({ type: "LOAD_DRAFT", payload: invoice });
        // Auto-expand selected milestones
        const selectedIds = new Set(
          invoice.milestoneItems.map((item) => item.milestoneId)
        );
        setExpandedMilestones(selectedIds);
      } else {
        // Reset for new invoice
        dispatch({ type: "RESET_FORM" });
        setExpandedMilestones(new Set());
      }
    }
  }, [open, invoice]);

  const handleToggleExpand = (milestoneId: string) => {
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(milestoneId)) {
        next.delete(milestoneId);
      } else {
        next.add(milestoneId);
      }
      return next;
    });
  };

  const validateDraft = (): string | null => {
    if (!state.invoiceDate) {
      return "Invoice date is required";
    }
    if (state.selectedMilestones.size === 0) {
      return "Please select at least one milestone";
    }
    return null;
  };

  const validateFinalize = (): string | null => {
    const draftError = validateDraft();
    if (draftError) {
      return draftError;
    }

    // Check all milestone amounts are > 0
    for (const item of state.selectedMilestones.values()) {
      if (item.editableAmount <= 0) {
        return `Milestone "${item.milestoneTitle}" has invalid amount`;
      }
    }

    // Check discount validity
    if (state.discountValue < 0) {
      return "Discount value cannot be negative";
    }
    if (state.discountType === "percentage" && state.discountValue > 100) {
      return "Percentage discount cannot exceed 100%";
    }

    return null;
  };

  const handleSaveDraft = () => {
    const error = validateDraft();
    if (error) {
      toast.error(error);
      return;
    }

    const newInvoice = {
      id: invoice?.id || `inv-${Date.now()}`,
      invoiceNumber: state.invoiceReference,
      invoiceDate: state.invoiceDate,
      notes: state.notes,
      milestoneItems: Array.from(state.selectedMilestones.values()),
      lineItems: state.lineItems
        .filter((item) => item.description.trim() || item.amount > 0)
        .map((item) => ({
          description: item.description,
          rateType: item.rateType,
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount,
        })),
      subtotal: state.subtotal,
      discountType: state.discountType,
      discountValue: state.discountValue,
      discountAmount: state.discountAmount,
      netTotal: state.netTotal,
      paidAmount: state.paidAmount,
      balance: state.balance,
      status: "draft" as const,
      createdAt: invoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: invoice?.createdBy || "Current User",
    } as unknown as Invoice;

    onSave(newInvoice);
    toast.success("Invoice saved as draft");
  };

  const handleFinalize = () => {
    const error = validateFinalize();
    if (error) {
      toast.error(error);
      return;
    }

    const newInvoice = {
      id: invoice?.id || `inv-${Date.now()}`,
      invoiceNumber: state.invoiceReference,
      invoiceDate: state.invoiceDate,
      notes: state.notes,
      milestoneItems: Array.from(state.selectedMilestones.values()),
      lineItems: state.lineItems
        .filter((item) => item.description.trim() || item.amount > 0)
        .map((item) => ({
          description: item.description,
          rateType: item.rateType,
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount,
        })),
      subtotal: state.subtotal,
      discountType: state.discountType,
      discountValue: state.discountValue,
      discountAmount: state.discountAmount,
      netTotal: state.netTotal,
      paidAmount: state.paidAmount,
      balance: state.balance,
      status: "sent" as const,
      createdAt: invoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: invoice?.createdBy || "Current User",
    } as unknown as Invoice;

    onSave(newInvoice);
    toast.success("Invoice finalized successfully");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Prevent editing finalized invoices
  const isEditable = !invoice || invoice.status === "draft";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl">
              {!invoice && "Create New Invoice"}
              {invoice && invoice.status === "draft" && "Edit Invoice"}
              {invoice && invoice.status !== "draft" && "View Invoice"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Main Form Area */}
            <div className="flex-1 space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate" className="text-sm">
                      Invoice Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={state.invoiceDate}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_INVOICE_DATE",
                          payload: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceReference" className="text-sm">
                      Invoice Reference
                    </Label>
                    <Input
                      id="invoiceReference"
                      value={state.invoiceReference}
                      disabled
                      className="text-sm bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={state.notes}
                    onChange={(e) =>
                      dispatch({ type: "SET_NOTES", payload: e.target.value })
                    }
                    placeholder="Add any notes or special terms..."
                    rows={3}
                    disabled={!isEditable}
                    className="text-sm resize-none"
                  />
                </div>
              </div>

              {/* Milestone Selection Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Select Milestones <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {state.selectedMilestones.size} milestone(s) selected
                  </p>
                </div>

                {isLoadingMilestones ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading milestones...
                  </div>
                ) : (
                  <MilestoneSelectionTable
                    milestones={milestonesWithStatus}
                    selectedMilestones={state.selectedMilestones}
                    onToggleMilestone={(id, milestone) => {
                      if (isEditable) {
                        dispatch({
                          type: "TOGGLE_MILESTONE",
                          payload: { milestoneId: id, milestone },
                        });
                      }
                    }}
                    onUpdateRate={(id, data) => {
                      if (isEditable) {
                        dispatch({
                          type: "UPDATE_MILESTONE_RATE",
                          payload: { milestoneId: id, ...data },
                        });
                      }
                    }}
                    onUpdateAmount={(id, amount) => {
                      if (isEditable) {
                        dispatch({
                          type: "UPDATE_MILESTONE_AMOUNT",
                          payload: { milestoneId: id, amount },
                        });
                      }
                    }}
                    expandedMilestones={expandedMilestones}
                    onToggleExpand={handleToggleExpand}
                  />
                )}
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:w-80">
              <InvoiceSummaryPanel
                subtotal={state.subtotal}
                discountType={state.discountType}
                discountValue={state.discountValue}
                discountAmount={state.discountAmount}
                netTotal={state.netTotal}
                paidAmount={state.paidAmount}
                balance={state.balance}
                onSetDiscount={(type, value) => {
                  if (isEditable) {
                    dispatch({
                      type: "SET_DISCOUNT",
                      payload: { type, value },
                    });
                  }
                }}
                onSetPaidAmount={(amount) => {
                  if (isEditable) {
                    dispatch({ type: "SET_PAID_AMOUNT", payload: amount });
                  }
                }}
              />
            </div>
          </div>
        </div>

        {isEditable && (
          <DialogFooter className="border-t px-6 py-4 bg-muted/20">
            <div className="flex items-center justify-between w-full">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={state.selectedMilestones.size === 0}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={handleFinalize}
                  disabled={state.selectedMilestones.size === 0}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  Finalize Invoice
                </Button>
              </div>
            </div>
          </DialogFooter>
        )}

        {!isEditable && (
          <DialogFooter className="border-t px-6 py-4 bg-muted/20">
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
