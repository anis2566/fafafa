import { PaymentMethod} from "@prisma/client";
import { z } from "zod";

export const AdmissionPaymentSchema = z.object({
  method: z
    .nativeEnum(PaymentMethod)
    .refine((val) => Object.values(PaymentMethod).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
});

export type AdmissionPaymentSchemaType = z.infer<typeof AdmissionPaymentSchema>;
