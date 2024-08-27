import { RoomStatus } from "@prisma/client";
import { z } from "zod";

export const RoomSchema = z.object({
  status: z
    .nativeEnum(RoomStatus)
    .refine((val) => Object.values(RoomStatus).includes(val), {
      message: "required",
    }),
  name: z.number().min(1, { message: "required" }),
  houseId: z.string().min(1, { message: "required" }),
  capacity: z.number().min(1, { message: "required" }),
  availableTime: z
    .array(z.string().min(1))
    .min(1)
    .nonempty("required"),
});

export type RoomSchemaType = z.infer<typeof RoomSchema>;
