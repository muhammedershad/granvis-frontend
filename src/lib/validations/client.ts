import { z } from "zod";

// Helper function to validate phone number
const phoneRegex = /^\+?[1-9]\d{7,14}$/;

// Zod schema for creating a new client
export const createClientSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less")
    .regex(/^\S+$/, "First name must be a single word without spaces"),
  middleName: z
    .string()
    .max(50, "Middle name must be 50 characters or less")
    .regex(/^$|^\S+$/, "Middle name must be a single word without spaces")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less")
    .regex(/^\S+$/, "Last name must be a single word without spaces"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      phoneRegex,
      "Phone must be numeric with optional leading + and 8-15 digits"
    ),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),

  // Professional Information
  occupation: z.string().optional(),
  employer: z.string().optional(),

  // Address (all required)
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),

  // Family/Additional Contacts
  spouseName: z.string().optional(),
  spousePhone: z.string().optional(),
  spouseEmail: z
    .string()
    .email("Invalid spouse email")
    .optional()
    .or(z.literal("")),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Client Information
  status: z.enum(["Potential Lead", "On Hold", "Active"]),
  source: z.enum([
    "Referral",
    "Website",
    "Social Media",
    "Advertisement",
    "Cold Call",
    "Other",
  ]),
  priority: z.enum(["Low", "Medium", "High", "VIP"]),

  // Preferences
  preferredContactMethod: z.string().optional(),
  preferredContactTime: z.string().optional(),
  architecturalStyle: z.string().optional(),
  architecturalStyleOther: z.string().optional(),
  budgetRange: z.string().optional(),

  // Notes and Tags
  notes: z.string().optional(),
  tags: z.string().optional(),

  // Avatar
  avatar: z.string().optional(),
  avatarKey: z.string().optional(),

  // System
  createdBy: z.string(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
