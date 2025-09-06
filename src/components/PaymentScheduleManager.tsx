import { useState } from "react";
import { Calendar, Clock, Plus, Search, Filter, Edit, Trash2, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";

interface PaymentSchedule {
  id: string;
  clientName: string;
  projectName: string;
  totalAmount: number;
  paidAmount: number;
  installments: Installment[];
  status: "active" | "completed" | "paused" | "overdue";
  startDate: string;
  endDate: string;
  frequency: "monthly" | "quarterly" | "milestone-based" | "custom";
}

interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "partial";
  paidAmount?: number;
  paidDate?: string;
  description: string;
}

const mockSchedules: PaymentSchedule[] = [
  {
    id: "1",
    clientName: "Luxury Residential Complex",
    projectName: "Modern Villa Development",
    totalAmount: 500000,
    paidAmount: 300000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    frequency: "monthly",
    status: "active",
    installments: [
      {
        id: "1-1",
        amount: 100000,
        dueDate: "2024-01-15",
        status: "paid",
        paidAmount: 100000,
        paidDate: "2024-01-14",
        description: "Initial payment - Design phase"
      },
      {
        id: "1-2",
        amount: 100000,
        dueDate: "2024-02-15",
        status: "paid",
        paidAmount: 100000,
        paidDate: "2024-02-12",
        description: "Phase 1 - Foundation work"
      },
      {
        id: "1-3",
        amount: 100000,
        dueDate: "2024-03-15",
        status: "paid",
        paidAmount: 100000,
        paidDate: "2024-03-18",
        description: "Phase 2 - Structural work"
      },
      {
        id: "1-4",
        amount: 100000,
        dueDate: "2024-12-15",
        status: "pending",
        description: "Phase 3 - Interior work"
      },
      {
        id: "1-5",
        amount: 100000,
        dueDate: "2024-12-31",
        status: "pending",
        description: "Final payment - Project completion"
      }
    ]
  },
  {
    id: "2",
    clientName: "Commercial Office Tower",
    projectName: "Downtown Business Center",
    totalAmount: 750000,
    paidAmount: 250000,
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    frequency: "quarterly",
    status: "active",
    installments: [
      {
        id: "2-1",
        amount: 250000,
        dueDate: "2024-06-15",
        status: "paid",
        paidAmount: 250000,
        paidDate: "2024-06-10",
        description: "Q1 Payment - Planning and permits"
      },
      {
        id: "2-2",
        amount: 250000,
        dueDate: "2024-09-15",
        status: "overdue",
        description: "Q2 Payment - Foundation and structure"
      },
      {
        id: "2-3",
        amount: 250000,
        dueDate: "2024-12-15",
        status: "pending",
        description: "Q3 Payment - Interior and systems"
      }
    ]
  },
  {
    id: "3",
    clientName: "Mixed-Use Development",
    projectName: "Urban Living Complex",
    totalAmount: 900000,
    paidAmount: 450000,
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    frequency: "milestone-based",
    status: "active",
    installments: [
      {
        id: "3-1",
        amount: 180000,
        dueDate: "2024-03-15",
        status: "paid",
        paidAmount: 180000,
        paidDate: "2024-03-12",
        description: "Milestone 1 - Site preparation"
      },
      {
        id: "3-2",
        amount: 270000,
        dueDate: "2024-06-15",
        status: "paid",
        paidAmount: 270000,
        paidDate: "2024-06-20",
        description: "Milestone 2 - Foundation complete"
      },
      {
        id: "3-3",
        amount: 270000,
        dueDate: "2024-12-15",
        status: "pending",
        description: "Milestone 3 - Structure complete"
      },
      {
        id: "3-4",
        amount: 180000,
        dueDate: "2025-02-28",
        status: "pending",
        description: "Milestone 4 - Project completion"
      }
    ]
  }
];

export function PaymentScheduleManager() {
  const [schedules, setSchedules] = useState<PaymentSchedule[]>(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<PaymentSchedule | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "partial": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "active": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "paused": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScheduleProgress = (schedule: PaymentSchedule) => {
    return (schedule.paidAmount / schedule.totalAmount) * 100;
  };

  const getUpcomingInstallments = () => {
    const upcoming: { schedule: PaymentSchedule; installment: Installment }[] = [];
    
    schedules.forEach(schedule => {
      schedule.installments.forEach(installment => {
        if (installment.status === "pending" || installment.status === "overdue") {
          upcoming.push({ schedule, installment });
        }
      });
    });
    
    return upcoming.sort((a, b) => new Date(a.installment.dueDate).getTime() - new Date(b.installment.dueDate).getTime());
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search schedules..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
              <Plus className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Payment Schedule</DialogTitle>
              <DialogDescription>
                Set up a new payment schedule for a project
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
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input id="totalAmount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="frequency">Payment Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="milestone-based">Milestone-based</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional schedule notes..." />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button>Create Schedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Active Schedules</p>
            <p className="text-2xl text-foreground">{schedules.filter(s => s.status === "active").length}</p>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Total Expected</p>
            <p className="text-2xl text-foreground">
              {formatCurrency(schedules.reduce((sum, s) => sum + s.totalAmount, 0))}
            </p>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Collected</p>
            <p className="text-2xl text-foreground">
              {formatCurrency(schedules.reduce((sum, s) => sum + s.paidAmount, 0))}
            </p>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-red-50/50 dark:from-gray-900/50 dark:to-red-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-red-500/5 dark:shadow-red-500/10">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Upcoming Due</p>
            <p className="text-2xl text-foreground">{getUpcomingInstallments().length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Schedules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-foreground mb-2">{schedule.clientName}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {schedule.projectName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(schedule.status)}>
                    {schedule.status}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedSchedule(schedule)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Amount Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Payment Progress</span>
                  <span className="text-foreground">
                    {formatCurrency(schedule.paidAmount)} / {formatCurrency(schedule.totalAmount)}
                  </span>
                </div>
                <Progress value={getScheduleProgress(schedule)} className="h-2" />
              </div>

              {/* Schedule Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Frequency</span>
                  <p className="text-foreground capitalize">{schedule.frequency.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Installments</span>
                  <p className="text-foreground">{schedule.installments.length} payments</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date</span>
                  <p className="text-foreground">{schedule.startDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date</span>
                  <p className="text-foreground">{schedule.endDate}</p>
                </div>
              </div>

              {/* Next Payment Due */}
              {(() => {
                const nextPayment = schedule.installments.find(i => i.status === "pending" || i.status === "overdue");
                if (nextPayment) {
                  return (
                    <div className="p-3 rounded-lg bg-muted/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-foreground">Next Payment</p>
                          <p className="text-xs text-muted-foreground">{nextPayment.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-foreground">{formatCurrency(nextPayment.amount)}</p>
                          <Badge className={getStatusColor(nextPayment.status)} variant="outline">
                            Due: {nextPayment.dueDate}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedSchedule.clientName}</DialogTitle>
              <DialogDescription>{selectedSchedule.projectName}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Schedule Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg text-foreground">{formatCurrency(selectedSchedule.totalAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Paid Amount</p>
                  <p className="text-lg text-foreground">{formatCurrency(selectedSchedule.paidAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-lg text-foreground">{formatCurrency(selectedSchedule.totalAmount - selectedSchedule.paidAmount)}</p>
                </div>
              </div>

              {/* Installments List */}
              <div>
                <h3 className="text-foreground mb-4">Payment Installments</h3>
                <div className="space-y-3">
                  {selectedSchedule.installments.map((installment, index) => (
                    <div key={installment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm shadow-lg shadow-purple-500/25">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-foreground">{installment.description}</p>
                          <p className="text-sm text-muted-foreground">Due: {installment.dueDate}</p>
                          {installment.paidDate && (
                            <p className="text-sm text-green-600">Paid: {installment.paidDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground">{formatCurrency(installment.amount)}</p>
                        <Badge className={getStatusColor(installment.status)}>
                          {installment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}