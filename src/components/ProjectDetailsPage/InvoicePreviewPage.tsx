"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  Edit,
  Loader2,
  Printer,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { InvoicePreview, InvoicePreviewData } from "./InvoicePreview";
import { useGetProjectByIdQuery } from "@/lib/api/projectsApi";
import {
  useGetDefaultFirmSettingsQuery,
  useGetFirmSettingsByIdQuery,
} from "@/lib/api/firmSettingsApi";
import { useGetClientByIdQuery } from "@/lib/api/clientsApi";
import {
  CreateInvoiceDto,
  Invoice,
  InvoiceMilestoneItem,
  useCreateInvoiceMutation,
  useGenerateInvoicePdfMutation,
  useGetInvoiceByIdQuery,
} from "@/lib/api/invoicesApi";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { FirmSettings } from "@/types/firm-settings";

interface InvoicePreviewPageProps {
  projectId: string;
  basePath: string;
}

// Default firm settings fallback when none is configured
const defaultFirmSettingsFallback: FirmSettings = {
  id: "default",
  name: "Your Company Name",
  address: "Your Address",
  city: "Your City",
  state: "Your State",
  country: "India",
  phone: "Your Phone",
  email: "your@email.com",
  invoicePrefix: "INV",
  invoiceStartNumber: 1,
  defaultNotes: [
    "Detailed MEP Drawings are considered an extra service.",
    "One site visit is included in each stage. Additional site visits will be charged separately.",
    "Site visits are for observation, reporting, and client coordination. They are not intended for full-time site supervision.",
  ],
  isDefault: true,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function parseSearchParams(searchParams: URLSearchParams) {
  const invoiceDate =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const invoiceRef = searchParams.get("invoiceRef") || "";
  const notesParam = searchParams.get("notes");
  const notes = notesParam ? notesParam.split("|") : undefined;

  const itemsParam = searchParams.get("items");
  const milestoneItems: InvoiceMilestoneItem[] = (() => {
    if (!itemsParam) {
      return [];
    }
    try {
      return JSON.parse(atob(itemsParam));
    } catch {
      return [];
    }
  })();

  const subtotal = parseFloat(searchParams.get("subtotal") || "0");
  const discountType = (searchParams.get("discountType") || "percentage") as
    | "percentage"
    | "flat";
  const discountValue = parseFloat(searchParams.get("discountValue") || "0");
  const discountAmount = parseFloat(searchParams.get("discountAmount") || "0");
  const netTotal = parseFloat(searchParams.get("netTotal") || "0");
  const paidAmount = parseFloat(searchParams.get("paidAmount") || "0");
  const firmSettingsId = searchParams.get("firmSettingsId") || "";

  return {
    invoiceDate,
    invoiceRef,
    notes,
    milestoneItems,
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    netTotal,
    paidAmount,
    firmSettingsId,
  };
}

function buildInvoiceData(opts: {
  projectId: string;
  project: { clientId?: string };
  params: ReturnType<typeof parseSearchParams>;
  firmSettings: FirmSettings;
  firmSettingsData: FirmSettings | null | undefined;
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    _id?: string;
  } | null;
}): CreateInvoiceDto {
  const { projectId, project, params, firmSettings, firmSettingsData, user } =
    opts;
  return {
    projectId,
    clientId: project?.clientId || "",
    invoiceDate: params.invoiceDate,
    milestoneItems: params.milestoneItems,
    subtotal: params.subtotal,
    discountType: params.discountType,
    discountValue: params.discountValue,
    discountAmount: params.discountAmount,
    netTotal: params.netTotal,
    paidAmount: params.paidAmount,
    notes: params.notes?.join("\n"),
    defaultNotes: firmSettings.defaultNotes,
    status: "sent",
    firmSettingsId: firmSettingsData?.id || params.firmSettingsId || undefined,
    createdBy: user
      ? `${user.firstName} ${user.lastName}`.trim() || user.email
      : "Unknown User",
    createdById: user?._id,
  };
}

function deriveEffectiveParams(
  isViewMode: boolean,
  existingInvoice: Invoice | undefined,
  params: ReturnType<typeof parseSearchParams>
) {
  if (!isViewMode || !existingInvoice) {
    return params;
  }
  return {
    invoiceDate: existingInvoice.invoiceDate?.split("T")[0] || "",
    invoiceRef: existingInvoice.invoiceNumber,
    notes: existingInvoice.notes
      ? existingInvoice.notes.split("\n")
      : existingInvoice.defaultNotes,
    milestoneItems: existingInvoice.milestoneItems,
    subtotal: existingInvoice.subtotal,
    discountType: existingInvoice.discountType,
    discountValue: existingInvoice.discountValue,
    discountAmount: existingInvoice.discountAmount,
    netTotal: existingInvoice.netTotal,
    paidAmount: existingInvoice.paidAmount,
    firmSettingsId: existingInvoice.firmSettingsId || "",
  };
}

async function downloadInvoicePdf(
  generatePdf: ReturnType<typeof useGenerateInvoicePdfMutation>[0],
  invoiceId: string,
  invoiceNumber: string
) {
  const result = await generatePdf(invoiceId).unwrap();
  const byteCharacters = atob(result.pdfBase64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

function useInvoiceData(projectId: string) {
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [generatePdf, { isLoading: isDownloading }] =
    useGenerateInvoicePdfMutation();

  const invoiceId = searchParams.get("invoiceId");
  const isViewMode = !!invoiceId;
  const params = parseSearchParams(searchParams);

  const { data: existingInvoice, isLoading: isLoadingInvoice } =
    useGetInvoiceByIdQuery(invoiceId || "", { skip: !invoiceId });

  const effectiveParams = deriveEffectiveParams(
    isViewMode,
    existingInvoice,
    params
  );

  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useGetProjectByIdQuery(projectId, { skip: !projectId });

  const firmSettingsIdToFetch = effectiveParams.firmSettingsId;
  const { data: selectedFirmData, isLoading: isLoadingSelectedFirm } =
    useGetFirmSettingsByIdQuery(firmSettingsIdToFetch, {
      skip: !firmSettingsIdToFetch,
    });

  const { data: defaultFirmData, isLoading: isLoadingDefaultFirm } =
    useGetDefaultFirmSettingsQuery(undefined, {
      skip: !!firmSettingsIdToFetch,
    });

  const isLoadingFirmSettings = firmSettingsIdToFetch
    ? isLoadingSelectedFirm
    : isLoadingDefaultFirm;
  const firmSettingsData = selectedFirmData || defaultFirmData;
  const firmSettings = firmSettingsData || defaultFirmSettingsFallback;

  const { data: client, isLoading: isLoadingClient } = useGetClientByIdQuery(
    project?.clientId || "",
    { skip: !project?.clientId }
  );

  const isLoading =
    isLoadingProject ||
    isLoadingFirmSettings ||
    (isViewMode ? isLoadingInvoice : false) ||
    (project?.clientId ? isLoadingClient : false);

  return {
    user,
    invoiceId,
    isViewMode,
    effectiveParams,
    project,
    projectError,
    client,
    firmSettings,
    firmSettingsData,
    existingInvoice,
    isLoading,
    isCreating,
    isDownloading,
    createInvoice,
    generatePdf,
  };
}

function PreviewActionBar({
  projectName,
  isBusy,
  isViewMode,
  invoiceNumber,
  onClose,
  onEdit,
  onPrint,
  onDownload,
  onFinalize,
}: {
  projectName: string;
  isBusy: boolean;
  isViewMode?: boolean;
  invoiceNumber?: string;
  onClose: () => void;
  onEdit?: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onFinalize?: () => void;
}) {
  return (
    <div className="print:hidden sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              {isViewMode ? "View Invoice" : "Invoice Preview"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {projectName}
              {invoiceNumber ? ` • ${invoiceNumber}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onEdit && (
            <Button variant="outline" onClick={onEdit} disabled={isBusy}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={onPrint} disabled={isBusy}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={onDownload} disabled={isBusy}>
            {isBusy ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>
          {onFinalize && (
            <Button
              onClick={onFinalize}
              disabled={isBusy}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Finalize Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InvoicePreviewPage({
  projectId,
  basePath,
}: InvoicePreviewPageProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    user,
    invoiceId,
    isViewMode,
    effectiveParams,
    project,
    projectError,
    client,
    firmSettings,
    firmSettingsData,
    existingInvoice,
    isLoading,
    isCreating,
    isDownloading,
    createInvoice,
    generatePdf,
  } = useInvoiceData(projectId);

  const isBusy = isGenerating || isCreating || isDownloading;

  const handleEdit = () => {
    if (isViewMode && existingInvoice?.status === "draft") {
      router.push(`${basePath}/${projectId}/invoices/new?edit=${invoiceId}`);
    } else {
      router.push(`${basePath}/${projectId}/invoices/new`);
    }
  };

  const handleClose = () => {
    router.push(`${basePath}/${projectId}?tab=invoices`);
  };

  const handleFinalize = async () => {
    if (effectiveParams.milestoneItems.length === 0) {
      toast.error("No milestone items found");
      return;
    }

    setIsGenerating(true);
    try {
      const invoiceData = buildInvoiceData({
        projectId,
        project: project || {},
        params: effectiveParams,
        firmSettings,
        firmSettingsData,
        user,
      });

      await createInvoice(invoiceData).unwrap();
      toast.success("Invoice finalized successfully");
      router.push(`${basePath}/${projectId}?tab=invoices`);
    } catch {
      toast.error("Failed to finalize invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!isViewMode || !invoiceId) {
      window.print();
      return;
    }
    try {
      await downloadInvoicePdf(
        generatePdf,
        invoiceId,
        existingInvoice?.invoiceNumber || "invoice"
      );
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-3 text-lg text-muted-foreground">
          Loading preview...
        </span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-6 w-6" />
          <p className="text-lg font-medium">Unable to load invoice preview</p>
        </div>
        <p className="text-muted-foreground">
          {projectError
            ? "Failed to load project details. Please try again."
            : "Project not found."}
        </p>
        <Button variant="outline" onClick={handleClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (effectiveParams.milestoneItems.length === 0 && !isViewMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-6 w-6" />
          <p className="text-lg font-medium">No milestones selected</p>
        </div>
        <p className="text-muted-foreground">
          Please go back and select at least one milestone for the invoice.
        </p>
        <Button variant="outline" onClick={handleEdit}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back to Edit
        </Button>
      </div>
    );
  }

  const previewData: InvoicePreviewData = {
    firmSettings,
    project,
    client: client || null,
    milestoneItems: effectiveParams.milestoneItems,
    invoiceDate: effectiveParams.invoiceDate,
    invoiceRef: effectiveParams.invoiceRef,
    notes: effectiveParams.notes,
    subtotal: effectiveParams.subtotal,
    discountType: effectiveParams.discountType,
    discountValue: effectiveParams.discountValue,
    discountAmount: effectiveParams.discountAmount,
    netTotal: effectiveParams.netTotal,
  };

  const isUsingFallbackFirmSettings = !firmSettingsData;
  const isDraftInvoice = isViewMode && existingInvoice?.status === "draft";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {isUsingFallbackFirmSettings && (
        <div className="print:hidden bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              No firm settings configured. Using placeholder data. Please
              configure your firm settings for accurate invoices.
            </span>
          </div>
        </div>
      )}

      <PreviewActionBar
        projectName={project.name}
        isBusy={isBusy}
        isViewMode={isViewMode}
        invoiceNumber={isViewMode ? existingInvoice?.invoiceNumber : undefined}
        onClose={handleClose}
        onEdit={isDraftInvoice || !isViewMode ? handleEdit : undefined}
        onPrint={() => window.print()}
        onDownload={handleDownload}
        onFinalize={!isViewMode ? handleFinalize : undefined}
      />

      {/* Preview Container */}
      <div className="container mx-auto px-4 py-8 print:p-0 print:m-0">
        <div
          ref={printRef}
          className="max-w-4xl mx-auto shadow-xl print:shadow-none print:max-w-none"
        >
          <InvoicePreview data={previewData} />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-preview,
          .invoice-preview * {
            visibility: visible;
          }
          .invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 0;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
