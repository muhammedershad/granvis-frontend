import { Client } from "../../types/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  Globe,
  Mail,
  MoreHorizontal,
  Phone,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn } from "../ui/utils";
import { formatIndianCurrency } from "@/lib/utils/currency";

interface ClientCardProps {
  client: Client;
  onSelect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
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

export function ClientCard({ client, onSelect, onDelete }: ClientCardProps) {
  return (
    <Card
      className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl dark:hover:shadow-black/70 cursor-pointer"
      onClick={() => onSelect(client.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-blue-50/40 to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 group-hover:opacity-100 transition-opacity"></div>

      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-white/40 dark:border-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/30">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-foreground text-base">
                {client.name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {client.companyName}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Badge
            className={cn(
              "flex items-center space-x-1",
              getStatusColor(client.status)
            )}
          >
            {getStatusIcon(client.status)}
            <span>{client.status}</span>
          </Badge>
          <Badge
            className={cn(
              "flex items-center space-x-1",
              getPriorityColor(client.priority)
            )}
          >
            {getPriorityIcon(client.priority)}
            <span>{client.priority}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{client.industry}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {client.email}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{client.phone}</span>
          </div>
          {client.website && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate flex items-center space-x-1"
              >
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-white/40 dark:border-white/10">
          <div>
            <p className="text-muted-foreground">Project Value</p>
            <p className="text-foreground">
              {formatIndianCurrency(client.totalProjectValue)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Projects</p>
            <p className="text-foreground">{client.projectsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
