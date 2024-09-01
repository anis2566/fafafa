"use server";

import { Class, Month, PaymentStatus } from "@prisma/client";

import { db } from "@/lib/prisma";
import {
  AttendenceCreateSchema,
  AttendenceCreateSchemaType,
  AttendenceSchema,
  AttendenceSchemaType,
} from "./schema";

export const GET_BATCH_BY_CLASS = async (className: Class) => {
  const batches = await db.batch.findMany({
    where: {
      class: className,
    },
  });

  return { batches };
};

export const GET_STUDENT_FOR_ATTENDENCE = async (
  values: AttendenceCreateSchemaType
) => {
  const { data, success } = AttendenceCreateSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const students = await db.student.findMany({
    where: {
      session: values.session,
      class: values.class,
      batchId: data.batchId,
      isPresent: true,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      studentId: true,
    },
    orderBy: {
      studentId: "asc",
    },
  });

  return { students };
};

export const CREATE_ATTENDENCE = async (values: AttendenceSchemaType) => {
  const { data, success } = AttendenceSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const { students } = data;

  const attendence = await db.attendence.findFirst({
    where: {
      batchId: data.batchId,
      month: Object.values(Month)[new Date().getMonth()],
    },
  });

  if (attendence) {
    throw new Error("Attendence already created");
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    for (const student of students) {
      await db.attendence.create({
        data: {
          session: data.session,
          month: Object.values(Month)[currentMonth],
          day: day,
          class: data.class,
          batchId: data.batchId,
          studentId: student,
        },
      });
    }
  }

  const currentMonthIndex = new Date().getMonth();

  for (const studentId of students) {
    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { monthlyFee: true, class: true, id: true },
    });

    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    await db.monthlyPayment.create({
      data: {
        amount: student.monthlyFee,
        session: new Date().getFullYear(),
        class: student.class,
        status: PaymentStatus.Unpaid,
        studentId: student.id,
        month: Object.values(Month)[currentMonthIndex],
      },
    });
  }

  return {
    success: "Attendence created",
  };
};
