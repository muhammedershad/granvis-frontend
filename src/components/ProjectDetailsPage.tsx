import { useState } from "react";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Edit,
  Plus,
  MoreHorizontal,
  FileText,
  CreditCard,
  TrendingUp,
  Activity,
  Target,
  ChevronRight,
  Eye,
  Download
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface ProjectDetailsPageProps {
  projectId: string;
  onBack: () => void;
}

// Timeline item interface
interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  assignedTo: string;
  assignedBy: string;
  startDate: string;
  endDate?: string;
  completedDate?: string;
  category: 'design' | 'construction' | 'approval' | 'meeting' | 'review' | 'delivery';
  attachments?: string[];
  comments?: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
  }>;
}

// Schedule item interface
interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'meeting' | 'task' | 'milestone' | 'review' | 'deadline';
  attendees?: string[];
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

// Payment interface
interface Payment {
  id: string;
  amount: number;
  type: 'advance' | 'milestone' | 'final' | 'additional';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  description: string;
  invoiceNumber?: string;
  paymentMethod?: string;
}

// Mock data - in a real app, this would come from your API
const mockProject = {
  id: "1",
  name: "Modern Villa Residence",
  description: "Luxury 4-bedroom villa with contemporary design and sustainable features including solar panels, rainwater harvesting, and energy-efficient systems. The project focuses on creating a seamless indoor-outdoor living experience with open spaces, natural lighting, and premium finishes.",
  client: {
    id: "1",
    name: "John & Sarah Williams",
    email: "williams@email.com",
    phone: "+1 (555) 123-4567",
    company: "Williams Family Trust",
    address: "123 Hillcrest Drive, Beverly Hills, CA 90210"
  },
  type: "Villa",
  category: "Luxury Residential",
  status: "In Progress",
  priority: "High",
  startDate: "2024-01-15",
  endDate: "2024-08-30",
  deadline: "2024-09-15",
  progressPercentage: 65,
  currentPhase: "Interior Construction",
  projectManager: "John Doe",
  teamMembers: ["Sarah Johnson", "Michael Chen", "Amanda Lee"],
  location: {
    address: "123 Hillcrest Drive",
    city: "Beverly Hills",
    state: "CA",
    country: "USA"
  },
  budget: {
    total: 850000,
    spent: 420000,
    remaining: 430000
  },
  tags: ["Luxury", "Sustainable", "Contemporary"]
};

const mockTimeline: TimelineItem[] = [
  {
    id: "1",
    title: "Project Initiation & Site Survey",
    description: "Initial site visit, measurements, and feasibility study completed. Soil testing and utility mapping done.",
    status: "completed",
    assignedTo: "John Doe",
    assignedBy: "Emily Rodriguez",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    completedDate: "2024-01-21",
    category: "design",
    attachments: ["site-survey.pdf", "soil-report.pdf"],
    comments: [
      {
        id: "1",
        author: "John Doe",
        message: "Site survey completed successfully. Found some drainage issues that need addressing.",
        timestamp: "2024-01-21T10:30:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Conceptual Design Development",
    description: "Creating initial design concepts, floor plans, and 3D visualizations based on client requirements.",
    status: "completed",
    assignedTo: "Sarah Johnson",
    assignedBy: "John Doe",
    startDate: "2024-01-23",
    endDate: "2024-02-15",
    completedDate: "2024-02-14",
    category: "design",
    attachments: ["concept-designs.pdf", "3d-renders.zip"],
    comments: [
      {
        id: "2",
        author: "Sarah Johnson",
        message: "Presented 3 concept options to client. They preferred option B with some modifications.",
        timestamp: "2024-02-14T14:20:00Z"
      }
    ]
  },
  {
    id: "3",
    title: "Building Permit Application",
    description: "Preparing and submitting building permit application to local authorities with detailed drawings.",
    status: "completed",
    assignedTo: "Michael Chen",
    assignedBy: "John Doe",
    startDate: "2024-02-16",
    endDate: "2024-03-01",
    completedDate: "2024-02-28",
    category: "approval",
    attachments: ["permit-application.pdf", "technical-drawings.dwg"]
  },
  {
    id: "4",
    title: "Foundation Excavation",
    description: "Site preparation and foundation excavation according to approved plans and specifications.",
    status: "completed",
    assignedTo: "Construction Team A",
    assignedBy: "John Doe",
    startDate: "2024-03-15",
    endDate: "2024-03-30",
    completedDate: "2024-03-29",
    category: "construction"
  },
  {
    id: "5",
    title: "Structural Framework",
    description: "Steel and concrete structural work including columns, beams, and floor slabs.",
    status: "completed",
    assignedTo: "Construction Team B",
    assignedBy: "John Doe",
    startDate: "2024-04-01",
    endDate: "2024-05-15",
    completedDate: "2024-05-14",
    category: "construction"
  },
  {
    id: "6",
    title: "Interior Construction Phase 1",
    description: "Electrical, plumbing, and HVAC rough-in work. Installation of interior walls and insulation.",
    status: "in-progress",
    assignedTo: "Construction Team C",
    assignedBy: "John Doe",
    startDate: "2024-05-16",
    endDate: "2024-07-15",
    category: "construction",
    comments: [
      {
        id: "3",
        author: "Construction Team C",
        message: "Electrical work 80% complete. HVAC installation starts next week.",
        timestamp: "2024-06-15T09:15:00Z"
      }
    ]
  },
  {
    id: "7",
    title: "Interior Finishes & Fixtures",
    description: "Installation of flooring, painting, kitchen cabinets, bathroom fixtures, and final finishes.",
    status: "pending",
    assignedTo: "Interior Team",
    assignedBy: "Sarah Johnson",
    startDate: "2024-07-16",
    endDate: "2024-08-30",
    category: "construction"
  },
  {
    id: "8",
    title: "Final Inspection & Handover",
    description: "Final quality inspection, client walkthrough, and project handover with documentation.",
    status: "pending",
    assignedTo: "John Doe",
    assignedBy: "Emily Rodriguez",
    startDate: "2024-09-01",
    endDate: "2024-09-15",
    category: "delivery"
  }
];

const mockSchedule: ScheduleItem[] = [
  {
    id: "1",
    title: "Client Progress Review Meeting",
    description: "Monthly progress review with clients to discuss current status and upcoming phases",
    startDate: "2024-07-15T10:00:00Z",
    endDate: "2024-07-15T11:30:00Z",
    type: "meeting",
    attendees: ["John Doe", "Sarah Johnson", "John Williams", "Sarah Williams"],
    location: "Project Site Office",
    status: "scheduled"
  },
  {
    id: "2",
    title: "Electrical System Final Inspection",
    description: "Final inspection of electrical installations by certified inspector",
    startDate: "2024-07-20T14:00:00Z",
    endDate: "2024-07-20T16:00:00Z",
    type: "review",
    attendees: ["Michael Chen", "Electrical Inspector"],
    location: "Project Site",
    status: "scheduled"
  },
  {
    id: "3",
    title: "Interior Design Milestone",
    description: "Complete interior design selections and finalization",
    startDate: "2024-07-25T09:00:00Z",
    endDate: "2024-07-25T17:00:00Z",
    type: "milestone",
    attendees: ["Sarah Johnson", "Interior Designer"],
    status: "scheduled"
  }
];

const mockPayments: Payment[] = [
  {
    id: "1",
    amount: 170000,
    type: "advance",
    status: "paid",
    dueDate: "2024-01-20",
    paidDate: "2024-01-18",
    description: "Project advance payment (20%)",
    invoiceNumber: "INV-2024-001",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "2",
    amount: 255000,
    type: "milestone",
    status: "paid",
    dueDate: "2024-04-15",
    paidDate: "2024-04-12",
    description: "Foundation & Structure completion (30%)",
    invoiceNumber: "INV-2024-002",
    paymentMethod: "Check"
  },
  {
    id: "3",
    amount: 170000,
    type: "milestone",
    status: "pending",
    dueDate: "2024-07-30",
    description: "Interior construction phase completion (20%)",
    invoiceNumber: "INV-2024-003"
  },
  {
    id: "4",
    amount: 255000,
    type: "final",
    status: "pending",
    dueDate: "2024-09-15",
    description: "Final payment upon project completion (30%)",
    invoiceNumber: "INV-2024-004"
  }
];

export function ProjectDetailsPage({ projectId, onBack }: ProjectDetailsPageProps) {
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<TimelineItem | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "scheduled":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "design":
        return <FileText className="h-4 w-4" />;
      case "construction":
        return <Building2 className="h-4 w-4" />;
      case "approval":
        return <CheckCircle className="h-4 w-4" />;
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "review":
        return <Eye className="h-4 w-4" />;
      case "delivery":
        return <Target className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "in-progress":
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-muted/50">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-foreground">{mockProject.name}</h1>
            <p className="text-muted-foreground">Project Details & Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-background/50 hover:bg-muted/50">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-xl text-foreground">{mockProject.progressPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget Spent</p>
                <p className="text-xl text-foreground">{formatCurrency(mockProject.budget.spent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Left</p>
                <p className="text-xl text-foreground">
                  {Math.ceil((new Date(mockProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-xl text-foreground">{mockProject.teamMembers.length + 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full bg-muted/30 p-1 rounded-xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-background">Timeline</TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-background">Schedule</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-background">Payments</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-background">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Information */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-foreground">Project Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <p className="text-foreground mt-1">{mockProject.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Type</label>
                      <p className="text-foreground mt-1">{mockProject.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Category</label>
                      <p className="text-foreground mt-1">{mockProject.category}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(mockProject.status.toLowerCase().replace(' ', '-'))}>
                          {mockProject.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Priority</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(mockProject.priority.toLowerCase())}>
                          {mockProject.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Current Phase</label>
                    <p className="text-foreground mt-1">{mockProject.currentPhase}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Progress</label>
                    <div className="mt-2">
                      <Progress value={mockProject.progressPercentage} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">{mockProject.progressPercentage}% Complete</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mockProject.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-foreground">Client Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-border/50">
                    <AvatarImage src={`https://avatar.vercel.sh/${mockProject.client.name}`} alt={mockProject.client.name} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                      {mockProject.client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-foreground">{mockProject.client.name}</h3>
                    <p className="text-sm text-muted-foreground">{mockProject.client.company}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{mockProject.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{mockProject.client.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-foreground">{mockProject.client.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team & Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Team */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-foreground">Project Team</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${mockProject.projectManager}`} alt={mockProject.projectManager} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 text-xs">
                        {mockProject.projectManager.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-foreground text-sm">{mockProject.projectManager}</p>
                      <p className="text-xs text-muted-foreground">Project Manager</p>
                    </div>
                  </div>
                  {mockProject.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${member}`} alt={member} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 text-xs">
                          {member.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">{member}</p>
                        <p className="text-xs text-muted-foreground">Team Member</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Location & Timeline */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-foreground">Location & Dates</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Project Location</label>
                  <p className="text-foreground mt-1">
                    {mockProject.location.address}, {mockProject.location.city}, {mockProject.location.state} {mockProject.location.country}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Start Date</label>
                    <p className="text-foreground mt-1">{formatDate(mockProject.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">End Date</label>
                    <p className="text-foreground mt-1">{formatDate(mockProject.endDate)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Deadline</label>
                  <p className="text-foreground mt-1">{formatDate(mockProject.deadline)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-foreground">Project Timeline</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="bg-background/50 hover:bg-muted/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-6">
                {mockTimeline.map((item, index) => (
                  <div key={item.id} className="relative">
                    {index !== mockTimeline.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-px bg-border"></div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted/30 border-2 border-border">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedTimelineItem(item)}
                      >
                        <Card className="hover:shadow-md transition-shadow border-border/50 hover:border-border bg-card/30 hover:bg-card/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-foreground">{item.title}</h4>
                                  <Badge className={`${getStatusColor(item.status)} text-xs`}>
                                    {item.status.replace('-', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{item.assignedTo}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(item.startDate)}</span>
                                    {item.endDate && <span> - {formatDate(item.endDate)}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-foreground">Upcoming Schedule</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="bg-background/50 hover:bg-muted/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Event
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                {mockSchedule.map((item) => (
                  <Card key={item.id} className="border-border/50 bg-card/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 bg-purple-500/10 rounded border border-purple-500/20">
                              {getCategoryIcon(item.type)}
                            </div>
                            <h4 className="text-foreground">{item.title}</h4>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDateTime(item.startDate)}</span>
                            </div>
                            {item.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            {item.attendees && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{item.attendees.length} attendees</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Event</DropdownMenuItem>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Summary Cards */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
              <CardContent className="relative p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-xl text-foreground">
                      {formatCurrency(mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] to-orange-500/[0.02] dark:from-yellow-400/[0.05] dark:to-orange-400/[0.05]"></div>
              <CardContent className="relative p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl text-foreground">
                      {formatCurrency(mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
              <CardContent className="relative p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl text-foreground">{formatCurrency(mockProject.budget.total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-foreground">Payment Schedule</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="bg-background/50 hover:bg-muted/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-foreground">
                        {payment.invoiceNumber || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/30">
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {formatDate(payment.dueDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                            {payment.status === 'pending' && (
                              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-foreground">Project Documents</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="bg-background/50 hover:bg-muted/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-foreground mb-2">No Documents Yet</h3>
                <p className="text-muted-foreground mb-4">Upload project documents, drawings, and files to get started.</p>
                <Button variant="outline" className="bg-background/50 hover:bg-muted/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Timeline Item Details Modal */}
      <Dialog open={!!selectedTimelineItem} onOpenChange={() => setSelectedTimelineItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-card/95 border-border/50">
          {selectedTimelineItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(selectedTimelineItem.category)}
                  <DialogTitle className="text-foreground">{selectedTimelineItem.title}</DialogTitle>
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Description</h4>
                  <p className="text-foreground">{selectedTimelineItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Status</h4>
                    <Badge className={getStatusColor(selectedTimelineItem.status)}>
                      {selectedTimelineItem.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Category</h4>
                    <Badge variant="outline" className="bg-muted/30">
                      {selectedTimelineItem.category}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Assigned To</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedTimelineItem.assignedTo}`} />
                        <AvatarFallback className="text-xs">
                          {selectedTimelineItem.assignedTo.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground text-sm">{selectedTimelineItem.assignedTo}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Assigned By</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedTimelineItem.assignedBy}`} />
                        <AvatarFallback className="text-xs">
                          {selectedTimelineItem.assignedBy.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground text-sm">{selectedTimelineItem.assignedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Start Date</h4>
                    <p className="text-foreground">{formatDate(selectedTimelineItem.startDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">
                      {selectedTimelineItem.status === 'completed' ? 'Completed Date' : 'End Date'}
                    </h4>
                    <p className="text-foreground">
                      {selectedTimelineItem.completedDate 
                        ? formatDate(selectedTimelineItem.completedDate)
                        : selectedTimelineItem.endDate 
                        ? formatDate(selectedTimelineItem.endDate)
                        : 'Not set'
                      }
                    </p>
                  </div>
                </div>

                {selectedTimelineItem.attachments && selectedTimelineItem.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-3">Attachments</h4>
                    <div className="space-y-2">
                      {selectedTimelineItem.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded border">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground text-sm">{attachment}</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTimelineItem.comments && selectedTimelineItem.comments.length > 0 && (
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-3">Comments</h4>
                    <div className="space-y-3">
                      {selectedTimelineItem.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-muted/20 rounded border border-border/30">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://avatar.vercel.sh/${comment.author}`} />
                            <AvatarFallback className="text-xs">
                              {comment.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-foreground">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedTimelineItem(null)}>
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}