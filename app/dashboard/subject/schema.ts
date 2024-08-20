import { Class, Group } from "@prisma/client";
import { z } from "zod";

export const SubjectSchema = z.object({
  group: z.nativeEnum(Group).optional(),
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  name: z.string().min(1, { message: "required" }),
});

export type SubjectSchemaType = z.infer<typeof SubjectSchema>;
