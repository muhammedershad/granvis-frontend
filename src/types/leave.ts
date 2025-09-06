export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedReason?: string;
  documents: LeaveDocument[];
  isHalfDay: boolean;
  halfDaySession?: 'morning' | 'afternoon';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  handoverNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxDays: number;
  isCarryForward: boolean;
  requiresApproval: boolean;
  requiresDocument: boolean;
  color: string;
  icon: string;
}

export type LeaveStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled' 
  | 'withdrawn';

export interface LeaveBalance {
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  totalAllowed: number;
  used: number;
  remaining: number;
  pending: number;
  carriedForward: number;
  year: number;
}

export interface LeaveDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface LeaveFilters {
  status: string;
  leaveType: string;
  dateRange: {
    from: string;
    to: string;
  };
  employee: string;
}

export interface LeaveStats {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  totalDaysTaken: number;
  mostUsedLeaveType: string;
  averageLeavePerEmployee: number;
}

export interface LeaveCalendarEvent {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  color: string;
}