"use server";

import { Class, Role } from "@prisma/client";

import { db } from "@/lib/prisma";
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

  const { referenceId, ...rest } = data;

  const id = await db.$transaction(async (ctx) => {
    const newStudent = await ctx.student.create({
      data: {
        studentId: counter.count + 1,
        session: new Date().getFullYear(),
        ...rest,
        ...(referenceId && { referenceId }),
      },
    });

    await ctx.counter.update({
      where: {
        id: counter.id,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });

    return newStudent.id;
  });

  return {
    success: "Student created",
    id,
  };
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

export const GET_USERS = async () => {
  const users = await db.user.findMany({
    where: {
      role: {
        not: Role.Admin,
      },
    },
  });

  return { users };
};
