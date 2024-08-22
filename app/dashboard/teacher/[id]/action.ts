"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { TeacherPaymentSchema, TeacherPaymentSchemaType } from "./schema";

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
  values: TeacherPaymentSchemaType;
};

export const ADD_TEACHER_PAYMENT = async ({
  teacherId,
  values,
}: AddTeacherSubject) => {
  const { data, success } = TeacherPaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.teacherPayment.findFirst({
    where: {
      teacherId,
      level: data.level,
    },
  });

  if (payment) {
    throw new Error("Payment already exists");
  }

  await db.teacherPayment.create({
    data: {
      teacherId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/teacher/${teacherId}`);

  return {
    success: "Payment added",
  };
};
