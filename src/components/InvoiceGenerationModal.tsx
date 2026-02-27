"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  CheckCircle2,
  Download,
  FileText,
  Info,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthDetails } from "@/store/slices/authSlice";
import {
  CreatePaymentDto,
  PaymentMethod,
  PaymentStatus,
} from "@/types/payment";
import {
  useCreatePaymentMutation,
  useGeneratePaymentPdfMutation,
} from "@/lib/api/paymentsApi";
import { useGetProjectsQuery } from "@/lib/api/projectsApi";
import { useGetMilestonesByProjectQuery } from "@/lib/api/milestonesApi";
import { Milestone, RateType } from "@/types/milestone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface InvoiceGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedProjectId?: string;
  preSelectedMilestoneId?: string;
}

const customLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  rate: z.number().min(0, "Rate must be non-negative"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const invoiceFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  milestoneId: z.string().min(1, "Milestone is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  method: z.nativeEnum(PaymentMethod),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  transactionReference: z.string().optional(),
  customLineItems: z.array(customLineItemSchema).optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

interface SuccessViewProps {
  onDownloadPdf: () => void;
  onClose: () => void;
}

function SuccessView({ onDownloadPdf, onClose }: SuccessViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-8 px-6">
      <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-6">
        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">
          Invoice Generated Successfully!
        </h3>
        <p className="text-muted-foreground">
          Your invoice has been created and the PDF is ready for download
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={onDownloadPdf} size="lg">
          <Download className="mr-2 h-5 w-5" />
          Download PDF
        </Button>
        <Button onClick={onClose} variant="outline" size="lg">
          Close
        </Button>
      </div>
    </div>
  );
}

interface ProjectMilestoneSectionProps {
  control: ReturnType<typeof useForm<InvoiceFormData>>["control"];
  errors: ReturnType<typeof useForm<InvoiceFormData>>["formState"]["errors"];
  isLoadingProjects: boolean;
  isLoadingMilestones: boolean;
  projects: { id: string; name: string; clientId?: string }[];
  milestones: Milestone[];
  selectedProjectId: string;
}

function ProjectMilestoneSection({
  control,
  errors,
  isLoadingProjects,
  isLoadingMilestones,
  projects,
  milestones,
  selectedProjectId,
}: ProjectMilestoneSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project & Milestone</CardTitle>
        <CardDescription>
          Select the project and milestone for this invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectId">
              Project <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProjects && (
                      <SelectItem value="loading" disabled>
                        Loading projects...
                      </SelectItem>
                    )}
                    {!isLoadingProjects && projects.length === 0 && (
                      <SelectItem value="none" disabled>
                        No projects found
                      </SelectItem>
                    )}
                    {!isLoadingProjects &&
                      projects.length > 0 &&
                      projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.projectId && (
              <p className="text-sm text-red-500">{errors.projectId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestoneId">
              Milestone <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="milestoneId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingMilestones && (
                      <SelectItem value="loading" disabled>
                        Loading milestones...
                      </SelectItem>
                    )}
                    {!isLoadingMilestones && milestones.length === 0 && (
                      <SelectItem value="none" disabled>
                        No milestones found
                      </SelectItem>
                    )}
                    {!isLoadingMilestones &&
                      milestones.length > 0 &&
                      milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          Stage {milestone.stageNumber}: {milestone.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.milestoneId && (
              <p className="text-sm text-red-500">
                {errors.milestoneId.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MilestoneDetailsSectionProps {
  selectedMilestone: Milestone;
}

function MilestoneDetailsSection({
  selectedMilestone,
}: MilestoneDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestone Details</CardTitle>
        <CardDescription>
          Stage {selectedMilestone.stageNumber}: {selectedMilestone.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Scope of Work</Label>
          <div className="space-y-2">
            {selectedMilestone.scopeOfWork.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.rateType === RateType.PER_SQFT
                      ? `₹${item.rate.toLocaleString("en-IN")}/sq.ft`
                      : `₹${item.rate.toLocaleString("en-IN")} × ${item.quantity}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMilestone.additionalCharges &&
          selectedMilestone.additionalCharges.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Additional Charges
              </Label>
              <div className="space-y-2">
                {selectedMilestone.additionalCharges.map((charge) => (
                  <div
                    key={charge.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{charge.description}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{charge.ratePerUnit.toLocaleString("en-IN")} ×{" "}
                        {charge.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(charge.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <span className="font-semibold">Milestone Total:</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(selectedMilestone.totalAmount || 0)}
          </span>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p>
              <span className="font-semibold">Paid Amount:</span>{" "}
              {formatCurrency(selectedMilestone.paidAmount || 0)}
            </p>
            <p>
              <span className="font-semibold">Pending Amount:</span>{" "}
              {formatCurrency(selectedMilestone.pendingAmount || 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CustomLineItemsSectionProps {
  customLineItemsFields: Record<string, string | number>[];
  appendCustomLineItem: (item: {
    description: string;
    rate: number;
    quantity: number;
  }) => void;
  removeCustomLineItem: (index: number) => void;
  register: ReturnType<typeof useForm<InvoiceFormData>>["register"];
  errors: ReturnType<typeof useForm<InvoiceFormData>>["formState"]["errors"];
  watchCustomLineItems:
    | { description: string; rate: number; quantity: number }[]
    | undefined;
  customItemsTotal: number;
}

function CustomLineItemsSection({
  customLineItemsFields,
  appendCustomLineItem,
  removeCustomLineItem,
  register,
  errors,
  watchCustomLineItems,
  customItemsTotal,
}: CustomLineItemsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Custom Line Items</CardTitle>
            <CardDescription>
              Add additional charges or custom items to this invoice
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendCustomLineItem({
                description: "",
                rate: 0,
                quantity: 1,
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {customLineItemsFields.length > 0 ? (
          <div className="space-y-3">
            {customLineItemsFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg bg-muted/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-600"
                    onClick={() => removeCustomLineItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="e.g., Site Visit Charges"
                    {...register(`customLineItems.${index}.description`)}
                  />
                  {errors.customLineItems?.[index]?.description && (
                    <p className="text-sm text-red-500">
                      {errors.customLineItems[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      {...register(`customLineItems.${index}.rate`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="1"
                      {...register(`customLineItems.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      (watchCustomLineItems?.[index]?.rate || 0) *
                        (watchCustomLineItems?.[index]?.quantity || 1)
                    )}
                  </span>
                </div>
              </div>
            ))}

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Custom Items Total:</span>
                <span className="text-lg font-bold">
                  {formatCurrency(customItemsTotal)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No custom items added. Click &quot;Add Item&quot; to include
            additional charges.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface PaymentDetailsSectionProps {
  control: ReturnType<typeof useForm<InvoiceFormData>>["control"];
  register: ReturnType<typeof useForm<InvoiceFormData>>["register"];
  errors: ReturnType<typeof useForm<InvoiceFormData>>["formState"]["errors"];
  watchAmount: number;
}

function PaymentDetailsSection({
  control,
  register,
  errors,
  watchAmount,
}: PaymentDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter payment and invoice information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="method">
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.BANK_TRANSFER}>
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                    <SelectItem value={PaymentMethod.CHEQUE}>Cheque</SelectItem>
                    <SelectItem value={PaymentMethod.UPI}>UPI</SelectItem>
                    <SelectItem value={PaymentMethod.NEFT}>NEFT</SelectItem>
                    <SelectItem value={PaymentMethod.RTGS}>RTGS</SelectItem>
                    <SelectItem value={PaymentMethod.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionReference">Transaction Reference</Label>
            <Input
              id="transactionReference"
              placeholder="e.g., TXN123456"
              {...register("transactionReference")}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">
              Invoice Date <span className="text-red-500">*</span>
            </Label>
            <Input id="invoiceDate" type="date" {...register("invoiceDate")} />
            {errors.invoiceDate && (
              <p className="text-sm text-red-500">
                {errors.invoiceDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidDate">Paid Date (if paid)</Label>
            <Input id="paidDate" type="date" {...register("paidDate")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Brief description of the payment"
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes or terms..."
            rows={3}
            {...register("notes")}
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Invoice Amount
              </p>
              <p className="text-xs text-muted-foreground">
                (Milestone + Custom Items)
              </p>
            </div>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(watchAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InvoiceFormFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isCreating: boolean;
  selectedMilestone: Milestone | null;
}

function InvoiceFormFooter({
  onClose,
  onSubmit,
  isLoading,
  isCreating,
  selectedMilestone,
}: InvoiceFormFooterProps) {
  return (
    <div className="border-t px-6 py-4">
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading || !selectedMilestone}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isCreating ? "Creating..." : "Generating PDF..."}
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}

export function InvoiceGenerationModal({
  open,
  onOpenChange,
  preSelectedProjectId,
  preSelectedMilestoneId,
}: InvoiceGenerationModalProps) {
  const { user } = useSelector(getAuthDetails);
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [generatePdf, { isLoading: isGeneratingPdf }] =
    useGeneratePaymentPdfMutation();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preSelectedProjectId || ""
  );
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [generatedPaymentId, setGeneratedPaymentId] = useState<string | null>(
    null
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Fetch projects
  const { data: projectsResponse, isLoading: isLoadingProjects } =
    useGetProjectsQuery({
      page: 1,
      limit: 1000,
    });

  // Fetch milestones for selected project
  const { data: milestonesData, isLoading: isLoadingMilestones } =
    useGetMilestonesByProjectQuery(selectedProjectId, {
      skip: !selectedProjectId,
    });

  const projects = projectsResponse?.data || [];
  const milestones = useMemo(() => milestonesData || [], [milestonesData]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      projectId: preSelectedProjectId || "",
      milestoneId: preSelectedMilestoneId || "",
      amount: 0,
      method: PaymentMethod.BANK_TRANSFER,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      paidDate: "",
      description: "",
      notes: "",
      transactionReference: "",
      customLineItems: [],
    },
  });

  const {
    fields: customLineItemsFields,
    append: appendCustomLineItem,
    remove: removeCustomLineItem,
  } = useFieldArray({
    control,
    name: "customLineItems",
  });

  const watchProjectId = watch("projectId");
  const watchMilestoneId = watch("milestoneId");
  const watchCustomLineItems = watch("customLineItems");

  // Update selected project when project changes
  useEffect(() => {
    if (watchProjectId) {
      setSelectedProjectId(watchProjectId);
      setValue("milestoneId", "");
      setSelectedMilestone(null);
    }
  }, [watchProjectId, setValue]);

  // Update selected milestone and calculate amount
  useEffect(() => {
    if (watchMilestoneId && milestones.length > 0) {
      const milestone = milestones.find((m) => m.id === watchMilestoneId);
      if (milestone) {
        setSelectedMilestone(milestone);

        // Calculate base amount from milestone
        const baseAmount = milestone.totalAmount || 0;

        // Add custom line items
        const customItemsTotal = (watchCustomLineItems || []).reduce(
          (sum, item) => sum + item.rate * item.quantity,
          0
        );

        setValue("amount", baseAmount + customItemsTotal);
      }
    }
  }, [watchMilestoneId, milestones, watchCustomLineItems, setValue]);

  // Calculate custom items total
  const customItemsTotal = useMemo(() => {
    return (watchCustomLineItems || []).reduce(
      (sum, item) => sum + item.rate * item.quantity,
      0
    );
  }, [watchCustomLineItems]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      reset({
        projectId: preSelectedProjectId || "",
        milestoneId: preSelectedMilestoneId || "",
        amount: 0,
        method: PaymentMethod.BANK_TRANSFER,
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        paidDate: "",
        description: "",
        notes: "",
        transactionReference: "",
        customLineItems: [],
      });
      setGeneratedPaymentId(null);
      setPdfUrl(null);
    }
  }, [open, reset, preSelectedProjectId, preSelectedMilestoneId]);

  const onSubmit = async (data: InvoiceFormData) => {
    if (!user) {
      return;
    }

    try {
      // Get client ID from selected project
      const selectedProject = projects.find((p) => p.id === data.projectId);
      if (!selectedProject?.clientId) {
        toast.error("Selected project has no associated client");
        return;
      }

      const payload: CreatePaymentDto = {
        projectId: data.projectId,
        milestoneId: data.milestoneId,
        clientId: selectedProject.clientId,
        amount: data.amount,
        currency: "INR",
        status: data.paidDate ? PaymentStatus.PAID : PaymentStatus.PENDING,
        method: data.method,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate || undefined,
        paidDate: data.paidDate || undefined,
        description: data.description || undefined,
        notes: data.notes || undefined,
        transactionReference: data.transactionReference || undefined,
        createdBy: `${user.firstName} ${user.lastName}`,
        createdById: user._id,
      };

      const payment = await createPayment(payload).unwrap();
      setGeneratedPaymentId(payment.id);

      toast.success("Invoice created successfully!");

      // Auto-generate PDF
      try {
        const pdfResponse = await generatePdf(payment.id).unwrap();
        setPdfUrl(pdfResponse.pdfUrl);
        toast.success("PDF generated successfully!");
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        toast.error("Invoice created but PDF generation failed");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err?.data?.message || "Failed to create invoice";
      toast.error(message);
      console.error("Invoice creation error:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setGeneratedPaymentId(null);
      setPdfUrl(null);
      setSelectedMilestone(null);
    }, 300);
  };

  const isLoading = isCreating || isGeneratingPdf;

  const watchAmount = watch("amount");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Invoice
            </DialogTitle>
            <DialogDescription>
              Create an invoice for a project milestone with optional custom
              line items
            </DialogDescription>
          </DialogHeader>
        </div>

        {generatedPaymentId && pdfUrl ? (
          <SuccessView
            onDownloadPdf={handleDownloadPdf}
            onClose={handleClose}
          />
        ) : (
          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
              <ProjectMilestoneSection
                control={control}
                errors={errors}
                isLoadingProjects={isLoadingProjects}
                isLoadingMilestones={isLoadingMilestones}
                projects={projects}
                milestones={milestones}
                selectedProjectId={selectedProjectId}
              />

              {selectedMilestone && (
                <MilestoneDetailsSection
                  selectedMilestone={selectedMilestone}
                />
              )}

              {selectedMilestone && (
                <CustomLineItemsSection
                  customLineItemsFields={customLineItemsFields}
                  appendCustomLineItem={appendCustomLineItem}
                  removeCustomLineItem={removeCustomLineItem}
                  register={register}
                  errors={errors}
                  watchCustomLineItems={watchCustomLineItems}
                  customItemsTotal={customItemsTotal}
                />
              )}

              {selectedMilestone && (
                <PaymentDetailsSection
                  control={control}
                  register={register}
                  errors={errors}
                  watchAmount={watchAmount}
                />
              )}
            </form>
          </div>
        )}

        {!generatedPaymentId && (
          <InvoiceFormFooter
            onClose={handleClose}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            isCreating={isCreating}
            selectedMilestone={selectedMilestone}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
