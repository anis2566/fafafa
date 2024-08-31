"use server";

import { Class, Month } from "@prisma/client";

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
      month: Object.values(Month)[new Date().getMinutes()],
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

  return {
    success: "Attendence created",
  };
};
