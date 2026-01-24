import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  Home,
  Palette,
  Pause,
  TreePine,
  TrendingUp,
  X,
} from "lucide-react";

export const getTypeIcon = (type: string) => {
  switch (type) {
    case "Villa":
      return Home;
    case "Commercial":
      return Building2;
    case "Interior":
      return Palette;
    case "Landscape":
      return TreePine;
    default:
      return Building2;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "In Progress":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "On Hold":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Completed":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Planning":
      return <Clock className="w-3 h-3" />;
    case "In Progress":
      return <TrendingUp className="w-3 h-3" />;
    case "On Hold":
      return <Pause className="w-3 h-3" />;
    case "Completed":
      return <CheckCircle className="w-3 h-3" />;
    case "Cancelled":
      return <X className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Low":
      return "bg-gray-500/20 text-gray-400";
    case "Medium":
      return "bg-blue-500/20 text-blue-400";
    case "High":
      return "bg-orange-500/20 text-orange-400";
    case "Critical":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};
