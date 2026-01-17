import { IAuthRoles } from "@/store/slices/authSlice";
import { NavigationItem } from "./types";

export function getRolePrefix(role: IAuthRoles): string {
  switch (role) {
    case IAuthRoles.SUPER_ADMIN:
      return "/super-admin";
    case IAuthRoles.ADMIN:
      return "/admin";
    case IAuthRoles.MANAGER:
      return "/manager";
    case IAuthRoles.ACCOUNTANT:
      return "/accountant";
    case IAuthRoles.EMPLOYEE:
      return "/employee";
    default:
      return "";
  }
}

export function filterNavigationByRole(
  items: NavigationItem[],
  role: IAuthRoles,
  rolePrefix: string
): NavigationItem[] {
  return items
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((item) => ({
      ...item,
      link: `${rolePrefix}/${item.page}`,
    }));
}

export function addLinksToProjectTypes(
  projectTypes: Array<{ title: string; icon: any; page: string }>,
  rolePrefix: string
) {
  return projectTypes.map((item) => ({
    ...item,
    link: `${rolePrefix}/${item.page}`,
  }));
}
