import { z } from "zod";

const requiredString = z.string().trim().min(1, { message: "required" });

export const SignInSchema = z.object({
  email: requiredString.email({ message: "invalid email" }),
  password: requiredString,
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
