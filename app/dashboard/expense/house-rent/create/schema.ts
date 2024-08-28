import { Month, PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const HousePaymentSchema = z.object({
  month: z
    .nativeEnum(Month)
    .refine((val) => Object.values(Month).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
  method: z
    .nativeEnum(PaymentMethod)
    .refine((val) => Object.values(PaymentMethod).includes(val), {
      message: "required",
    }),
  note: z.string().optional(),
  houseId: z.string().min(1, { message: "required" }),
});

export type HousePaymentSchemaType = z.infer<typeof HousePaymentSchema>;
