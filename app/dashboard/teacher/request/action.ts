"use server";

import { Role, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

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
    await db.$transaction(async (ctx) => {
      await ctx.user.update({
        where: {
          id: app.userId,
        },
        data: {
          status: Status.Active,
        },
      });

      await ctx.teacher.update({
        where: {
          id: app.teacherId,
        },
        data: {
          userId: app.userId,
        },
      });
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

  await db.$transaction(async (ctx) => {
    await ctx.user.update({
      where: {
        id: app.userId,
      },
      data: {
        role: Role.User,
        status: Status.Pending
      },
    });
    await ctx.teacherRequest.delete({
      where: {
        id,
      },
    });
  });

  revalidatePath("/dashboard/teacher/request");

  return {
    success: "Application deleted",
  };
};
