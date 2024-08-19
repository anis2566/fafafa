import { z } from "zod";
import {
  Nationality,
  Class as PrismaClass,
  Shift,
  Religion,
  Group,
  Gender,
} from "@prisma/client";

const requiredString = z.string().trim().min(1, { message: "required" });

export const StudentSchema = z.object({
  name: requiredString.min(4, { message: "min length 4" }),
  nameBangla: requiredString.min(4, { message: "min length 4" }),
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
  school: requiredString.min(4, { message: "min length 4" }),
  class: z
    .nativeEnum(PrismaClass)
    .refine((val) => Object.values(PrismaClass).includes(val), {
      message: "required",
    }),
  shift: z
    .nativeEnum(Shift)
    .refine((val) => Object.values(Shift).includes(val), {
      message: "required",
    }),
  group: z
    .nativeEnum(Group)
    .refine((val) => Object.values(Group).includes(val), {
      message: "required",
    })
    .optional(),
  section: z.string().optional(),
  roll: z.number().min(1, { message: "required" }),
  fPhone: requiredString.min(11, { message: "Invalid phone number" }),
  mPhone: requiredString.min(11, { message: "Invalid phone number" }),
  presentHouseNo: requiredString,
  presentMoholla: requiredString,
  presentPost: requiredString,
  presentThana: requiredString,
  permanentVillage: requiredString,
  permanentPost: requiredString,
  permanentThana: requiredString,
  permanentDistrict: requiredString,
  admissionFee: z.number().min(1, { message: "required" }),
  monthlyFee: z.number().min(1, { message: "required" }),
});

export type StudentSchemaType = z.infer<typeof StudentSchema>;
