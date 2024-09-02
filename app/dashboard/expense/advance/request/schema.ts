import { z } from "zod";

export const TeacherAdvanceSchema = z.object({
  amount: z.number().min(1, { message: "required" }),
  teacherId: z.string().min(1, { message: "required" }),
});

export type TeacherAdvanceSchemaType = z.infer<typeof TeacherAdvanceSchema>;
