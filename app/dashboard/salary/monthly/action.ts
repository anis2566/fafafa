"use server";

import { db } from "@/lib/prisma";

export const GET_PAYMENT_BY_ID = async (id: string) => {
  const payment = await db.monthlyPayment.findUnique({
    where: {
      id,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return { payment };
};
