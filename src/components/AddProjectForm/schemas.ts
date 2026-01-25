import * as z from "zod";

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
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
  clientId: z.string().optional(),
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
    .min(20, "Requirements must be at least 20 characters"),
  currentPhase: z.string().optional(),
  progressPercentage: z.string().optional(),
  projectManager: z.string().min(1, "Project manager is required"),
  managerId: z.string().optional(),
  teamMembers: z.string().optional(),
  teamMemberIds: z.array(z.string()).optional(),
});

export const timelineSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  deadline: z.string().optional(),
  estimatedDuration: z.string().optional(),
  totalBudget: z
    .string()
    .min(1, "Total budget is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Budget must be a positive number",
    }),
});

export const additionalSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  tags: z.string().optional(),
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
