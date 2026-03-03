import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSidebar } from "./SidebarProvider";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationDropdown } from "./NotificationDropdown";
import { type IAuthRoles, getAuthDetails } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { getRolePrefix } from "./Sidebar/utils";
import { getAvatarUrl } from "@/lib/utils/cloudfront";

interface DashboardHeaderProps {
  title?: string;
  onNavigateToNotifications?: () => void;
}

export function DashboardHeader({
  title = "Dashboard Overview",
  onNavigateToNotifications,
}: DashboardHeaderProps) {
  const { isMobile, toggleMobileSidebar } = useSidebar();
  const { user } = useSelector(getAuthDetails);
  const rolePrefix = user?.role ? getRolePrefix(user.role as IAuthRoles) : "";
  const profileLink = rolePrefix ? `${rolePrefix}/profile` : "#";
  const avatarUrl = getAvatarUrl(user?.avatarKey, user?.avatar);
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`;

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
        return `Welcome back, ${`${user?.firstName} ${user?.lastName}` || "User"}!`;
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
            <p className="text-sm text-muted-foreground hidden sm:block">
              {getWelcomeMessage()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme toggle */}
          <ThemeToggle />

          <NotificationDropdown
            onNavigateToNotifications={onNavigateToNotifications || (() => {})}
          />

          <Link
            href={profileLink}
            className="shrink-0 rounded-full transition-all duration-300 hover:ring-2 hover:ring-purple-500/30"
          >
            <Avatar className="w-8 h-8 md:w-10 md:h-10 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/25">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={initials} />}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs md:text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
