import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Users,
  Building2,
  Calendar,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserPlus,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { Employee, EmployeeFilters, EmployeeSort } from "../types/employee";

// Enhanced mock data with more employees
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@architecturalpro.com",
    phone: "+1 (555) 123-4567",
    employeeId: "EMP001",
    position: "Senior Architect",
    department: "Design",
    team: "Residential Projects",
    manager: "Jane Smith",
    hireDate: "2022-03-15",
    employmentStatus: "Active",
    employmentType: "Full-time",
    salary: 95000,
    dateOfBirth: "1985-07-20",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 (555) 123-4568"
    },
    skills: ["AutoCAD", "Revit", "3D Modeling", "Project Management"],
    experience: 8,
    education: "Master's in Architecture",
    certifications: ["LEED AP", "NCARB"],
    createdAt: "2022-03-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@architecturalpro.com",
    phone: "+1 (555) 234-5678",
    employeeId: "EMP002",
    position: "Interior Designer",
    department: "Interior Design",
    team: "Commercial Projects",
    manager: "Mike Wilson",
    hireDate: "2023-01-10",
    employmentStatus: "Active",
    employmentType: "Full-time",
    salary: 72000,
    dateOfBirth: "1990-03-12",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    emergencyContact: {
      name: "Tom Johnson",
      relationship: "Brother",
      phone: "+1 (555) 234-5679"
    },
    skills: ["Interior Design", "Space Planning", "3D Visualization", "Color Theory"],
    experience: 5,
    education: "Bachelor's in Interior Design",
    certifications: ["NCIDQ", "LEED Green Associate"],
    createdAt: "2023-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@architecturalpro.com",
    phone: "+1 (555) 345-6789",
    employeeId: "EMP003",
    position: "Landscape Architect",
    department: "Landscape",
    team: "Urban Planning",
    manager: "Lisa Brown",
    hireDate: "2021-08-20",
    employmentStatus: "Active",
    employmentType: "Full-time",
    salary: 88000,
    dateOfBirth: "1987-11-05",
    address: {
      street: "789 Pine St",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    emergencyContact: {
      name: "Lisa Chen",
      relationship: "Spouse",
      phone: "+1 (555) 345-6790"
    },
    skills: ["Landscape Design", "Site Planning", "Sustainability", "GIS"],
    experience: 6,
    education: "Master's in Landscape Architecture",
    certifications: ["PLA", "LEED AP"],
    createdAt: "2021-08-20",
    updatedAt: "2024-01-15"
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@architecturalpro.com",
    phone: "+1 (555) 456-7890",
    employeeId: "EMP004",
    position: "Project Manager",
    department: "Project Management",
    team: "Large Scale Projects",
    manager: "David Lee",
    hireDate: "2023-06-01",
    employmentStatus: "Active",
    employmentType: "Full-time",
    salary: 85000,
    dateOfBirth: "1988-04-18",
    address: {
      street: "321 Elm St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Father",
      phone: "+1 (555) 456-7891"
    },
    skills: ["Project Management", "Agile", "Risk Management", "Team Leadership"],
    experience: 7,
    education: "Master's in Project Management",
    certifications: ["PMP", "PRINCE2"],
    createdAt: "2023-06-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "5",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@architecturalpro.com",
    phone: "+1 (555) 567-8901",
    employeeId: "EMP005",
    position: "Structural Engineer",
    department: "Engineering",
    team: "Structural Analysis",
    manager: "Angela Davis",
    hireDate: "2022-09-12",
    employmentStatus: "Active",
    employmentType: "Full-time",
    salary: 92000,
    dateOfBirth: "1986-12-03",
    address: {
      street: "654 Maple Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA"
    },
    emergencyContact: {
      name: "Mary Wilson",
      relationship: "Mother",
      phone: "+1 (555) 567-8902"
    },
    skills: ["Structural Analysis", "AutoCAD", "SAP2000", "Steel Design"],
    experience: 9,
    education: "Master's in Structural Engineering",
    certifications: ["PE", "SE"],
    createdAt: "2022-09-12",
    updatedAt: "2024-01-15"
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@architecturalpro.com",
    phone: "+1 (555) 678-9012",
    employeeId: "EMP006",
    position: "Junior Architect",
    department: "Design",
    team: "Residential Projects",
    manager: "John Doe",
    hireDate: "2024-01-08",
    employmentStatus: "Active",
    employmentType: "Full-time",
    salary: 68000,
    dateOfBirth: "1995-08-25",
    address: {
      street: "987 Cedar Ln",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA"
    },
    emergencyContact: {
      name: "Robert Thompson",
      relationship: "Father",
      phone: "+1 (555) 678-9013"
    },
    skills: ["AutoCAD", "SketchUp", "Adobe Creative Suite", "3D Modeling"],
    experience: 2,
    education: "Bachelor's in Architecture",
    certifications: [],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-15"
  },
  {
    id: "7",
    firstName: "David",
    lastName: "Martinez",
    email: "david.martinez@architecturalpro.com",
    phone: "+1 (555) 789-0123",
    employeeId: "EMP007",
    position: "CAD Technician",
    department: "Design",
    team: "Technical Support",
    manager: "John Doe",
    hireDate: "2023-11-20",
    employmentStatus: "On Leave",
    employmentType: "Full-time",
    salary: 55000,
    dateOfBirth: "1992-02-14",
    address: {
      street: "147 Birch St",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      country: "USA"
    },
    emergencyContact: {
      name: "Sofia Martinez",
      relationship: "Spouse",
      phone: "+1 (555) 789-0124"
    },
    skills: ["AutoCAD", "Revit", "Technical Drawing", "BIM"],
    experience: 4,
    education: "Associate's in CAD Technology",
    certifications: ["AutoCAD Certified User"],
    createdAt: "2023-11-20",
    updatedAt: "2024-01-15"
  },
  {
    id: "8",
    firstName: "Amanda",
    lastName: "Lee",
    email: "amanda.lee@architecturalpro.com",
    phone: "+1 (555) 890-1234",
    employeeId: "EMP008",
    position: "Design Consultant",
    department: "Interior Design",
    team: "Luxury Projects",
    manager: "Sarah Johnson",
    hireDate: "2023-04-03",
    employmentStatus: "Active",
    employmentType: "Part-time",
    salary: 45000,
    dateOfBirth: "1991-06-09",
    address: {
      street: "258 Spruce Way",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    emergencyContact: {
      name: "Kevin Lee",
      relationship: "Brother",
      phone: "+1 (555) 890-1235"
    },
    skills: ["Interior Design", "Color Consultation", "Space Planning", "Client Relations"],
    experience: 6,
    education: "Bachelor's in Interior Design",
    certifications: ["NCIDQ"],
    createdAt: "2023-04-03",
    updatedAt: "2024-01-15"
  }
];

const ITEMS_PER_PAGE = 10;

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department: "all",
    position: "all",
    employmentStatus: "all",
    employmentType: "all"
  });
  const [sort, setSort] = useState<EmployeeSort>({
    field: "firstName",
    direction: "asc"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get unique values for filter options
  const departments = [...new Set(employees.map(emp => emp.department))];
  const positions = [...new Set(employees.map(emp => emp.position))];
  const statuses = [...new Set(employees.map(emp => emp.employmentStatus))];
  const types = [...new Set(employees.map(emp => emp.employmentType))];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.employmentStatus === "Active").length;
    const onLeave = employees.filter(e => e.employmentStatus === "On Leave").length;
    const newThisMonth = employees.filter(e => {
      const hireDate = new Date(e.hireDate);
      const now = new Date();
      return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
    }).length;

    return { total, active, onLeave, newThisMonth, departments: departments.length };
  }, [employees, departments]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        employee.firstName.toLowerCase().includes(searchTerm) ||
        employee.lastName.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.employeeId.toLowerCase().includes(searchTerm);

      const matchesDepartment = filters.department === "all" || employee.department === filters.department;
      const matchesPosition = filters.position === "all" || employee.position === filters.position;
      const matchesStatus = filters.employmentStatus === "all" || employee.employmentStatus === filters.employmentStatus;
      const matchesType = filters.employmentType === "all" || employee.employmentType === filters.employmentType;

      return matchesSearch && matchesDepartment && matchesPosition && matchesStatus && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, filters, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof Employee) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (field: keyof Employee) => {
    if (sort.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sort.direction === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "On Leave": return "outline";
      case "Terminated": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-3 h-3" />;
      case "On Leave": return <Clock className="w-3 h-3" />;
      case "Inactive": return <AlertCircle className="w-3 h-3" />;
      case "Terminated": return <AlertCircle className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEmployees(prev => [...prev, employee]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-white/90">Employee Management</h1>
          <p className="text-white/60">Manage your team members and their information</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white/90">Add New Employee</DialogTitle>
              </DialogHeader>
              <AddEmployeeForm onSubmit={handleAddEmployee} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Employees</p>
              <div className="flex items-center space-x-2">
                <p className="text-white/90 text-2xl">{stats.total}</p>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Active Employees</p>
              <div className="flex items-center space-x-2">
                <p className="text-white/90 text-2xl">{stats.active}</p>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  {Math.round((stats.active / stats.total) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Departments</p>
              <p className="text-white/90 text-2xl">{stats.departments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
              <UserPlus className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">New This Month</p>
              <p className="text-white/90 text-2xl">{stats.newThisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="p-6 bg-black/20 border-white/10 backdrop-blur-xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-white/90 text-lg mb-4">Search & Filter Employees</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
            
            <Select value={filters.department} onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.position} onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.employmentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, employmentStatus: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setFilters({ search: "", department: "all", position: "all", employmentStatus: "all", employmentType: "all" })}
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          
          {filteredAndSortedEmployees.length !== employees.length && (
            <div className="text-white/60 text-sm">
              Showing {filteredAndSortedEmployees.length} of {employees.length} employees
            </div>
          )}
        </div>
      </Card>

      {/* Enhanced Employee Table */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white/70">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("firstName")}
                    className="h-auto p-0 text-white/70 hover:text-white transition-colors"
                  >
                    Employee {getSortIcon("firstName")}
                  </Button>
                </TableHead>
                <TableHead className="text-white/70">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("position")}
                    className="h-auto p-0 text-white/70 hover:text-white transition-colors"
                  >
                    Position {getSortIcon("position")}
                  </Button>
                </TableHead>
                <TableHead className="text-white/70">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("department")}
                    className="h-auto p-0 text-white/70 hover:text-white transition-colors"
                  >
                    Department {getSortIcon("department")}
                  </Button>
                </TableHead>
                <TableHead className="text-white/70">Contact</TableHead>
                <TableHead className="text-white/70">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("employmentStatus")}
                    className="h-auto p-0 text-white/70 hover:text-white transition-colors"
                  >
                    Status {getSortIcon("employmentStatus")}
                  </Button>
                </TableHead>
                <TableHead className="text-white/70">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("hireDate")}
                    className="h-auto p-0 text-white/70 hover:text-white transition-colors"
                  >
                    Hire Date {getSortIcon("hireDate")}
                  </Button>
                </TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-11 h-11 border-2 border-white/10">
                        <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white/90">{employee.firstName} {employee.lastName}</p>
                        <p className="text-white/50 text-sm">{employee.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white/80">{employee.position}</p>
                      <p className="text-white/50 text-sm">{employee.experience} years exp.</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white/80">{employee.department}</p>
                      <p className="text-white/50 text-sm">{employee.team}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-white/40" />
                        <span className="text-white/70 text-sm truncate max-w-[180px]">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-white/40" />
                        <span className="text-white/70 text-sm">{employee.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(employee.employmentStatus)} className="flex items-center space-x-1">
                      {getStatusIcon(employee.employmentStatus)}
                      <span>{employee.employmentStatus}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">
                    <div>
                      <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
                      <p className="text-white/50 text-xs">{employee.employmentType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                        <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Employee
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Employee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/2">
            <div className="text-white/60 text-sm">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedEmployees.length)} of {filteredAndSortedEmployees.length} employees
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={cn(
                        "w-8 h-8 p-0",
                        currentPage === pageNumber 
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}