"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";

type FindStudent = {
  session: number;
  className: Class;
  id: number;
};

export const FIND_STUDENT = async ({ session, className, id }: FindStudent) => {
  const student = await db.student.findFirst({
    where: {
      session,
      class: className,
      studentId: id,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return { student };
};
