"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, FolderOpen, UserCircle } from "lucide-react";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  Planning:
    "bg-yellow-100/80 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30",
  "In Progress":
    "bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  "On Hold":
    "bg-orange-100/80 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
  Completed:
    "bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30",
  Cancelled:
    "bg-red-100/80 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30",
};

interface MyProjectsListProps {
  data: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    progressPercentage: number;
    client: string;
    startDate: string;
    endDate?: string;
    role: string;
  }>;
}

export function MyProjectsList({ data }: MyProjectsListProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-slate-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">My Projects</h3>
          <Badge
            variant="secondary"
            className="bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30"
          >
            {data.length} projects
          </Badge>
        </div>

        <div className="space-y-3">
          {data.map((project) => (
            <div
              key={project.id}
              className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-500/30 dark:to-indigo-500/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/20">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${
                          project.role === "manager"
                            ? "bg-purple-100/80 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30"
                            : "bg-cyan-100/80 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30"
                        }`}
                      >
                        <UserCircle className="w-3 h-3 mr-0.5" />
                        {project.role === "manager" ? "Manager" : "Member"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${STATUS_STYLES[project.status] || ""}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {project.type}
                    </span>
                    <span>{project.client}</span>
                    {project.startDate && (
                      <span className="ml-auto">
                        {format(new Date(project.startDate), "MMM d, yyyy")}
                        {project.endDate &&
                          ` - ${format(new Date(project.endDate), "MMM d, yyyy")}`}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress
                      value={project.progressPercentage}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                      {project.progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
