import Link from "next/link";
import { cn } from "../ui/utils";
import { NavigationItem } from "./types";

interface NavigationLinksProps {
  items: NavigationItem[];
  currentPage: string;
  isCollapsed: boolean;
  isMobile: boolean;
  onNavClick: (page: string, link: string, e?: React.MouseEvent) => void;
}

export function NavigationLinks({
  items,
  currentPage,
  isCollapsed,
  isMobile,
  onNavClick,
}: NavigationLinksProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.page;
        return (
          <Link
            key={item.page}
            href={item.link || "#"}
            onClick={(e) => onNavClick(item.page, item?.link || "", e)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-foreground border border-purple-500/30 shadow-lg shadow-purple-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm opacity-0 dark:opacity-100"></div>
            )}

            <div className="relative z-10 flex items-center gap-3 w-full">
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
