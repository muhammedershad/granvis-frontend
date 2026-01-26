import { ProjectFormData } from "./schemas";

export function checkIdentitySectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) {
    return false;
  }

  const requiredFields = [
    formData.name,
    formData.description,
    formData.type,
    formData.status,
    formData.priority,
  ];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkClientSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) {
    return false;
  }

  // Client name and clientId are both required
  const requiredFields = [formData.client, formData.clientId];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkScopeSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) {
    return false;
  }

  // Project manager name and managerId are both required
  const requiredFields = [formData.projectManager, formData.managerId];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkFinancialsSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) {
    return false;
  }

  // Only startDate is required, budget is optional
  const requiredFields = [formData.startDate];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkLocationSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) {
    return false;
  }

  // Location is now required - address, city, and state must be filled
  const requiredFields = [formData.address, formData.city, formData.state];

  return requiredFields.every((field) => field && field.trim() !== "");
}
