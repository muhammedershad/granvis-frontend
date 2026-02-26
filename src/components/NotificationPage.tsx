import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  CheckCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Eye,
  Filter,
  Info,
  Loader2,
  MoreHorizontal,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NotificationFilters } from "../types/notification";
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "@/lib/api/notificationsApi";

export function NotificationPage() {
  const [filters, setFilters] = useState<NotificationFilters>({
    type: "all",
    category: "all",
    priority: "all",
    read: "all",
    search: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  // Build query params from filters + tab
  const queryParams = {
    page,
    limit: 20,
    type: filters.type !== "all" ? filters.type : undefined,
    category:
      activeTab !== "all"
        ? activeTab
        : filters.category !== "all"
          ? filters.category
          : undefined,
    priority: filters.priority !== "all" ? filters.priority : undefined,
    read:
      filters.read !== "all"
        ? filters.read === "read"
          ? "true"
          : "false"
        : undefined,
    search: filters.search || undefined,
  };

  const { data: notificationsData, isLoading } =
    useGetNotificationsQuery(queryParams);
  const { data: stats } = useGetNotificationStatsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const pagination = notificationsData?.pagination;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      case "project":
        return <Building2 className="w-4 h-4 text-purple-500" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case "team":
        return <Users className="w-4 h-4 text-indigo-500" />;
      case "system":
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "project":
        return <Building2 className="w-4 h-4" />;
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      case "team":
        return <Users className="w-4 h-4" />;
      case "client":
        return <UserPlus className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      case "reminder":
        return <Clock className="w-4 h-4" />;
      case "alert":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return "Just now";
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return notifTime.toLocaleDateString();
  };

  const handleMarkAsRead = (id: string) => {
    markRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllRead();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  // Reset page when filters or tab change
  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
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
            <p className="text-muted-foreground">
              Manage your notifications and alerts
            </p>
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
                <p className="text-xl text-foreground">
                  {stats?.total ?? 0}
                </p>
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
                <p className="text-xl text-foreground">
                  {stats?.unread ?? 0}
                </p>
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
                <p className="text-xl text-foreground">
                  {stats?.urgent ?? 0}
                </p>
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
                <p className="text-xl text-foreground">
                  {stats?.today ?? 0}
                </p>
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
                <p className="text-xl text-foreground">
                  {stats?.thisWeek ?? 0}
                </p>
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
                    onChange={(e) =>
                      handleFilterChange({ search: e.target.value })
                    }
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange({ type: value })}
              >
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

              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  handleFilterChange({ priority: value })
                }
              >
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

              <Select
                value={filters.read}
                onValueChange={(value) => handleFilterChange({ read: value })}
              >
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
                onClick={() => {
                  setFilters({
                    type: "all",
                    category: "all",
                    priority: "all",
                    read: "all",
                    search: "",
                  });
                  setPage(1);
                }}
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
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-8 w-full bg-muted/30 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="project"
            className="data-[state=active]:bg-background"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-background"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-background"
          >
            Team
          </TabsTrigger>
          <TabsTrigger
            value="client"
            className="data-[state=active]:bg-background"
          >
            Clients
          </TabsTrigger>
          <TabsTrigger
            value="reminder"
            className="data-[state=active]:bg-background"
          >
            Reminders
          </TabsTrigger>
          <TabsTrigger
            value="alert"
            className="data-[state=active]:bg-background"
          >
            Alerts
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-background"
          >
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <Loader2 className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
                  <p className="text-muted-foreground">
                    Loading notifications...
                  </p>
                </CardContent>
              </Card>
            ) : notifications.length === 0 ? (
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-foreground mb-2">
                    No Notifications Found
                  </h3>
                  <p className="text-muted-foreground">
                    No notifications match your current filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all hover:shadow-md ${
                    !notification.read ? "border-l-4 border-l-blue-500" : ""
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
                              <h4
                                className={`text-foreground ${!notification.read ? "font-medium" : "font-normal"}`}
                              >
                                {notification.title}
                              </h4>
                              <Badge
                                className={getPriorityColor(
                                  notification.priority
                                )}
                              >
                                {notification.priority}
                              </Badge>
                              {getCategoryIcon(notification.category)}
                            </div>

                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              <span className="capitalize">
                                {notification.category}
                              </span>
                              {notification.metadata?.amount && (
                                <span>
                                  $
                                  {notification.metadata.amount.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {notification.actionLabel}
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteNotification(notification.id)
                                  }
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

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} notifications
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
