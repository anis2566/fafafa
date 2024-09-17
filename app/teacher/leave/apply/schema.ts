import { z } from "zod";

export const LeaveAppSchema = z.object({
  reason: z.string().min(1, { message: "required" }),
  dates: z.array(z.date()).min(1, "required"),
  attachments: z.array(z.string()).optional(),
});

export type LeaveAppSchemaType = z.infer<typeof LeaveAppSchema>;
