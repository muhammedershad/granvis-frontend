"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  FileText,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Save,
  Settings,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/types/client";

// Mock comprehensive client data
const mockClientData: Client[] = [
  {
    id: "1",
    name: "Williams Family",
    firstName: "John",
    lastName: "Williams",
    fullName: "John Williams",
    email: "john.williams@email.com",
    phone: "+1 (555) 234-5678",
    companyName: "Williams Enterprises",
    companyType: "Small Business",
    status: "Active" as const,
    avatar: "",
    address: {
      street: "456 Luxury Lane",
      city: "Beverly Hills",
      state: "California",
      zipCode: "90210",
      country: "United States",
    },
    website: "https://williamsenterprises.com",
    industry: "Technology",
    source: "Website",
    priority: "VIP",
    totalProjectValue: 850000,
    projectsCount: 3,
    activeProjects: 1,
    completedProjects: 2,
    primaryContact: {
      name: "John Williams",
      title: "CEO",
      email: "john.williams@email.com",
      phone: "+1 (555) 234-5678",
    },
    secondaryContact: {
      name: "Sarah Williams",
      title: "COO",
      email: "sarah.williams@email.com",
      phone: "+1 (555) 234-5679",
    },
    tags: ["VIP", "Technology", "Repeat Client", "High Value"],
    notes:
      "Long-term client with multiple successful projects. Prefers modern, sustainable designs with smart home integration.",
    projectIds: ["1", "2", "3"],
    createdAt: "2023-08-15T00:00:00Z",
    updatedAt: "2024-07-01T00:00:00Z",
    createdBy: "Michael Chen",
    lastContactDate: "2024-07-08T14:30:00Z",
  },
];

interface ClientDetailsPageProps {
  clientId: string;
  onBack?: () => void;
}

interface ProjectHistory {
  id: string;
  name: string;
  type: string;
  status: "completed" | "active" | "on-hold" | "cancelled";
  startDate: string;
  endDate?: string;
  budget: number;
  actualCost: number;
  satisfaction: number;
}

interface PaymentHistory {
  id: string;
  projectName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue" | "partial";
  method: string;
}

interface Communication {
  id: string;
  type: "email" | "call" | "meeting" | "proposal";
  subject: string;
  date: string;
  status: "completed" | "scheduled" | "cancelled";
  notes: string;
}

const mockProjectHistory: ProjectHistory[] = [
  {
    id: "1",
    name: "Modern Villa Residence",
    type: "Residential",
    status: "active",
    startDate: "2024-03-01",
    budget: 425000,
    actualCost: 285000,
    satisfaction: 4.9,
  },
  {
    id: "2",
    name: "Home Office Extension",
    type: "Residential",
    status: "completed",
    startDate: "2023-10-15",
    endDate: "2024-01-20",
    budget: 185000,
    actualCost: 178000,
    satisfaction: 4.7,
  },
  {
    id: "3",
    name: "Garden Pavilion",
    type: "Landscape",
    status: "completed",
    startDate: "2023-08-20",
    endDate: "2023-11-30",
    budget: 240000,
    actualCost: 235000,
    satisfaction: 4.8,
  },
];

const mockPaymentHistory: PaymentHistory[] = [
  {
    id: "1",
    projectName: "Modern Villa Residence",
    amount: 85000,
    dueDate: "2024-07-15",
    status: "pending",
    method: "Bank Transfer",
  },
  {
    id: "2",
    projectName: "Modern Villa Residence",
    amount: 127500,
    dueDate: "2024-06-01",
    paidDate: "2024-06-01",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "3",
    projectName: "Home Office Extension",
    amount: 178000,
    dueDate: "2024-01-20",
    paidDate: "2024-01-18",
    status: "paid",
    method: "Check",
  },
];

const mockCommunications: Communication[] = [
  {
    id: "1",
    type: "meeting",
    subject: "Project Progress Review",
    date: "2024-07-15T10:00:00Z",
    status: "scheduled",
    notes: "Monthly progress review for Modern Villa Residence project",
  },
  {
    id: "2",
    type: "email",
    subject: "Design Revision Approval",
    date: "2024-07-08T14:30:00Z",
    status: "completed",
    notes: "Client approved the revised kitchen design plans",
  },
  {
    id: "3",
    type: "call",
    subject: "Budget Discussion",
    date: "2024-07-01T16:00:00Z",
    status: "completed",
    notes: "Discussed additional budget allocation for premium finishes",
  },
];

// eslint-disable-next-line max-lines-per-function
export function ClientDetailsPage({
  clientId,
  onBack,
}: ClientDetailsPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  const client = useMemo(() => {
    return mockClientData.find((c) => c.id === clientId) || mockClientData[0];
  }, [clientId]);

  // Calculate payment statistics
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

  // Calculate average satisfaction
  const avgSatisfaction = useMemo(() => {
    const total = mockProjectHistory.reduce(
      (sum, p) => sum + p.satisfaction,
      0
    );
    return (total / mockProjectHistory.length).toFixed(1);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedClient(null);
    } else {
      setEditedClient({ ...client });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (editedClient) {
      console.warn("Saving client:", editedClient);
      setIsEditing(false);
      setEditedClient(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
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

  const currentClient = editedClient || client;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "On Hold":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "Potential Lead":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "on-hold":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "partial":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "proposal":
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

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
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Archive Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {currentClient.activeProjects} Active
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {currentClient.projectsCount}
              </p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>{currentClient.completedProjects} Completed</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Payment Value Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200/50 dark:border-emerald-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                {paymentStats.paymentCount} Payments
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                ${paymentStats.totalPayments.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Payment Value
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>${paymentStats.totalPaid.toLocaleString()} Paid</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-12 -mt-12" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                Pending
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                ${paymentStats.totalPending.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-amber-500" />
              <span>
                {(
                  (paymentStats.totalPending / paymentStats.totalPayments) *
                  100
                ).toFixed(0)}
                % of Total
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Client Satisfaction Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              >
                Excellent
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {avgSatisfaction}/5.0
              </p>
              <p className="text-sm text-muted-foreground">Avg. Satisfaction</p>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= parseFloat(avgSatisfaction)
                      ? "text-amber-500 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
                <CardHeader className="relative pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Client Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Projects
                    </span>
                    <span className="font-medium">
                      {currentClient.projectsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active Projects
                    </span>
                    <span className="font-medium">
                      {currentClient.activeProjects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Completed Projects
                    </span>
                    <span className="font-medium">
                      {currentClient.completedProjects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Value
                    </span>
                    <span className="font-medium">
                      ${currentClient.totalProjectValue?.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
                <CardHeader className="relative pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Client Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex flex-wrap gap-2">
                    {currentClient.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Company Name
                      </Label>
                      <p className="text-foreground">
                        {currentClient.companyName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Company Type
                      </Label>
                      <p className="text-foreground">
                        {currentClient.companyType}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Industry
                      </Label>
                      <p className="text-foreground">
                        {currentClient.industry}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Priority
                      </Label>
                      <Badge variant="secondary">
                        {currentClient.priority}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Website
                      </Label>
                      <p className="text-foreground">
                        {currentClient.website ? (
                          <a
                            href={currentClient.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentClient.website}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Source
                      </Label>
                      <p className="text-foreground">{currentClient.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-blue-500/[0.02] dark:from-cyan-400/[0.05] dark:to-blue-400/[0.05]"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    Notes & Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  {isEditing ? (
                    <Textarea
                      value={currentClient.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="bg-background/50"
                      rows={4}
                      placeholder="Add notes about client preferences, requirements, etc."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {currentClient.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p className="text-foreground">
                    {currentClient.primaryContact?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <p className="text-foreground">
                    {currentClient.primaryContact?.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-foreground">
                    {currentClient.primaryContact?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <p className="text-foreground">
                    {currentClient.primaryContact?.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Secondary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p className="text-foreground">
                    {currentClient.secondaryContact?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <p className="text-foreground">
                    {currentClient.secondaryContact?.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-foreground">
                    {currentClient.secondaryContact?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <p className="text-foreground">
                    {currentClient.secondaryContact?.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  {isEditing ? (
                    <Textarea
                      value={currentClient.address.street}
                      onChange={(e) =>
                        handleInputChange("address", {
                          ...currentClient.address,
                          street: e.target.value,
                        })
                      }
                      className="bg-background/50"
                      rows={2}
                    />
                  ) : (
                    <p className="text-foreground">
                      {currentClient.address.street}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <p className="text-foreground">
                      {currentClient.address.city}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <p className="text-foreground">
                      {currentClient.address.state}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ZIP Code</Label>
                    <p className="text-foreground">
                      {currentClient.address.zipCode}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <p className="text-foreground">
                      {currentClient.address.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-pink-500/[0.02] dark:from-purple-400/[0.05] dark:to-pink-400/[0.05]"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <Label>Source</Label>
                  <p className="text-foreground">{currentClient.source}</p>
                </div>
                <div className="space-y-2">
                  <Label>Last Contact Date</Label>
                  <p className="text-foreground">
                    {currentClient.lastContactDate
                      ? new Date(
                          currentClient.lastContactDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Created By</Label>
                  <p className="text-foreground">{currentClient.createdBy}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Project History
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actual Cost</TableHead>
                    <TableHead>Satisfaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProjectHistory.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>{project.type}</TableCell>
                      <TableCell>
                        <Badge
                          className={getProjectStatusColor(project.status)}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(project.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${project.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        ${project.actualCost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-current" />
                          <span className="text-sm">
                            {project.satisfaction}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.projectName}
                      </TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {payment.paidDate
                          ? new Date(payment.paidDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-blue-500/[0.02] dark:from-cyan-400/[0.05] dark:to-blue-400/[0.05]"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                Communication History
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              {mockCommunications.map((comm) => (
                <div
                  key={comm.id}
                  className="p-4 border border-border/50 rounded-lg bg-background/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        {getCommunicationIcon(comm.type)}
                      </div>
                      <div>
                        <h4 className="text-foreground">{comm.subject}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {comm.type} •{" "}
                          {new Date(comm.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        comm.status === "completed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }
                    >
                      {comm.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-11">
                    {comm.notes}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Documents & Files
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-foreground mb-2">No Documents Uploaded</h3>
                <p className="text-muted-foreground mb-4">
                  Upload contracts, proposals, and other client documents.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
