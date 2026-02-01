"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Award,
  Briefcase,
  Building,
  Camera,
  ChevronRight,
  Clock,
  Crown,
  Edit,
  Home,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Save,
  Shield,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Employee } from "../../types/employee";
import { cn } from "../ui/utils";
import { toast } from "sonner";
import {
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesByManagerQuery,
} from "@/lib/api/employeesApi";
import { useGetProjectsByEmployeeQuery } from "@/lib/api/projectsApi";
import { Project } from "@/types/project";
import { getAvatarUrl } from "@/lib/utils/cloudfront";

interface EmployeeDetailsPageProps {
  employeeId: string;
}

const DEPARTMENTS = [
  { value: "architecture", label: "Architecture" },
  { value: "interior", label: "Interior" },
  { value: "landscape", label: "Landscape" },
  { value: "construction", label: "Construction" },
  { value: "drafting", label: "Drafting" },
  { value: "accountant", label: "Accountant" },
  { value: "admin", label: "Admin" },
  { value: "marketing", label: "Marketing" },
];

const EMPLOYMENT_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "On Leave", label: "On Leave" },
  { value: "Terminated", label: "Terminated" },
];

const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Intern", label: "Intern" },
];

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "completed":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "paused":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "inactive":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "on leave":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "terminated":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getProjectStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "planning":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "in progress":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "on hold":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getProjectPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function EmployeeProfileCard({
  employee,
  isEditing,
  editedEmployee,
  setEditedEmployee,
}: {
  employee: Employee;
  isEditing: boolean;
  editedEmployee: Employee;
  setEditedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
}) {
  const avatarUrl = getAvatarUrl(employee.avatarKey, employee.avatar);
  const initials = employee.name
    ? employee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`;

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      <CardContent className="relative z-10 p-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Avatar & Basic Info */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
            <div className="relative mb-4">
              <Avatar className="w-28 h-28 border-4 border-white/10 shadow-xl">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-purple-500 hover:bg-purple-600"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="text-center lg:text-left space-y-2">
              <Badge
                className={cn("text-xs", getStatusColor(employee.employmentStatus))}
              >
                {employee.employmentStatus}
              </Badge>
              <p className="text-white/50 text-xs">
                Employee ID: {employee.employeeId}
              </p>
              <p className="text-white/50 text-xs">
                Joined: {new Date(employee.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Middle Column - Personal Information */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <h3 className="text-white/90 font-medium text-sm">Personal Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white/50 text-xs uppercase tracking-wider">Full Name</Label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <Input
                      value={editedEmployee.firstName}
                      onChange={(e) =>
                        setEditedEmployee((prev) =>
                          prev ? { ...prev, firstName: e.target.value } : null
                        )
                      }
                      placeholder="First Name"
                      className="bg-white/5 border-white/10 text-white h-9 text-sm"
                    />
                    <Input
                      value={editedEmployee.lastName}
                      onChange={(e) =>
                        setEditedEmployee((prev) =>
                          prev ? { ...prev, lastName: e.target.value } : null
                        )
                      }
                      placeholder="Last Name"
                      className="bg-white/5 border-white/10 text-white h-9 text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-white/90 mt-1">
                    {employee.name ||
                      `${employee.firstName} ${employee.lastName}`}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white/50 text-xs uppercase tracking-wider">Position</Label>
                {isEditing ? (
                  <Input
                    value={editedEmployee.position}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, position: e.target.value } : null
                      )
                    }
                    className="mt-1.5 bg-white/5 border-white/10 text-white h-9 text-sm"
                  />
                ) : (
                  <p className="text-white/90 mt-1">{employee.position}</p>
                )}
              </div>

              <div>
                <Label className="text-white/50 text-xs uppercase tracking-wider">Department</Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee.department}
                    onValueChange={(value) =>
                      setEditedEmployee((prev) =>
                        prev
                          ? { ...prev, department: value as Employee["department"] }
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-white/90 mt-1 capitalize">
                    {employee.department}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white/50 text-xs uppercase tracking-wider">
                  Employment Type
                </Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee.employmentType}
                    onValueChange={(value) =>
                      setEditedEmployee((prev) =>
                        prev
                          ? {
                              ...prev,
                              employmentType: value as Employee["employmentType"],
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-white/90 mt-1">{employee.employmentType}</p>
                )}
              </div>

              <div>
                <Label className="text-white/50 text-xs uppercase tracking-wider">Status</Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee.employmentStatus}
                    onValueChange={(value) =>
                      setEditedEmployee((prev) =>
                        prev
                          ? {
                              ...prev,
                              employmentStatus: value as Employee["employmentStatus"],
                              status: value as Employee["status"],
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge className={cn("text-xs", getStatusColor(employee.employmentStatus))}>
                      {employee.employmentStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Mail className="w-4 h-4 text-blue-400" />
              <h3 className="text-white/90 font-medium text-sm">Contact Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedEmployee.email}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, email: e.target.value } : null
                      )
                    }
                    className="bg-white/5 border-white/10 text-white h-9 text-sm"
                  />
                ) : (
                  <span className="text-white/90 text-sm">{employee.email}</span>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                {isEditing ? (
                  <Input
                    value={editedEmployee.phone}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null
                      )
                    }
                    className="bg-white/5 border-white/10 text-white h-9 text-sm"
                  />
                ) : (
                  <span className="text-white/90 text-sm">{employee.phone}</span>
                )}
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <MapPin className="w-4 h-4 text-orange-400" />
                </div>
                {isEditing ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editedEmployee.address?.street || ""}
                      onChange={(e) =>
                        setEditedEmployee((prev) =>
                          prev
                            ? {
                                ...prev,
                                address: {
                                  ...prev.address,
                                  street: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                      placeholder="Street"
                      className="bg-white/5 border-white/10 text-white h-9 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editedEmployee.address?.city || ""}
                        onChange={(e) =>
                          setEditedEmployee((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  address: {
                                    ...prev.address,
                                    city: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                        placeholder="City"
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                      />
                      <Input
                        value={editedEmployee.address?.state || ""}
                        onChange={(e) =>
                          setEditedEmployee((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  address: {
                                    ...prev.address,
                                    state: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                        placeholder="State"
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-white/90 text-sm">
                    {employee.address
                      ? `${employee.address.street}, ${employee.address.city}, ${employee.address.state} ${employee.address.pinCode}`
                      : "Not provided"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <Label className="text-white/50 text-xs uppercase tracking-wider">Experience</Label>
            </div>
            {isEditing ? (
              <Input
                type="number"
                value={editedEmployee.experience || 0}
                onChange={(e) =>
                  setEditedEmployee((prev) =>
                    prev
                      ? { ...prev, experience: parseInt(e.target.value) || 0 }
                      : null
                  )
                }
                className="bg-white/5 border-white/10 text-white h-9 text-sm"
              />
            ) : (
              <p className="text-white/90 text-lg font-semibold">
                {employee.experience || 0} <span className="text-sm font-normal text-white/60">years</span>
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <Label className="text-white/50 text-xs uppercase tracking-wider">Salary</Label>
            </div>
            {isEditing ? (
              <Input
                type="number"
                value={editedEmployee.salary || 0}
                onChange={(e) =>
                  setEditedEmployee((prev) =>
                    prev
                      ? { ...prev, salary: parseInt(e.target.value) || 0 }
                      : null
                  )
                }
                className="bg-white/5 border-white/10 text-white h-9 text-sm"
              />
            ) : (
              <p className="text-white/90 text-lg font-semibold">
                {employee.salary
                  ? `₹${employee.salary.toLocaleString()}`
                  : <span className="text-sm font-normal text-white/60">Not disclosed</span>}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <Label className="text-white/50 text-xs uppercase tracking-wider">Role</Label>
            </div>
            <p className="text-white/90 text-lg font-semibold capitalize">{employee.role}</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <Label className="text-white/50 text-xs uppercase tracking-wider">Hire Date</Label>
            </div>
            <p className="text-white/90 text-lg font-semibold">
              {new Date(employee.hireDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmployeeDetailsPage({ employeeId }: EmployeeDetailsPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: employee,
    isLoading,
    isError,
  } = useGetEmployeeByIdQuery(employeeId);

  const { data: directReports = [] } = useGetEmployeesByManagerQuery(employeeId);
  const { data: employeeProjects = [], isLoading: isLoadingProjects } = useGetProjectsByEmployeeQuery(employeeId);

  const [updateEmployee, { isLoading: isSaving }] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedEmployee(null);
    } else if (employee) {
      setEditedEmployee({ ...employee });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (editedEmployee) {
      try {
        await updateEmployee({ id: employeeId, data: editedEmployee }).unwrap();
        toast.success("Employee updated successfully");
        setIsEditing(false);
        setEditedEmployee(null);
      } catch {
        toast.error("Failed to update employee");
      }
    }
  };

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      await deleteEmployee(employeeId).unwrap();
      toast.success("Employee deleted successfully");
      router.push("/admin/employees");
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <X className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-semibold text-foreground">
          Employee Not Found
        </h3>
        <p className="text-muted-foreground">
          The requested employee could not be loaded.
        </p>
        <Button variant="outline" onClick={handleBack}>
          Go Back
        </Button>
      </div>
    );
  }

  const currentEmployee = editedEmployee || employee;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-background/50 border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-medium">Employees</span>
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">
          {currentEmployee.name ||
            `${currentEmployee.firstName} ${currentEmployee.lastName}`}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-white/90">Employee Details</h1>
          <p className="text-white/60">
            View and manage employee profile information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/admin/employees/${employeeId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Full Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleEditToggle}
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEditToggle}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Employee Profile Card */}
      <EmployeeProfileCard
        employee={employee}
        isEditing={isEditing}
        editedEmployee={currentEmployee}
        setEditedEmployee={setEditedEmployee}
      />

      {/* Detailed Information Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-black/20 border-white/10 grid grid-cols-5 w-full">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-purple-500/20"
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-purple-500/20"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-purple-500/20"
          >
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-purple-500/20"
          >
            <Target className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-purple-500/20"
          >
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills & Certifications */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white/90 flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Skills & Certifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white/80 text-sm mb-2">
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills && employee.skills.length > 0 ? (
                      employee.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm">No skills added</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-white/80 text-sm mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.certifications &&
                    employee.certifications.length > 0 ? (
                      employee.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm">
                        No certifications added
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white/90 flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {employee.education?.degree ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Degree</span>
                      <span className="text-white/90">
                        {employee.education.degree}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">University</span>
                      <span className="text-white/90">
                        {employee.education.university}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Year of Passing</span>
                      <span className="text-white/90">
                        {employee.education.dateOfPassing
                          ? new Date(
                              employee.education.dateOfPassing
                            ).getFullYear()
                          : "N/A"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-white/60 text-sm">
                    No education details added
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white/90 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {employee.emergencyContact?.name ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Name</span>
                      <span className="text-white/90">
                        {employee.emergencyContact.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Relationship</span>
                      <span className="text-white/90">
                        {employee.emergencyContact.relationship}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Phone</span>
                      <span className="text-white/90">
                        {employee.emergencyContact.phone}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-white/60 text-sm">
                    No emergency contact added
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white/90 flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>Personal Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Gender</span>
                  <span className="text-white/90">
                    {employee.gender || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Date of Birth</span>
                  <span className="text-white/90">
                    {employee.dateOfBirth
                      ? new Date(employee.dateOfBirth).toLocaleDateString()
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Member Since</span>
                  <span className="text-white/90">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center justify-between">
                <span>Project Assignments ({employeeProjects.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : employeeProjects.length > 0 ? (
                <div className="space-y-4">
                  {employeeProjects.map((project) => {
                    const isManager = project.managerId === employeeId;
                    return (
                      <div
                        key={project.id}
                        className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer overflow-hidden"
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Cover Image */}
                          <div className="w-full h-40 sm:w-32 sm:h-32 shrink-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative">
                            {project.coverImage ? (
                              <img
                                src={project.coverImage}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Briefcase className="w-10 h-10 text-white/20" />
                              </div>
                            )}
                            {/* Role Badge - positioned on image for mobile */}
                            <div className="absolute top-2 right-2 sm:hidden">
                              {isManager ? (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs backdrop-blur-sm">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Manager
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs backdrop-blur-sm">
                                  <Users className="w-3 h-3 mr-1" />
                                  Team Member
                                </Badge>
                              )}
                            </div>
                            {/* Progress overlay for mobile */}
                            <div className="absolute bottom-2 right-2 sm:hidden bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                              <span className="text-white/90 text-sm font-medium">
                                {project.progressPercentage || 0}%
                              </span>
                            </div>
                          </div>
                          {/* Content */}
                          <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start sm:items-center gap-2 mb-2">
                                <h4 className="text-white/90 font-medium text-sm sm:text-base line-clamp-2 sm:truncate">
                                  {project.name}
                                </h4>
                                {/* Role badge for desktop */}
                                <div className="hidden sm:block shrink-0">
                                  {isManager ? (
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                      <Crown className="w-3 h-3 mr-1" />
                                      Manager
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                      <Users className="w-3 h-3 mr-1" />
                                      Team Member
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-white/60 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <Badge className={cn("text-xs", getProjectStatusColor(project.status))}>
                                  {project.status}
                                </Badge>
                                <Badge className={cn("text-xs", getProjectPriorityColor(project.priority))}>
                                  {project.priority}
                                </Badge>
                                <span className="text-white/50 text-xs flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  {project.type}
                                </span>
                                <span className="text-white/50 text-xs flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {project.location?.city}, {project.location?.state}
                                </span>
                              </div>
                              {/* Date for mobile - shown inline with badges */}
                              <p className="text-white/50 text-xs mt-2 sm:hidden">
                                Started: {new Date(project.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            {/* Progress section - hidden on mobile (shown on image instead) */}
                            <div className="hidden sm:block text-right shrink-0">
                              <div className="text-white/90 text-sm font-medium mb-1">
                                {project.progressPercentage || 0}%
                              </div>
                              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                  style={{ width: `${project.progressPercentage || 0}%` }}
                                />
                              </div>
                              <p className="text-white/50 text-xs mt-2">
                                {new Date(project.startDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Briefcase className="w-12 h-12 text-white/30 mb-4" />
                  <h4 className="text-white/70 font-medium mb-2">
                    No Projects Assigned
                  </h4>
                  <p className="text-white/50 text-sm max-w-md">
                    This employee is not currently assigned to any projects as a
                    manager or team member.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manager */}
            {employee.managerId && (
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white/90 flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span>Reports To</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white/90">
                        {employee.manager || "Manager"}
                      </p>
                      <p className="text-white/60 text-sm">Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Direct Reports */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white/90 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Direct Reports ({directReports.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {directReports.length > 0 ? (
                  <div className="space-y-3">
                    {directReports.map((report) => {
                      const reportAvatarUrl = getAvatarUrl(
                        report.avatarKey,
                        report.avatar
                      );
                      const reportInitials = report.name
                        ? report.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : `${report.firstName?.[0] || ""}${report.lastName?.[0] || ""}`;

                      return (
                        <div
                          key={report.id}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() =>
                            router.push(`/admin/employees/${report.id}`)
                          }
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={reportAvatarUrl || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                              {reportInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-white/90 text-sm">
                              {report.name ||
                                `${report.firstName} ${report.lastName}`}
                            </p>
                            <p className="text-white/60 text-xs">
                              {report.position}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              "text-xs",
                              getStatusColor(report.employmentStatus)
                            )}
                          >
                            {report.employmentStatus}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">No direct reports</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="w-12 h-12 text-white/30 mb-4" />
                <h4 className="text-white/70 font-medium mb-2">
                  Performance Tracking Coming Soon
                </h4>
                <p className="text-white/50 text-sm max-w-md">
                  Performance metrics and KPI tracking will be available in a
                  future update. You&apos;ll be able to track goals, reviews,
                  and achievements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Work History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-12 h-12 text-white/30 mb-4" />
                <h4 className="text-white/70 font-medium mb-2">
                  Work History Coming Soon
                </h4>
                <p className="text-white/50 text-sm max-w-md">
                  Employment history tracking will be available in a future
                  update. You&apos;ll be able to see position changes,
                  promotions, and career progression.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
