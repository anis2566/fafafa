"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { HouseSchema, HouseSchemaType } from "../../create/schema";

type UpdateHouse = {
  id: string;
  values: HouseSchemaType;
};

export const UPDATE_HOUSE = async ({ id, values }: UpdateHouse) => {
  const { data, success } = HouseSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const house = await db.house.findUnique({
    where: {
      id,
    },
  });

  if (!house) {
    throw new Error("House not found");
  }

  await db.house.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/house");

  return {
    success: "House updated",
  };
};
