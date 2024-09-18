"use server";

import { LeaveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

type UpdateStatus = {
  id: string;
  status: LeaveStatus;
};

export const UPDATE_LEAVE_STATUS = async ({ id, status }: UpdateStatus) => {
  const app = await db.leaveApp.findUnique({
    where: {
      id,
    },
    include: {
      teacher: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!app) throw new Error("Application not found");

  await db.leaveApp.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/dashboard/teacher/leave");

  return {
    success: "Status updated",
  };
};
