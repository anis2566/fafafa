"use server";

import { db } from "@/lib/prisma";
import { TeacherPaymentSchema, TeacherPaymentSchemaType } from "./schema";
import { revalidatePath } from "next/cache";

export const CREATE_TEACHER_PAYMENT = async (
  values: TeacherPaymentSchemaType
) => {
  const { data, success } = TeacherPaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.teacherPayment.findFirst({
    where: {
      teacherId: data.teacherId,
      month: data.month,
    },
  });

  if (payment) {
    throw new Error("Payment already created");
  }

  const teacher = await db.teacher.findUnique({
    where: {
      id: data.teacherId,
    },
    include: {
      fee: true,
      bank: true,
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  const total = teacher.fee ? teacher.fee.perClass * data.classUnit : 0;
  const deduction = teacher.fee
    ? teacher.fee.perClass * (data.deductionUnit ?? 0)
    : 0;

  await db.teacherPayment.create({
    data: {
      teacherName: teacher.name,
      session: new Date().getFullYear(),
      amount:
        total +
        (data?.incentive ?? 0) -
        (deduction + (teacher?.bank?.advance ?? 0)),
      advance: teacher?.bank?.advance ?? 0,
      deduction,
      ...data,
    },
  });

  await db.bank.update({
    where: {
      teacherId: teacher.id,
    },
    data: {
      advance: {
        decrement: teacher?.bank?.advance ?? 0,
      },
    },
  });

  revalidatePath("/dashbaord/expense/teacher/create");

  return {
    success: "Payment created",
  };
};

export const GET_TEACHERS = async () => {
  const teachers = await db.teacher.findMany({
    include: {
      fee: true,
      bank: true,
    },
    orderBy: {
      teacherId: "asc",
    },
  });

  return { teachers };
};
