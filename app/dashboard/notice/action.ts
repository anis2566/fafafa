"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

export const DELETE_NOTICE = async (id: string) => {
  const notice = await db.notice.findUnique({
    where: {
      id,
    },
  });

  if (!notice) {
    throw new Error("Notice not found");
  }

  await db.notice.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/notice");

  return {
    success: "Notice deleted",
  };
};
