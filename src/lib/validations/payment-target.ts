import { z } from "zod";

export const createPaymentTargetSchema = z
  .object({
    title: z
      .string()
      .min(1, "Target title is required")
      .max(100, "Title must be 100 characters or less"),
    targetAmount: z
      .number({
        error: "Target amount is required and must be a number",
      })
      .min(1, "Target amount must be at least 1"),
    startDate: z.date({ error: "Start date is required" }),
    deadline: z.date({ error: "Deadline is required" }),
    category: z.enum(["quarterly", "monthly", "annual", "receivables"], {
      error: "Category is required",
    }),
  })
  .refine((data) => data.deadline > data.startDate, {
    message: "Deadline must be after start date",
    path: ["deadline"],
  });

export type CreatePaymentTargetFormData = z.infer<
  typeof createPaymentTargetSchema
>;
