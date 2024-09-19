"use server";

import { Month, Status, TransactionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { TeacherAdvanceSchema, TeacherAdvanceSchemaType } from "./schema";

export const GET_TEACHERS = async (id?: number) => {
  const teachers = await db.teacher.findMany({
    where: {
      ...(id && { teacherId: id }),
      status: Status.Active,
    },
    orderBy: {
      teacherId: "asc",
    },
    take: 3,
  });

  return { teachers };
};

export const CREATE_ADVANCE = async (values: TeacherAdvanceSchemaType) => {
  const { data, success } = TeacherAdvanceSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const teacher = await db.teacher.findUnique({
    where: {
      id: data.teacherId,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  await db.$transaction(async (ctx) => {
    await ctx.teacherAdvance.create({
      data: {
        session: new Date().getFullYear(),
        month: Object.values(Month)[new Date().getMonth()],
        ...data,
        status: TransactionStatus.Approve,
        teacherName: teacher.name,
      },
    });

    await ctx.bank.update({
      where: {
        teacherId: data.teacherId,
      },
      data: {
        advance: {
          increment: data.amount,
        },
        current: {
          decrement: data.amount,
        },
      },
    });
  });

  revalidatePath("/dashboard/expense/advance");

  return {
    success: "Request successful",
  };
};
