"use server";

import { Month, TransactionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { TeacherAdvanceSchema, TeacherAdvanceSchemaType } from "./schema";

export const GET_TEACHERS = async (id?: number) => {
  const teachers = await db.teacher.findMany({
    where: {
      ...(id && { teacherId: id }),
    },
    orderBy: {
      teacherId: "asc",
    },
  });

  return { teachers };
};

export const CREATE_ADVANCE = async (values: TeacherAdvanceSchemaType) => {
  const { data, success } = TeacherAdvanceSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  await db.$transaction(async (ctx) => {
    await db.teacherAdvance.create({
      data: {
        session: new Date().getFullYear(),
        month: Object.values(Month)[new Date().getMonth()],
        ...data,
        status: TransactionStatus.Approve,
      },
    });

    await db.bank.update({
      where: {
        teacherId: data.teacherId,
      },
      data: {
        advance: {
          increment: data.amount,
        },
      },
    });
  });

  revalidatePath("/dashboard/expense/advance");

  return {
    success: "Request successful",
  };
};
