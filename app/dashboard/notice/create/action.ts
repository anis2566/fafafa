"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { NoticeSchema, NoticeSchemaType } from "./schema";

export const CREATE_NOTICE = async (values: NoticeSchemaType) => {
  const { data, success } = NoticeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  await db.notice.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/notice");

  return {
    success: "Notice created",
  };
};
