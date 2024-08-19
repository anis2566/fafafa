import { Class } from "@prisma/client";
import { z } from "zod";

export const AdmissionFeeSchema = z.object({
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
});

export type AdmissionFeeSchemaType = z.infer<typeof AdmissionFeeSchema>;
