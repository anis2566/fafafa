"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { RoomSchema, RoomSchemaType } from "../../create/schema";

type UpdateRoom = {
  id: string;
  values: RoomSchemaType;
};

export const UPDATE_ROOM = async ({ id, values }: UpdateRoom) => {
  const { data, success } = RoomSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const room = await db.room.findUnique({
    where: {
      id,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  await db.room.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/room");

  return {
    success: "Room updated",
  };
};
