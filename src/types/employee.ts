export interface Employee {
  id: string;
  // Basic Information
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  name: string;
  gender: string;
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  joinDate: string;

  // Employment Details
  employeeId: string;
  position: string;
  department:
    | "architecture"
    | "interior"
    | "landscape"
    | "construction"
    | "drafting"
    | "accountant"
    | "admin"
    | "marketing";
  managerId?: string;
  manager?: string;
  hireDate: string;
  employmentStatus: "Active" | "Inactive" | "On Leave" | "Terminated";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  role: "employee" | "admin" | "manager" | "super_admin" | "accountant";
  salary?: number;

  // Personal Details
  dateOfBirth?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Professional Details
  skills: string[];
  experience: number; // years
  education?: {
    degree: string;
    university: string;
    dateOfPassing: string;
  };
  certifications: string[];

  // System fields
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  search: string;
  department: string;
  position: string;
  employmentStatus: string;
  employmentType: string;
}

export interface EmployeeSort {
  field: keyof Employee;
  direction: "asc" | "desc";
}
