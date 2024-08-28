import { Month } from "@prisma/client";
import { z } from "zod";

export const TeacherPaymentSchema = z.object({
  classUnit: z.number().min(1, { message: "required" }),
  incentive: z.number().optional(),
  deductionUnit: z.number().optional(),
  month: z
    .nativeEnum(Month)
    .refine((val) => Object.values(Month).includes(val), {
      message: "required",
    }),
  teacherId: z.string().min(1, { message: "required" }),
  note: z.string().optional()
});

export type TeacherPaymentSchemaType = z.infer<typeof TeacherPaymentSchema>;
