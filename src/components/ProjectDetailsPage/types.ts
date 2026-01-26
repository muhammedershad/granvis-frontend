/**
 * Type definitions for ProjectDetailsPage components
 */

// Timeline item interface
export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "cancelled";
  assignedTo: string;
  assignedBy: string;
  startDate: string;
  endDate?: string;
  completedDate?: string;
  category:
    | "design"
    | "construction"
    | "approval"
    | "meeting"
    | "review"
    | "delivery"
    | "milestone";
  attachments?: string[];
  comments?: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
  }>;
}

// Schedule item interface
export interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "meeting" | "task" | "milestone" | "review" | "deadline";
  attendees?: string[];
  location?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
}

// Payment interface
export interface Payment {
  id: string;
  amount: number;
  type: "advance" | "milestone" | "final" | "additional";
  status: "pending" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  paidDate?: string;
  description: string;
  invoiceNumber?: string;
  paymentMethod?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  type: string;
  category: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  deadline: string;
  progressPercentage: number;
  currentPhase: string;
  projectManager: string;
  teamMembers: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  tags: string[];
}
