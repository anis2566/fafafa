"use server";

import { db } from "@/lib/prisma";
import { Day, LeaveStatus } from "@prisma/client";
import { LeaveAppSchema, LeaveAppSchemaType } from "./schema";

export const CREATE_LEAVE_APP = async (values: LeaveAppSchemaType) => {
  const { data, success } = LeaveAppSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const isApplied = await db.leaveApp.findFirst({
    where: {
      teacherId: data.teacherId,
      status: LeaveStatus.Pending,
    },
  });

  if (isApplied) throw new Error("This teacher has already applied.");

  const app = await db.leaveApp.create({
    data: {
      ...data,
    },
  });

  return {
    success: "Application successful",
    id: app.id,
  };
};

type GetClass = {
  days: Day[];
  teacherId: string;
}

export const GET_CLASS_BY_DAYS = async ({days, teacherId}:GetClass) => {

  const classes = await db.batchClass.findMany({
    where: {
      teacherId,
      day: {
        in: days,
      },
    },
  });

  return { classes };
};
