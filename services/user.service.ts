"use server";

import { db } from "@/lib/prisma";
import axios from "axios";

export const GET_USER_BY_EMAIL = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const VERIFY_EMAIL = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  // await knock.users.identify(user.id, {
  //   name: user.name ?? "Guest",
  //   avatar: user.image,
  // });

  try {
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? "https://www.apbnscouts.org/api/auth/verify-email"
        : "http://localhost:3000/api/auth/verify-email";

    await axios.post(apiUrl, {
      user,
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
