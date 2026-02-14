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
  InvoiceMilestoneItem,
  useCreateInvoiceMutation,
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

function PreviewActionBar({
  projectName,
  isBusy,
  onClose,
  onEdit,
  onPrint,
  onDownload,
  onFinalize,
}: {
  projectName: string;
  isBusy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onFinalize: () => void;
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
            <h1 className="text-lg font-semibold">Invoice Preview</h1>
            <p className="text-sm text-muted-foreground">{projectName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onEdit} disabled={isBusy}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
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
  const searchParams = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  const params = parseSearchParams(searchParams);

  // Fetch project details
  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  // Fetch firm settings
  const { data: selectedFirmData, isLoading: isLoadingSelectedFirm } =
    useGetFirmSettingsByIdQuery(params.firmSettingsId, {
      skip: !params.firmSettingsId,
    });

  const { data: defaultFirmData, isLoading: isLoadingDefaultFirm } =
    useGetDefaultFirmSettingsQuery(undefined, {
      skip: !!params.firmSettingsId,
    });

  const isLoadingFirmSettings = params.firmSettingsId
    ? isLoadingSelectedFirm
    : isLoadingDefaultFirm;
  const firmSettingsData = selectedFirmData || defaultFirmData;
  const firmSettings = firmSettingsData || defaultFirmSettingsFallback;

  // Fetch client details
  const { data: client, isLoading: isLoadingClient } = useGetClientByIdQuery(
    project?.clientId || "",
    {
      skip: !project?.clientId,
    }
  );

  const isLoading =
    isLoadingProject ||
    isLoadingFirmSettings ||
    (project?.clientId ? isLoadingClient : false);
  const isBusy = isGenerating || isCreating;

  const handleEdit = () => {
    router.push(`${basePath}/${projectId}/invoices/new`);
  };

  const handleClose = () => {
    router.push(`${basePath}/${projectId}?tab=invoices`);
  };

  const handleFinalize = async () => {
    if (params.milestoneItems.length === 0) {
      toast.error("No milestone items found");
      return;
    }

    setIsGenerating(true);
    try {
      const invoiceData = buildInvoiceData({
        projectId,
        project: project || {},
        params,
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

  if (params.milestoneItems.length === 0) {
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
    milestoneItems: params.milestoneItems,
    invoiceDate: params.invoiceDate,
    invoiceRef: params.invoiceRef,
    notes: params.notes,
    subtotal: params.subtotal,
    discountType: params.discountType,
    discountValue: params.discountValue,
    discountAmount: params.discountAmount,
    netTotal: params.netTotal,
  };

  const isUsingFallbackFirmSettings = !firmSettingsData;

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
        onClose={handleClose}
        onEdit={handleEdit}
        onPrint={() => window.print()}
        onDownload={() => {
          toast.info(
            "Use your browser's 'Save as PDF' option in the print dialog"
          );
          window.print();
        }}
        onFinalize={handleFinalize}
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
