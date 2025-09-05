'use client'
import { BudgetChart } from "@/components/BudgetChart";
import { CalendarWidget } from "@/components/CalendarWidget";
import { ClientsPage } from "@/components/ClientsPage";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmployeesPage } from "@/components/EmployeesPage";
import { ForgotPasswordPage } from "@/components/ForgotPasswordPage";
import { LoginPage } from "@/components/LoginPage";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectProgress } from "@/components/ProjectProgress";
import { ProjectsPage } from "@/components/ProjectsPage";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarProvider";
import { TeamSection } from "@/components/TeamSection";
import { VerifyEmailPage } from "@/components/VerifyEmailPage";
import Image from "next/image";
import { useState } from "react";

type PageType = "dashboard" | "employees" | "projects" | "team" | "clients" | "calendar" | "budget";
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

  const renderPageContent = () => {
    switch (currentPage) {
      case "employees":
      case "team":
        return <EmployeesPage />;
      case "projects":
        return <ProjectsPage />;
      case "clients":
        return <ClientsPage />;
      case "calendar":
        return (
          <div className="text-center py-20">
            <h2 className="text-white/90 text-2xl mb-4">Calendar Page</h2>
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
      case "budget":
        return (
          <div className="text-center py-20">
            <h2 className="text-white/90 text-2xl mb-4">Budget Page</h2>
            <p className="text-white/60">Coming soon...</p>
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
      case "projects":
        return "Project Management";
      case "clients":
        return "Client Management";
      case "calendar":
        return "Calendar & Schedule";
      case "budget":
        return "Budget & Finance";
      case "dashboard":
      default:
        return "Dashboard Overview";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar with navigation handler */}
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {/* Main content with responsive margin based on sidebar state and screen size */}
      <div className={`min-h-screen transition-all duration-300 ease-in-out ${
        isMobile 
          ? 'ml-0' // No margin on mobile (sidebar overlays)
          : isCollapsed 
            ? 'ml-16' // Collapsed sidebar margin on desktop
            : 'ml-64' // Expanded sidebar margin on desktop
      }`}>
        <DashboardHeader title={getPageTitle()} />
        
        <main className="p-4 md:p-6 space-y-4 md:space-y-6">
          {renderPageContent()}
        </main>
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
    </div>
  );
}


export default function Home() {
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
          <ForgotPasswordPage
            onBackToLogin={goToLogin}
            onResetPassword={(email) => {
              handleForgotPassword(email);
              // Optionally redirect back to login after sending reset email
              // goToLogin();
            }}
          />
        );
      
      case "verify-email":
        return (
          <VerifyEmailPage
            email={pendingVerificationEmail}
            onBackToLogin={goToLogin}
            onResendEmail={handleResendVerificationEmail}
            onVerificationComplete={handleVerificationComplete}
          />
        );
      
      case "login":
      default:
        return (
          <LoginPage
            onLogin={handleLogin}
            onForgotPassword={goToForgotPassword}
            onSignUp={handleSignUp}
          />
        );
    }
  }

  // If user needs email verification, show verify email page
  if (!user.isEmailVerified) {
    return (
      <VerifyEmailPage
        email={user.email}
        onBackToLogin={handleLogout}
        onResendEmail={handleResendVerificationEmail}
        onVerificationComplete={handleVerificationComplete}
      />
    );
  }

  // User is authenticated and verified, show dashboard
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
