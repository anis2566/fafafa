"use server";

import { db } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { MonthlyPaymentSchemaType } from "./schema";

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

  if (dueMonth.student.monthlyFee !== values.amount) {
    throw new Error("Invalid amount");
  }

  await db.monthlyPayment.update({
    where: {
      id: dueMonth.id,
    },
    data: {
      status: PaymentStatus.Paid,
      method: PaymentMethod.Cash,
    },
  });

  return {
    success: "Payment successful",
  };
};
