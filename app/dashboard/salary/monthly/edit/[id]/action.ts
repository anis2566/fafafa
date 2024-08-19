"use server";

import { PaymentStatus } from "@prisma/client";

import {
  MonthlyPaymentSchema,
  MonthlyPaymentSchemaType,
} from "../../../new/[id]/schema";
import { db } from "@/lib/prisma";

type UpdatePayment = {
  id: string;
  values: MonthlyPaymentSchemaType;
};

export const UPDATE_PAYMENT = async ({ id, values }: UpdatePayment) => {
  const { data, success } = MonthlyPaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.monthlyPayment.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const dueMonth = await db.monthlyPayment.findFirst({
    where: {
      month: data.month,
      status: PaymentStatus.Unpaid,
    },
  });

  if (!dueMonth) {
    throw new Error("Invalid month");
  }

  if (payment.student.monthlyFee !== data.amount) {
    throw new Error("Invalid amount");
  }

  const update = await db.monthlyPayment.update({
    where: {
      id: dueMonth.id,
    },
    data: {
      ...data,
      status: PaymentStatus.Paid
    },
  });

  return {
    success: "Payment updated",
  };
};
