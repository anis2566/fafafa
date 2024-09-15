"use server";

import { db } from "@/lib/prisma";
import { Class, Day } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { TeacherFeeSchema, TeacherFeeSchemaType } from "./schema";

export const GET_SUBJECTS_FOR_TEACHER = async (className: Class) => {
  const subjects = await db.subject.findMany({
    where: {
      class: className,
    },
  });

  return {
    subjects,
  };
};

type AddTeacherSubject = {
  teacherId: string;
  values: TeacherFeeSchemaType;
};

export const ADD_TEACHER_PAYMENT = async ({
  teacherId,
  values,
}: AddTeacherSubject) => {
  const { data, success } = TeacherFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.teacherFee.findFirst({
    where: {
      teacherId,
    },
  });

  if (fee) {
    throw new Error("Fee already exists");
  }

  await db.teacherFee.create({
    data: {
      teacherId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/teacher/${teacherId}`);

  return {
    success: "Fee added",
  };
};

type UpdatePayment = {
  id: string;
  values: TeacherFeeSchemaType;
};

export const UPDATE_TEACHER_PAYMENT = async ({ id, values }: UpdatePayment) => {
  const { data, success } = TeacherFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.teacherFee.findUnique({
    where: {
      id,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  await db.teacherFee.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath(`/dashbaord/teacher/${fee.teacherId}`);

  return {
    success: "Fee updated",
  };
};

export const GET_SUBJECT_BY_BATCH = async (id: string) => {
  const batch = await db.batch.findUnique({
    where: {
      id,
    },
  });

  if (!batch) throw new Error("Batch not found");

  const subjects = await db.subject.findMany({
    where: {
      class: batch.class,
    },
  });

  return { subjects };
};

type GetTeachers = {
  id: string;
  searchId?: number;
};

export const GET_TEACHERS_BY_BATCH = async ({ id, searchId }: GetTeachers) => {
  const batch = await db.batch.findUnique({
    where: {
      id,
    },
  });

  if (!batch) throw new Error("Batch not found");

  const teachers = await db.teacher.findMany({
    where: {
      level: {
        has: batch.level,
      },
      ...(searchId && { teacherId: searchId }),
    },
    take: 3,
  });

  return { teachers };
};

type CreateBatchClass = {
  batchId: string;
  time: string;
  day: Day;
  subjectId: string;
  teacherId: string;
};

export const ADD_BATCH_CLASS = async ({
  batchId,
  time,
  day,
  subjectId,
  teacherId,
}: CreateBatchClass) => {
  const isBatchTimeBook = await db.batchClass.findFirst({
    where: {
      batchId,
      AND: [
        {
          day,
        },
        {
          time,
        },
      ],
    },
  });

  if (isBatchTimeBook) {
    throw new Error(`The batch time is booked for day ${day}`);
  }

  const isTeacherTimeBook = await db.batchClass.findFirst({
    where: {
      teacherId,
      AND: [
        {
          day,
        },
        {
          time,
        },
      ],
    },
  });

  if (isTeacherTimeBook) {
    throw new Error(`The teacher time is booked for day ${day}`);
  }

  const subject = await db.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      name: true,
    },
  });

  if (!subject) throw new Error("Subject not found");

  const teacher = await db.teacher.findUnique({
    where: {
      id: teacherId,
    },
    select: {
      name: true,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  const batch = await db.batch.findUnique({
    where: {
      id: batchId,
    },
    include: {
      room: true,
    },
  });

  if (!batch) throw new Error("Batch not found");

  await db.batchClass.create({
    data: {
      batchId,
      day,
      time,
      subjectId,
      teacherId,
      subjectName: subject.name,
      teacherName: teacher.name,
      batchName: batch.name,
      roomName: batch.room.name,
      roomId: batch.roomId,
    },
  });

  revalidatePath(`/dashboard/teacher/${teacherId}`);

  return {
    success: "Class added",
  };
};
