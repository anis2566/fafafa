"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { ExpenseSchema, ExpenseSchemaType } from "../../create/schema";

type UpdateRoom = {
  id: string;
  values: ExpenseSchemaType;
};

export const UPDATE_EXPENSE = async ({ id, values }: UpdateRoom) => {
  const { data, success } = ExpenseSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const room = await db.expense.findUnique({
    where: {
      id,
    },
  });

  if (!room) {
    throw new Error("Expense not found");
  }

  await db.expense.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/expense");

  return {
    success: "Expense updated",
  };
};
