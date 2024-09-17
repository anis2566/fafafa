import { z } from "zod";

export const IncomeSchema = z.object({
  name: z.string().min(1, { message: "required" }),
  amount: z.number().min(1, { message: "required" }),
  note: z.string().optional(),
});

export type IncomeSchemaType = z.infer<typeof IncomeSchema>;
