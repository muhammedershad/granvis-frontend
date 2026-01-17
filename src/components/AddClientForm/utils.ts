import { FieldErrors } from "react-hook-form";
import { CreateClientFormData } from "@/lib/validations/client";

const sectionErrorChecks: Record<
  "personal" | "professional" | "address" | "status" | "notes",
  (errors: FieldErrors<CreateClientFormData>) => boolean
> = {
  personal: (errors) =>
    !!(
      errors.firstName ||
      errors.middleName ||
      errors.lastName ||
      errors.email ||
      errors.phone ||
      errors.dateOfBirth ||
      errors.gender
    ),
  professional: (errors) => !!(errors.occupation || errors.employer),
  address: (errors) =>
    !!(
      errors.street ||
      errors.city ||
      errors.state ||
      errors.postalCode ||
      errors.country
    ),
  status: (errors) =>
    !!(
      errors.status ||
      errors.priority ||
      errors.architecturalStyle ||
      errors.architecturalStyleOther
    ),
  notes: (errors) => !!(errors.notes || errors.tags),
};

export function checkSectionErrors(
  errors: FieldErrors<CreateClientFormData>,
  section: "personal" | "professional" | "address" | "status" | "notes"
): boolean {
  const checkFn = sectionErrorChecks[section];
  return checkFn ? checkFn(errors) : false;
}

export function buildClientData(data: CreateClientFormData) {
  const fullName = [data.firstName, data.middleName, data.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    fullName: fullName,
    name: fullName,
    email: data.email || "",
    phone: data.phone,
    website: undefined,
    companyName: data.employer || fullName,
    companyType: "Individual" as const,
    industry: data.occupation || "Other",
    address: {
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.postalCode,
      country: data.country,
    },
    primaryContact: {
      name: fullName,
      title: data.occupation || "Client",
      email: data.email || "",
      phone: data.phone,
    },
    secondaryContact: data.spouseName
      ? {
          name: data.spouseName,
          title: "Spouse",
          email: data.spouseEmail || "",
          phone: data.spousePhone || "",
        }
      : undefined,
    status: data.status,
    source: data.source,
    priority: data.priority,
    totalProjectValue: 0,
    projectsCount: 0,
    notes: data.notes || "",
    tags: data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    projectIds: [],
    activeProjects: 0,
    completedProjects: 0,
    createdBy: data.createdBy,
  };
}
