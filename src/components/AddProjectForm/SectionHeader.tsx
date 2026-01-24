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
  onClick,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 cursor-pointer rounded-lg transition-all",
        isActive
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-sm"
          : "hover:bg-muted/30"
      )}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className={cn(
            "p-2.5 rounded-lg transition-all",
            isActive
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md"
              : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {hasErrors && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">
                  Please review errors
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full",
            status === "Required"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
          )}
        >
          {hasErrors ? (
            <AlertCircle className="h-3 w-3" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          <span>{status}</span>
        </div>
        {isActive ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
    </div>
  );
}
