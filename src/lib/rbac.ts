import { IAuthRoles } from "@/store/slices/authSlice";

/**
 * Role hierarchy and permissions for Add Employee feature
 */

// Roles that can add employees
export const canAddEmployee = (role: IAuthRoles | undefined): boolean => {
  if (!role) {
    return false;
  }
  return [IAuthRoles.SUPER_ADMIN, IAuthRoles.ADMIN].includes(role);
};

// Get allowed roles that a user can create based on their role
export const getAllowedRolesToCreate = (
  currentUserRole: IAuthRoles | undefined
): IAuthRoles[] => {
  if (!currentUserRole) {
    return [];
  }

  switch (currentUserRole) {
    case IAuthRoles.SUPER_ADMIN:
      return [
        IAuthRoles.SUPER_ADMIN,
        IAuthRoles.ADMIN,
        IAuthRoles.MANAGER,
        IAuthRoles.EMPLOYEE,
        IAuthRoles.ACCOUNTANT,
      ];
    case IAuthRoles.ADMIN:
      return [IAuthRoles.MANAGER, IAuthRoles.EMPLOYEE, IAuthRoles.ACCOUNTANT];
    default:
      return [];
  }
};

// Check if user can create a specific role
export const canCreateRole = (
  currentUserRole: IAuthRoles | undefined,
  targetRole: IAuthRoles
): boolean => {
  const allowedRoles = getAllowedRolesToCreate(currentUserRole);
  return allowedRoles.includes(targetRole);
};

// Get role display options for UI dropdown
export const getRoleOptions = (
  currentUserRole: IAuthRoles | undefined
): Array<{ value: string; label: string }> => {
  const allowedRoles = getAllowedRolesToCreate(currentUserRole);

  const roleMap: Record<IAuthRoles, string> = {
    [IAuthRoles.SUPER_ADMIN]: "Super Admin",
    [IAuthRoles.ADMIN]: "Admin",
    [IAuthRoles.MANAGER]: "Manager",
    [IAuthRoles.EMPLOYEE]: "Employee",
    [IAuthRoles.ACCOUNTANT]: "Accountant",
  };

  return allowedRoles.map((role) => ({
    value: role,
    label: roleMap[role],
  }));
};
