import { z } from "zod";

// Helper function to validate name fields (no numbers, no special chars, unicode allowed)
const nameRegex = /^[\p{L}\s'-]+$/u;

// Helper function to validate phone number
const phoneRegex = /^\+?[1-9]\d{7,14}$/;

// Helper to check if date is in the past
const isPastDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper to check if date is today or future
const isTodayOrFuture = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

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
export const createEmployeeFormSchema = z
  .object({
    // Basic Information - Personal Information Section
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .regex(
        nameRegex,
        "First name cannot contain numbers or special characters"
      ),
    middleName: z
      .string()
      .trim()
      .max(50, "Middle name must not exceed 50 characters")
      .regex(
        /^[\p{L}\s'-]*$/u,
        "Middle name cannot contain numbers or special characters"
      )
      .optional()
      .or(z.literal("")),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .regex(
        nameRegex,
        "Last name cannot contain numbers or special characters"
      ),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
      .transform((val) => val.toLowerCase()),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        phoneRegex,
        "Phone must be numeric with optional leading + and 8-15 digits"
      ),
    avatar: z.string().optional(),
    avatarKey: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"], {
      message: "Gender must be Male, Female, or Other",
    }),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Invalid date format")
      .refine((val) => isPastDate(val), "Date of birth must be before today"),

    // Employment Details
    employeeId: z.string().min(1, "Employee ID is required"),
    position: z
      .string()
      .trim()
      .min(1, "Position is required")
      .max(100, "Position must not exceed 100 characters")
      .refine(
        (val) => !/^\d+$/.test(val),
        "Position cannot contain only numbers"
      ),
    department: z.enum(
      [
        "architecture",
        "interior",
        "landscape",
        "construction",
        "drafting",
        "accountant",
        "admin",
        "marketing",
      ],
      {
        message: "Invalid department selected",
      }
    ),
    managerId: z.string().optional().or(z.literal("")),
    hireDate: z
      .string()
      .min(1, "Hire date is required")
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Invalid hire date format"),
    joinDate: z
      .string()
      .min(1, "Join date is required")
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Invalid join date format")
      .refine(
        (val) => isTodayOrFuture(val),
        "Join date must be today or in the future"
      ),
    employmentStatus: z.enum(["Active", "Inactive", "On Leave", "Terminated"], {
      message: "Invalid employment status",
    }),
    employmentType: z.enum(["Full-time", "Part-time", "Contract", "Intern"], {
      message: "Invalid employment type",
    }),
    role: z.enum(
      ["employee", "admin", "manager", "super_admin", "accountant"],
      {
        message: "Invalid role selected",
      }
    ),
    salary: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === "") {
          return true;
        }
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      }, "Salary must be a positive number or zero"),

    // Personal Details
    address: addressSchema,
    emergencyContact: emergencyContactSchema.optional(),

    // Professional Details
    skillsInput: z.string().optional(),
    experience: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === "") {
          return true;
        }
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      }, "Experience must be a positive number or zero"),
    education: educationSchema.optional(),
    certificationsInput: z.string().optional(),
  })
  .refine(
    (data) => {
      // Cross-field validation: hire date must not be after join date
      if (data.hireDate && data.joinDate) {
        const hireDate = new Date(data.hireDate);
        const joinDate = new Date(data.joinDate);
        return hireDate <= joinDate;
      }
      return true;
    },
    {
      message: "Hire date must not be after join date",
      path: ["hireDate"],
    }
  );

export type CreateEmployeeFormInput = z.infer<typeof createEmployeeFormSchema>;
