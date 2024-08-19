"use server";

import { db } from "@/lib/prisma";
import axios from "axios";
import { redirect } from "next/navigation";

export const FORGOT_PASSWORD_REQUEST = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { data } = await axios.post(
    `${
      process.env.NODE_ENV === "production"
        ? "https://scout-org.vercel.app/api/send-email/forgot-password"
        : "http://localhost:3000/api/email/forgot-password"
    }`,
    {
      email: user.email,
      id: user.id,
    }
  );
  if (data?.success) {
    redirect(`/auth/forgot-password/${user.id}`);
  } else {
    throw new Error("Something went wrong! Try again!");
  }
};
