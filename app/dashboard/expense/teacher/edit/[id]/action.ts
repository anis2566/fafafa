"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import {
  TeacherPaymentSchema,
  TeacherPaymentSchemaType,
} from "../../create/schema";

type UpdateTeacherPayment = {
  id: string;
  values: TeacherPaymentSchemaType;
};

export const UPDATE_TEACHER_PAYMENT = async ({
  id,
  values,
}: UpdateTeacherPayment) => {
  const { data, success } = TeacherPaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.teacherPayment.findUnique({
    where: {
      id,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const teacher = await db.teacher.findUnique({
    where: {
      id: data.teacherId,
    },
    include: {
      fee: true,
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  const total = teacher.fee ? teacher.fee.perClass * data.classUnit : 0;
  const deduction = teacher.fee
    ? teacher.fee.perClass * (data.deductionUnit ?? 0)
    : 0;

  await db.teacherPayment.update({
    where: {
      id,
    },
    data: {
      ...data,
      amount: total - deduction + (data?.incentive ?? 0),
      deduction,
    },
  });

  revalidatePath("/dashboard/expense/teacher");

  return {
    success: "Payment updated",
  };
};
