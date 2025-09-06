'use client'
import { BudgetChart } from "@/components/BudgetChart";
import { CalendarWidget } from "@/components/CalendarWidget";
import { ClientsPage } from "@/components/ClientsPage";
import { CRMPage } from "@/components/CRMPage";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmployeeDetailsPage } from "@/components/EmployeeDetailsPage";
import { EmployeesPage } from "@/components/EmployeesPage";
import { EnquiryPage } from "@/components/EnquiryPage";
import { ForgotPasswordPage } from "@/components/ForgotPasswordPage";
import { LoginPage } from "@/components/LoginPage";
import { MarketingPage } from "@/components/MarketingPage";
import { NotificationPage } from "@/components/NotificationPage";
import { PaymentPage } from "@/components/PaymentPage";
import { ProjectDetailsPage } from "@/components/ProjectDetailsPage";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectProgress } from "@/components/ProjectProgress";
import { ProjectsPage } from "@/components/ProjectsPage";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarProvider";
import { TeamSection } from "@/components/TeamSection";
import { ThemeProvider } from "@/components/ThemeProvider";
import { VerifyEmailPage } from "@/components/VerifyEmailPage";
import { useState } from "react";

type PageType = "dashboard" | "employees" | "employee-details" | "projects" | "project-details" | "team" | "clients" | "crm" | "marketing" | "payments" | "calendar" | "budget" | "enquiries" | "notifications";
type AuthPageType = "login" | "forgot-password" | "verify-email" | "signup";

interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

function DashboardContent() {
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

  const renderPageContent = () => {
    switch (currentPage) {
      case "employees":
      case "team":
        return <EmployeesPage onEmployeeSelect={handleEmployeeSelect} />;
      case "employee-details":
        return selectedEmployeeId ? (
          <EmployeeDetailsPage 
            employeeId={selectedEmployeeId} 
            onBack={handleBackFromEmployeeDetails}
          />
        ) : (
          <EmployeesPage onEmployeeSelect={handleEmployeeSelect} />
        );
      case "enquiries":
        return <EnquiryPage />;
      case "projects":
        return <ProjectsPage onProjectSelect={handleProjectSelect} />;
      case "project-details":
        return selectedProjectId ? (
          <ProjectDetailsPage 
            projectId={selectedProjectId} 
            onBack={handleBackFromProjectDetails}
          />
        ) : (
          <ProjectsPage onProjectSelect={handleProjectSelect} />
        );
      case "clients":
        return <ClientsPage />;
      case "crm":
        return <CRMPage />;
      case "marketing":
        return <MarketingPage />;
      case "payments":
        return <PaymentPage />;
      case "notifications":
        return <NotificationPage />;
      case "calendar":
        return (
          <div className="text-center py-20">
            <h2 className="text-foreground text-2xl mb-4">Calendar Page</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "budget":
        return (
          <div className="text-center py-20">
            <h2 className="text-foreground text-2xl mb-4">Budget Page</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "dashboard":
      default:
        return (
          <>
            {/* Top row - Key metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-1">
                <ProjectOverview />
              </div>
              <div className="lg:col-span-2">
                <BudgetChart />
              </div>
            </div>

            {/* Middle row - Team and Calendar */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <TeamSection />
              <CalendarWidget />
            </div>

            {/* Bottom row - Projects */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <ProjectProgress />
            </div>
          </>
        );
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
      case "calendar":
        return "Calendar & Schedule";
      case "budget":
        return "Finance & Budgeting";
      case "dashboard":
      default:
        return "Dashboard Overview";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-x-hidden">
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
      <div className={`min-h-screen transition-all duration-300 ease-in-out ${
        isMobile 
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
          {renderPageContent()}
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
    </div>
  );
}


export default function Home() {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPageType>("login");
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>("");

  // Authentication handlers
  const handleLogin = (email: string, password: string) => {
    // Simulate login logic
    console.log("Login attempt:", { email, password });
    
    // For demo purposes, create a mock user
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: email,
      isEmailVerified: true // For demo, assume verified
    };
    
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentAuthPage("login");
  };

  const handleForgotPassword = (email: string) => {
    console.log("Password reset requested for:", email);
    // In a real app, this would send a reset email
  };

  const handleSignUp = () => {
    setCurrentAuthPage("signup");
    // For demo, we'll redirect to login since we don't have a signup page
    // In a real app, you'd create a SignUpPage component
    console.log("Sign up requested - would show signup form");
  };

  const handleResendVerificationEmail = () => {
    console.log("Resending verification email to:", pendingVerificationEmail);
    // In a real app, this would resend the verification email
  };

  const handleVerificationComplete = () => {
    console.log("Email verification completed");
    if (user) {
      setUser({ ...user, isEmailVerified: true });
    }
  };

  // Navigation handlers for auth pages
  const goToLogin = () => setCurrentAuthPage("login");
  const goToForgotPassword = () => setCurrentAuthPage("forgot-password");
  const goToVerifyEmail = (email: string) => {
    setPendingVerificationEmail(email);
    setCurrentAuthPage("verify-email");
  };

  // If user is not authenticated, show auth pages
  if (!user) {
    switch (currentAuthPage) {
      case "forgot-password":
        return (
          <ThemeProvider>
            <ForgotPasswordPage
              onBackToLogin={goToLogin}
              onResetPassword={(email) => {
                handleForgotPassword(email);
                // Optionally redirect back to login after sending reset email
                // goToLogin();
              }}
            />
          </ThemeProvider>
        );
      
      case "verify-email":
        return (
          <ThemeProvider>
            <VerifyEmailPage
              email={pendingVerificationEmail}
              onBackToLogin={goToLogin}
              onResendEmail={handleResendVerificationEmail}
              onVerificationComplete={handleVerificationComplete}
            />
          </ThemeProvider>
        );
      
      case "login":
      default:
        return (
          <ThemeProvider>
            <LoginPage
              onLogin={handleLogin}
              onForgotPassword={goToForgotPassword}
              onSignUp={handleSignUp}
            />
          </ThemeProvider>
        );
    }
  }

  // If user needs email verification, show verify email page
  if (!user.isEmailVerified) {
    return (
      <ThemeProvider>
        <VerifyEmailPage
          email={user.email}
          onBackToLogin={handleLogout}
          onResendEmail={handleResendVerificationEmail}
          onVerificationComplete={handleVerificationComplete}
        />
      </ThemeProvider>
    );
  }

  // User is authenticated and verified, show dashboard
  return (
    <ThemeProvider>
      <SidebarProvider>
        <DashboardContent />
      </SidebarProvider>
    </ThemeProvider>
  );
}
