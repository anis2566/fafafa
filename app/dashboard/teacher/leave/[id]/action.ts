"use server";

import { Day } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

type GetTeachers = {
  day: Day;
  time: string;
  id?: number;
};

export const GET_TEACHERS_BY_DAY_TIME = async ({
  day,
  time,
  id,
}: GetTeachers) => {
  const teachers = await db.teacher.findMany({
    where: {
      classes: {
        none: {
          day,
          time,
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

  const { userId } = await GET_USER();

  await sendNotification({
    trigger: "leave-class",
    actor: {
      id: userId,
    },
    recipients: [teacher.userId || ""],
    data: {
      redirectUrl: "/teacher/class/proxy",
    },
  });

  revalidatePath(`/dashboard/teacher/leave/${updatedClass.appId}`);

  return {
    success: "Teacher assigned",
  };
};
