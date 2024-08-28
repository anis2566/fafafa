"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { TeacherFeeSchema, TeacherFeeSchemaType } from "./schema";

export const GET_SUBJECTS_FOR_TEACHER = async (className: Class) => {
  const subjects = await db.subject.findMany({
    where: {
      class: className,
    },
  });

  return {
    subjects,
  };
};

type AddTeacherSubject = {
  teacherId: string;
  values: TeacherFeeSchemaType;
};

export const ADD_TEACHER_PAYMENT = async ({
  teacherId,
  values,
}: AddTeacherSubject) => {
  const { data, success } = TeacherFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.teacherFee.findFirst({
    where: {
      teacherId,
    },
  });

  if (fee) {
    throw new Error("Fee already exists");
  }

  await db.teacherFee.create({
    data: {
      teacherId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/teacher/${teacherId}`);

  return {
    success: "Fee added",
  };
};

type UpdatePayment = {
  id: string;
  values: TeacherFeeSchemaType;
};

export const UPDATE_TEACHER_PAYMENT = async ({ id, values }: UpdatePayment) => {
  const { data, success } = TeacherFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.teacherFee.findUnique({
    where: {
      id,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  await db.teacherFee.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath(`/dashbaord/teacher/${fee.teacherId}`);

  return {
    success: "Fee updated",
  };
};
