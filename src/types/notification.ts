export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'project' | 'payment' | 'team' | 'system';
  category: 'project' | 'payment' | 'team' | 'client' | 'system' | 'reminder' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    projectId?: string;
    employeeId?: string;
    clientId?: string;
    paymentId?: string;
    amount?: number;
    dueDate?: string;
  };
}

export interface NotificationFilters {
  type: string;
  category: string;
  priority: string;
  read: string;
  search: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
  today: number;
  thisWeek: number;
}