"use server";

import { db } from "@/lib/prisma";
import { AttendenceStatus } from "@prisma/client";

type UpdateAttendences = {
  batchId: string;
  ids: string[];
};

export const UPDATE_ATTENDENCES = async ({
  ids,
  batchId,
}: UpdateAttendences) => {
  const attendences = await db.attendence.findMany({
    where: {
      batchId,
    },
  });

  const absentStudents = attendences.filter(
    (item) => !ids.includes(item.studentId)
  );
  const presentStudents = attendences.filter((item) =>
    ids.includes(item.studentId)
  );

  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  await db.$transaction(async (ctx) => {
    await ctx.attendence.updateMany({
      where: {
        studentId: { in: absentStudents.map((item) => item.studentId) },
        batchId,
        day: currentDay,
      },
      data: {
        status: AttendenceStatus.A,
      },
    });

    await ctx.attendence.updateMany({
      where: {
        studentId: { in: presentStudents.map((item) => item.studentId) },
        batchId,
        day: currentDay,
      },
      data: {
        status: AttendenceStatus.P,
      },
    });
  });

  return {
    success: "Attendence updated",
  };
};
