import { LucideIcon } from "lucide-react";
import { IAuthRoles } from "@/store/slices/authSlice";

export interface NavigationItem {
  title: string;
  icon: LucideIcon;
  page: string;
  badge?: string;
  roles: IAuthRoles[];
  link?: string;
}

export interface SidebarProps {
  className?: string;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}
