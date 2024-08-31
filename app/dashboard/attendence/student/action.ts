"use server";

import { Class } from "@prisma/client";

import { db } from "@/lib/prisma";

export const GET_BATCH_BY_CLASS = async (className: Class) => {
  const batches = await db.batch.findMany({
    where: {
      class: className,
    },
  });

  return { batches };
};
