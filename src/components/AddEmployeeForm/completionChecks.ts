import { CreateEmployeeFormInput } from "@/lib/validations/employee";

export function checkPersonalSectionCompletion(
  hasErrors: boolean,
  formData: CreateEmployeeFormInput
): boolean {
  return (
    !hasErrors &&
    !!formData.firstName &&
    !!formData.lastName &&
    !!formData.email &&
    !!formData.phone &&
    !!formData.gender
  );
}

export function checkEmploymentSectionCompletion(
  hasErrors: boolean,
  formData: CreateEmployeeFormInput
): boolean {
  return (
    !hasErrors &&
    !!formData.employeeId &&
    !!formData.position &&
    !!formData.department &&
    !!formData.hireDate &&
    !!formData.joinDate &&
    !!formData.employmentStatus &&
    !!formData.employmentType &&
    !!formData.role
  );
}

export function checkAddressSectionCompletion(
  hasErrors: boolean,
  formData: CreateEmployeeFormInput
): boolean {
  return (
    !hasErrors &&
    !!formData.address.street &&
    !!formData.address.city &&
    !!formData.address.state &&
    !!formData.address.pinCode &&
    !!formData.address.country
  );
}
