import { NoticeType } from "@prisma/client";
import { z } from "zod";

export const NoticeSchema = z.object({
  type: z
    .nativeEnum(NoticeType)
    .refine((val) => Object.values(NoticeType).includes(val), {
      message: "required",
    }),
  text: z.string().min(1, { message: "required" }),
});

export type NoticeSchemaType = z.infer<typeof NoticeSchema>;
