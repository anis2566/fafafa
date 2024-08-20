"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { BatchSchema, BatchSchemaType } from "../../create/schema";

type UpdateBatch = {
  id: string;
  values: BatchSchemaType;
};

export const UPDATE_BATCH = async ({ id, values }: UpdateBatch) => {
  const { data, success } = BatchSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const batch = await db.batch.findUnique({
    where: {
      id,
    },
    include: {
      room: {
        select: {
          availableTime: true,
          bookTime: true,
        },
      },
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.roomId === data.roomId) {
    const isSametime =
      data.time.every((item) => batch.time.includes(item)) &&
      data.time.length === batch.time.length;

    if (!isSametime) {
      const updatedBookTime = batch.room.bookTime.filter(
        (time) => !batch.time.includes(time)
      );
      await db.room.update({
        where: {
          id: batch.roomId,
        },
        data: {
          bookTime: [...updatedBookTime, ...data.time],
        },
      });
    }
  } else {
    const room = await db.room.findUnique({
      where: {
        id: data.roomId,
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    await db.room.update({
      where: {
        id: room.id,
      },
      data: {
        bookTime: [...room.bookTime, ...data.time],
      },
    });
    const updatedBookTime = batch.room.bookTime.filter(
      (time) => !batch.time.includes(time)
    );
    await db.room.update({
      where: {
        id: batch.roomId,
      },
      data: {
        bookTime: updatedBookTime,
      },
    });
  }

  await db.batch.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/batch");

  return {
    success: "Batch updated",
  };
};
