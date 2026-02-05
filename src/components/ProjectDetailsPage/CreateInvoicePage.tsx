"use client";

import { useReducer, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Calendar,
  ArrowLeft,
  Save,
  CheckCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MilestoneSelectionTable } from "./MilestoneSelectionTable";
import { InvoiceSummaryPanel } from "./InvoiceSummaryPanel";
import {
  Invoice,
  invoiceFormReducer,
  initialInvoiceFormState,
  generateInvoiceNumber,
  calculateMilestoneInvoicingStatus,
  MilestoneWithInvoicing,
  mockInvoices,
} from "./invoiceMockData";
import { useGetMilestonesByProjectQuery } from "@/lib/api/milestonesApi";
import { useGetProjectByIdQuery } from "@/lib/api/projectsApi";
import { toast } from "sonner";

interface CreateInvoicePageProps {
  projectId: string;
  basePath: string;
}

export function CreateInvoicePage({
  projectId,
  basePath,
}: CreateInvoicePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(invoiceFormReducer, initialInvoiceFormState);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [existingInvoices] = useState<Invoice[]>(mockInvoices);

  // Determine if we're editing an existing invoice (from query param)
  const invoiceId = searchParams.get('edit');
  const isEditMode = !!invoiceId;
  const existingInvoice = isEditMode
    ? existingInvoices.find(inv => inv.id === invoiceId)
    : null;

  // Fetch project details
  const {
    data: project,
    isLoading: isLoadingProject,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  // Fetch milestones for the project
  const {
    data: milestonesData = [],
    isLoading: isLoadingMilestones,
  } = useGetMilestonesByProjectQuery(projectId, {
    skip: !projectId,
  });

  // Calculate invoicing status for each milestone
  const milestonesWithStatus: MilestoneWithInvoicing[] = milestonesData.map(milestone => {
    // Filter out the current invoice being edited to avoid double-counting
    const invoicesToConsider = existingInvoices.filter(inv => inv.id !== (invoiceId || ''));

    // Calculate based on existing finalized invoices
    const { status, totalBilled, remainingAmount } = calculateMilestoneInvoicingStatus(
      milestone,
      invoicesToConsider
    );

    return {
      ...milestone,
      invoicingStatus: status,
      totalBilled,
      remainingToBill: remainingAmount,
    };
  });

  // Initialize form
  useEffect(() => {
    if (isEditMode && existingInvoice) {
      // Load existing invoice for editing
      dispatch({ type: 'LOAD_DRAFT', payload: existingInvoice });
      // Auto-expand selected milestones
      const selectedIds = new Set(existingInvoice.milestoneItems.map(item => item.milestoneId));
      setExpandedMilestones(selectedIds);
    } else {
      // Reset for new invoice
      dispatch({ type: 'RESET_FORM' });
      setExpandedMilestones(new Set());
    }
  }, [isEditMode, existingInvoice]);

  const handleToggleExpand = (milestoneId: string) => {
    setExpandedMilestones(prev => {
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
      return 'Invoice date is required';
    }
    if (state.selectedMilestones.size === 0) {
      return 'Please select at least one milestone';
    }
    return null;
  };

  const validateFinalize = (): string | null => {
    const draftError = validateDraft();
    if (draftError) return draftError;

    // Check all milestone amounts are > 0
    for (const item of state.selectedMilestones.values()) {
      if (item.editableAmount <= 0) {
        return `Milestone "${item.milestoneTitle}" has invalid amount`;
      }
    }

    // Check discount validity
    if (state.discountValue < 0) {
      return 'Discount value cannot be negative';
    }
    if (state.discountType === 'percentage' && state.discountValue > 100) {
      return 'Percentage discount cannot exceed 100%';
    }

    return null;
  };

  const createInvoiceObject = (status: 'draft' | 'sent'): Invoice => {
    return {
      id: existingInvoice?.id || `inv-${Date.now()}`,
      invoiceNumber: state.invoiceReference,
      invoiceDate: state.invoiceDate,
      notes: state.notes,
      milestoneItems: Array.from(state.selectedMilestones.values()),
      subtotal: state.subtotal,
      discountType: state.discountType,
      discountValue: state.discountValue,
      discountAmount: state.discountAmount,
      netTotal: state.netTotal,
      paidAmount: state.paidAmount,
      balance: state.balance,
      status,
      createdAt: existingInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: existingInvoice?.createdBy || 'Current User',
    };
  };

  const handleSaveDraft = async () => {
    const error = validateDraft();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const invoice = createInvoiceObject('draft');

      // In real implementation, this would be an API call
      console.log('Saving draft invoice:', invoice);

      toast.success('Invoice saved as draft');
      router.push(`${basePath}/${projectId}?tab=invoices`);
    } catch (error) {
      toast.error('Failed to save invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    const error = validateFinalize();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const invoice = createInvoiceObject('sent');

      // In real implementation, this would be an API call
      console.log('Finalizing invoice:', invoice);

      toast.success('Invoice finalized successfully');
      router.push(`${basePath}/${projectId}?tab=invoices`);
    } catch (error) {
      toast.error('Failed to finalize invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`${basePath}/${projectId}?tab=invoices`);
  };

  const handlePreview = () => {
    const error = validateDraft();
    if (error) {
      toast.error(error);
      return;
    }

    // Build URL params for preview
    const params = new URLSearchParams();
    const milestoneIds = Array.from(state.selectedMilestones.keys());
    params.set("milestones", milestoneIds.join(","));
    params.set("date", state.invoiceDate);
    if (state.notes) {
      params.set("notes", state.notes.split("\n").join("|"));
    }

    router.push(`${basePath}/${projectId}/invoices/preview?${params.toString()}`);
  };

  // Prevent editing finalized invoices
  const isEditable = !existingInvoice || existingInvoice.status === 'draft';

  if (isLoadingProject || isLoadingMilestones) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-3 text-lg text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {project?.name} • {state.invoiceReference}
            </p>
          </div>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          {isEditable && (
            <>
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={isSaving || state.selectedMilestones.size === 0}
                className="border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSaving || state.selectedMilestones.size === 0}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save as Draft
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={isSaving || state.selectedMilestones.size === 0}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Finalize Invoice
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-6">
          {/* Basic Info Card */}
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate" className="text-sm">
                    Invoice Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={state.invoiceDate}
                    onChange={(e) => dispatch({ type: 'SET_INVOICE_DATE', payload: e.target.value })}
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
                  onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
                  placeholder="Add any notes or special terms..."
                  rows={3}
                  disabled={!isEditable}
                  className="text-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestone Selection Card */}
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-blue-500/[0.02] dark:from-purple-400/[0.05] dark:to-blue-400/[0.05]"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-foreground">
                    Select Milestones <span className="text-red-500">*</span>
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  {state.selectedMilestones.size} milestone(s) selected
                </p>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <MilestoneSelectionTable
                milestones={milestonesWithStatus}
                selectedMilestones={state.selectedMilestones}
                onToggleMilestone={(id, milestone) => {
                  if (isEditable) {
                    dispatch({ type: 'TOGGLE_MILESTONE', payload: { milestoneId: id, milestone } });
                  }
                }}
                onUpdateRate={(id, data) => {
                  if (isEditable) {
                    dispatch({
                      type: 'UPDATE_MILESTONE_RATE',
                      payload: { milestoneId: id, ...data },
                    });
                  }
                }}
                onUpdateAmount={(id, amount) => {
                  if (isEditable) {
                    dispatch({
                      type: 'UPDATE_MILESTONE_AMOUNT',
                      payload: { milestoneId: id, amount },
                    });
                  }
                }}
                expandedMilestones={expandedMilestones}
                onToggleExpand={handleToggleExpand}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
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
                dispatch({ type: 'SET_DISCOUNT', payload: { type, value } });
              }
            }}
            onSetPaidAmount={(amount) => {
              if (isEditable) {
                dispatch({ type: 'SET_PAID_AMOUNT', payload: amount });
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            size="sm"
          >
            Cancel
          </Button>
          {isEditable && (
            <>
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={isSaving || state.selectedMilestones.size === 0}
                size="sm"
                className="border-blue-500/50 text-blue-600"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSaving || state.selectedMilestones.size === 0}
                size="sm"
                className="flex-1"
              >
                Draft
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={isSaving || state.selectedMilestones.size === 0}
                size="sm"
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600"
              >
                Finalize
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Spacer for mobile fixed buttons */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}
