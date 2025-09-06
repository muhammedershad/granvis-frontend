import { useState, useMemo } from "react";
import {
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Building2,
  Settings,
  Trash2,
  Mail as MarkAsRead,
  Eye,
  ExternalLink,
  Calendar,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  FileText,
  UserPlus,
  CreditCard,
  Target,
  Activity,
  CheckCheck,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Notification, NotificationFilters, NotificationStats } from "../types/notification";

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Payment Overdue",
    message: "Villa project payment of $85,000 is 5 days overdue from John & Sarah Williams",
    type: "error",
    category: "payment",
    priority: "urgent",
    read: false,
    timestamp: "2024-07-10T09:30:00Z",
    actionUrl: "/payments",
    actionLabel: "View Payment",
    metadata: {
      paymentId: "PAY-001",
      amount: 85000,
      dueDate: "2024-07-05"
    }
  },
  {
    id: "2",
    title: "Project Milestone Completed",
    message: "Interior Construction phase completed for Modern Villa Residence project",
    type: "success",
    category: "project",
    priority: "medium",
    read: false,
    timestamp: "2024-07-09T14:22:00Z",
    actionUrl: "/projects/1",
    actionLabel: "View Project",
    metadata: {
      projectId: "1"
    }
  },
  {
    id: "3",
    title: "New Team Member Added",
    message: "Michael Chen has been added to the Downtown Office Complex project team",
    type: "info",
    category: "team",
    priority: "low",
    read: true,
    timestamp: "2024-07-09T11:15:00Z",
    actionUrl: "/employees",
    actionLabel: "View Team",
    metadata: {
      employeeId: "3",
      projectId: "2"
    }
  },
  {
    id: "4",
    title: "Client Meeting Reminder",
    message: "Progress review meeting with Williams Family scheduled for tomorrow at 10:00 AM",
    type: "info",
    category: "reminder",
    priority: "high",
    read: false,
    timestamp: "2024-07-09T08:45:00Z",
    actionUrl: "/calendar",
    actionLabel: "View Calendar"
  },
  {
    id: "5",
    title: "Budget Alert",
    message: "University Campus Landscape project has exceeded 85% of allocated budget",
    type: "warning",
    category: "project",
    priority: "high",
    read: false,
    timestamp: "2024-07-08T16:30:00Z",
    actionUrl: "/projects/4",
    actionLabel: "Review Budget",
    metadata: {
      projectId: "4"
    }
  },
  {
    id: "6",
    title: "System Maintenance",
    message: "Scheduled system maintenance will occur tonight from 2:00 AM to 4:00 AM",
    type: "info",
    category: "system",
    priority: "medium",
    read: true,
    timestamp: "2024-07-08T13:00:00Z"
  },
  {
    id: "7",
    title: "New Enquiry Received",
    message: "New project enquiry from Tech Innovations Inc. for office renovation",
    type: "info",
    category: "client",
    priority: "medium",
    read: false,
    timestamp: "2024-07-08T10:15:00Z",
    actionUrl: "/enquiries",
    actionLabel: "View Enquiry"
  },
  {
    id: "8",
    title: "Payment Received",
    message: "Received $255,000 milestone payment for Modern Villa Residence project",
    type: "success",
    category: "payment",
    priority: "medium",
    read: true,
    timestamp: "2024-07-07T15:45:00Z",
    actionUrl: "/payments",
    actionLabel: "View Payment",
    metadata: {
      amount: 255000,
      projectId: "1"
    }
  },
  {
    id: "9",
    title: "Document Upload Required",
    message: "Building permits pending upload for Downtown Office Complex project",
    type: "warning",
    category: "project",
    priority: "high",
    read: false,
    timestamp: "2024-07-07T12:20:00Z",
    actionUrl: "/projects/2",
    actionLabel: "Upload Documents",
    metadata: {
      projectId: "2"
    }
  },
  {
    id: "10",
    title: "Task Assignment",
    message: "You've been assigned to review electrical plans for Boutique Hotel Interior",
    type: "info",
    category: "project",
    priority: "medium",
    read: true,
    timestamp: "2024-07-06T09:30:00Z",
    actionUrl: "/projects/3",
    actionLabel: "View Task",
    metadata: {
      projectId: "3"
    }
  }
];

export function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filters, setFilters] = useState<NotificationFilters>({
    type: "all",
    category: "all",
    priority: "all",
    read: "all",
    search: ""
  });
  const [activeTab, setActiveTab] = useState("all");

  // Calculate statistics
  const stats = useMemo((): NotificationStats => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const urgent = notifications.filter(n => n.priority === 'urgent').length;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayCount = notifications.filter(n => {
      const notifDate = new Date(n.timestamp);
      return notifDate >= today;
    }).length;
    
    const thisWeekCount = notifications.filter(n => {
      const notifDate = new Date(n.timestamp);
      return notifDate >= weekAgo;
    }).length;

    return { total, unread, urgent, today: todayCount, thisWeek: thisWeekCount };
  }, [notifications]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = !filters.search || 
        notification.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        notification.message.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.type === "all" || notification.type === filters.type;
      const matchesCategory = filters.category === "all" || notification.category === filters.category;
      const matchesPriority = filters.priority === "all" || notification.priority === filters.priority;
      const matchesRead = filters.read === "all" || 
        (filters.read === "read" && notification.read) ||
        (filters.read === "unread" && !notification.read);

      return matchesSearch && matchesType && matchesCategory && matchesPriority && matchesRead;
    });

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(n => n.category === activeTab);
    }

    return filtered.sort((a, b) => {
      // Sort by read status (unread first), then by priority, then by timestamp
      if (a.read !== b.read) return a.read ? 1 : -1;
      
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications, filters, activeTab]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "project": return <Building2 className="w-4 h-4 text-purple-500" />;
      case "payment": return <DollarSign className="w-4 h-4 text-green-500" />;
      case "team": return <Users className="w-4 h-4 text-indigo-500" />;
      case "system": return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "project": return <Building2 className="w-4 h-4" />;
      case "payment": return <DollarSign className="w-4 h-4" />;
      case "team": return <Users className="w-4 h-4" />;
      case "client": return <UserPlus className="w-4 h-4" />;
      case "system": return <Settings className="w-4 h-4" />;
      case "reminder": return <Clock className="w-4 h-4" />;
      case "alert": return <AlertCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifTime.toLocaleDateString();
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: false } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Manage your notifications and alerts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="bg-background/50 hover:bg-muted/50"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.02] to-red-500/[0.02] dark:from-orange-400/[0.05] dark:to-red-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-xl text-foreground">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-pink-500/[0.02] dark:from-red-400/[0.05] dark:to-pink-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-xl text-foreground">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl text-foreground">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl text-foreground">{stats.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
        <CardContent className="relative p-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-foreground">Filter Notifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.read} onValueChange={(value) => setFilters(prev => ({ ...prev, read: value }))}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({ type: "all", category: "all", priority: "all", read: "all", search: "" })}
                className="bg-background/50 hover:bg-muted/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-8 w-full bg-muted/30 p-1 rounded-xl">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">All</TabsTrigger>
          <TabsTrigger value="project" className="data-[state=active]:bg-background">Projects</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-background">Payments</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-background">Team</TabsTrigger>
          <TabsTrigger value="client" className="data-[state=active]:bg-background">Clients</TabsTrigger>
          <TabsTrigger value="reminder" className="data-[state=active]:bg-background">Reminders</TabsTrigger>
          <TabsTrigger value="alert" className="data-[state=active]:bg-background">Alerts</TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-background">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-foreground mb-2">No Notifications Found</h3>
                  <p className="text-muted-foreground">No notifications match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-purple-500/[0.01] dark:from-blue-400/[0.02] dark:to-purple-400/[0.02]"></div>
                  <CardContent className="relative p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-foreground ${!notification.read ? 'font-medium' : 'font-normal'}`}>
                                {notification.title}
                              </h4>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {getCategoryIcon(notification.category)}
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                              <span className="capitalize">{notification.category}</span>
                              {notification.metadata?.amount && (
                                <span>${notification.metadata.amount.toLocaleString()}</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button variant="ghost" size="sm" className="text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {notification.actionLabel}
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {notification.read ? (
                                  <DropdownMenuItem onClick={() => handleMarkAsUnread(notification.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Mark as Unread
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}