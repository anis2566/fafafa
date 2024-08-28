"use server";

import { db } from "@/lib/prisma";
import { Month, PaymentMethod, PaymentStatus } from "@prisma/client";

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

  await db.admissionPayment.create({
    data: {
      studentId: student.id,
      session: new Date().getFullYear(),
      month: Object.values(Month)[new Date().getMonth()],
      amount: student.admissionFee,
      method: PaymentMethod.Cash,
      status: PaymentStatus.Paid,
    },
  });

  await db.monthlyPayment.create({
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
    await db.monthlyPayment.create({
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

  return {
    success: "Payment successful",
  };
};
