"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import {
  HousePaymentSchema,
  HousePaymentSchemaType,
} from "../../create/schema";

type UpdateHousePayment = {
  id: string;
  values: HousePaymentSchemaType;
};

export const UPDATE_HOUSE_PAYMENT = async ({
  id,
  values,
}: UpdateHousePayment) => {
  const { data, success } = HousePaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.housePayment.findUnique({
    where: {
      id,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  await db.housePayment.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/expense/house-rent");

  return {
    success: "Payment updated",
  };
};
