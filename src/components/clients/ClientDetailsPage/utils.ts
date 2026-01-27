import { Mail, Phone, Users, FileText, MessageSquare } from "lucide-react";
import { createElement } from "react";

export interface PaymentHistory {
  id: string;
  projectName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue" | "partial";
  method: string;
}

export interface Communication {
  id: string;
  type: "email" | "call" | "meeting" | "proposal";
  subject: string;
  date: string;
  status: "completed" | "scheduled" | "cancelled";
  notes: string;
}

// TODO: Replace with real payment API when available
export const mockPaymentHistory: PaymentHistory[] = [
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

// TODO: Replace with real communications API when available
export const mockCommunications: Communication[] = [
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

export function getStatusColor(status: string) {
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
}

export function getProjectStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "On Hold":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

export function getPaymentStatusColor(status: string) {
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
}

export function getCommunicationIcon(type: string) {
  switch (type) {
    case "email":
      return createElement(Mail, { className: "h-4 w-4" });
    case "call":
      return createElement(Phone, { className: "h-4 w-4" });
    case "meeting":
      return createElement(Users, { className: "h-4 w-4" });
    case "proposal":
      return createElement(FileText, { className: "h-4 w-4" });
    default:
      return createElement(MessageSquare, { className: "h-4 w-4" });
  }
}
