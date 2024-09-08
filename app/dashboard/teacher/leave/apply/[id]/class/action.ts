"use server";

import { db } from "@/lib/prisma";

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

  return {
    success: "Class added",
  };
};
