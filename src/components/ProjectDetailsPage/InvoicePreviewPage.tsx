"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Download,
  Edit,
  CheckCircle,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { InvoicePreview, InvoicePreviewData } from "./InvoicePreview";
import { useGetProjectByIdQuery } from "@/lib/api/projectsApi";
import { useGetMilestonesByProjectQuery } from "@/lib/api/milestonesApi";
import { useGetDefaultFirmSettingsQuery } from "@/lib/api/firmSettingsApi";
import { useGetClientByIdQuery } from "@/lib/api/clientsApi";
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

export function InvoicePreviewPage({
  projectId,
  basePath,
}: InvoicePreviewPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get selected milestone IDs from URL params
  const selectedMilestoneIds = searchParams.get("milestones")?.split(",") || [];
  const invoiceDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const notesParam = searchParams.get("notes");
  const notes = notesParam ? notesParam.split("|") : undefined;

  // Fetch project details
  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
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

  // Fetch firm settings
  const {
    data: firmSettingsData,
    isLoading: isLoadingFirmSettings,
  } = useGetDefaultFirmSettingsQuery();

  // Use fetched firm settings or fallback
  const firmSettings = firmSettingsData || defaultFirmSettingsFallback;

  // Fetch client details
  const {
    data: client,
    isLoading: isLoadingClient,
  } = useGetClientByIdQuery(project?.clientId || "", {
    skip: !project?.clientId,
  });

  // Filter milestones based on selection
  const selectedMilestones = selectedMilestoneIds.length > 0
    ? milestonesData.filter(m => selectedMilestoneIds.includes(m.id))
    : milestonesData;

  const isLoading = isLoadingProject || isLoadingMilestones || isLoadingFirmSettings || (project?.clientId ? isLoadingClient : false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call the backend PDF generation endpoint
      // For now, we'll use browser print as PDF
      toast.info("Use your browser's 'Save as PDF' option in the print dialog");
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    // Go back to edit mode
    router.push(`${basePath}/${projectId}/invoices/new`);
  };

  const handleFinalize = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to finalize invoice
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Invoice finalized successfully");
      router.push(`${basePath}/${projectId}?tab=invoices`);
    } catch {
      toast.error("Failed to finalize invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    router.push(`${basePath}/${projectId}?tab=invoices`);
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
          {projectError ? "Failed to load project details. Please try again." : "Project not found."}
        </p>
        <Button variant="outline" onClick={handleClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (selectedMilestones.length === 0) {
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
    milestones: selectedMilestones,
    invoiceDate,
    notes,
  };

  const isUsingFallbackFirmSettings = !firmSettingsData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Warning Banner for Missing Firm Settings */}
      {isUsingFallbackFirmSettings && (
        <div className="print:hidden bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              No firm settings configured. Using placeholder data. Please configure your firm settings for accurate invoices.
            </span>
          </div>
        </div>
      )}

      {/* Action Bar - Hidden on Print */}
      <div className="print:hidden sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Invoice Preview</h1>
              <p className="text-sm text-muted-foreground">{project.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              disabled={isGenerating}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isGenerating}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Finalize Invoice
            </Button>
          </div>
        </div>
      </div>

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
