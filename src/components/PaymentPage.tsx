"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  CreditCard,
  Download,
  FileText,
  Loader2,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PaymentScheduleManager } from "./PaymentScheduleManager";
import { PaymentReports } from "./PaymentReports";
import { PaymentStatistics } from "./PaymentStatistics";
import { InvoiceGenerationModal } from "./InvoiceGenerationModal";
import { useGetGlobalInvoiceSummaryQuery } from "@/lib/api/invoicesApi";
import { useGetClientsQuery } from "@/lib/api/clientsApi";
import { useGetAllProjectsQuery } from "@/lib/api/projectsApi";
import {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
} from "@/lib/api/paymentsApi";
import { getAuthDetails } from "@/store/slices/authSlice";
import { KpiStatsCards } from "./PaymentPage/KpiStatsCards";
import { SummaryCards } from "./PaymentPage/SummaryCards";
import { RecentPaymentsList } from "./PaymentPage/RecentPaymentsList";
import { TargetsTab } from "./PaymentPage/TargetsTab";

export function PaymentPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Create Payment form state
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");

  // Auth
  const { user } = useSelector(getAuthDetails);

  // Data fetching
  const {
    data: summary,
    isLoading: summaryLoading,
    error: _summaryError,
  } = useGetGlobalInvoiceSummaryQuery();

  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetPaymentsQuery({
    page: 1,
    limit: 10,
  });

  const { data: clientsData } = useGetClientsQuery({});
  const { data: projectsData } = useGetAllProjectsQuery();

  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();

  const recentPayments = paymentsData?.data ?? [];
  const clients = clientsData?.data ?? [];
  const projects = projectsData ?? [];

  const handleCreatePayment = async () => {
    if (!selectedClientId || !selectedProjectId || !paymentAmount) {
      return;
    }

    try {
      await createPayment({
        clientId: selectedClientId,
        projectId: selectedProjectId,
        amount: parseFloat(paymentAmount),
        invoiceDate: new Date().toISOString(),
        dueDate: paymentDueDate || undefined,
        description: paymentDescription || undefined,
        currency: "INR",
        createdBy: user?.email || "unknown",
        createdById: user?._id,
      }).unwrap();

      toast.success("Payment created successfully");

      // Reset form and close dialog
      setSelectedClientId("");
      setSelectedProjectId("");
      setPaymentAmount("");
      setPaymentDueDate("");
      setPaymentDescription("");
      setShowCreatePayment(false);
    } catch (_error) {
      toast.error("Failed to create payment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - follows Notification/Employee page pattern */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-foreground">Payment Management</h1>
            <p className="text-muted-foreground">
              Track payments, manage schedules, and monitor financial
              performance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-background/50 hover:bg-muted/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
          <Dialog open={showCreatePayment} onOpenChange={setShowCreatePayment}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Payment</DialogTitle>
                <DialogDescription>
                  Add a new payment record or invoice
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select
                      value={selectedClientId}
                      onValueChange={setSelectedClientId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                            {client.companyName
                              ? ` (${client.companyName})`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Select
                      value={selectedProjectId}
                      onValueChange={setSelectedProjectId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={paymentDueDate}
                      onChange={(e) => setPaymentDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Payment description or notes"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreatePayment(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePayment}
                    disabled={
                      isCreating ||
                      !selectedClientId ||
                      !selectedProjectId ||
                      !paymentAmount
                    }
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
                  >
                    {isCreating && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Create Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="schedules" className="text-xs sm:text-sm">
            Schedules
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">
            Reports
          </TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs sm:text-sm">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="targets" className="text-xs sm:text-sm">
            Targets
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-8 space-y-6">
          <KpiStatsCards summary={summary} isLoading={summaryLoading} />
          <SummaryCards summary={summary} isLoading={summaryLoading} />

          {/* Recent Payments & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentPaymentsList
                payments={recentPayments}
                isLoading={paymentsLoading}
                isError={!!paymentsError}
                onViewAll={() => setActiveTab("schedules")}
              />
            </div>

            {/* Quick Actions */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-blue-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative pb-3">
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300"
                  onClick={() => setShowInvoiceModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  Create Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300"
                  onClick={() => setShowCreatePayment(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Record Payment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300"
                  onClick={() => setActiveTab("schedules")}
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Payment Schedules
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300"
                  onClick={() => setActiveTab("reports")}
                >
                  <FileText className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300"
                  onClick={() => setActiveTab("statistics")}
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
                  View Statistics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="mt-8 space-y-6">
          <PaymentScheduleManager />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-8 space-y-6">
          <PaymentReports />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="mt-8 space-y-6">
          <PaymentStatistics />
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="mt-8 space-y-6">
          <TargetsTab />
        </TabsContent>
      </Tabs>

      {/* Invoice Generation Modal */}
      <InvoiceGenerationModal
        open={showInvoiceModal}
        onOpenChange={setShowInvoiceModal}
      />
    </div>
  );
}
