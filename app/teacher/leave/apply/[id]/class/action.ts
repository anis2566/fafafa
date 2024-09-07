"use server";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_HR, GET_USER } from "@/services/user.service";

type UpdateApp = {
  id: string;
  classIds: string[];
};

export const UPDATE_LEAVE_APP = async ({ id, classIds }: UpdateApp) => {
  const classes = await db.batchClass.findMany({
    where: {
      id: {
        in: classIds,
      },
    },
  });

  if (classes.length > 0) {
    for (const classItem of classes) {
      const { teacherId, teacherName, ...rest } = classItem;
      await db.leaveClass.create({
        data: {
          appId: id,
          ...rest,
        },
      });
    }
  }

  const { userId, user } = await GET_USER();
  const { id: hrId } = await GET_HR();

  await sendNotification({
    trigger: "leave-request",
    actor: {
      id: userId,
      name: user.name || "",
    },
    recipients: [hrId],
    data: {
      redirectUrl: "/dashboard/teacher/leave",
    },
  });

  return {
    success: "Class added",
  };
};
