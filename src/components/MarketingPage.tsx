import { useState } from "react";
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  Clock, 
  DollarSign, 
  Filter, 
  Plus, 
  Search, 
  Star, 
  TrendingUp, 
  Users,
  Target,
  FileText,
  Heart,
  CreditCard,
  Eye,
  Phone,
  Mail,
  MapPin,
  Award,
  Briefcase,
  Coffee
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CampaignPlanner } from "./CampaignPlanner";
import { MarketingAnalytics } from "./MarketingAnalytics";

// Mock data
const marketingTeam = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "SJ",
    tasks: 12,
    completed: 8,
    efficiency: 85,
    specialties: ["Strategy", "Brand Management"]
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Digital Marketing Manager",
    avatar: "MC",
    tasks: 15,
    completed: 11,
    efficiency: 92,
    specialties: ["SEO", "Social Media"]
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Content Creator",
    avatar: "ER",
    tasks: 18,
    completed: 14,
    efficiency: 88,
    specialties: ["Content", "Video Production"]
  },
  {
    id: "4",
    name: "David Kim",
    role: "Marketing Analyst",
    avatar: "DK",
    tasks: 10,
    completed: 9,
    efficiency: 95,
    specialties: ["Analytics", "Market Research"]
  }
];

const tasks = [
  {
    id: "1",
    title: "Q1 Brand Campaign Strategy",
    description: "Develop comprehensive brand awareness campaign for new residential projects",
    assignee: "Sarah Johnson",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-12-15",
    category: "Strategy",
    progress: 65
  },
  {
    id: "2", 
    title: "Social Media Content Calendar",
    description: "Create December content calendar for all social platforms",
    assignee: "Emily Rodriguez",
    priority: "medium",
    status: "completed",
    dueDate: "2024-12-01",
    category: "Content",
    progress: 100
  },
  {
    id: "3",
    title: "Website SEO Optimization",
    description: "Optimize main website pages for better search rankings",
    assignee: "Mike Chen",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-12-20",
    category: "Digital",
    progress: 40
  },
  {
    id: "4",
    title: "Client Portfolio Video",
    description: "Produce showcase video for premium projects",
    assignee: "Emily Rodriguez",
    priority: "medium",
    status: "planning",
    dueDate: "2024-12-30",
    category: "Content",
    progress: 15
  }
];

const leads = [
  {
    id: "1",
    name: "Luxury Residential Complex",
    contact: "Robert Anderson",
    email: "r.anderson@luxurydev.com",
    phone: "+1 (555) 123-4567",
    value: 2500000,
    probability: 75,
    stage: "proposal",
    source: "Website",
    lastContact: "2024-12-02"
  },
  {
    id: "2",
    name: "Commercial Office Tower",
    contact: "Lisa Chen",
    email: "l.chen@corporatebuild.com", 
    phone: "+1 (555) 987-6543",
    value: 5200000,
    probability: 60,
    stage: "negotiation",
    source: "Referral",
    lastContact: "2024-12-01"
  },
  {
    id: "3",
    name: "Mixed-Use Development",
    contact: "James Wilson",
    email: "j.wilson@mixeddev.com",
    phone: "+1 (555) 456-7890", 
    value: 8900000,
    probability: 40,
    stage: "initial",
    source: "Cold Outreach",
    lastContact: "2024-11-28"
  }
];

const benefits = [
  {
    title: "Health Insurance",
    description: "Comprehensive medical, dental, and vision coverage",
    icon: Heart,
    coverage: 95,
    type: "health"
  },
  {
    title: "Retirement Plan",
    description: "401(k) with company matching up to 6%",
    icon: CreditCard,
    coverage: 85,
    type: "financial"
  },
  {
    title: "Professional Development",
    description: "Annual learning budget and conference attendance",
    icon: Award,
    coverage: 78,
    type: "development"
  },
  {
    title: "Flexible Work",
    description: "Hybrid work model with flexible hours",
    icon: Briefcase,
    coverage: 90,
    type: "lifestyle"
  },
  {
    title: "Wellness Program",
    description: "Gym membership and mental health support",
    icon: Coffee,
    coverage: 70,
    type: "wellness"
  }
];

const expenses = [
  {
    id: "1",
    description: "Google Ads Campaign - Q4",
    amount: 15000,
    category: "Advertising",
    date: "2024-12-01",
    status: "approved",
    approver: "Sarah Johnson"
  },
  {
    id: "2",
    description: "Content Creation Tools - Adobe Suite",
    amount: 599,
    category: "Software",
    date: "2024-11-30",
    status: "pending",
    approver: "-"
  },
  {
    id: "3", 
    description: "Trade Show Booth - ArchExpo 2024",
    amount: 8500,
    category: "Events",
    date: "2024-11-28",
    status: "approved",
    approver: "Sarah Johnson"
  },
  {
    id: "4",
    description: "Photography Equipment",
    amount: 3200,
    category: "Equipment",
    date: "2024-11-25",
    status: "rejected",
    approver: "Finance Team"
  }
];

export function MarketingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "planning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "on-hold": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "initial": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "qualified": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "proposal": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "negotiation": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "closed": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgProbability = leads.reduce((sum, lead) => sum + lead.probability, 0) / leads.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Marketing Management</h1>
          <p className="text-muted-foreground">
            Manage your marketing team, campaigns, leads, and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="team" className="text-xs sm:text-sm">Team</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs sm:text-sm">Campaigns</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
          <TabsTrigger value="leads" className="text-xs sm:text-sm">Leads</TabsTrigger>
          <TabsTrigger value="benefits" className="text-xs sm:text-sm">Benefits</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm">Expenses</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                    <p className="text-2xl text-foreground">12</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                    <p className="text-2xl text-foreground">248</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +23% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl text-foreground">12.5%</p>
                  </div>
                  <Star className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-900/50 dark:to-cyan-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pipeline Value</p>
                    <p className="text-2xl text-foreground">${(totalLeadValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-cyan-500" />
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.5% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Add New Lead
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">New lead: Luxury Residential Complex</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Campaign "Brand Awareness" updated</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Task "SEO Optimization" completed</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <MarketingAnalytics />
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketingTeam.map((member) => (
              <Card key={member.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <span className="text-white font-medium">{member.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasks</span>
                      <span className="text-foreground">{member.completed}/{member.tasks}</span>
                    </div>
                    <Progress value={(member.completed / member.tasks) * 100} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="text-foreground">{member.efficiency}%</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {member.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignPlanner />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search tasks..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assignee</span>
                      <span className="text-foreground">{task.assignee}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="text-foreground">{task.dueDate}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Priority</span>
                      <span className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          {/* Lead Pipeline Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Pipeline Value</p>
                <p className="text-2xl text-foreground">${(totalLeadValue / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>
            
            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Average Probability</p>
                <p className="text-2xl text-foreground">{avgProbability.toFixed(0)}%</p>
              </CardContent>
            </Card>
            
            <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Active Leads</p>
                <p className="text-2xl text-foreground">{leads.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Leads List */}
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2">{lead.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {lead.contact}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStageColor(lead.stage)}>
                      {lead.stage}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="text-foreground">${(lead.value / 1000000).toFixed(2)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Probability</p>
                      <p className="text-foreground">{lead.probability}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="text-foreground">{lead.source}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Contact</p>
                      <p className="text-foreground">{lead.lastContact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-foreground">{benefit.title}</h3>
                      <p className="text-xs text-muted-foreground">{benefit.type}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{benefit.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="text-foreground">{benefit.coverage}%</span>
                    </div>
                    <Progress value={benefit.coverage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          {/* Expense Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
                <p className="text-2xl text-foreground">
                  ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Approved</p>
                <p className="text-2xl text-foreground">
                  ${expenses.filter(e => e.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative bg-gradient-to-br from-white/50 to-yellow-50/50 dark:from-gray-900/50 dark:to-yellow-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-yellow-500/5 dark:shadow-yellow-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Pending</p>
                <p className="text-2xl text-foreground">
                  ${expenses.filter(e => e.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative bg-gradient-to-br from-white/50 to-red-50/50 dark:from-gray-900/50 dark:to-red-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-red-500/5 dark:shadow-red-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Rejected</p>
                <p className="text-2xl text-foreground">
                  ${expenses.filter(e => e.status === 'rejected').reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Add New Expense Button */}
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Submit a new expense for approval
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter expense description" />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advertising">Advertising</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Additional notes (optional)" />
                  </div>
                  <Button className="w-full">Submit Expense</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Expenses List */}
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2">{expense.description}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {expense.category}</span>
                        <span>Date: {expense.date}</span>
                        <span>Approver: {expense.approver}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-foreground">${expense.amount.toLocaleString()}</p>
                      <Badge 
                        className={
                          expense.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          expense.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}