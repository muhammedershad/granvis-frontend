export interface Employee {
  id: string;
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  
  // Employment Details
  employeeId: string;
  position: string;
  department: string;
  team: string;
  manager: string;
  hireDate: string;
  employmentStatus: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  salary: number;
  
  // Personal Details
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Professional Details
  skills: string[];
  experience: number; // years
  education: string;
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
  direction: 'asc' | 'desc';
}