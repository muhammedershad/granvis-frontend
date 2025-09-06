import { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  Briefcase,
  Users,
  Building,
  Star,
  TrendingUp,
  FileText,
  Settings,
  MoreHorizontal,
  Camera,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Target,
  Activity,
  BookOpen,
  Zap
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Employee } from "../types/employee";
import { Project } from "../types/project";
import { cn } from "./ui/utils";

interface EmployeeDetailsPageProps {
  employeeId: string;
  onBack: () => void;
}

interface EmployeeProject {
  id: string;
  name: string;
  role: string;
  status: "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  progress: number;
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: "up" | "down" | "stable";
  period: string;
}

interface WorkHistoryEntry {
  id: string;
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

// Mock data for detailed employee information
const mockEmployeeDetails: Employee & {
  projects: EmployeeProject[];
  performance: PerformanceMetric[];
  workHistory: WorkHistoryEntry[];
  directReports: Employee[];
  manager: Employee | null;
  skills: string[];
  certifications: string[];
  bio: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
} = {
  id: "1",
  name: "Sarah Chen",
  email: "sarah.chen@company.com",
  phone: "+1 (555) 123-4567",
  position: "Senior Software Architect",
  department: "Engineering",
  status: "active",
  avatar: "",
  joinDate: "2021-03-15",
  employeeId: "EMP001",
  salary: 120000,
  location: "San Francisco, CA",
  bio: "Experienced software architect with 8+ years in full-stack development. Passionate about building scalable systems and mentoring junior developers. Leads the platform architecture team and drives technical decisions for our core products.",
  skills: ["React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL"],
  certifications: ["AWS Solutions Architect", "Google Cloud Professional", "Scrum Master"],
  emergencyContact: {
    name: "David Chen",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543"
  },
  projects: [
    {
      id: "1",
      name: "E-commerce Platform Redesign",
      role: "Technical Lead",
      status: "active",
      startDate: "2024-01-15",
      progress: 75
    },
    {
      id: "2",
      name: "Mobile App Backend",
      role: "Senior Developer",
      status: "completed",
      startDate: "2023-08-01",
      endDate: "2023-12-20",
      progress: 100
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      role: "Architect",
      status: "active",
      startDate: "2023-11-01",
      progress: 45
    }
  ],
  performance: [
    { id: "1", name: "Code Quality", value: 92, target: 85, trend: "up", period: "Q4 2023" },
    { id: "2", name: "Project Delivery", value: 88, target: 90, trend: "stable", period: "Q4 2023" },
    { id: "3", name: "Team Collaboration", value: 95, target: 80, trend: "up", period: "Q4 2023" },
    { id: "4", name: "Innovation", value: 85, target: 75, trend: "up", period: "Q4 2023" }
  ],
  workHistory: [
    {
      id: "1",
      position: "Senior Software Architect",
      department: "Engineering",
      startDate: "2023-01-01",
      description: "Lead technical architecture for core platform, mentoring team of 8 developers",
      achievements: [
        "Reduced system response time by 40%",
        "Successfully migrated legacy systems to microservices",
        "Implemented CI/CD pipeline improving deployment efficiency by 60%"
      ]
    },
    {
      id: "2",
      position: "Senior Software Engineer",
      department: "Engineering",
      startDate: "2021-03-15",
      endDate: "2022-12-31",
      description: "Full-stack development on core product features",
      achievements: [
        "Built real-time notification system handling 1M+ daily events",
        "Designed and implemented user authentication system",
        "Mentored 3 junior developers"
      ]
    }
  ],
  directReports: [
    {
      id: "2",
      name: "Alex Thompson",
      email: "alex.thompson@company.com",
      position: "Software Engineer",
      department: "Engineering",
      status: "active",
      avatar: "",
      joinDate: "2022-06-01",
      employeeId: "EMP002",
      phone: "",
      salary: 0,
      location: ""
    },
    {
      id: "3",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@company.com",
      position: "Frontend Developer",
      department: "Engineering",
      status: "active",
      avatar: "",
      joinDate: "2023-02-15",
      employeeId: "EMP003",
      phone: "",
      salary: 0,
      location: ""
    }
  ],
  manager: {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@company.com",
    position: "Engineering Director",
    department: "Engineering",
    status: "active",
    avatar: "",
    joinDate: "2020-01-10",
    employeeId: "EMP004",
    phone: "",
    salary: 0,
    location: ""
  }
};

export function EmployeeDetailsPage({ employeeId, onBack }: EmployeeDetailsPageProps) {
  const [employee, setEmployee] = useState(mockEmployeeDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // In a real app, fetch employee details by ID
    console.log("Loading employee details for ID:", employeeId);
  }, [employeeId]);

  const handleSave = () => {
    setEmployee(editedEmployee);
    setIsEditing(false);
    console.log("Employee updated:", editedEmployee);
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-3 h-3 text-green-400" />;
      case "down": return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default: return <Activity className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-white/90">Employee Details</h1>
          <p className="text-white/60">Comprehensive employee profile and management</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Employee Profile Card */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
        <CardContent className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white/10">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <Badge className={cn("mb-2", getStatusColor(employee.status))}>
                  {employee.status}
                </Badge>
                <p className="text-white/60 text-sm">Employee ID: {employee.employeeId}</p>
                <p className="text-white/60 text-sm">Joined: {new Date(employee.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Employee Details */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-white/90 flex items-center space-x-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Personal Information</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white/70 text-sm">Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedEmployee.name}
                          onChange={(e) => setEditedEmployee(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      ) : (
                        <p className="text-white/90 text-lg">{employee.name}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white/70 text-sm">Position</Label>
                      {isEditing ? (
                        <Input
                          value={editedEmployee.position}
                          onChange={(e) => setEditedEmployee(prev => ({ ...prev, position: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      ) : (
                        <p className="text-white/90">{employee.position}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white/70 text-sm">Department</Label>
                      {isEditing ? (
                        <Select
                          value={editedEmployee.department}
                          onValueChange={(value) => setEditedEmployee(prev => ({ ...prev, department: value }))}
                        >
                          <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="HR">Human Resources</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-white/90">{employee.department}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-white/90 flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Contact Information</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-white/60" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedEmployee.email}
                          onChange={(e) => setEditedEmployee(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      ) : (
                        <span className="text-white/90">{employee.email}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-white/60" />
                      {isEditing ? (
                        <Input
                          value={editedEmployee.phone}
                          onChange={(e) => setEditedEmployee(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      ) : (
                        <span className="text-white/90">{employee.phone}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-white/60" />
                      {isEditing ? (
                        <Input
                          value={editedEmployee.location}
                          onChange={(e) => setEditedEmployee(prev => ({ ...prev, location: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      ) : (
                        <span className="text-white/90">{employee.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={editedEmployee.bio}
                    onChange={(e) => setEditedEmployee(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    placeholder="Employee bio..."
                  />
                ) : (
                  <p className="text-white/80 text-sm leading-relaxed">{employee.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-black/20 border-white/10 grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500/20">
            <Briefcase className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-purple-500/20">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-500/20">
            <Target className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-500/20">
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
                  <h4 className="text-white/80 text-sm mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white/80 text-sm mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Name</span>
                  <span className="text-white/90">{employee.emergencyContact.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Relationship</span>
                  <span className="text-white/90">{employee.emergencyContact.relationship}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Phone</span>
                  <span className="text-white/90">{employee.emergencyContact.phone}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white/90">Project Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.projects.map((project) => (
                  <div key={project.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white/90">{project.name}</h4>
                        <p className="text-white/60 text-sm">{project.role}</p>
                      </div>
                      <Badge className={cn(getStatusColor(project.status))}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Progress</span>
                        <span className="text-white/90">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-white/10" />
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span>Started: {project.startDate}</span>
                        {project.endDate && <span>Completed: {project.endDate}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manager */}
            {employee.manager && (
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
                      <AvatarImage src={employee.manager.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                        {employee.manager.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white/90">{employee.manager.name}</p>
                      <p className="text-white/60 text-sm">{employee.manager.position}</p>
                      <p className="text-white/60 text-sm">{employee.manager.email}</p>
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
                  <span>Direct Reports ({employee.directReports.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.directReports.map((report) => (
                    <div key={report.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={report.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                          {report.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white/90 text-sm">{report.name}</p>
                        <p className="text-white/60 text-xs">{report.position}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employee.performance.map((metric) => (
              <Card key={metric.id} className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white/90">{metric.name}</h4>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className="text-white/60 text-sm">{metric.period}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Current</span>
                      <span className="text-white/90">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2 bg-white/10" />
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>Target: {metric.target}%</span>
                      <span className={cn(
                        metric.value >= metric.target ? "text-green-400" : "text-yellow-400"
                      )}>
                        {metric.value >= metric.target ? "✓ Achieved" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white/90">Work History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employee.workHistory.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    {/* Timeline connector */}
                    {index !== employee.workHistory.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-white/20"></div>
                    )}
                    
                    <div className="flex space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-white/90">{entry.position}</h4>
                          <p className="text-white/70 text-sm">{entry.department}</p>
                          <p className="text-white/60 text-sm">
                            {entry.startDate} - {entry.endDate || "Present"}
                          </p>
                        </div>
                        <p className="text-white/80 text-sm">{entry.description}</p>
                        <div className="space-y-2">
                          <h5 className="text-white/80 text-sm">Key Achievements:</h5>
                          <ul className="space-y-1">
                            {entry.achievements.map((achievement, i) => (
                              <li key={i} className="text-white/70 text-sm flex items-start space-x-2">
                                <Star className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}