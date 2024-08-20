"use server";

import { RoomStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { BatchSchema, BatchSchemaType } from "./schema";

export const CREATE_BATCH = async (values: BatchSchemaType) => {
  const { data, success } = BatchSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const batch = await db.batch.findFirst({
    where: {
      name: data.name,
      class: data.class,
    },
    include: {
      room: {
        select: {
          availableTime: true,
        },
      },
    },
  });

  if (batch) {
    throw new Error("Batch already exists");
  }

  await db.batch.create({
    data: {
      ...data,
    },
  });

  await db.room.update({
    where: {
      id: data.roomId,
    },
    data: {
      bookTime: {
        push: data.time,
      },
    },
  });

  revalidatePath("/dashboard/batch");

  return {
    success: "Batch created",
  };
};

export const GET_ROOMS = async () => {
  const rooms = await db.room.findMany({
    where: {
      status: RoomStatus.Active,
    },
    orderBy: {
      name: "asc",
    },
  });
  return { rooms };
};
