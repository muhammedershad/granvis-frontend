import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

export function SidebarHeader({
  isCollapsed,
  isMobile,
  onToggle,
}: SidebarHeaderProps) {
  const showExpanded = !isCollapsed || isMobile;

  return (
    <div
      className={cn(
        "flex items-center border-b border-border overflow-hidden transition-all duration-300 ease-in-out",
        showExpanded ? "p-4 justify-between" : "p-2 justify-center"
      )}
    >
      <div
        className="flex items-center min-w-0 overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          width: showExpanded ? "180px" : "0px",
          opacity: showExpanded ? 1 : 0,
        }}
      >
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="/logo-dark-theme.png"
            alt="Griha"
            width={32}
            height={32}
            className="hidden dark:block object-contain"
          />
          <Image
            src="/logo-light-theme.png"
            alt="Griha"
            width={32}
            height={32}
            className="block dark:hidden object-contain"
          />
        </div>
        <h2 className="text-foreground text-sm whitespace-nowrap ml-3">
          Griha Architects
        </h2>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 flex-shrink-0"
      >
        {isMobile && <X className="w-4 h-4" />}
        {!isMobile && isCollapsed && <ChevronRight className="w-4 h-4" />}
        {!isMobile && !isCollapsed && <ChevronLeft className="w-4 h-4" />}
      </Button>
    </div>
  );
}
