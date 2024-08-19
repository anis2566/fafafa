"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { MonthlyFeeSchema, MonthlyFeeSchemaType } from "./schema";

export const CREATE_FEE = async (values: MonthlyFeeSchemaType) => {
  const { data, success } = MonthlyFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.monthlyFee.findFirst({
    where: {
      class: data.class,
    },
  });

  if (fee) {
    throw new Error("Fee with this class is exists");
  }

  await db.monthlyFee.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/fee/monthly");

  return {
    success: "Fee assigned",
  };
};

type UpdateFee = {
  id: string;
  values: MonthlyFeeSchemaType;
};

export const UPDATE_FEE = async ({ id, values }: UpdateFee) => {
  const { data, success } = MonthlyFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.monthlyFee.findUnique({
    where: {
      id,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  await db.monthlyFee.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/fee/monthly");

  return {
    success: "Fee updated",
  };
};

export const DELETE_FEE = async (id: string) => {
  const fee = await db.monthlyFee.findUnique({
    where: {
      id,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  await db.monthlyFee.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/fee/monthly");

  return {
    success: "Fee deleted",
  };
};
