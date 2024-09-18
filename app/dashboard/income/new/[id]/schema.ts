import { Class, Month, PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const MonthlyPaymentSchema = z.object({
  month: z
    .nativeEnum(Month)
    .refine((val) => Object.values(Month).includes(val), {
      message: "required",
    }),
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  method: z
    .nativeEnum(PaymentMethod)
    .refine((val) => Object.values(PaymentMethod).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
  note: z.string().optional(),
});

export type MonthlyPaymentSchemaType = z.infer<typeof MonthlyPaymentSchema>;
