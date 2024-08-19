"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

export const DELETE_ROOM = async (id: string) => {
  const room = await db.room.findUnique({
    where: {
      id,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  await db.room.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/room");

  return {
    success: "Room deleted",
  };
};
