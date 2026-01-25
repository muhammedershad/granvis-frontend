import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "../ui/utils";

interface SectionHeaderProps {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  status: string;
  isActive: boolean;
  hasErrors?: boolean;
  isCompleted?: boolean;
  onClick: (id: string) => void;
}

export function SectionHeader({
  id,
  icon: Icon,
  title,
  subtitle,
  status,
  isActive,
  hasErrors,
  isCompleted,
  onClick,
}: SectionHeaderProps) {
  const getContainerClass = () => {
    if (hasErrors) {
      return "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50";
    }
    if (isActive) {
      return "bg-white/70 dark:bg-white/5 border-blue-500/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]";
    }
    return "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5";
  };

  const getIconClass = () => {
    if (hasErrors) {
      return "bg-red-500/10 dark:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400";
    }
    if (isActive) {
      return "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400";
    }
    return "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 cursor-pointer transition-all border rounded-xl",
        getContainerClass()
      )}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-2.5 rounded-xl border transition-all",
            getIconClass()
          )}
        >
          {hasErrors ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm tracking-tight">
            {title}
          </h3>
          <p
            className={cn(
              "text-xs",
              hasErrors
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            )}
          >
            {hasErrors ? "Please fix errors" : subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {hasErrors && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
              Error
            </div>
          )}
          {!hasErrors && isActive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
              In Progress
            </div>
          )}
          {!hasErrors && !isActive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {isCompleted ? "Completed" : status}
            </div>
          )}
        </div>
        {isActive ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
