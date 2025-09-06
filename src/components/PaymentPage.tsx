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
  CreditCard,
  Eye,
  Phone,
  Mail,
  MapPin,
  Award,
  Briefcase,
  Coffee,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown
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
import { PaymentScheduleManager } from "./PaymentScheduleManager";
import { PaymentReports } from "./PaymentReports";
import { PaymentStatistics } from "./PaymentStatistics";

// Mock data
const recentPayments = [
  {
    id: "1",
    clientName: "Luxury Residential Complex",
    projectName: "Modern Villa Development",
    amount: 125000,
    dueDate: "2024-12-15",
    status: "paid",
    paymentDate: "2024-12-14",
    method: "Bank Transfer",
    invoiceNumber: "INV-2024-001"
  },
  {
    id: "2",
    clientName: "Commercial Office Tower",
    projectName: "Downtown Business Center",
    amount: 250000,
    dueDate: "2024-12-20",
    status: "pending",
    paymentDate: null,
    method: "Check",
    invoiceNumber: "INV-2024-002"
  },
  {
    id: "3",
    clientName: "Mixed-Use Development",
    projectName: "Urban Living Complex",
    amount: 180000,
    dueDate: "2024-12-10",
    status: "overdue",
    paymentDate: null,
    method: "Wire Transfer",
    invoiceNumber: "INV-2024-003"
  },
  {
    id: "4",
    clientName: "Sustainable Housing",
    projectName: "Green Community Project",
    amount: 95000,
    dueDate: "2024-12-25",
    status: "pending",
    paymentDate: null,
    method: "ACH Transfer",
    invoiceNumber: "INV-2024-004"
  },
  {
    id: "5",
    clientName: "Corporate Headquarters",
    projectName: "Tech Campus Expansion",
    amount: 320000,
    dueDate: "2024-12-18",
    status: "partial",
    paymentDate: "2024-12-17",
    method: "Bank Transfer",
    invoiceNumber: "INV-2024-005"
  }
];

const paymentTargets = [
  {
    id: "1",
    title: "Q4 2024 Revenue",
    target: 2500000,
    current: 2150000,
    deadline: "2024-12-31",
    category: "quarterly"
  },
  {
    id: "2",
    title: "December Collections",
    target: 850000,
    current: 650000,
    deadline: "2024-12-31",
    category: "monthly"
  },
  {
    id: "3",
    title: "Annual Goal 2024",
    target: 8500000,
    current: 7800000,
    deadline: "2024-12-31",
    category: "annual"
  },
  {
    id: "4",
    title: "Outstanding Receivables",
    target: 150000, // Target is to keep below this amount
    current: 185000,
    deadline: "2024-12-31",
    category: "receivables"
  }
];

const quickStats = {
  totalRevenue: 7800000,
  pendingPayments: 650000,
  overdueAmount: 185000,
  paidThisMonth: 920000,
  averagePaymentTime: 12,
  collectionRate: 94.5
};

export function PaymentPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showCreatePayment, setShowCreatePayment] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "partial": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle2 className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <XCircle className="w-4 h-4" />;
      case "partial": return <AlertCircle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTargetProgress = (target: any) => {
    if (target.category === "receivables") {
      // For receivables, we want current to be below target
      return Math.min(100, (target.current / target.target) * 100);
    }
    return (target.current / target.target) * 100;
  };

  const getTargetStatus = (target: any) => {
    const progress = getTargetProgress(target);
    if (target.category === "receivables") {
      return progress > 100 ? "warning" : "good";
    }
    return progress >= 90 ? "good" : progress >= 70 ? "warning" : "poor";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Payment Management</h1>
          <p className="text-muted-foreground">
            Track payments, manage schedules, and monitor financial performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreatePayment} onOpenChange={setShowCreatePayment}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
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
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury-residential">Luxury Residential Complex</SelectItem>
                        <SelectItem value="commercial-office">Commercial Office Tower</SelectItem>
                        <SelectItem value="mixed-use">Mixed-Use Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="villa-dev">Modern Villa Development</SelectItem>
                        <SelectItem value="business-center">Downtown Business Center</SelectItem>
                        <SelectItem value="urban-complex">Urban Living Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Payment description or notes" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreatePayment(false)}>
                    Cancel
                  </Button>
                  <Button>Create Payment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="schedules" className="text-xs sm:text-sm">Schedules</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs sm:text-sm">Statistics</TabsTrigger>
          <TabsTrigger value="targets" className="text-xs sm:text-sm">Targets</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl text-foreground">{formatCurrency(quickStats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-yellow-50/50 dark:from-gray-900/50 dark:to-yellow-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-yellow-500/5 dark:shadow-yellow-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                    <p className="text-2xl text-foreground">{formatCurrency(quickStats.pendingPayments)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="mt-4 flex items-center text-yellow-600 text-sm">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -8.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-red-50/50 dark:from-gray-900/50 dark:to-red-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-red-500/5 dark:shadow-red-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue Amount</p>
                    <p className="text-2xl text-foreground">{formatCurrency(quickStats.overdueAmount)}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="mt-4 flex items-center text-red-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +15.3% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                    <p className="text-2xl text-foreground">{quickStats.collectionRate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2.1% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Payments */}
            <div className="lg:col-span-2">
              <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Recent Payments</CardTitle>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPayments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25">
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <h4 className="text-foreground">{payment.clientName}</h4>
                            <p className="text-sm text-muted-foreground">{payment.invoiceNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground">{formatCurrency(payment.amount)}</p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Payment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Avg Payment Time</p>
                <p className="text-2xl text-foreground">{quickStats.averagePaymentTime} days</p>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-900/50 dark:to-cyan-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">This Month</p>
                <p className="text-2xl text-foreground">{formatCurrency(quickStats.paidThisMonth)}</p>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-orange-50/50 dark:from-gray-900/50 dark:to-orange-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-orange-500/5 dark:shadow-orange-500/10">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Active Clients</p>
                <p className="text-2xl text-foreground">24</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <PaymentScheduleManager />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <PaymentReports />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <PaymentStatistics />
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="space-y-6">
          {/* Target Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {paymentTargets.map((target) => {
              const progress = getTargetProgress(target);
              const status = getTargetStatus(target);
              
              return (
                <Card key={target.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground">{target.title}</h3>
                      <Badge 
                        className={
                          status === "good" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                          status === "warning" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                          "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current</span>
                        <span className="text-foreground">{formatCurrency(target.current)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target</span>
                        <span className="text-foreground">{formatCurrency(target.target)}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, progress)} 
                        className={`h-2 ${target.category === "receivables" && progress > 100 ? "bg-red-500/20" : ""}`}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: {target.deadline}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Create New Target */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Set New Target</CardTitle>
              <CardDescription>Create financial goals and track performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="targetTitle">Target Title</Label>
                  <Input id="targetTitle" placeholder="e.g., Q1 2025 Revenue" />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input id="targetAmount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="targetDeadline">Deadline</Label>
                  <Input id="targetDeadline" type="date" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
                  <Target className="w-4 h-4 mr-2" />
                  Create Target
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}