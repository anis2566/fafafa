"use server";

import { TeacherPaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

type UpdateStatus = {
  id: string;
  status: TeacherPaymentStatus;
};

export const UPDATE_STATUS = async ({ id, status }: UpdateStatus) => {
  const payment = await db.teacherPayment.findUnique({
    where: {
      id,
    },
  });

  if (!payment) throw new Error("Payment not found");

  await db.teacherPayment.update({
    where: {
      id,
    },
    data: {
      status
    },
  });

  revalidatePath("/dashboard/expense/teacher/approval");

  return {
    success: "Status updated",
  };
};
