"use server";

import { LeaveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

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
                userId: true
            }
        }
    }
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

  const { userId } = await GET_USER();

  await sendNotification({
    trigger: "leave-response",
    actor: {
      id: userId,
    },
    recipients: [app.teacher.userId || ""],
    data: {
      status,
    },
  });

  revalidatePath("/dashboard/teacher/leave");

  return {
    success: "Status updated",
  };
};
