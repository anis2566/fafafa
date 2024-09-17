"use server";

import { Month, PaymentMethod, PaymentStatus } from "@prisma/client";

import { db } from "@/lib/prisma";

export const PAY_WITH_CASH = async (id: string) => {
  const student = await db.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const currentMonthIndex = new Date().getMonth();

  const paymentId = await db.$transaction(async (ctx) => {
    await ctx.admissionPayment.create({
      data: {
        studentId: student.id,
        session: new Date().getFullYear(),
        month: Object.values(Month)[new Date().getMonth()],
        amount: student.admissionFee,
        method: PaymentMethod.Cash,
        status: PaymentStatus.Paid,
      },
    });

    const payment = await ctx.monthlyPayment.create({
      data: {
        amount: student.monthlyFee,
        session: new Date().getFullYear(),
        class: student.class,
        method: PaymentMethod.Cash,
        status: PaymentStatus.Paid,
        studentId: student.id,
        month: Object.values(Month)[currentMonthIndex],
      },
    });

    for (let i = 0; i <= currentMonthIndex; i++) {
      await ctx.monthlyPayment.create({
        data: {
          amount: student.monthlyFee,
          method: PaymentMethod.Cash,
          session: new Date().getFullYear(),
          class: student.class,
          status: PaymentStatus.NA,
          studentId: student.id,
          month: Object.values(Month)[i],
        },
      });
    }

    return payment.id;
  });

  return {
    success: "Payment successful",
    id: paymentId,
  };
};
