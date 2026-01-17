import { z } from "zod";

// Address validation schema
const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(1, "Pin code is required"),
  country: z.string().min(1, "Country is required"),
});

// Emergency contact validation schema
const emergencyContactSchema = z.object({
  name: z.string().optional(),
  relationship: z.string().optional(),
  phone: z.string().optional(),
});

// Education validation schema
const educationSchema = z.object({
  degree: z.string().optional(),
  university: z.string().optional(),
  dateOfPassing: z.string().optional(),
});

// Form input schema (accepts string inputs for numbers)
export const createEmployeeFormSchema = z.object({
  // Basic Information
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  middleName: z
    .string()
    .max(50, "Middle name must not exceed 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),
  avatar: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().optional(),

  // Employment Details
  employeeId: z.string().min(1, "Employee ID is required"),
  position: z.string().min(1, "Position is required"),
  department: z.enum([
    "architecture",
    "interior",
    "landscape",
    "construction",
    "drafting",
    "accountant",
    "admin",
    "marketing",
  ]),
  managerId: z.string().optional(),
  hireDate: z.string().min(1, "Hire date is required"),
  joinDate: z.string().min(1, "Join date is required"),
  employmentStatus: z.enum(["Active", "Inactive", "On Leave", "Terminated"]),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Intern"]),
  role: z.enum(["employee", "admin", "manager", "super_admin", "accountant"]),
  salary: z.string().optional(),

  // Personal Details
  address: addressSchema,
  emergencyContact: emergencyContactSchema.optional(),

  // Professional Details
  skillsInput: z.string().optional(),
  experience: z.string().optional(),
  education: educationSchema.optional(),
  certificationsInput: z.string().optional(),
});

export type CreateEmployeeFormInput = z.infer<typeof createEmployeeFormSchema>;
