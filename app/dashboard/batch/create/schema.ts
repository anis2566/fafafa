import { Class, Level } from "@prisma/client";
import { z } from "zod";

export const BatchSchema = z.object({
  class: z
    .nativeEnum(Class)
    .refine((val) => Object.values(Class).includes(val), {
      message: "required",
    }),
  level: z
    .nativeEnum(Level)
    .refine((val) => Object.values(Level).includes(val), {
      message: "required",
    }),
  name: z.string().min(1, { message: "required" }),
  capacity: z.number().min(1, { message: "required" }),
  time: z.array(z.string().min(1)).min(1).nonempty("required"),
  classTime: z.array(z.string().min(1)).min(1).nonempty("required"),
  roomId: z.string().min(1, { message: "required" }),
});

export type BatchSchemaType = z.infer<typeof BatchSchema>;
