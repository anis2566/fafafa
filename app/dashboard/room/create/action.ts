"use server";

import { revalidatePath } from "next/cache";
import { HouseStatus } from "@prisma/client";

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

  const house = await db.house.findUnique({
    where: {
      id: data.houseId,
    },
    include: {
      rooms: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!house) {
    throw new Error("House not found");
  }

  if (house.roomCount === house.rooms.length) {
    throw new Error("House is full with room");
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

export const GET_HOUSES = async () => {
  const houses = await db.house.findMany({
    where: {
      status: HouseStatus.Active,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { houses };
};
