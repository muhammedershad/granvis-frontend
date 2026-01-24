import {
  Building2,
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
import { formatDate, getStatusColor } from "./utils";
import type { Project } from "./types";

interface OverviewTabProps {
  project: Project;
}

export function OverviewTab({ project }: OverviewTabProps) {
  return (
    <div className="space-y-6">
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
                  <p className="text-foreground mt-1">{project.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={getStatusColor(
                        project.status.toLowerCase().replace(" ", "-")
                      )}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Priority
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={getStatusColor(project.priority.toLowerCase())}
                    >
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Current Phase
                </label>
                <p className="text-foreground mt-1">{project.currentPhase}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Progress
                </label>
                <div className="mt-2">
                  <Progress
                    value={project.progressPercentage}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.progressPercentage}% Complete
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/30">
                    {tag}
                  </Badge>
                ))}
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
                  src={`https://avatar.vercel.sh/${project.client.name}`}
                  alt={project.client.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                  {project.client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-foreground">{project.client.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.client.company}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{project.client.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{project.client.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-foreground">
                  {project.client.address}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {project.projectManager
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
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
                      {member
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{member}</p>
                    <p className="text-xs text-muted-foreground">Team Member</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Location & Timeline */}
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-foreground">
                Location & Dates
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Project Location
              </label>
              <p className="text-foreground mt-1">
                {project.location.address}, {project.location.city},{" "}
                {project.location.state} {project.location.country}
              </p>
            </div>
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
              <label className="text-sm text-muted-foreground">Deadline</label>
              <p className="text-foreground mt-1">
                {formatDate(project.deadline)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
