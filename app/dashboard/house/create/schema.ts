import { HouseStatus } from "@prisma/client";
import { z } from "zod";

export const HouseSchema = z.object({
  status: z
    .nativeEnum(HouseStatus)
    .refine((val) => Object.values(HouseStatus).includes(val), {
      message: "required",
    }),
  name: z.string().min(1, { message: "required" }),
  roomCount: z.number().min(1, { message: "required" }),
});

export type HouseSchemaType = z.infer<typeof HouseSchema>;
