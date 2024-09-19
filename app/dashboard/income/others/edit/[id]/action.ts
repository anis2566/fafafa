"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { IncomeSchema, IncomeSchemaType } from "../../schema";

type UpdateIncome = {
  id: string;
  values: IncomeSchemaType;
};

export const UPDATE_INCOME = async ({ id, values }: UpdateIncome) => {
  const { data, success } = IncomeSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const income = await db.income.findUnique({
    where: {
      id,
    },
  });

  if (!income) throw new Error("Income not found");

  await db.income.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/income/history/others");

  return {
    success: "Updated",
  };
};
