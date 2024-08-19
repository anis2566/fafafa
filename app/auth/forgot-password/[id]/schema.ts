import { z } from "zod";

export const PasswordSchema = z
  .object({
    password: z.string().trim().min(6, { message: "min 6 characters" }),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordSchemaType = z.infer<typeof PasswordSchema>;
