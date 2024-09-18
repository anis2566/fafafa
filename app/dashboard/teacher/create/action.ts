"use server";

import { CounterClass } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { TeacherSchema, TeacherSchemaType } from "./schema";

export const CREATE_TEACHER = async (values: TeacherSchemaType) => {
  const { data, success } = TeacherSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input field");
  }

  const counter = await db.counter.findFirst({
    where: {
      class: CounterClass.Teacher,
    },
  });

  if (!counter) {
    throw new Error("Counter not found");
  }

  await db.$transaction(async (ctx) => {
    const newTeacher = await ctx.teacher.create({
      data: {
        ...data,
        session: new Date().getFullYear(),
        teacherId: counter.count + 1,
      },
    });

    await ctx.bank.create({
      data: {
        teacherId: newTeacher.id,
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
  });

  revalidatePath("/dashboard/teacher");

  return {
    success: "Teacher created",
  };
};
