"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
  subjectId: string;
};

export const ADD_TEACHER_SUBJECT = async ({
  teacherId,
  subjectId,
}: AddTeacherSubject) => {
  const subject = await db.teacherSubject.findUnique({
    where: {
      teacherId_subjectId: {
        teacherId,
        subjectId,
      },
    },
  });

  if (subject) {
    throw new Error("Subject already exists");
  }

  await db.teacherSubject.create({
    data: {
      teacherId,
      subjectId,
    },
  });

  revalidatePath(`/dashboard/teacher/${teacherId}`);

  return {
    success: "Subject added",
  };
};
