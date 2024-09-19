"use server";

import { revalidatePath } from "next/cache";
import { Month } from "@prisma/client";

import { db } from "@/lib/prisma";
import { ExpenseSchema, ExpenseSchemaType } from "../schema";

export const CREATE_EXPENSE = async (values: ExpenseSchemaType) => {
  const { data, success } = ExpenseSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  await db.expense.create({
    data: {
      ...data,
      session: new Date().getFullYear(),
      month: Object.values(Month)[new Date().getMonth()],
    },
  });

  revalidatePath("/dashboard/expense/utility");

  return {
    success: "Expense created",
  };
};
