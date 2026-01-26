import { Project } from "../../types/project";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "../ui/utils";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  getPriorityColor,
  getStatusColor,
  getStatusIcon,
  getTypeIcon,
} from "./projectHelpers";

interface ProjectCardViewProps {
  projects: Project[];
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string, projectName: string) => void;
}

export function ProjectCardView({
  projects,
  onSelect,
  onDelete,
}: ProjectCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => {
        const TypeIcon = getTypeIcon(project.type);
        return (
          <Card
            key={project.id}
            className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl dark:hover:shadow-black/70 cursor-pointer"
            onClick={() => onSelect(project.id)}
          >
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              {project.images && project.images.length > 0 ? (
                <ImageWithFallback
                  src={project.images[0]}
                  alt={project.name}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TypeIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 opacity-50" />
                </div>
              )}
              <div className="absolute top-3 left-3 p-2 bg-white/90 dark:bg-black/60 rounded-lg backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-lg">
                <TypeIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="absolute top-3 right-3">
                <Badge
                  className={cn(
                    "shadow-lg backdrop-blur-sm border",
                    getStatusColor(project.status)
                  )}
                >
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </Badge>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-blue-50/40 to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 group-hover:opacity-100 transition-opacity"></div>

            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-foreground text-base mb-1">
                    {project.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {project.client}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id, project.name);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-sm text-foreground">
                    {project.progressPercentage}%
                  </span>
                </div>
                <Progress
                  value={project.progressPercentage}
                  className="h-2 bg-white/50 dark:bg-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground">
                    {project.totalBudget
                      ? `₹${(project.totalBudget / 100000).toFixed(1)}L`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={getPriorityColor(project.priority)}
                >
                  {project.priority}
                </Badge>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.teamMembers.length + 1}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
