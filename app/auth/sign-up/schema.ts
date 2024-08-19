import { z } from "zod";

const requiredString = z.string().trim().min(1, { message: "required" });

export const SignUpSchema = z.object({
  name: requiredString.min(4, { message: "min 4 characters" }),
  email: requiredString.email({ message: "invalid email" }),
  password: requiredString.min(6, { message: "min 6 characters" }),
  image: requiredString,
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
