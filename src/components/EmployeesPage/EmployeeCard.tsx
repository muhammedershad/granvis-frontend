import { Employee } from "../../types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  UserX,
} from "lucide-react";
import { cn } from "../ui/utils";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

interface EmployeeCardProps {
  employee: Employee;
  onSelect: (employeeId: string) => void;
  onDelete: (employeeId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "On Leave":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Inactive":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "Terminated":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="w-3 h-3" />;
    case "On Leave":
      return <Clock className="w-3 h-3" />;
    case "Inactive":
      return <AlertCircle className="w-3 h-3" />;
    case "Terminated":
      return <UserX className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

const getEmploymentTypeColor = (type: string) => {
  switch (type) {
    case "Full-time":
      return "bg-blue-500/20 text-blue-400";
    case "Part-time":
      return "bg-purple-500/20 text-purple-400";
    case "Contract":
      return "bg-orange-500/20 text-orange-400";
    case "Intern":
      return "bg-pink-500/20 text-pink-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getDepartmentColor = (department: string) => {
  switch (department) {
    case "architecture":
      return "bg-indigo-500/20 text-indigo-400";
    case "interior":
      return "bg-purple-500/20 text-purple-400";
    case "landscape":
      return "bg-green-500/20 text-green-400";
    case "construction":
      return "bg-orange-500/20 text-orange-400";
    case "drafting":
      return "bg-blue-500/20 text-blue-400";
    case "accountant":
      return "bg-emerald-500/20 text-emerald-400";
    case "admin":
      return "bg-gray-500/20 text-gray-400";
    case "marketing":
      return "bg-pink-500/20 text-pink-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

export function EmployeeCard({
  employee,
  onSelect,
  onDelete,
}: EmployeeCardProps) {
  return (
    <Card
      className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl dark:hover:shadow-black/70 cursor-pointer"
      onClick={() => onSelect(employee.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-blue-50/40 to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 group-hover:opacity-100 transition-opacity"></div>

      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-white/40 dark:border-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/30">
              <AvatarImage
                src={getCloudFrontUrl(employee.avatarKey) ?? undefined}
                alt={employee.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {employee.name[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-foreground text-base">
                {employee.name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {employee.position}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(employee.id);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Employee
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(employee.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2 mt-3 flex-wrap gap-2">
          <Badge
            className={cn(
              "flex items-center space-x-1",
              getStatusColor(employee.employmentStatus)
            )}
          >
            {getStatusIcon(employee.employmentStatus)}
            <span>{employee.employmentStatus}</span>
          </Badge>
          <Badge
            className={cn(
              "flex items-center space-x-1",
              getEmploymentTypeColor(employee.employmentType)
            )}
          >
            <span>{employee.employmentType}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <Badge
              className={cn(
                "flex items-center space-x-1",
                getDepartmentColor(employee.department)
              )}
            >
              <span>
                {employee.department
                  ? employee.department.charAt(0).toUpperCase() +
                    employee.department.slice(1)
                  : "N/A"}
              </span>
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {employee.email}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.phone}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-white/40 dark:border-white/10">
          <div>
            <p className="text-muted-foreground">Employee ID</p>
            <p className="text-foreground">{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Experience</p>
            <p className="text-foreground">{employee.experience} years</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
