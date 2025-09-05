import { Bell, Search, Settings, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSidebar } from "./SidebarProvider";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard Overview" }: DashboardHeaderProps) {
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
    <header className="relative backdrop-blur-xl bg-black/20 border-b border-white/10 px-4 md:px-6 py-4">
      {/* Neon gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-white/90">{title}</h1>
            <p className="text-sm text-white/60 hidden sm:block">{getWelcomeMessage()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input 
              placeholder="Search..."
              className="pl-10 w-48 md:w-64 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 transition-all duration-300"
            />
          </div>
          
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 sm:hidden">
            <Search className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></div>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>
          
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 cursor-pointer hover:shadow-blue-500/40 transition-all duration-300">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}