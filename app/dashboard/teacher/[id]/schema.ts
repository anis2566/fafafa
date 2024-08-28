import { z } from "zod";

export const TeacherFeeSchema = z.object({
  perClass: z.number().min(1, { message: "required" }),
});

export type TeacherFeeSchemaType = z.infer<typeof TeacherFeeSchema>;
