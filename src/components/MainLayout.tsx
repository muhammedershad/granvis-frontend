"use client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { useSidebar } from "@/components/SidebarProvider";
import { getCookie } from "@/lib/cookies";
import { getAuthDetails } from "@/store/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { Loader2 } from "lucide-react";

type PageType =
  | "dashboard"
  | "employees"
  | "employee-details"
  | "projects"
  | "project-details"
  | "team"
  | "clients"
  | "crm"
  | "marketing"
  | "payments"
  | "calendar"
  | "budget"
  | "enquiries"
  | "notifications"
  | "profile";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const authState = useSelector(getAuthDetails);
  const isAuthenticated = authState?.isAuthenticated;
  const accessToken = getCookie("accessToken");
  const { isCollapsed, isMobile } = useSidebar();
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Client-side auth guard (fallback for middleware)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated || !accessToken) {
        router.push("/sign-in");
      } else {
        setIsAuthChecked(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, accessToken, router]);

  // Establish WebSocket connection for real-time notifications
  useNotificationSocket();

  // Update current page based on pathname
  useEffect(() => {
    const path = pathname?.split("/").pop() || "dashboard";
    setCurrentPage(path as PageType);
  }, [pathname]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleNavigateToNotifications = () => {
    setCurrentPage("notifications");
    // Get the role prefix from the current pathname
    const pathParts = pathname?.split("/") || [];
    const rolePrefix = pathParts.length >= 2 ? `/${pathParts[1]}` : "";
    if (rolePrefix) {
      router.push(`${rolePrefix}/notifications`);
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "employees":
      case "team":
        return "Employee Management";
      case "employee-details":
        return "Employee Details";
      case "enquiries":
        return "Enquiry Management";
      case "projects":
        return "Project Management";
      case "project-details":
        return "Project Details";
      case "clients":
        return "Client Management";
      case "crm":
        return "Office CRM - Attendance & Leave";
      case "marketing":
        return "Marketing Management";
      case "payments":
        return "Payment Management";
      case "notifications":
        return "Notifications";
      case "profile":
        return "Profile";
      case "calendar":
        return "Calendar & Schedule";
      case "budget":
        return "Finance & Budgeting";
      case "dashboard":
      default:
        return "Dashboard Overview";
    }
  };

  // Compute margin class based on sidebar state
  const getMainMarginClass = () => {
    if (isMobile) {
      return "ml-0";
    }
    if (isCollapsed) {
      return "ml-16";
    }
    return "ml-64";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-x-hidden">
      {/* Animated background elements - only show in dark theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Light theme background pattern with subtle animated gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-100/40 to-cyan-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-blue-100/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      {/* Sidebar with navigation handler */}
      <Sidebar
        onNavigate={(page: string) => setCurrentPage(page as PageType)}
        currentPage={currentPage}
      />

      {/* Main content with responsive margin based on sidebar state and screen size */}
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${getMainMarginClass()}`}
      >
        <DashboardHeader
          title={getPageTitle()}
          onNavigateToNotifications={handleNavigateToNotifications}
        />

        <main className="p-4 md:p-6 space-y-4 md:space-y-6 relative">
          {children}
        </main>
      </div>

      {/* Subtle grid overlay - different for light/dark */}
      <div
        className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
                    linear-gradient(rgba(100, 116, 139, 0.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(100, 116, 139, 0.4) 1px, transparent 1px)
                  `,
          backgroundSize: "50px 50px",
        }}
      ></div>
    </div>
  );
};

export default MainLayout;
