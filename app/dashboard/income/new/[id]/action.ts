"use server";

import { PaymentStatus } from "@prisma/client";

import { db } from "@/lib/prisma";
import { MonthlyPaymentSchemaType } from "./schema";
import { revalidatePath } from "next/cache";

type PayWithCash = {
  values: MonthlyPaymentSchemaType;
  studentId: string;
};

export const PAY_WITH_CASH = async ({ values, studentId }: PayWithCash) => {
  const existPayment = await db.monthlyPayment.findFirst({
    where: {
      studentId,
      month: values.month,
    },
  });

  if (existPayment) {
    const updatedPayment = await db.monthlyPayment.update({
      where: {
        id: existPayment.id,
      },
      data: {
        ...values,
        status: PaymentStatus.Paid,
      },
    });

    revalidatePath("/dashboard/salary/monthly");

    return {
      success: "Payment successful",
      id: updatedPayment.id,
    };
  } else {
    const newPayment = await db.monthlyPayment.create({
      data: {
        ...values,
        session: new Date().getFullYear(),
        studentId,
        status: PaymentStatus.Paid,
      },
    });

    revalidatePath("/dashboard/salary/monthly");

    return {
      success: "Payment successful",
      id: newPayment.id,
    };
  }
};
