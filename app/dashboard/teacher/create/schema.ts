import { z } from "zod";
import {
  Nationality,
  Class as PrismaClass,
  Shift,
  Religion,
  Group,
  Gender,
  Level,
} from "@prisma/client";

const requiredString = z.string().trim().min(1, { message: "required" });

export const TeacherSchema = z.object({
  name: requiredString.min(4, { message: "min length 4" }),
  fName: requiredString.min(4, { message: "min length 4" }),
  mName: requiredString.min(4, { message: "min length 4" }),
  dob: z.date().refine((date) => date !== null, { message: "required" }),
  nationality: z
    .nativeEnum(Nationality)
    .refine((val) => Object.values(Nationality).includes(val), {
      message: "required",
    }),
  gender: z
    .nativeEnum(Gender)
    .refine((val) => Object.values(Gender).includes(val), {
      message: "required",
    }),
  religion: z
    .nativeEnum(Religion)
    .refine((val) => Object.values(Religion).includes(val), {
      message: "required",
    }),
  imageUrl: requiredString,
  phone: requiredString.min(11, { message: "Invalid phone number" }),
  altPhone: requiredString
    .min(11, { message: "Invalid phone number" })
    .optional(),
  presentHouseNo: requiredString,
  presentMoholla: requiredString,
  presentPost: requiredString,
  presentThana: requiredString,
  permanentVillage: requiredString,
  permanentPost: requiredString,
  permanentThana: requiredString,
  permanentDistrict: requiredString,
  level: z
    .nativeEnum(Level)
    .refine((val) => Object.values(Level).includes(val), {
      message: "required",
    }),
});

export type TeacherSchemaType = z.infer<typeof TeacherSchema>;
