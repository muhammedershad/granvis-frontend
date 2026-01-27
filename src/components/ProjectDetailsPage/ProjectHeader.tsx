"use client";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Download,
  Edit,
  FileText,
  Home,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ProjectHeaderProps {
  projectName: string;
  projectId: string;
  onBack: () => void;
  basePath?: string;
}

export function ProjectHeader({
  projectName,
  projectId,
  onBack,
  basePath = "/super-admin/projects",
}: ProjectHeaderProps) {
  const router = useRouter();

  const handleEditProject = () => {
    router.push(`${basePath}/${projectId}/edit`);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-background/50 border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-medium">Projects</span>
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">{projectName}</span>
      </div>

      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-foreground">{projectName}</h1>
        <p className="text-muted-foreground">Project Details & Management</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-background/50 hover:bg-muted/50"
          onClick={handleEditProject}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    </div>
  );
}
