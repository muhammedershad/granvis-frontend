import { 
  Home, 
  Building2, 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Palette,
  TreePine,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useSidebar } from "./SidebarProvider";

interface SidebarProps {
  className?: string;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    page: "dashboard"
  },
  {
    title: "Projects",
    icon: Building2,
    page: "projects",
    badge: "24"
  },
  {
    title: "Team",
    icon: Users,
    page: "team"
  },
  {
    title: "Clients",
    icon: UserCheck,
    page: "clients"
  },
  {
    title: "Calendar",
    icon: Calendar,
    page: "calendar",
    badge: "3"
  },
  {
    title: "Budget",
    icon: DollarSign,
    page: "budget"
  }
];

const projectTypes = [
  {
    title: "Architecture",
    icon: Building2,
    page: "projects"
  },
  {
    title: "Interior Design",
    icon: Palette,
    page: "projects"
  },
  {
    title: "Landscape",
    icon: TreePine,
    page: "projects"
  }
];

const bottomItems = [
  {
    title: "Files",
    icon: FolderOpen,
    page: "files"
  },
  {
    title: "Reports",
    icon: BarChart3,
    page: "reports"
  },
  {
    title: "Settings",
    icon: Settings,
    page: "settings"
  }
];

export function Sidebar({ className, onNavigate, currentPage = "dashboard" }: SidebarProps) {
  const { isCollapsed, toggleSidebar, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();

  const handleNavClick = (page: string) => {
    // Close mobile sidebar when clicking a nav item
    if (isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
    onNavigate?.(page);
  };

  const handleBackdropClick = () => {
    if (isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col h-screen transition-all duration-300 ease-in-out z-50",
        // Mobile styles
        isMobile ? [
          "fixed left-0 top-0 w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        ] : [
          // Desktop styles
          "fixed left-0 top-0",
          isCollapsed ? "w-16" : "w-64"
        ],
        className
      )}>
        {/* Sidebar Background with Glassmorphism */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/30 border-r border-white/10">
          {/* Neon gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col h-full z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <div className="w-4 h-4 bg-white/90 rounded-sm"></div>
                </div>
                <div>
                  <h2 className="text-white/90 text-sm">ArchitecturalPro</h2>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ml-auto"
            >
              {isMobile ? (
                <X className="w-4 h-4" />
              ) : isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {/* Main Items */}
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNavClick(item.page)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden",
                        isActive 
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {/* Active item glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm"></div>
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
                    </button>
                  );
                })}
              </div>

              {/* Project Types Section */}
              {(!isCollapsed || isMobile) && (
                <div className="pt-6">
                  <div className="px-3 pb-2">
                    <h3 className="text-xs text-white/50 uppercase tracking-wide">Project Types</h3>
                  </div>
                  <div className="space-y-1">
                    {projectTypes.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.title}
                          onClick={() => handleNavClick(item.page)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-left">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-white/10 p-3">
            <nav className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && <span className="text-left">{item.title}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile */}
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-xs text-white">JD</span>
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 truncate">John Doe</p>
                  <p className="text-xs text-white/60 truncate">Lead Architect</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}