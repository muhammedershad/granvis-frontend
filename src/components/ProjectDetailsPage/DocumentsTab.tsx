import {
  Download,
  ExternalLink,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  MoreHorizontal,
  Plus,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { ProjectDocument } from "@/types/project";

interface DocumentsTabProps {
  documents: ProjectDocument[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFileIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (
    lowerType.includes("image") ||
    lowerType.includes("png") ||
    lowerType.includes("jpg") ||
    lowerType.includes("jpeg")
  ) {
    return <FileImage className="h-5 w-5 text-green-600 dark:text-green-400" />;
  }
  if (lowerType.includes("pdf")) {
    return <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />;
  }
  if (lowerType.includes("video") || lowerType.includes("mp4")) {
    return (
      <FileVideo className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    );
  }
  if (
    lowerType.includes("excel") ||
    lowerType.includes("spreadsheet") ||
    lowerType.includes("xlsx") ||
    lowerType.includes("csv")
  ) {
    return (
      <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    );
  }
  if (lowerType.includes("doc") || lowerType.includes("word")) {
    return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
  }
  return <File className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
};

const getFileTypeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (
    lowerType.includes("image") ||
    lowerType.includes("png") ||
    lowerType.includes("jpg")
  ) {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
  }
  if (lowerType.includes("pdf")) {
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
  }
  if (lowerType.includes("video")) {
    return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
  }
  if (
    lowerType.includes("excel") ||
    lowerType.includes("spreadsheet") ||
    lowerType.includes("xlsx")
  ) {
    return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
  }
  return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
};

export function DocumentsTab({ documents }: DocumentsTabProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">
              Project Documents ({documents.length})
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-foreground font-medium mb-2">
              No Documents Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Upload project documents, drawings, and files to get started.
            </p>
            <Button
              variant="outline"
              className="bg-background/50 hover:bg-muted/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload First Document
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <Card key={document.id} className="border-border/50 bg-card/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        {getFileIcon(document.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-foreground font-medium mb-1">
                          {document.name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge className={getFileTypeColor(document.type)}>
                            {document.type}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{document.uploadedBy}</span>
                          </div>
                          <span>
                            Uploaded {formatDate(document.uploadedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(document.url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(document.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
