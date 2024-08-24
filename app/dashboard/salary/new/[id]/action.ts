"use server";

import { PaymentMethod, PaymentStatus } from "@prisma/client";

import { db } from "@/lib/prisma";
import { MonthlyPaymentSchemaType } from "./schema";
import { revalidatePath } from "next/cache";

type PayWithCash = {
  values: MonthlyPaymentSchemaType;
  studentId: string;
};

export const PAY_WITH_CASH = async ({ values, studentId }: PayWithCash) => {
  const dueMonth = await db.monthlyPayment.findFirst({
    where: {
      studentId,
      status: PaymentStatus.Unpaid,
      month: values.month,
    },
    include: {
      student: true,
    },
  });

  if (!dueMonth) {
    throw new Error("Invalid month");
  }

  await db.monthlyPayment.update({
    where: {
      id: dueMonth.id,
    },
    data: {
      status: PaymentStatus.Paid,
      method: PaymentMethod.Cash,
      amount: values.amount,
      note: values.note,
    },
  });

  revalidatePath("/dashboard/salary/monthly");

  return {
    success: "Payment successful",
  };
};
