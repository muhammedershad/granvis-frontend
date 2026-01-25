import { Client } from "@/types/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { formatIndianCurrency } from "@/lib/utils/currency";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

interface ClientTableViewProps {
  clients: Client[];
  onSelect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  sortField: keyof Client;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Client) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Potential":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Inactive":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "Former":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="w-3 h-3" />;
    case "Potential":
      return <Clock className="w-3 h-3" />;
    case "Inactive":
      return <AlertCircle className="w-3 h-3" />;
    case "Former":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Low":
      return "bg-gray-500/20 text-gray-400";
    case "Medium":
      return "bg-blue-500/20 text-blue-400";
    case "High":
      return "bg-orange-500/20 text-orange-400";
    case "VIP":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "VIP":
      return <Star className="w-3 h-3" />;
    case "High":
      return <TrendingUp className="w-3 h-3" />;
    default:
      return null;
  }
};

export function ClientTableView({
  clients,
  onSelect,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: ClientTableViewProps) {
  const getSortIcon = (field: keyof Client) => {
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

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/40 dark:border-white/10">
              <TableHead className="text-muted-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                  Client {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="text-muted-foreground">Company</TableHead>
              <TableHead className="text-muted-foreground">Contact</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Priority</TableHead>
              <TableHead className="text-muted-foreground">Projects</TableHead>
              <TableHead className="text-muted-foreground">Value</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
                onClick={() => onSelect(client.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-white/40 dark:border-white/10 shadow-sm">
                      <AvatarImage
                        src={`${getCloudFrontUrl(client.avatarKey)}`}
                        alt={client.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {client.name[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">{client.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {client.primaryContact.title}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-foreground">{client.companyName}</p>
                    <p className="text-muted-foreground text-sm">
                      {client.industry}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {client.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {client.phone}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center space-x-1 w-fit",
                      getStatusColor(client.status)
                    )}
                  >
                    {getStatusIcon(client.status)}
                    <span>{client.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center space-x-1 w-fit",
                      getPriorityColor(client.priority)
                    )}
                  >
                    {getPriorityIcon(client.priority)}
                    <span>{client.priority}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground">
                    <p>{client.projectsCount} total</p>
                    <p className="text-sm text-muted-foreground">
                      {client.activeProjects} active, {client.completedProjects}{" "}
                      done
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatIndianCurrency(client.totalProjectValue)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(client.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(client.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
