"use server";

import { Month } from "@prisma/client";

import { db } from "@/lib/prisma";
import { IncomeSchema, IncomeSchemaType } from "./schema";

export const CREATE_INCOME = async (values: IncomeSchemaType) => {
  const { data, success } = IncomeSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  await db.income.create({
    data: {
      ...data,
      session: new Date().getFullYear(),
      month: Object.values(Month)[new Date().getMonth()],
    },
  });

  return {
    success: "Income created",
  };
};
