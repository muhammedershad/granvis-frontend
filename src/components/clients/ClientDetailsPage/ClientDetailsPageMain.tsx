"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Download,
  Edit,
  Home,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/types/client";
import {
  useDeleteClientMutation,
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from "@/lib/api/clientsApi";
import { useGetProjectsByClientQuery } from "@/lib/api/projectsApi";
import { toast } from "sonner";
import { getStatusColor, mockPaymentHistory } from "./utils";
import { SummaryCards } from "./SummaryCards";
import { OverviewTabContent } from "./OverviewTabContent";
import { ContactTabContent } from "./ContactTabContent";
import { ProjectsTabContent } from "./ProjectsTabContent";
import { PaymentsTabContent } from "./PaymentsTabContent";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { DocumentsTabContent } from "./DocumentsTabContent";

interface ClientDetailsPageProps {
  clientId: string;
  onBack?: () => void;
}

export function ClientDetailsPage({
  clientId,
  onBack,
}: ClientDetailsPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  const {
    data: client,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useGetClientByIdQuery(clientId);

  const { data: projects = [] } = useGetProjectsByClientQuery(clientId);

  const [updateClient, { isLoading: isSaving }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const paymentStats = useMemo(() => {
    const totalPaid = mockPaymentHistory
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPending = mockPaymentHistory
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPayments = mockPaymentHistory.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return {
      totalPaid,
      totalPending,
      totalPayments,
      paymentCount: mockPaymentHistory.length,
    };
  }, []);

  const avgSatisfaction = useMemo(() => {
    if (projects.length === 0) {
      return "0.0";
    }
    const completedProjects = projects.filter(
      (p) => p.status === "Completed" && p.progressPercentage != null
    );
    if (completedProjects.length === 0) {
      return "N/A";
    }
    const avgProgress =
      completedProjects.reduce(
        (sum, p) => sum + (p.progressPercentage ?? 0),
        0
      ) / completedProjects.length;
    return (avgProgress / 20).toFixed(1); // Scale 0-100 to 0-5
  }, [projects]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedClient(null);
    } else if (client) {
      setEditedClient({ ...client });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (editedClient) {
      try {
        await updateClient({ id: clientId, data: editedClient }).unwrap();
        toast.success("Client updated successfully");
        setIsEditing(false);
        setEditedClient(null);
      } catch {
        toast.error("Failed to update client");
      }
    }
  };

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Are you sure you want to archive this client?")) {
      return;
    }
    try {
      await deleteClient(clientId).unwrap();
      toast.success("Client archived successfully");
      router.back();
    } catch {
      toast.error("Failed to archive client");
    }
  };

  const handleInputChange = (
    field: string,
    value: Client["address"] | string
  ) => {
    if (editedClient) {
      setEditedClient({
        ...editedClient,
        [field]: value,
      });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (isClientLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isClientError || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <X className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-semibold text-foreground">
          Client Not Found
        </h3>
        <p className="text-muted-foreground">
          The requested client could not be loaded.
        </p>
        <Button variant="outline" onClick={handleBack}>
          Go Back
        </Button>
      </div>
    );
  }

  const currentClient = editedClient || client;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-background/50 border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-medium">Clients</span>
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">
          {currentClient.name}
        </span>
      </div>

      {/* Client Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
            <AvatarImage src={currentClient.avatar} alt={currentClient.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-lg">
              {currentClient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-foreground flex items-center gap-2">
              {currentClient.name}
              <Badge className={getStatusColor(currentClient.status)}>
                {currentClient.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {currentClient.companyName} • {currentClient.companyType} Client
            </p>
            <p className="text-sm text-muted-foreground">
              Client since{" "}
              {new Date(currentClient.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-background/50 hover:bg-muted/50"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Client Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Archive Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleEditToggle}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEditToggle}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          )}
        </div>
      </div>

      <SummaryCards
        client={currentClient}
        paymentStats={paymentStats}
        avgSatisfaction={avgSatisfaction}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full bg-muted/30 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-background"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-background"
          >
            Contact
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-background"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-background"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="communications"
            className="data-[state=active]:bg-background"
          >
            Communications
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-background"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent
            client={currentClient}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <ContactTabContent
            client={currentClient}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectsTabContent projects={projects} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentsTabContent />
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <CommunicationsTabContent />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
