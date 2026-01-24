import { Button } from "../ui/button";
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
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      {(!isCollapsed || isMobile) && (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
            <div className="w-4 h-4 bg-white/90 rounded-sm"></div>
          </div>
          <div>
            <h2 className="text-foreground text-sm">ArchitecturalPro</h2>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 ml-auto"
      >
        {isMobile && <X className="w-4 h-4" />}
        {!isMobile && isCollapsed && <ChevronRight className="w-4 h-4" />}
        {!isMobile && !isCollapsed && <ChevronLeft className="w-4 h-4" />}
      </Button>
    </div>
  );
}
