"use server";

import { db } from "@/lib/prisma";
import { Class, Day } from "@prisma/client";
import { revalidatePath } from "next/cache";

type GetStudent = {
  id: number | undefined;
  className: Class;
};

export const GET_STUDENTS_FOR_BATCH = async ({ id, className }: GetStudent) => {
  const students = await db.student.findMany({
    where: {
      ...(id && { studentId: id }),
      class: className,
      batchId: {
        equals: "" || null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return { students };
};

type AddStudent = {
  batchId: string;
  ids: string[];
};

export const ADD_STUDENT_TO_BATCH = async ({ ids, batchId }: AddStudent) => {
  const batch = await db.batch.findUnique({
    where: {
      id: batchId,
    },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.capacity - batch.students.length < ids.length) {
    throw new Error("Batch capacity is full");
  }

  for (const id of ids) {
    await db.student.update({
      where: {
        id,
      },
      data: {
        batchId,
      },
    });
  }

  revalidatePath(`/dashboard/batch/${batchId}`);

  return {
    success: "Student added",
  };
};

export const REMOVE_STUDENT_FROM_BATCH = async (id: string) => {
  const student = await db.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  await db.student.update({
    where: {
      id,
    },
    data: {
      batchId: null,
    },
  });

  revalidatePath(`/dashboard/batch/${student.batchId}`);

  return {
    success: "Student removed",
  };
};

export const REMOVE_CLASS_FROM_BATCH = async (id: string) => {
  const batchClass = await db.batchClass.findUnique({
    where: {
      id,
    },
  });

  if (!batchClass) {
    throw new Error("Class not found");
  }

  await db.batchClass.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/dashboard/batch/${batchClass.batchId}`);
  revalidatePath(`/dashboard/teacher/${batchClass.teacherId}`);

  return {
    success: "Class removed",
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

  revalidatePath(`/dashboard/batch/${batchId}`);

  return {
    success: "Class added",
  };
};
