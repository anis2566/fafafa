"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { HousePaymentSchema, HousePaymentSchemaType } from "./schema";

export const CREATE_HOUSE_PAYMENT = async (values: HousePaymentSchemaType) => {
  const { data, success } = HousePaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.housePayment.findFirst({
    where: {
      houseId: data.houseId,
      session: new Date().getFullYear(),
      month: data.month,
    },
  });

  if (payment) {
    throw new Error("Already paid");
  }

  const house = await db.house.findUnique({
    where: {
      id: data.houseId,
    },
  });

  if (!house) {
    throw new Error("House not found");
  }

  await db.housePayment.create({
    data: {
      session: new Date().getFullYear(),
      houseName: house.name,
      ...data,
    },
  });

  revalidatePath("/dashbaord/expense/house-rent");

  return {
    success: "Payment successful",
  };
};
