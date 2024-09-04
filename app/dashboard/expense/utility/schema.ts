import { Expenses, Month } from "@prisma/client";
import { z } from "zod";

export const ExpenseSchema = z.object({
  type: z
    .nativeEnum(Expenses)
    .refine((val) => Object.values(Expenses).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
  note: z.string().optional(),
});

export type ExpenseSchemaType = z.infer<typeof ExpenseSchema>;
