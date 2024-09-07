"use server";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { revalidatePath } from "next/cache";

type UpdateUser = {
  name: string;
  image: string;
};
export const UPDATE_USER = async ({ name, image }: UpdateUser) => {
  const { user } = await GET_USER();

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
      image,
    },
  });

  revalidatePath("/teacher/profile");

  return {
    success: "Profile updated",
  };
};
