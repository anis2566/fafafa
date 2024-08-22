"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";
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

  return {
    success: "Class removed",
  };
};
