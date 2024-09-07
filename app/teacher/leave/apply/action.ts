"use server";

import { db } from "@/lib/prisma";
import { GET_TEACHER } from "@/services/user.service";
import { Day, LeaveStatus } from "@prisma/client";
import { LeaveAppSchema, LeaveAppSchemaType } from "./schema";

export const CREATE_LEAVE_APP = async (values: LeaveAppSchemaType) => {
  const { data, success } = LeaveAppSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const { teacherId } = await GET_TEACHER();

  const isApplied = await db.leaveApp.findFirst({
    where: {
      teacherId,
      status: LeaveStatus.Pending,
    },
  });

  if (isApplied) throw new Error("You have already applied.");

  const app = await db.leaveApp.create({
    data: {
      teacherId,
      ...data,
    },
  });

  return {
    success: "Application successful",
    id: app.id
  };
};

export const GET_CLASS_BY_DAYS = async (days: Day[]) => {
  const { teacherId } = await GET_TEACHER();

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
