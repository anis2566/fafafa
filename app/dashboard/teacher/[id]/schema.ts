import { Level } from "@prisma/client";
import { z } from "zod";

export const TeacherPaymentSchema = z.object({
  level: z
    .nativeEnum(Level)
    .refine((val) => Object.values(Level).includes(val), {
      message: "required",
    }),
  amount: z.number().min(1, { message: "required" }),
});

export type TeacherPaymentSchemaType = z.infer<typeof TeacherPaymentSchema>;
