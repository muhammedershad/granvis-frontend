import { ProjectFormData } from "./schemas";

export function checkIdentitySectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) return false;

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
  if (hasErrors) return false;

  const requiredFields = [formData.client];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkScopeSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) return false;

  const requiredFields = [formData.projectManager];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkFinancialsSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) return false;

  const requiredFields = [formData.startDate, formData.totalBudget];

  return requiredFields.every((field) => field && field.trim() !== "");
}

export function checkLocationSectionCompletion(
  hasErrors: boolean,
  formData: Partial<ProjectFormData>
): boolean {
  if (hasErrors) return false;

  // Location is optional, but if any fields are filled, consider it complete
  const hasAnyLocationData = Boolean(
    (formData.address && formData.address.trim() !== "") ||
    (formData.city && formData.city.trim() !== "") ||
    (formData.state && formData.state.trim() !== "")
  );

  return hasAnyLocationData;
}
