"use server";

import { db } from "@/lib/prisma";
import { TeacherPaymentSchema, TeacherPaymentSchemaType } from "./schema";
import { revalidatePath } from "next/cache";
import { TeacherPaymentStatus } from "@prisma/client";

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

  const deduction = teacher.fee
    ? teacher.fee.perClass * (data.deductionUnit ?? 0)
    : 0;

  const total = teacher.fee
    ? teacher.fee.perClass * data.classUnit + (data?.incentive ?? 0) - deduction
    : 0 + (data?.incentive ?? 0) - deduction;

  if ((teacher?.bank?.advance ?? 0) > 0) {
    if (total <= (teacher?.bank?.advance ?? 0)) {
      await db.bank.update({
        where: {
          teacherId: data.teacherId,
        },
        data: {
          advance: {
            decrement: total,
          },
          current: {
            increment: total,
          },
        },
      });

      await db.teacherPayment.create({
        data: {
          teacherName: teacher.name,
          session: new Date().getFullYear(),
          amount: total,
          advance: total,
          deduction,
          ...data,
          status: TeacherPaymentStatus.Dismiss,
        },
      });
    } else {
      await db.bank.update({
        where: {
          teacherId: data.teacherId,
        },
        data: {
          advance: 0,
          current: {
            increment: total,
          },
        },
      });

      await db.teacherPayment.create({
        data: {
          teacherName: teacher.name,
          session: new Date().getFullYear(),
          amount: total - (teacher.bank?.advance ?? 0),
          deduction,
          advance: teacher.bank?.advance ?? 0,
          ...data,
        },
      });
    }
  } else {
    await db.teacherPayment.create({
      data: {
        teacherName: teacher.name,
        session: new Date().getFullYear(),
        amount: total,
        deduction,
        ...data,
      },
    });
  }

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
