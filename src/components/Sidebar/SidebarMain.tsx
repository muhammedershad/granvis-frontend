"use client";

import Link from "next/link";
import { cn } from "../ui/utils";
import { useSidebar } from "@/components/SidebarProvider";
import { useLogoutMutation } from "@/lib/api/apiSlice";
import {
  IAuthRoles,
  getAuthDetails,
  logout as logoutAction,
} from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie } from "@/lib/cookies";
import { SidebarProps } from "./types";
import { bgNavigationItems, bottomItems, projectTypes } from "./constants";
import {
  addLinksToProjectTypes,
  filterNavigationByRole,
  getRolePrefix,
} from "./utils";
import { SidebarHeader } from "./SidebarHeader";
import { NavigationLinks } from "./NavigationLinks";
import { UserProfile } from "./UserProfile";

export function SidebarMain({
  className,
  onNavigate,
  currentPage = "dashboard",
}: SidebarProps) {
  const {
    isCollapsed,
    toggleSidebar,
    isMobile,
    isMobileOpen,
    setIsMobileOpen,
  } = useSidebar();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const { user } = useSelector(getAuthDetails);

  const userRole = user?.role as IAuthRoles;
  const rolePrefix = userRole ? getRolePrefix(userRole) : "";

  const navigationItems = userRole
    ? filterNavigationByRole(bgNavigationItems, userRole, rolePrefix)
    : [];

  const projectTypesWithLinks = addLinksToProjectTypes(
    projectTypes,
    rolePrefix
  );

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      dispatch(logoutAction());
      window.location.href = "/";
    }
  };

  const handleNavClick = (page: string, link: string, e?: React.MouseEvent) => {
    if (page === "logout") {
      e?.preventDefault();
      handleLogout();
      return;
    }
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
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      <div
        className={cn(
          "flex flex-col h-screen transition-all duration-300 ease-in-out z-50",
          isMobile
            ? [
                "fixed left-0 top-0 w-64",
                isMobileOpen ? "translate-x-0" : "-translate-x-full",
              ]
            : ["fixed left-0 top-0", isCollapsed ? "w-16" : "w-64"],
          className
        )}
      >
        <div className="absolute inset-0 backdrop-blur-xl bg-white/80 dark:bg-black/30 border-r border-white/30 dark:border-white/10 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-indigo-50/60 to-purple-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="relative flex flex-col h-full z-10">
          <SidebarHeader
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onToggle={toggleSidebar}
          />

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              <NavigationLinks
                items={navigationItems}
                currentPage={currentPage}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                onNavClick={handleNavClick}
              />

              {(!isCollapsed || isMobile) && userRole && (
                <div className="pt-6">
                  <div className="px-3 pb-2">
                    <h3 className="text-xs text-muted-foreground/70 uppercase tracking-wide">
                      Project Types
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {projectTypesWithLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          href={item.link || "#"}
                          onClick={(e) =>
                            handleNavClick(item.page, item.link, e)
                          }
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-left">{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>
          </div>

          <div className="border-t border-border p-3">
            <nav className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.page}
                    href={item.link || "#"}
                    onClick={(e) =>
                      handleNavClick(item.page, item?.link || "", e)
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && (
                      <span className="text-left">{item.title}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {user && (
            <UserProfile
              user={user}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </>
  );
}
