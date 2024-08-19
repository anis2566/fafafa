"use server";

import { revalidatePath } from "next/cache";

import {
  StudentSchema,
  StudentSchemaType,
} from "@/app/dashboard/admission/schema";
import { db } from "@/lib/prisma";

type UpdateStudent = {
  id: string;
  values: StudentSchemaType;
};

export const UPDATE_STUDENT = async ({ id, values }: UpdateStudent) => {
  const { data, success } = StudentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const student = await db.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  await db.student.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/student");

  return {
    success: "Student updated",
  };
};
