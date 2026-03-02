import { Employee } from "../../types/employee";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
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

interface EmployeeTableViewProps {
  employees: Employee[];
  onSelect: (employeeId: string) => void;
  onDelete: (employeeId: string) => void;
  sortField: keyof Employee;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Employee) => void;
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

export function EmployeeTableView({
  employees,
  onSelect,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: EmployeeTableViewProps) {
  const getSortIcon = (field: keyof Employee) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/40 dark:border-white/10">
              <TableHead className="text-muted-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                  Employee {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="text-muted-foreground">
                Department
              </TableHead>
              <TableHead className="text-muted-foreground">Contact</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">
                Employee ID
              </TableHead>
              <TableHead className="text-muted-foreground">
                Experience
              </TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee.id}
                className="border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
                onClick={() => onSelect(employee.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-white/40 dark:border-white/10 shadow-sm">
                      <AvatarImage
                        src={getCloudFrontUrl(employee.avatarKey) ?? undefined}
                        alt={employee.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {employee.name[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">{employee.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {employee.position}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center space-x-1 w-fit",
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
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {employee.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {employee.phone}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center space-x-1 w-fit",
                      getStatusColor(employee.employmentStatus)
                    )}
                  >
                    {getStatusIcon(employee.employmentStatus)}
                    <span>{employee.employmentStatus}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center space-x-1 w-fit",
                      getEmploymentTypeColor(employee.employmentType)
                    )}
                  >
                    <span>{employee.employmentType}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {employee.employeeId}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {employee.experience} years
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
