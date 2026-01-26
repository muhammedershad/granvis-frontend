"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-foreground">{projectName}</h1>
          <p className="text-muted-foreground">Project Details & Management</p>
        </div>
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
  );
}
