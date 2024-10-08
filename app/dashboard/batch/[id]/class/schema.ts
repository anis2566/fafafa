import { Day } from "@prisma/client";
import { z } from "zod";

export const BatchClassSchema = z.object({
  time: z.string().min(1, { message: "required" }),
  day: z.array(z.nativeEnum(Day)).min(1, { message: "required" }),
  subjectId: z.string().min(1, { message: "required" }),
  teacherId: z.string().min(1, { message: "required" }),
});

export type BatchClassSchemaType = z.infer<typeof BatchClassSchema>;
