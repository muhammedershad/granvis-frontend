import {
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  Home,
  Palette,
  Settings,
  TreePine,
  UserCheck,
} from "lucide-react";
import { IAuthRoles } from "@/store/slices/authSlice";
import { NavigationItem } from "./types";

export const bgNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    page: "dashboard",
    roles: [
      IAuthRoles.SUPER_ADMIN,
      IAuthRoles.ADMIN,
      IAuthRoles.MANAGER,
      IAuthRoles.ACCOUNTANT,
      IAuthRoles.EMPLOYEE,
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    page: "notifications",
    badge: "5",
    roles: [
      IAuthRoles.SUPER_ADMIN,
      IAuthRoles.ADMIN,
      IAuthRoles.MANAGER,
      IAuthRoles.EMPLOYEE,
    ],
  },
  {
    title: "Projects",
    icon: Building2,
    page: "projects",
    roles: [
      IAuthRoles.SUPER_ADMIN,
      IAuthRoles.ADMIN,
      IAuthRoles.MANAGER,
      IAuthRoles.ACCOUNTANT,
      IAuthRoles.EMPLOYEE,
    ],
  },
  {
    title: "Clients",
    icon: UserCheck,
    page: "clients",
    roles: [IAuthRoles.SUPER_ADMIN, IAuthRoles.ADMIN, IAuthRoles.MANAGER],
  },
  {
    title: "Payments",
    icon: CreditCard,
    page: "payments",
    roles: [IAuthRoles.SUPER_ADMIN, IAuthRoles.ADMIN, IAuthRoles.ACCOUNTANT],
  },
  {
    title: "Employees",
    icon: UserCheck,
    page: "employees",
    roles: [IAuthRoles.SUPER_ADMIN, IAuthRoles.ADMIN],
  },
  {
    title: "Firm Settings",
    icon: Briefcase,
    page: "firm-settings",
    roles: [IAuthRoles.SUPER_ADMIN, IAuthRoles.ADMIN],
  },
];

export const projectTypes = [
  {
    title: "Architecture",
    icon: Building2,
    page: "projects",
  },
  {
    title: "Interior Design",
    icon: Palette,
    page: "projects",
  },
  {
    title: "Landscape",
    icon: TreePine,
    page: "projects",
  },
];

export const bottomItems = [
  {
    title: "Logout",
    icon: Settings,
    page: "logout",
    link: "/",
  },
];
