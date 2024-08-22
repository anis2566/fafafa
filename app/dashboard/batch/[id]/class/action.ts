"use server";

import { Class, Level } from "@prisma/client";

import { db } from "@/lib/prisma";
import { BatchClassSchema, BatchClassSchemaType } from "./schema";
import { revalidatePath } from "next/cache";

type CreateBatchClass = {
  id: string;
  values: BatchClassSchemaType;
};

export const CREATE_BATCH_CLASS = async ({ id, values }: CreateBatchClass) => {
  const { data, success } = BatchClassSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const isBatchTimeBook = await db.batchClass.findFirst({
    where: {
      batchId: id,
      AND: [
        {
          day: {
            hasSome: values.day,
          },
        },
        {
          time: {
            hasSome: values.time,
          },
        },
      ],
    },
  });

  if (isBatchTimeBook) {
    throw new Error("The batch time is book");
  }

  const isTeacherTimeBook = await db.batchClass.findFirst({
    where: {
      teacherId: values.teacherId,
      time: {
        hasSome: values.time,
      },
      day: {
        hasSome: values.day,
      },
    },
  });

  if (isTeacherTimeBook) {
    throw new Error("The teacher time is book");
  }

  await db.batchClass.create({
    data: {
      batchId: id,
      ...data,
    },
  });

  revalidatePath(`/dashboard/batch/${id}`)

  return {
    success: "Class created",
  };
};

export const GET_SUBJECT_BY_CLASS = async (className: Class) => {
  const subjects = await db.subject.findMany({
    where: {
      class: className,
    },
  });

  return {
    subjects,
  };
};

export const GET_TEACHER_BY_LEVEL = async (level: Level) => {
  const teachers = await db.teacher.findMany({
    where: {
      level: {
        has: level,
      },
    },
  });

  return { teachers };
};
