import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z.string().max(2000).optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  project: z.string().min(1, "Project is required"),
  milestone: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.coerce.number().min(0).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  actualHours: z.coerce.number().min(0).optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
