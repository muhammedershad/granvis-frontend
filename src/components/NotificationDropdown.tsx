import { useState, useMemo } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  DollarSign,
  Users,
  Building2,
  Settings,
  ExternalLink,
  MoreHorizontal,
  Eye,
  CheckCheck,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Notification } from "../types/notification";

// Mock notification data (first 5 most recent)
const mockRecentNotifications: Notification[] = [
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
    actionLabel: "View Payment"
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
    actionLabel: "View Project"
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
    actionLabel: "Review Budget"
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
  }
];

interface NotificationDropdownProps {
  onNavigateToNotifications: () => void;
}

export function NotificationDropdown({ onNavigateToNotifications }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockRecentNotifications);
  
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "project": return <Building2 className="w-4 h-4 text-purple-500" />;
      case "payment": return <DollarSign className="w-4 h-4 text-green-500" />;
      case "team": return <Users className="w-4 h-4 text-indigo-500" />;
      case "system": return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
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

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-background animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-w-[90vw] backdrop-blur-xl bg-card/95 border-border/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-80">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group ${
                      !notification.read ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`text-sm leading-5 ${!notification.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-4">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {notification.priority === 'urgent' && (
                                <Badge className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Unread indicator */}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>

                        {/* Action button */}
                        {notification.actionUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs mt-2 h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <Separator />
        <div className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-center text-sm text-muted-foreground hover:text-foreground"
            onClick={onNavigateToNotifications}
          >
            <Eye className="h-4 w-4 mr-2" />
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}