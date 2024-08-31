import { Class } from "@prisma/client";
import { z } from "zod";

export const AttendenceCreateSchema = z.object({
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  batchId: z.string().min(1, { message: "required" }),
  session: z.number().min(1, { message: "required" }),
});

export type AttendenceCreateSchemaType = z.infer<typeof AttendenceCreateSchema>;

export const AttendenceSchema = z.object({
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  batchId: z.string().min(1, { message: "required" }),
  session: z.number().min(1, { message: "required" }),
  students: z.array(z.string()).min(1, { message: "required" }),
});

export type AttendenceSchemaType = z.infer<typeof AttendenceSchema>;
