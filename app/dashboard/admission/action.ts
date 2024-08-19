"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";
import { StudentSchema, StudentSchemaType } from "./schema";

export const CREATE_STUDENT = async (values: StudentSchemaType) => {
  const { data, success } = StudentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const counter = await db.counter.findFirst({
    where: {
      class: data.class,
    },
  });

  if (!counter) {
    throw new Error("Counter not found");
  }

  const newStudent = await db.student.create({
    data: {
      studentId: counter.count + 1,
      session: new Date().getFullYear(),
      ...data,
    },
  });

  if (newStudent) {
    await db.counter.update({
      where: {
        id: counter.id,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  }

  return {
    success: "Student created",
    id: newStudent.id
  }
};

export const GET_ADMISSION_FEE_BY_CLASS = async (className: Class) => {
  const admissionFee = await db.admissionFee.findFirst({
    where: {
      class: className,
    },
  });

  if (!admissionFee) {
    throw new Error("Fee not found");
  }

  return { admissionFee };
};

export const GET_MONTHLY_FEE_BY_CLASS = async (className: Class) => {
  const monthlyFee = await db.monthlyFee.findFirst({
    where: {
      class: className,
    },
  });

  if (!monthlyFee) {
    throw new Error("Fee not found");
  }

  return { monthlyFee };
};
