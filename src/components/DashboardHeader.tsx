import { Bell, Search, Settings, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSidebar } from "./SidebarProvider";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationDropdown } from "./NotificationDropdown";

interface DashboardHeaderProps {
  title?: string;
  onNavigateToNotifications?: () => void;
}

export function DashboardHeader({ title = "Dashboard Overview", onNavigateToNotifications }: DashboardHeaderProps) {
  const { isMobile, toggleMobileSidebar } = useSidebar();

  const getWelcomeMessage = () => {
    switch (title) {
      case "Employee Management":
        return "Manage your team members and their information";
      case "Projects":
        return "Track and manage your architectural projects";
      case "Clients":
        return "Manage client relationships and communications";
      case "Calendar":
        return "View schedules and upcoming events";
      case "Budget":
        return "Monitor project finances and expenses";
      default:
        return "Welcome back, John Doe";
    }
  };

  return (
    <header className="relative backdrop-blur-xl bg-white/70 dark:bg-black/20 border-b border-white/20 dark:border-white/10 px-4 md:px-6 py-4 shadow-lg dark:shadow-2xl shadow-gray-200/30 dark:shadow-black/50">
      {/* Light theme gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      
      {/* Neon gradient background - only in dark theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-muted transition-all duration-300 md:hidden shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">{getWelcomeMessage()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search..."
              className="pl-10 w-48 md:w-64 bg-white/60 dark:bg-muted/50 border-white/40 dark:border-border text-foreground placeholder:text-muted-foreground focus:bg-white/80 dark:focus:bg-muted focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 shadow-sm"
            />
          </div>
          
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-muted transition-all duration-300 sm:hidden shadow-sm">
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />
          
          <NotificationDropdown 
            onNavigateToNotifications={onNavigateToNotifications || (() => {})} 
          />
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-muted transition-all duration-300 hidden sm:flex shadow-sm">
            <Settings className="w-5 h-5" />
          </Button>
          
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-200/50 dark:shadow-blue-500/25 cursor-pointer hover:shadow-xl hover:shadow-blue-300/60 dark:hover:shadow-blue-500/40 transition-all duration-300">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}