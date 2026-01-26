import { Project } from "../../types/project";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  getPriorityColor,
  getStatusColor,
  getStatusIcon,
  getTypeIcon,
} from "./projectHelpers";

interface ProjectTableViewProps {
  projects: Project[];
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string, projectName: string) => void;
  sortField: keyof Project;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Project) => void;
}

export function ProjectTableView({
  projects,
  onSelect,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: ProjectTableViewProps) {
  const getSortIcon = (field: keyof Project) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <CardContent className="relative p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5">
              <TableHead className="text-foreground w-[200px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort("name")}
                  className="h-auto p-0 text-left justify-start text-foreground"
                >
                  Project Name
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="text-foreground">Client</TableHead>
              <TableHead className="text-foreground">Type</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Priority</TableHead>
              <TableHead className="text-foreground">Progress</TableHead>
              <TableHead className="text-foreground">Budget</TableHead>
              <TableHead className="text-foreground">End Date</TableHead>
              <TableHead className="text-foreground w-[50px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const TypeIcon = getTypeIcon(project.type);
              return (
                <TableRow
                  key={project.id}
                  className="border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer"
                  onClick={() => onSelect(project.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {project.images && project.images.length > 0 && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 dark:border-white/10">
                          <ImageWithFallback
                            src={project.images[0]}
                            alt={project.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {project.client}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {project.type}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{project.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(project.priority)}
                    >
                      {project.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={project.progressPercentage}
                        className="w-16 h-2"
                      />
                      <span className="text-sm text-foreground">
                        {project.progressPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {project.totalBudget
                      ? `₹${(project.totalBudget / 100000).toFixed(1)}L`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
