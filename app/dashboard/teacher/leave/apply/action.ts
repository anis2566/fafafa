"use server";

import { Day, LeaveStatus } from "@prisma/client";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { LeaveAppSchema, LeaveAppSchemaType } from "./schema";

export const CREATE_LEAVE_APP = async (values: LeaveAppSchemaType) => {
  const { data, success } = LeaveAppSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");
  const { dates } = data;

  const isApplied = await db.leaveApp.findFirst({
    where: {
      teacherId: data.teacherId,
      status: LeaveStatus.Pending,
    },
  });

  if (isApplied) throw new Error("This teacher has already applied.");

  const dayNames = dates.map((date) => {
    const dayOfWeek = new Date(date).getDay();
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayOfWeek] as Day;
  });

  const batchClasses = await db.batchClass.findMany({
    where: {
      day: {
        in: dayNames,
      },
    },
  });

  const updatedDays = dates.map((date) => addDays(new Date(date), 1));

  await db.$transaction(async (ctx) => {
    const app = await ctx.leaveApp.create({
      data: {
        ...data,
        days: dayNames,
      },
    });

    for (const cls of batchClasses) {
      const {
        day,
        time,
        subjectId,
        subjectName,
        batchId,
        batchName,
        roomName,
      } = cls;
      await ctx.leaveClass.create({
        data: {
          day,
          time,
          subjectId,
          subjectName,
          batchId,
          batchName,
          date: updatedDays[dayNames.indexOf(day)],
          appId: app.id,
          roomName,
        },
      });
    }
  });

  revalidatePath("/dashboard/teacher/leave");

  return {
    success: "Application successful",
  };
};
