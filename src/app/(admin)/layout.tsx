'use client';
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarProvider";
import { useState } from "react";

type PageType = "dashboard" | "employees" | "employee-details" | "projects" | "project-details" | "team" | "clients" | "crm" | "marketing" | "payments" | "calendar" | "budget" | "enquiries" | "notifications";
type AuthPageType = "login" | "forgot-password" | "verify-email" | "signup";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { isCollapsed, isMobile } = useSidebar();
    const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const handleEmployeeSelect = (employeeId: string) => {
        setSelectedEmployeeId(employeeId);
        setCurrentPage("employee-details");
    };

    const handleBackFromEmployeeDetails = () => {
        setCurrentPage("employees");
        setSelectedEmployeeId(null);
    };

    const handleProjectSelect = (projectId: string) => {
        setSelectedProjectId(projectId);
        setCurrentPage("project-details");
    };

    const handleBackFromProjectDetails = () => {
        setCurrentPage("projects");
        setSelectedProjectId(null);
    };

    const handleNavigateToNotifications = () => {
        setCurrentPage("notifications");
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
            case "calendar":
                return "Calendar & Schedule";
            case "budget":
                return "Finance & Budgeting";
            case "dashboard":
            default:
                return "Dashboard Overview";
        }
    };


    console.log("Admin layout rendered");
    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-x-hidden">
            {/* Animated background elements - only show in dark theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Light theme background pattern with subtle animated gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-100/40 to-cyan-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-blue-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
            </div>

            {/* Sidebar with navigation handler */}
            <Sidebar onNavigate={(page: string) => setCurrentPage(page as PageType)} currentPage={currentPage} />

            {/* Main content with responsive margin based on sidebar state and screen size */}
            <div className={`min-h-screen transition-all duration-300 ease-in-out ${isMobile
                ? 'ml-0' // No margin on mobile (sidebar overlays)
                : isCollapsed
                    ? 'ml-16' // Collapsed sidebar margin on desktop
                    : 'ml-64' // Expanded sidebar margin on desktop
                }`}>
                <DashboardHeader
                    title={getPageTitle()}
                    onNavigateToNotifications={handleNavigateToNotifications}
                />

                <main className="p-4 md:p-6 space-y-4 md:space-y-6 relative">
                    {children}
                </main>
            </div>

            {/* Subtle grid overlay - different for light/dark */}
            <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `
                    linear-gradient(rgba(100, 116, 139, 0.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(100, 116, 139, 0.4) 1px, transparent 1px)
                  `,
                backgroundSize: '50px 50px'
            }}></div>
        </div>)
}

export default Layout;