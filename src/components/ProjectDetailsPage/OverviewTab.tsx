import { useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Expand,
  Layers,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Target,
  User,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Image from "next/image";
import type { Project } from "@/types/project";
import { getTypeIcon } from "../ProjectsPage/projectHelpers";
import { EditTeamModal } from "./EditTeamModal";
import { useGetEmployeesQuery } from "@/lib/api/employeesApi";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

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

// Parse description to separate main description from client requirements
const parseDescription = (description: string) => {
  const clientReqMatch = description.match(/Client Requirements?:?\s*(.*)/i);
  if (clientReqMatch) {
    const mainDesc = description.slice(0, clientReqMatch.index).trim();
    const clientReq = clientReqMatch[1].trim();
    return { mainDescription: mainDesc, clientRequirements: clientReq };
  }
  return { mainDescription: description, clientRequirements: null };
};

// Hero Section Component
interface HeroSectionProps {
  project: Project;
  onViewFullImage: () => void;
}

function HeroSection({ project, onViewFullImage }: HeroSectionProps) {
  if (project.coverImage) {
    return (
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="relative w-full h-44 sm:h-52 md:h-60">
          <Image
            src={project.coverImage}
            alt={`${project.name} cover`}
            fill
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
            onClick={onViewFullImage}
          >
            <Expand className="h-4 w-4 mr-2" />
            View Full
          </Button>
          <HeroOverlay project={project} />
        </div>
      </Card>
    );
  }

  const TypeIcon = getTypeIcon(project.type);
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="relative w-full h-44 sm:h-52 md:h-60 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="w-20 h-20 text-gray-400 dark:text-gray-600 opacity-50" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        <HeroOverlay project={project} />
      </div>
    </Card>
  );
}

// Hero Overlay Component
function HeroOverlay({ project }: { project: Project }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Badge className={getPriorityColor(project.priority)}>
              {project.priority} Priority
            </Badge>
          </div>
          <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
            {project.name}
          </h2>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-2">
            <MapPin className="h-4 w-4" />
            <span>
              {project.location.city}, {project.location.state}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <p className="text-white/70 text-xs uppercase tracking-wide">
              Progress
            </p>
            <p className="text-white font-semibold text-lg">
              {project.progressPercentage ?? 0}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <p className="text-white/70 text-xs uppercase tracking-wide">
              Budget
            </p>
            <p className="text-white font-semibold text-lg">
              {formatCurrency(project.totalBudget)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <p className="text-white/70 text-xs uppercase tracking-wide">
              Team
            </p>
            <p className="text-white font-semibold text-lg">
              {project.teamMembers.length + 1}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Image Modal Component
function FullImageModal({
  show,
  coverImage,
  projectName,
  onClose,
}: {
  show: boolean;
  coverImage: string | undefined;
  projectName: string;
  onClose: () => void;
}) {
  if (!show || !coverImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      <div
        className="relative max-w-full max-h-full w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={coverImage}
          alt={`${projectName} cover`}
          fill
          className="object-contain rounded-lg"
          unoptimized
        />
      </div>
    </div>
  );
}

// Project Details Card Component
function ProjectDetailsCard({ project }: { project: Project }) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-indigo-500/[0.02] dark:from-blue-400/[0.05] dark:to-indigo-400/[0.05]"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-foreground text-base">
            Project Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="text-sm font-medium text-foreground">
            {project.type}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Category</span>
          <span className="text-sm font-medium text-foreground">
            {project.category || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className={`${getStatusColor(project.status)} text-xs`}>
            {project.status}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground">Priority</span>
          <Badge className={`${getPriorityColor(project.priority)} text-xs`}>
            {project.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Budget Card Component
function BudgetCard({
  project,
  budgetPercentage,
}: {
  project: Project;
  budgetPercentage: number;
}) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-foreground text-base">Budget</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(project.totalBudget)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Spent</span>
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(project.spentAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {formatCurrency(project.remainingBudget)}
          </span>
        </div>
        <div className="pt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Utilization</span>
            <span>{budgetPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={budgetPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

// Timeline Card Component
function TimelineCard({ project }: { project: Project }) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-foreground text-base">Timeline</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Start Date</span>
          <span className="text-sm font-medium text-foreground">
            {formatDate(project.startDate)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/30">
          <span className="text-sm text-muted-foreground">End Date</span>
          <span className="text-sm font-medium text-foreground">
            {formatDate(project.endDate)}
          </span>
        </div>
        {project.currentPhase && (
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Current Phase</span>
            <span className="text-sm font-medium text-foreground">
              {project.currentPhase}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground">Last Updated</span>
          <span className="text-sm font-medium text-muted-foreground">
            {formatDate(project.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Client Info Card Component
function ClientInfoCard({ project }: { project: Project }) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-foreground text-base">
            Client Information
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative">
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
            <h4 className="text-foreground font-medium">{project.client}</h4>
            <p className="text-sm text-muted-foreground">Client</p>
            <div className="mt-3 space-y-2">
              {project.clientPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{project.clientPhone}</span>
                </div>
              )}
              {project.clientEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{project.clientEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Client Card Component (for when no requirements exist)
function CompactClientCard({ project }: { project: Project }) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-foreground text-base">Client</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border-2 border-border/50">
            <AvatarImage
              src={`https://avatar.vercel.sh/${project.client}`}
              alt={project.client}
            />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 text-sm">
              {getInitials(project.client)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="text-foreground font-medium truncate">
              {project.client}
            </h4>
            {project.clientPhone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{project.clientPhone}</span>
              </div>
            )}
            {project.clientEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{project.clientEmail}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Location Card Component
function LocationCard({ project }: { project: Project }) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-teal-500/[0.02] dark:from-cyan-400/[0.05] dark:to-teal-400/[0.05]"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <CardTitle className="text-foreground text-base">
            Project Location
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Address
            </label>
            <p className="text-foreground mt-1">{project.location.address}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              City
            </label>
            <p className="text-foreground mt-1">{project.location.city}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              State
            </label>
            <p className="text-foreground mt-1">{project.location.state}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Employee type for team member details
interface TeamMember {
  id: string;
  name: string;
  avatarKey?: string;
  position?: string;
}

// Team Card Component
function TeamCard({
  project,
  managerDetails,
  teamMemberDetails,
  clientRequirements,
  onEditClick,
}: {
  project: Project;
  managerDetails: TeamMember | null;
  teamMemberDetails: TeamMember[];
  clientRequirements: string | null;
  onEditClick: () => void;
}) {
  const gridClass = !clientRequirements ? "sm:grid-cols-2 lg:grid-cols-3" : "";

  return (
    <Card
      className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 ${
        !clientRequirements ? "lg:col-span-2" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground text-base">
              Project Team
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={onEditClick}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          <div className={`grid gap-3 ${gridClass}`}>
            {/* Project Manager */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <Avatar className="h-9 w-9 border-2 border-white/40 dark:border-white/10 shadow-sm">
                <AvatarImage
                  src={getCloudFrontUrl(managerDetails?.avatarKey) || undefined}
                  alt={managerDetails?.name || project.projectManager}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-xs">
                  {getInitials(managerDetails?.name || project.projectManager)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">
                  {managerDetails?.name || project.projectManager}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {managerDetails?.position || "Project Manager"}
                </p>
              </div>
            </div>

            {/* Team Members */}
            {teamMemberDetails.length > 0
              ? teamMemberDetails.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-9 w-9 border-2 border-white/40 dark:border-white/10 shadow-sm">
                      <AvatarImage
                        src={getCloudFrontUrl(member.avatarKey) || undefined}
                        alt={member.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                        {member.name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.position}
                      </p>
                    </div>
                  </div>
                ))
              : project.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-9 w-9 border-2 border-white/40 dark:border-white/10 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                        {getInitials(member)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate">
                        {member}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Team Member
                      </p>
                    </div>
                  </div>
                ))}

            {project.teamMembers.length === 0 &&
              teamMemberDetails.length === 0 && (
                <p className="text-muted-foreground text-sm col-span-full">
                  No team members assigned yet
                </p>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewTab({ project }: OverviewTabProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);

  // Fetch employee data for team members and manager
  const { data: employeesData } = useGetEmployeesQuery(
    { limit: 100, employmentStatus: "Active" },
    { skip: !project.teamMemberIds?.length && !project.managerId }
  );

  // Get manager and team member details from fetched employees
  const managerDetails = useMemo(() => {
    if (!employeesData?.data || !project.managerId) {
      return null;
    }
    const manager = employeesData.data.find((e) => e.id === project.managerId);
    return manager
      ? {
          id: manager.id,
          name: manager.name,
          avatarKey: manager.avatarKey,
          position: manager.position,
        }
      : null;
  }, [employeesData, project.managerId]);

  const teamMemberDetails = useMemo((): TeamMember[] => {
    if (!employeesData?.data || !project.teamMemberIds?.length) {
      return [];
    }
    return project.teamMemberIds.reduce<TeamMember[]>((acc, id) => {
      const member = employeesData.data.find((e) => e.id === id);
      if (member) {
        acc.push({
          id: member.id,
          name: member.name,
          avatarKey: member.avatarKey,
          position: member.position,
        });
      }
      return acc;
    }, []);
  }, [employeesData, project.teamMemberIds]);

  const { mainDescription, clientRequirements } = parseDescription(
    project.description
  );
  const shouldTruncateDesc = mainDescription.length > 200;
  const shouldTruncateReq =
    clientRequirements && clientRequirements.length > 150;

  const budgetPercentage =
    project.totalBudget && project.spentAmount !== undefined
      ? (project.spentAmount / project.totalBudget) * 100
      : 0;

  const displayedDescription =
    shouldTruncateDesc && !isDescriptionExpanded
      ? `${mainDescription.slice(0, 200)}...`
      : mainDescription;

  const displayedRequirements =
    shouldTruncateReq && !isRequirementsExpanded
      ? `${clientRequirements?.slice(0, 150)}...`
      : clientRequirements;

  return (
    <div className="space-y-6">
      {/* Hero Section with Cover Image */}
      <div className="relative">
        <HeroSection
          project={project}
          onViewFullImage={() => setShowFullImage(true)}
        />
        <FullImageModal
          show={showFullImage}
          coverImage={project.coverImage}
          projectName={project.name}
          onClose={() => setShowFullImage(false)}
        />
      </div>

      {/* Description & Client Requirements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Description - Takes 2 columns */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/[0.02] to-zinc-500/[0.02] dark:from-slate-400/[0.05] dark:to-zinc-400/[0.05]"></div>
          <CardHeader className="relative pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-500/10 rounded-lg border border-slate-500/20">
                <Layers className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <CardTitle className="text-foreground">
                Project Description
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed">
                {displayedDescription}
              </p>
              {shouldTruncateDesc && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-primary"
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                >
                  {isDescriptionExpanded ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Project Tags */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
              <Badge variant="outline" className="text-xs">
                {project.type}
              </Badge>
              {project.category && (
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
              )}
              {project.currentPhase && (
                <Badge variant="outline" className="text-xs">
                  Phase: {project.currentPhase}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Requirements Card or Compact Client Card */}
        {clientRequirements ? (
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.02] to-pink-500/[0.02] dark:from-rose-400/[0.05] dark:to-pink-400/[0.05]"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <Target className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <CardTitle className="text-foreground text-base">
                  Client Requirements
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-foreground/90 text-sm leading-relaxed">
                {displayedRequirements}
              </p>
              {shouldTruncateReq && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-primary mt-2"
                  onClick={() =>
                    setIsRequirementsExpanded(!isRequirementsExpanded)
                  }
                >
                  {isRequirementsExpanded ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <CompactClientCard project={project} />
        )}
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectDetailsCard project={project} />
        <BudgetCard project={project} budgetPercentage={budgetPercentage} />
        <TimelineCard project={project} />
      </div>

      {/* Client & Team Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clientRequirements && <ClientInfoCard project={project} />}
        <TeamCard
          project={project}
          managerDetails={managerDetails}
          teamMemberDetails={teamMemberDetails}
          clientRequirements={clientRequirements}
          onEditClick={() => setShowEditTeamModal(true)}
        />
      </div>

      {/* Location Card */}
      <LocationCard project={project} />

      {/* Edit Team Modal */}
      <EditTeamModal
        open={showEditTeamModal}
        onOpenChange={setShowEditTeamModal}
        project={project}
      />
    </div>
  );
}
