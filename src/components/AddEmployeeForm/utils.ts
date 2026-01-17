import { CreateEmployeeFormInput } from "@/lib/validations/employee";

export function transformEmployeeFormData(
  data: CreateEmployeeFormInput,
  managers: Array<{ id: string; name: string }>
) {
  return {
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    name: [data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(" "),
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    employeeId: data.employeeId,
    position: data.position,
    department: data.department,
    managerId: data.managerId || undefined,
    manager: data.managerId
      ? managers.find((m) => m.id === data.managerId)?.name
      : undefined,
    hireDate: data.hireDate,
    joinDate: data.joinDate,
    employmentStatus: data.employmentStatus,
    status: data.employmentStatus,
    employmentType: data.employmentType,
    role: data.role,
    salary: data.salary ? parseFloat(data.salary) : undefined,
    address: {
      street: data.address.street,
      city: data.address.city,
      state: data.address.state,
      pinCode: data.address.pinCode,
      country: data.address.country,
    },
    emergencyContact: data.emergencyContact?.name
      ? {
          name: data.emergencyContact.name,
          relationship: data.emergencyContact.relationship || "",
          phone: data.emergencyContact.phone || "",
        }
      : undefined,
    skills: data.skillsInput
      ? data.skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    experience: data.experience ? parseInt(data.experience) : 0,
    education: data.education?.degree
      ? {
          degree: data.education.degree,
          university: data.education.university || "",
          dateOfPassing: data.education.dateOfPassing || "",
        }
      : undefined,
    certifications: data.certificationsInput
      ? data.certificationsInput
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [],
  };
}

export function getFieldsToValidate(
  sectionId: string
): Array<keyof CreateEmployeeFormInput> {
  if (sectionId === "personal") {
    return ["firstName", "lastName", "email", "phone", "gender"];
  } else if (sectionId === "employment") {
    return [
      "employeeId",
      "position",
      "department",
      "hireDate",
      "joinDate",
      "employmentStatus",
      "employmentType",
      "role",
    ];
  } else if (sectionId === "address") {
    return ["address"];
  }
  return [];
}

export function checkPersonalSectionErrors(errors: {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  gender?: unknown;
}): boolean {
  return !!(
    errors.firstName ||
    errors.lastName ||
    errors.email ||
    errors.phone ||
    errors.gender
  );
}

export function checkEmploymentSectionErrors(errors: {
  position?: unknown;
  department?: unknown;
  hireDate?: unknown;
  joinDate?: unknown;
  employmentStatus?: unknown;
  employmentType?: unknown;
  role?: unknown;
}): boolean {
  return !!(
    errors.position ||
    errors.department ||
    errors.hireDate ||
    errors.joinDate ||
    errors.employmentStatus ||
    errors.employmentType ||
    errors.role
  );
}

export function checkAddressSectionErrors(errors: {
  address?: {
    street?: unknown;
    city?: unknown;
    state?: unknown;
    pinCode?: unknown;
    country?: unknown;
  };
}): boolean {
  return !!(
    errors.address?.street ||
    errors.address?.city ||
    errors.address?.state ||
    errors.address?.pinCode ||
    errors.address?.country
  );
}
