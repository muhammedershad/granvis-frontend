import { z } from "zod";

const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

export const createFirmSettingsSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(1, "Firm name is required")
    .min(2, "Firm name must be at least 2 characters")
    .max(100, "Firm name must not exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Phone must be 10-15 digits (may include +, spaces, or hyphens)"),
  alternatePhone: z
    .string()
    .regex(phoneRegex, "Alternate phone must be 10-15 digits")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Website must be a valid URL (e.g. https://example.com)")
    .optional()
    .or(z.literal("")),

  // Address
  address: z
    .string()
    .min(1, "Address is required")
    .min(3, "Address must be at least 3 characters")
    .max(500, "Address must not exceed 500 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .min(2, "State must be at least 2 characters")
    .max(100, "State must not exceed 100 characters"),
  country: z.string().max(100, "Country must not exceed 100 characters").optional(),

  // Invoice Settings
  invoicePrefix: z
    .string()
    .max(20, "Invoice prefix must not exceed 20 characters")
    .optional(),
  invoiceStartNumber: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .int("Must be a whole number")
    .min(1, "Invoice start number must be at least 1")
    .optional(),
  defaultNotes: z.array(z.string()).optional(),
  isDefault: z.boolean().optional(),

  // Logo (managed outside form, stored as hidden value)
  logoKey: z.string().optional(),
});

export type CreateFirmSettingsFormData = z.infer<typeof createFirmSettingsSchema>;
