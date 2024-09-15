"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

export const DELETE_BATCH = async (id: string) => {
  const batch = await db.batch.findUnique({
    where: {
      id,
    },
    include: {
      students: true,
      room: true,
    },
  });

  if (!batch) throw new Error("Batch not found");

  if (batch.students.length > 0) {
    await db.student.updateMany({
      where: {
        batchId: batch.id,
      },
      data: {
        batchId: null,
      },
    });
  }

  await db.room.update({
    where: {
      id: batch.roomId,
    },
    data: {
      availableTime: batch.room.availableTime.filter(
        (time) => !batch.time.includes(time)
      ),
    },
  });

  await db.batch.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/batch");

  return {
    success: "Batch deleted",
  };
};
