import * as z from "zod";

export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters")
    .transform((val) => val.trim()),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .transform((val) => val.trim()),
  type: z.enum(["Villa", "Commercial", "Interior", "Landscape"]),
  category: z.string().optional(),
  sqft: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Sqft must be a number",
    }),
  status: z.enum([
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled",
  ]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
});

export const clientInfoSchema = z.object({
  client: z.string().min(1, "Client selection is required"),
  clientId: z.string().min(1, "Client must be selected"),
  clientEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  clientPhone: z.string().optional(),
});

export const detailsSchema = z.object({
  requirements: z
    .string()
    .min(1, "Client requirements are required")
    .min(20, "Requirements must be at least 20 characters")
    .transform((val) => val.trim()),
  currentPhase: z.string().optional(),
  progressPercentage: z.string().optional(),
  projectManager: z.string().min(1, "Project manager is required"),
  managerId: z.string().min(1, "Project manager must be selected"),
  teamMembers: z.string().optional(),
  teamMemberIds: z.array(z.string()).optional(),
});

export const timelineSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  totalBudget: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Budget must be a positive number",
    }),
});

export const additionalSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().optional(),
});

// Combined schema for the entire form
export const projectFormSchema = basicInfoSchema
  .merge(clientInfoSchema)
  .merge(detailsSchema)
  .merge(timelineSchema)
  .merge(additionalSchema)
  .extend({
    createdBy: z.string(),
  });

export type ProjectFormData = z.infer<typeof projectFormSchema>;
