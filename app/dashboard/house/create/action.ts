"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { HouseSchema, HouseSchemaType } from "./schema";

export const CREATE_HOUSE = async (values: HouseSchemaType) => {
  const { data, success } = HouseSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const house = await db.house.findFirst({
    where: {
      name: data.name,
    },
  });

  if (house) {
    throw new Error("House already exists");
  }

  await db.house.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/house");

  return {
    success: "House created",
  };
};
