"use server";

import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

type UpdateStatus = {
  id: string;
  status: Status;
};

export const UPDATE_TEACHER_STATUS = async ({ id, status }: UpdateStatus) => {
  const app = await db.teacherRequest.findUnique({
    where: {
      id,
    },
  });

  if (!app) throw new Error("Application not found");

  if (status === Status.Active) {
    await db.user.update({
      where: {
        id: app.userId,
      },
      data: {
        status: Status.Active,
      },
    });

    await db.teacher.update({
      where: {
        id: app.teacherId,
      },
      data: {
        userId: app.userId,
      },
    });
  }

  await db.teacherRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  const { userId } = await GET_USER();

  await sendNotification({
    trigger: "teacher-response",
    actor: {
      id: userId,
    },
    recipients: [app.userId],
    data: {
      status,
    },
  });

  revalidatePath("/dashboard/teacher/request");

  return {
    success: "Status updated",
  };
};

export const DELETE_REQUEST = async (id: string) => {
  const app = await db.teacherRequest.findUnique({
    where: {
      id,
    },
  });

  if (!app) {
    throw new Error("Application not found");
  }

  await db.teacherRequest.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/teacher/request");

  return {
    success: "Application deleted",
  };
};
