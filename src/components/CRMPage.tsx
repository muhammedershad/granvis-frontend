import { useState, useEffect } from "react";
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  Timer, 
  PlayCircle,
  PauseCircle,
  StopCircle,
  Coffee,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Plus,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Navigation,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Home,
  Building,
  Plane,
  Heart,
  UserX,
  CalendarDays,
  ClockIcon,
  MapPinIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AttendanceRecord, AttendanceStats, AttendanceActionType } from "../types/attendance";
import { LeaveRequest, LeaveBalance, LeaveType, LeaveStatus } from "../types/leave";
import { cn } from "./ui/utils";

// Mock data
const mockLeaveTypes: LeaveType[] = [
  {
    id: "1",
    name: "Annual Leave",
    code: "AL",
    description: "Yearly vacation days",
    maxDays: 25,
    isCarryForward: true,
    requiresApproval: true,
    requiresDocument: false,
    color: "bg-blue-500",
    icon: "Calendar"
  },
  {
    id: "2",
    name: "Sick Leave",
    code: "SL",
    description: "Medical leave",
    maxDays: 12,
    isCarryForward: false,
    requiresApproval: false,
    requiresDocument: true,
    color: "bg-red-500",
    icon: "Heart"
  },
  {
    id: "3",
    name: "Personal Leave",
    code: "PL",
    description: "Personal time off",
    maxDays: 5,
    isCarryForward: false,
    requiresApproval: true,
    requiresDocument: false,
    color: "bg-green-500",
    icon: "User"
  },
  {
    id: "4",
    name: "Maternity Leave",
    code: "ML",
    description: "Maternity leave",
    maxDays: 90,
    isCarryForward: false,
    requiresApproval: true,
    requiresDocument: true,
    color: "bg-pink-500",
    icon: "Heart"
  }
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "emp1",
    employeeName: "John Doe",
    date: "2024-01-15",
    clockIn: "09:00:00",
    clockOut: "17:30:00",
    breakStart: "12:00:00",
    breakEnd: "13:00:00",
    totalHours: 8.5,
    workingHours: 7.5,
    breakHours: 1,
    overtimeHours: 0,
    status: "present",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "123 Office Street, New York, NY",
      accuracy: 10
    },
    notes: "",
    isRemote: false,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T17:30:00Z"
  },
  {
    id: "2",
    employeeId: "emp1",
    employeeName: "John Doe",
    date: "2024-01-16",
    clockIn: "09:15:00",
    clockOut: "17:45:00",
    breakStart: "12:30:00",
    breakEnd: "13:15:00",
    totalHours: 8.5,
    workingHours: 7.75,
    breakHours: 0.75,
    overtimeHours: 0.25,
    status: "late",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "123 Office Street, New York, NY",
      accuracy: 15
    },
    notes: "Traffic jam",
    isRemote: false,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T17:45:00Z"
  }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "emp1",
    employeeName: "John Doe",
    employeeEmail: "john.doe@company.com",
    leaveType: mockLeaveTypes[0],
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    totalDays: 5,
    reason: "Family vacation",
    status: "pending",
    appliedDate: "2024-01-20",
    documents: [],
    isHalfDay: false,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "2",
    employeeId: "emp1",
    employeeName: "John Doe",
    employeeEmail: "john.doe@company.com",
    leaveType: mockLeaveTypes[1],
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    totalDays: 3,
    reason: "Flu symptoms",
    status: "approved",
    appliedDate: "2024-01-09",
    approvedBy: "Manager",
    approvedDate: "2024-01-09",
    documents: [],
    isHalfDay: false,
    createdAt: "2024-01-09T08:00:00Z",
    updatedAt: "2024-01-09T14:00:00Z"
  }
];

const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: "emp1",
    leaveTypeId: "1",
    leaveTypeName: "Annual Leave",
    totalAllowed: 25,
    used: 8,
    remaining: 17,
    pending: 5,
    carriedForward: 3,
    year: 2024
  },
  {
    employeeId: "emp1",
    leaveTypeId: "2",
    leaveTypeName: "Sick Leave",
    totalAllowed: 12,
    used: 3,
    remaining: 9,
    pending: 0,
    carriedForward: 0,
    year: 2024
  },
  {
    employeeId: "emp1",
    leaveTypeId: "3",
    leaveTypeName: "Personal Leave",
    totalAllowed: 5,
    used: 1,
    remaining: 4,
    pending: 0,
    carriedForward: 0,
    year: 2024
  }
];

export function CRMPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number, address: string} | null>(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(mockLeaveBalances);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user location
  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser");
      // Use mock location for demo
      setCurrentLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Office Street, New York, NY (Demo Location)"
      });
      setIsLocationLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject, 
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Mock reverse geocoding (in real app, use Google Maps API or similar)
      const address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
      
      setCurrentLocation({ latitude, longitude, address });
    } catch (error: any) {
      let errorMessage = "Location access failed";
      
      if (error.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access denied by user";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location information unavailable";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "Unknown location error";
        }
      }
      
      console.warn("Location error:", errorMessage, error);
      
      // Use mock location for demo when real location fails
      setCurrentLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Office Street, New York, NY (Demo Location)"
      });
    } finally {
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleAttendanceAction = (action: AttendanceActionType) => {
    if (!currentLocation && !isLocationLoading) {
      // Try to get location again before proceeding
      getCurrentLocation();
      return;
    }

    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const locationInfo = currentLocation?.address || "Demo Location";

    switch (action) {
      case 'clock-in':
        setIsClockedIn(true);
        console.log(`Clocked in at ${timeString} from ${locationInfo}`);
        break;
      case 'clock-out':
        setIsClockedIn(false);
        setIsOnBreak(false);
        console.log(`Clocked out at ${timeString} from ${locationInfo}`);
        break;
      case 'break-start':
        setIsOnBreak(true);
        console.log(`Break started at ${timeString}`);
        break;
      case 'break-end':
        setIsOnBreak(false);
        console.log(`Break ended at ${timeString}`);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'absent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partial': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'holiday': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLeaveStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'withdrawn': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const attendanceStats: AttendanceStats = {
    totalDays: 30,
    presentDays: 28,
    absentDays: 1,
    lateDays: 3,
    totalHours: 224,
    averageHours: 8.0,
    overtimeHours: 12,
    attendancePercentage: 93.3
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">Office CRM</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Attendance tracking and leave management</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{formatTime(currentTime)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(currentTime)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions with enhanced styling */}
      <Card className="group relative overflow-hidden transition-all duration-300 
        bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60 
        dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
        border border-gray-200/60 dark:border-white/10 
        shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
        hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
        backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
          
        {/* Dual gradient layers for light theme */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-purple-50/80"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/60 via-transparent to-blue-50/60"></div>
        </div>
        
        {/* Dual gradient layers for dark theme */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-cyan-500/3"></div>
        </div>

        {/* Subtle animated orbs */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-purple-100/20 dark:from-purple-500/10 dark:to-blue-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-100/40 to-cyan-100/20 dark:from-cyan-500/10 dark:to-blue-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <CardHeader className="relative z-10">
          <CardTitle className="text-gray-900 dark:text-white/90 flex items-center space-x-2 text-xl font-semibold">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-purple-500/20 dark:to-blue-500/20 rounded-lg border border-blue-200/50 dark:border-purple-500/30">
              <Timer className="w-5 h-5 text-blue-600 dark:text-purple-400" />
            </div>
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Clock In/Out */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isClockedIn ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-gray-700 dark:text-white/70 text-sm font-medium">
                  {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                </span>
              </div>
              <Button
                onClick={() => handleAttendanceAction(isClockedIn ? 'clock-out' : 'clock-in')}
                className={`w-full ${
                  isClockedIn 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                } border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
                disabled={isLocationLoading}
              >
                {isLocationLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <>
                    {isClockedIn ? <StopCircle className="w-4 h-4 mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                  </>
                )}
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
            </div>

            {/* Break */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-gray-700 dark:text-white/70 text-sm font-medium">
                  {isOnBreak ? 'On Break' : 'Working'}
                </span>
              </div>
              <Button
                onClick={() => handleAttendanceAction(isOnBreak ? 'break-end' : 'break-start')}
                disabled={!isClockedIn}
                variant="outline"
                className="w-full bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                  border border-gray-200/60 dark:border-white/10 
                  text-gray-700 dark:text-white/70 
                  hover:bg-gradient-to-br hover:from-orange-50 hover:via-orange-100/50 hover:to-orange-50 
                  dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
                  shadow-sm hover:shadow-md transition-all duration-200
                  backdrop-blur-sm disabled:opacity-50"
              >
                {isOnBreak ? <PlayCircle className="w-4 h-4 mr-2" /> : <PauseCircle className="w-4 h-4 mr-2" />}
                {isOnBreak ? 'End Break' : 'Start Break'}
              </Button>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {isLocationLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-600/30 dark:border-blue-400/30 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                ) : currentLocation ? (
                  <Navigation className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                )}
                <span className="text-gray-700 dark:text-white/70 text-sm font-medium">Location</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-white/60">
                {isLocationLoading ? (
                  <div className="flex items-center space-x-1">
                    <span>Getting location...</span>
                  </div>
                ) : currentLocation ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Wifi className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span>Located</span>
                    </div>
                    <div className="truncate" title={currentLocation.address}>
                      {currentLocation.address}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <WifiOff className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                      <span>Using demo location</span>
                    </div>
                    <Button
                      onClick={getCurrentLocation}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Retry location
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Leave */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-white/70 text-sm font-medium">Leave</span>
              </div>
              <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                      border border-gray-200/60 dark:border-white/10 
                      text-gray-700 dark:text-white/70 
                      hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
                      dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
                      shadow-sm hover:shadow-md transition-all duration-200
                      backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Apply Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-black/90 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white/90">Apply for Leave</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-white/60">
                      Submit a new leave application with all required details.
                    </DialogDescription>
                  </DialogHeader>
                  <LeaveApplicationForm onClose={() => setIsLeaveDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs with enhanced styling */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="p-1 bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60 dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90 border border-gray-200/60 dark:border-white/10 shadow-lg backdrop-blur-xl">
            <TabsTrigger 
              value="attendance" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-100 data-[state=active]:to-purple-100 dark:data-[state=active]:from-purple-500/20 dark:data-[state=active]:to-blue-500/20 data-[state=active]:shadow-md transition-all duration-200"
            >
              <div className="p-1 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-purple-500/10 dark:to-blue-500/10 rounded-md mr-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              </div>
              Attendance
            </TabsTrigger>
            <TabsTrigger 
              value="leave" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-100 data-[state=active]:to-purple-100 dark:data-[state=active]:from-purple-500/20 dark:data-[state=active]:to-blue-500/20 data-[state=active]:shadow-md transition-all duration-200"
            >
              <div className="p-1 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-purple-500/10 dark:to-blue-500/10 rounded-md mr-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              </div>
              Leave Management
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Stats with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group relative overflow-hidden transition-all duration-300 
              bg-gradient-to-br from-white via-gray-50/80 to-green-50/60 
              dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
              border border-gray-200/60 dark:border-white/10 
              shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
              hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
              backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 p-4">
                
              {/* Dual gradient layers */}
              <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/40 to-green-50/80"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-emerald-50/60 via-transparent to-green-50/60"></div>
              </div>
              <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
              </div>

              <div className="relative flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl border border-green-200/50 dark:border-green-500/30">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-white/60 text-sm font-medium">Present Days</p>
                  <p className="text-2xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{attendanceStats.presentDays}</p>
                </div>
              </div>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 
              bg-gradient-to-br from-white via-gray-50/80 to-yellow-50/60 
              dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
              border border-gray-200/60 dark:border-white/10 
              shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
              hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
              backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 p-4">
                
              {/* Dual gradient layers */}
              <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-orange-50/40 to-yellow-50/80"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-orange-50/60 via-transparent to-yellow-50/60"></div>
              </div>
              <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
              </div>

              <div className="relative flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-xl border border-yellow-200/50 dark:border-yellow-500/30">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-white/60 text-sm font-medium">Late Days</p>
                  <p className="text-2xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{attendanceStats.lateDays}</p>
                </div>
              </div>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 
              bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60 
              dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
              border border-gray-200/60 dark:border-white/10 
              shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
              hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
              backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 p-4">
                
              {/* Dual gradient layers */}
              <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-cyan-50/40 to-blue-50/80"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/60 via-transparent to-blue-50/60"></div>
              </div>
              <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-cyan-500/2"></div>
              </div>

              <div className="relative flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-xl border border-blue-200/50 dark:border-blue-500/30">
                  <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-white/60 text-sm font-medium">Total Hours</p>
                  <p className="text-2xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{attendanceStats.totalHours}</p>
                </div>
              </div>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 
              bg-gradient-to-br from-white via-gray-50/80 to-purple-50/60 
              dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
              border border-gray-200/60 dark:border-white/10 
              shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
              hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
              backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 p-4">
                
              {/* Dual gradient layers */}
              <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/40 to-purple-50/80"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-pink-50/60 via-transparent to-purple-50/60"></div>
              </div>
              <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
              </div>

              <div className="relative flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 rounded-xl border border-purple-200/50 dark:border-purple-500/30">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-white/60 text-sm font-medium">Attendance %</p>
                  <p className="text-2xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{attendanceStats.attendancePercentage}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendance Records with enhanced styling */}
          <Card className="group relative overflow-hidden transition-all duration-300 
            bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60 
            dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
            border border-gray-200/60 dark:border-white/10 
            shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
            hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
            backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
              
            {/* Dual gradient layers */}
            <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-purple-50/80"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/60 via-transparent to-blue-50/60"></div>
            </div>
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-blue-500/2 to-cyan-500/3"></div>
            </div>

            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-purple-500/20 dark:to-blue-500/20 rounded-lg border border-blue-200/50 dark:border-purple-500/30">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                  </div>
                  <span>Attendance History</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="
                    bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                    border border-gray-200/60 dark:border-white/10 
                    text-gray-700 dark:text-white/70 
                    hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
                    dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
                    shadow-sm hover:shadow-md transition-all duration-200
                    backdrop-blur-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="
                    bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                    border border-gray-200/60 dark:border-white/10 
                    text-gray-700 dark:text-white/70 
                    hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
                    dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
                    shadow-sm hover:shadow-md transition-all duration-200
                    backdrop-blur-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/70">Date</TableHead>
                      <TableHead className="text-white/70">Clock In</TableHead>
                      <TableHead className="text-white/70">Clock Out</TableHead>
                      <TableHead className="text-white/70">Total Hours</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      <TableHead className="text-white/70">Location</TableHead>
                      <TableHead className="text-white/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white/80">{record.date}</TableCell>
                        <TableCell className="text-white/80">{record.clockIn || '-'}</TableCell>
                        <TableCell className="text-white/80">{record.clockOut || '-'}</TableCell>
                        <TableCell className="text-white/80">{record.workingHours}h</TableCell>
                        <TableCell>
                          <Badge className={cn("capitalize", getStatusColor(record.status))}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {record.location ? (
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="w-3 h-3 text-white/40" />
                              <span className="text-xs truncate max-w-32">{record.location.address}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Tab */}
        <TabsContent value="leave" className="space-y-6">
          {/* Leave Balance with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaveBalances.map((balance) => (
              <Card key={balance.leaveTypeId} className="group relative overflow-hidden transition-all duration-300 
                bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60 
                dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
                border border-gray-200/60 dark:border-white/10 
                shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
                hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
                backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 p-4">
                  
                {/* Dual gradient layers */}
                <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-cyan-50/40 to-blue-50/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/60 via-transparent to-blue-50/60"></div>
                </div>
                <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
                </div>

                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{balance.leaveTypeName}</h3>
                    <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-white/60 font-medium">Used</span>
                      <span className="text-gray-900 dark:text-white/80 font-semibold">{balance.used}/{balance.totalAllowed}</span>
                    </div>
                    <Progress 
                      value={(balance.used / balance.totalAllowed) * 100} 
                      className="h-2 bg-gray-200 dark:bg-white/10"
                    />
                    <div className="flex justify-between text-xs text-gray-600 dark:text-white/60">
                      <span>Remaining: {balance.remaining}</span>
                      {balance.pending > 0 && <span>Pending: {balance.pending}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Leave Requests with enhanced styling */}
          <Card className="group relative overflow-hidden transition-all duration-300 
            bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60 
            dark:from-gray-900/90 dark:via-black/50 dark:to-gray-900/90
            border border-gray-200/60 dark:border-white/10 
            shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]
            hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_16px_64px_-16px_rgba(0,0,0,0.6)]
            backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
              
            {/* Dual gradient layers */}
            <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-purple-50/80"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/60 via-transparent to-blue-50/60"></div>
            </div>
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-blue-500/2 to-cyan-500/3"></div>
            </div>

            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-purple-500/20 dark:to-blue-500/20 rounded-lg border border-blue-200/50 dark:border-purple-500/30">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                  </div>
                  <span>Leave Requests</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="
                    bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                    border border-gray-200/60 dark:border-white/10 
                    text-gray-700 dark:text-white/70 
                    hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
                    dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
                    shadow-sm hover:shadow-md transition-all duration-200
                    backdrop-blur-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Apply Leave
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-black/90 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white/90">Apply for Leave</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-white/60">
                          Submit a new leave application with all required details.
                        </DialogDescription>
                      </DialogHeader>
                      <LeaveApplicationForm onClose={() => setIsLeaveDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200/60 dark:border-white/10 hover:bg-gray-50/50 dark:hover:bg-white/5">
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Leave Type</TableHead>
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Dates</TableHead>
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Days</TableHead>
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Reason</TableHead>
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Applied</TableHead>
                      <TableHead className="text-gray-700 dark:text-white/70 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id} className="border-gray-200/60 dark:border-white/10 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors duration-150">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${request.leaveType.color}`}></div>
                            <span className="text-gray-900 dark:text-white/80 font-medium">{request.leaveType.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-800 dark:text-white/80">
                          {request.startDate} to {request.endDate}
                        </TableCell>
                        <TableCell className="text-gray-800 dark:text-white/80 font-medium">{request.totalDays}</TableCell>
                        <TableCell className="text-gray-800 dark:text-white/80 max-w-40 truncate">{request.reason}</TableCell>
                        <TableCell>
                          <Badge className={cn("capitalize", getLeaveStatusColor(request.status))}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-800 dark:text-white/80">{request.appliedDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-900/95 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
                              <DropdownMenuItem className="text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {request.status === 'pending' && (
                                <>
                                  <DropdownMenuItem className="text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gray-200/60 dark:bg-white/10" />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Withdraw
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Leave Application Form Component with enhanced styling
function LeaveApplicationForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    isHalfDay: false,
    halfDaySession: 'morning',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    handoverNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Leave application submitted:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">Leave Type *</Label>
          <Select value={formData.leaveType} onValueChange={(value) => setFormData(prev => ({ ...prev, leaveType: value }))}>
            <SelectTrigger className="
              bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
              border border-gray-200/60 dark:border-white/10 
              text-gray-900 dark:text-white 
              hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
              dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-200
              backdrop-blur-sm">
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-900/95 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
              {mockLeaveTypes.map(type => (
                <SelectItem key={type.id} value={type.id} className="text-gray-900 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10">{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">Half Day</Label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isHalfDay}
                onChange={(e) => setFormData(prev => ({ ...prev, isHalfDay: e.target.checked }))}
                className="rounded border-gray-300 dark:border-white/30 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-white/70 text-sm">Half day leave</span>
            </label>
            {formData.isHalfDay && (
              <Select value={formData.halfDaySession} onValueChange={(value) => setFormData(prev => ({ ...prev, halfDaySession: value }))}>
                <SelectTrigger className="
                  bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                  border border-gray-200/60 dark:border-white/10 
                  text-gray-900 dark:text-white w-32
                  shadow-sm backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-900/95 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
                  <SelectItem value="morning" className="text-gray-900 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10">Morning</SelectItem>
                  <SelectItem value="afternoon" className="text-gray-900 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10">Afternoon</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">Start Date *</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="
              bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
              border border-gray-200/60 dark:border-white/10 
              text-gray-900 dark:text-white 
              hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
              dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-200
              backdrop-blur-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">End Date *</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="
              bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
              border border-gray-200/60 dark:border-white/10 
              text-gray-900 dark:text-white 
              hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
              dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-200
              backdrop-blur-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-white/70 font-medium">Reason *</Label>
        <Textarea
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Please provide a reason for your leave..."
          className="
            bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
            border border-gray-200/60 dark:border-white/10 
            text-gray-900 dark:text-white 
            placeholder:text-gray-500 dark:placeholder:text-white/50
            hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
            dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
            shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200
            backdrop-blur-sm min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-900 dark:text-white/90 font-semibold">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white/70 font-medium">Name</Label>
            <Input
              value={formData.emergencyContactName}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
              placeholder="Contact name"
              className="
                bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                border border-gray-200/60 dark:border-white/10 
                text-gray-900 dark:text-white 
                placeholder:text-gray-500 dark:placeholder:text-white/50
                shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white/70 font-medium">Phone</Label>
            <Input
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
              placeholder="Phone number"
              className="
                bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                border border-gray-200/60 dark:border-white/10 
                text-gray-900 dark:text-white 
                placeholder:text-gray-500 dark:placeholder:text-white/50
                shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white/70 font-medium">Relationship</Label>
            <Input
              value={formData.emergencyContactRelation}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
              placeholder="Relationship"
              className="
                bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                border border-gray-200/60 dark:border-white/10 
                text-gray-900 dark:text-white 
                placeholder:text-gray-500 dark:placeholder:text-white/50
                shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-white/70 font-medium">Handover Notes</Label>
        <Textarea
          value={formData.handoverNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, handoverNotes: e.target.value }))}
          placeholder="Any work handover notes or instructions..."
          className="
            bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
            border border-gray-200/60 dark:border-white/10 
            text-gray-900 dark:text-white 
            placeholder:text-gray-500 dark:placeholder:text-white/50
            hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 
            dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
            shadow-sm hover:shadow-md transition-all duration-200
            backdrop-blur-sm min-h-[80px]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="
            bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
            border border-gray-200/60 dark:border-white/10 
            text-gray-700 dark:text-white/70 
            hover:bg-gradient-to-br hover:from-gray-100 hover:via-gray-200/50 hover:to-gray-100 
            dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
            shadow-sm hover:shadow-md transition-all duration-200
            backdrop-blur-sm"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Submit Application
        </Button>
      </div>
    </form>
  );
}