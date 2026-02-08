import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { InvoiceListTable } from "./InvoiceListTable";
import { InvoiceFormDialog } from "./InvoiceFormDialog";
import { Invoice, mockInvoices } from "./invoiceMockData";
import type { Project } from "@/types/project";

interface InvoicesTabProps {
  project: Project;
  basePath: string;
}

export function InvoicesTab({ project, basePath }: InvoicesTabProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleCreateInvoice = () => {
    // Navigate to create invoice page
    router.push(`${basePath}/${project.id}/invoices/new`);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    if (invoice.status === "draft") {
      // Navigate to edit invoice page
      router.push(`${basePath}/${project.id}/invoices/new?edit=${invoice.id}`);
    } else {
      // View non-draft invoices in dialog (read-only)
      setViewingInvoice(invoice);
      setShowViewDialog(true);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setShowViewDialog(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
  };

  // This is kept for viewing invoices (read-only)
  const handleCloseViewDialog = () => {
    setShowViewDialog(false);
    setViewingInvoice(null);
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
          <InvoiceListTable
            invoices={invoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onView={handleViewInvoice}
          />
        </CardContent>
      </Card>

      {/* View Invoice Dialog (Read-only) */}
      <InvoiceFormDialog
        open={showViewDialog}
        onOpenChange={handleCloseViewDialog}
        invoice={viewingInvoice}
        projectId={project.id}
        existingInvoices={invoices}
        onSave={() => {}} // No-op for view mode
      />
    </div>
  );
}
