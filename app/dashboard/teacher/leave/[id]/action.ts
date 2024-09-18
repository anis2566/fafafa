"use server";

import { Day } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

type GetTeachers = {
  day: Day;
  time: string;
  id?: number;
  date: Date;
};

export const GET_TEACHERS_BY_DAY_TIME = async ({
  day,
  time,
  id,
  date,
}: GetTeachers) => {
  const teachers = await db.teacher.findMany({
    where: {
      classes: {
        none: {
          day,
          time,
        },
      },
      leaveClasses: {
        none: {
          day,
          time,
          date,
        },
      },
      ...(id && { teacherId: id }),
    },
    select: {
      id: true,
      teacherId: true,
      name: true,
    },
  });

  return { teachers };
};

type LeaveClassTeacher = {
  id: string;
  teacherId: string;
};

export const UPDATE_LEAVE_CLASS_TEACHER = async ({
  id,
  teacherId,
}: LeaveClassTeacher) => {
  const teacher = await db.teacher.findUnique({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  const updatedClass = await db.leaveClass.update({
    where: {
      id,
    },
    data: {
      teacherId,
      teacherName: teacher.name,
    },
  });

  revalidatePath(`/dashboard/teacher/leave/${updatedClass.appId}`);

  return {
    success: "Teacher assigned",
  };
};
