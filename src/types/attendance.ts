export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  totalHours: number;
  workingHours: number;
  breakHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'partial' | 'holiday';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    accuracy: number;
  } | null;
  notes: string;
  isRemote: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  isActive: boolean;
}

export interface AttendanceFilters {
  dateRange: {
    from: string;
    to: string;
  };
  status: string;
  employee: string;
  location: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  averageHours: number;
  overtimeHours: number;
  attendancePercentage: number;
}

export type AttendanceActionType = 'clock-in' | 'clock-out' | 'break-start' | 'break-end';

export interface AttendanceAction {
  type: AttendanceActionType;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    accuracy: number;
  };
  notes?: string;
}