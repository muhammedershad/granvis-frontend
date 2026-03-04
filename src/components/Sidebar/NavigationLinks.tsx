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
  const showLabels = !isCollapsed || isMobile;

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
              "w-full flex items-center rounded-lg text-sm transition-all duration-300 group relative overflow-hidden",
              showLabels ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
              isActive
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-foreground border border-purple-500/30 shadow-lg shadow-purple-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm opacity-0 dark:opacity-100"></div>
            )}

            <div
              className={cn(
                "relative z-10 flex items-center min-w-0",
                showLabels ? "w-full" : "w-auto"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div
                className="flex items-center min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  width: showLabels ? "100%" : "0px",
                  opacity: showLabels ? 1 : 0,
                  marginLeft: showLabels ? "12px" : "0px",
                }}
              >
                <span className="flex-1 text-left whitespace-nowrap truncate">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 ml-2 flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
