"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

export const DELETE_HOUSE = async (id: string) => {
  const room = await db.house.findUnique({
    where: {
      id,
    },
  });

  if (!room) {
    throw new Error("House not found");
  }

  await db.house.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/house");

  return {
    success: "House deleted",
  };
};
