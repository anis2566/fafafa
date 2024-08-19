import { Class } from "@prisma/client";
import { z } from "zod";

export const MonthlyFeeSchema = z.object({
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
});

export type MonthlyFeeSchemaType = z.infer<typeof MonthlyFeeSchema>;
