import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { InvoiceListTable } from "./InvoiceListTable";
import {
  Invoice,
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
  useGenerateInvoicePdfMutation,
  useGetInvoicesByProjectQuery,
  useMarkInvoiceAsSentMutation,
} from "@/lib/api/invoicesApi";
import type { Project } from "@/types/project";
import { toast } from "sonner";

interface InvoicesTabProps {
  project: Project;
  basePath: string;
}

export function InvoicesTab({ project, basePath }: InvoicesTabProps) {
  const router = useRouter();

  // Fetch invoices from API
  const {
    data: invoices = [],
    isLoading,
    isError,
  } = useGetInvoicesByProjectQuery(project.id);

  // Mutations
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [markAsSent] = useMarkInvoiceAsSentMutation();
  const [cancelInvoice] = useCancelInvoiceMutation();
  const [generatePdf] = useGenerateInvoicePdfMutation();
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<
    string | null
  >(null);

  const handleCreateInvoice = () => {
    router.push(`${basePath}/${project.id}/invoices/new`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    router.push(
      `${basePath}/${project.id}/invoices/preview?invoiceId=${invoice.id}`
    );
  };

  const handleEditInvoice = (invoice: Invoice) => {
    router.push(`${basePath}/${project.id}/invoices/new?edit=${invoice.id}`);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoice({ id: invoiceId, projectId: project.id }).unwrap();
      toast.success("Invoice deleted successfully");
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  const handleMarkAsSent = async (invoice: Invoice) => {
    try {
      await markAsSent(invoice.id).unwrap();
      toast.success("Invoice marked as sent");
    } catch {
      toast.error("Failed to mark invoice as sent");
    }
  };

  const handleCancelInvoice = async (invoice: Invoice) => {
    try {
      await cancelInvoice(invoice.id).unwrap();
      toast.success("Invoice cancelled");
    } catch {
      toast.error("Failed to cancel invoice");
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setDownloadingInvoiceId(invoice.id);
    try {
      const result = await generatePdf(invoice.id).unwrap();
      const byteCharacters = atob(result.pdfBase64);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Invoices</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage project invoices with milestone tracking
          </p>
        </div>
        <Button
          onClick={handleCreateInvoice}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Invoice
        </Button>
      </div>

      {/* Invoices Table */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-foreground">Invoice List</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading invoices...
              </span>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-500">
                Failed to load invoices. Please try again.
              </p>
            </div>
          ) : (
            <InvoiceListTable
              invoices={invoices}
              onView={handleViewInvoice}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onDownload={handleDownloadInvoice}
              downloadingInvoiceId={downloadingInvoiceId}
              onMarkAsSent={handleMarkAsSent}
              onCancel={handleCancelInvoice}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
