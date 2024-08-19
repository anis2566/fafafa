"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { RoomSchema, RoomSchemaType } from "./schema";

export const CREATE_ROOM = async (values: RoomSchemaType) => {
  const { data, success } = RoomSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const room = await db.room.findFirst({
    where: {
      name: data.name,
    },
  });

  if (room) {
    throw new Error("Room already exists");
  }

  await db.room.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/room");

  return {
    success: "Room created",
  };
};
