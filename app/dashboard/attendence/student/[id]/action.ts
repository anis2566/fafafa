"use server";

import { db } from "@/lib/prisma";
import { AttendenceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type UpdateAttendences = {
  batchId: string;
  ids: string[];
  day: number;
  isHoliday: boolean;
};

export const UPDATE_ATTENDENCES = async ({
  ids,
  batchId,
  day,
  isHoliday,
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

  if (isHoliday) {
    await db.attendence.updateMany({
      where: {
        studentId: { in: ids.map((item) => item) },
        batchId,
        day: day,
      },
      data: {
        status: AttendenceStatus.H,
        absentReason: "",
      },
    });
  } else {
    await db.$transaction(async (ctx) => {
      await ctx.attendence.updateMany({
        where: {
          studentId: { in: absentStudents.map((item) => item.studentId) },
          batchId,
          day: day,
        },
        data: {
          status: AttendenceStatus.A,
        },
      });

      await ctx.attendence.updateMany({
        where: {
          studentId: { in: presentStudents.map((item) => item.studentId) },
          batchId,
          day: day,
        },
        data: {
          status: AttendenceStatus.P,
          absentReason: "",
        },
      });
    });
  }

  revalidatePath(`/dashboard/attendence/student/${batchId}`);

  return {
    success: "Attendence updated",
  };
};

type UpdateReason = {
  id: string;
  reason: string;
};

export const UPDATE_ABSENT_REASON = async ({ id, reason }: UpdateReason) => {
  const attendence = await db.attendence.findUnique({
    where: {
      id,
    },
  });

  if (!attendence) {
    throw new Error("Attendence not found");
  }

  await db.attendence.update({
    where: {
      id,
    },
    data: {
      absentReason: reason,
    },
  });

  revalidatePath(`/dashboard/attendence/student/${attendence.batchId}`);

  return {
    success: "Attendence updated",
  };
};

type UpdateNumber = {
  id: string;
  number: string;
};

export const UPDATE_STUDENT_NUMBER = async ({ id, number }: UpdateNumber) => {
  const student = await db.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) throw new Error("Student not found");

  await db.student.update({
    where: {
      id,
    },
    data: {
      mPhone: number,
    },
  });

  revalidatePath(`/dashboard/attendence/student/${student.batchId}`);

  return {
    success: "Number updated",
  };
};

type StudentLeft = {
  id: string;
  leftReason: string;
};

export const STUDENT_LEFT = async ({ id, leftReason }: StudentLeft) => {
  const student = await db.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) throw new Error("Student not found");

  await db.student.update({
    where: {
      id,
    },
    data: {
      leftReason,
      isPresent: false,
    },
  });

  revalidatePath(`/dashboard/attendence/student/${student.batchId}`);

  return {
    success: "Applied",
  };
};
