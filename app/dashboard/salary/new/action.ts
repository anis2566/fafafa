"use server";

import { db } from "@/lib/prisma";
import { Class } from "@prisma/client";

type FindStudent = {
  session: number;
  className: Class;
  name?: string;
  id: number;
};

export const FIND_STUDENT = async ({
  session,
  className,
  name,
  id,
}: FindStudent) => {
  const student = await db.student.findFirst({
    where: {
      session,
      class: className,
      studentId: id,
      ...(name && { name: {contains: name, mode: "insensitive"} }),
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return { student };
};
