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
          days: {
            hasSome: values.day,
          },
        },
        {
          times: {
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
      times: {
        hasSome: values.time,
      },
      days: {
        hasSome: values.day,
      },
    },
  });

  if (isTeacherTimeBook) {
    throw new Error("The teacher time is book");
  }

  const subject = await db.subject.findUnique({
    where: {
      id: data.subjectId
    },
    select: {
      name: true
    }
  })

  if(!subject) throw new Error("Subject not found")

  const teacher = await db.teacher.findUnique({
    where: {
      id: data.teacherId
    },
    select: {
      name: true
    }
  })

  if(!teacher) throw new Error("Teacher not found")

  for (const item of data.day) {
    await db.batchClass.create({
      data: {
        batchId: id,
        days: data.day,
        times: data.time,
        day: item,
        time: `${data.time[0]}-${data.time[1]}`,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        subjectName: subject.name,
        teacherName: teacher.name
      },
    });
  }

  revalidatePath(`/dashboard/batch/${id}`);

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
    take: 3,
  });

  return { teachers };
};
