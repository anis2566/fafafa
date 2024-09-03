"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { TeacherSchema, TeacherSchemaType } from "../../create/schema";

type UpdateTeacher = {
  id: string;
  values: TeacherSchemaType;
};

export const UPDATE_TEACHER = async ({ id, values }: UpdateTeacher) => {
  const { data, success } = TeacherSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input field");
  }

  const teacher = await db.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  await db.teacher.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/teacher");

  return {
    success: "Teacher updated",
  };
};
