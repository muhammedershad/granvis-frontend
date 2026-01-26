import {
  Building2,
  DollarSign,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import type { Project } from "@/types/project";

interface OverviewTabProps {
  project: Project;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "N/A";
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number | undefined) => {
  if (!amount) {
    return "N/A";
  }
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase().replace(" ", "-");
  switch (statusLower) {
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    case "planning":
      return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
    case "on-hold":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
    case "medium":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    case "low":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function OverviewTab({ project }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Project Cover Image */}
      {project.coverImage ? (
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="relative h-48 sm:h-64 md:h-80 w-full">
            <img
              src={project.coverImage}
              alt={`${project.name} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-xl sm:text-2xl font-semibold drop-shadow-lg">
                {project.name}
              </h2>
              <p className="text-white/80 text-sm mt-1 drop-shadow">
                {project.location.city}, {project.location.state}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="relative h-32 w-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20">
            <div className="text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No cover image</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Information */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-foreground">
                Project Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  Description
                </label>
                <p className="text-foreground mt-1">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Type</label>
                  <p className="text-foreground mt-1">{project.type}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Category
                  </label>
                  <p className="text-foreground mt-1">
                    {project.category || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Priority
                  </label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              {project.currentPhase && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    Current Phase
                  </label>
                  <p className="text-foreground mt-1">{project.currentPhase}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">
                  Progress
                </label>
                <div className="mt-2">
                  <Progress
                    value={project.progressPercentage ?? 0}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.progressPercentage ?? 0}% Complete
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-foreground">
                Client Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-border/50">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${project.client}`}
                  alt={project.client}
                />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                  {getInitials(project.client)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-foreground font-medium">
                  {project.client}
                </h3>
                <p className="text-sm text-muted-foreground">Client</p>
              </div>
            </div>

            <div className="space-y-3">
              {project.clientPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{project.clientPhone}</span>
                </div>
              )}
              {project.clientEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{project.clientEmail}</span>
                </div>
              )}
              {!project.clientPhone && !project.clientEmail && (
                <p className="text-muted-foreground text-sm">
                  No contact information available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Information */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] to-emerald-500/[0.02] dark:from-green-400/[0.05] dark:to-emerald-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-foreground">
                Budget Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Total Budget
                </label>
                <p className="text-foreground mt-1 font-medium">
                  {formatCurrency(project.totalBudget)}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Spent Amount
                </label>
                <p className="text-foreground mt-1 font-medium">
                  {formatCurrency(project.spentAmount)}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Remaining
                </label>
                <p className="text-foreground mt-1 font-medium">
                  {formatCurrency(project.remainingBudget)}
                </p>
              </div>
            </div>
            {project.totalBudget && project.spentAmount !== undefined && (
              <div>
                <label className="text-sm text-muted-foreground">
                  Budget Utilization
                </label>
                <div className="mt-2">
                  <Progress
                    value={
                      project.totalBudget > 0
                        ? (project.spentAmount / project.totalBudget) * 100
                        : 0
                    }
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.totalBudget > 0
                      ? (
                          (project.spentAmount / project.totalBudget) *
                          100
                        ).toFixed(1)
                      : 0}
                    % Used
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Team */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-foreground">Project Team</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${project.projectManager}`}
                    alt={project.projectManager}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 text-xs">
                    {getInitials(project.projectManager)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-foreground text-sm">
                    {project.projectManager}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Project Manager
                  </p>
                </div>
              </div>
              {project.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${member}`}
                      alt={member}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 text-xs">
                      {getInitials(member)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{member}</p>
                    <p className="text-xs text-muted-foreground">Team Member</p>
                  </div>
                </div>
              ))}
              {project.teamMembers.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No team members assigned yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Location */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-foreground">
                Project Location
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Address</label>
              <p className="text-foreground mt-1">{project.location.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">City</label>
                <p className="text-foreground mt-1">{project.location.city}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">State</label>
                <p className="text-foreground mt-1">{project.location.state}</p>
              </div>
            </div>
            {project.location.country && (
              <div>
                <label className="text-sm text-muted-foreground">Country</label>
                <p className="text-foreground mt-1">
                  {project.location.country}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Timeline */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-blue-500/[0.02] dark:from-cyan-400/[0.05] dark:to-blue-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Building2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-foreground">
                Project Timeline
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Start Date
                </label>
                <p className="text-foreground mt-1">
                  {formatDate(project.startDate)}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  End Date
                </label>
                <p className="text-foreground mt-1">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Created At
              </label>
              <p className="text-foreground mt-1">
                {formatDate(project.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Last Updated
              </label>
              <p className="text-foreground mt-1">
                {formatDate(project.updatedAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
