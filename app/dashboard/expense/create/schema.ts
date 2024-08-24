import { z } from "zod";

export const ExpenseSchema = z.object({
  title: z.string().min(1, { message: "required" }),
  amount: z.number().min(1, { message: "required" }),
  carriedBy: z.string().min(1, { message: "required" }),
  note: z.string().optional(),
});

export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>;
