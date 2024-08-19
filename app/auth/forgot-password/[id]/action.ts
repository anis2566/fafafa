"use server";

import { db } from "@/lib/prisma";
import { saltAndHashPassword } from "@/lib/utils";

type VerifyUser = {
  id: string;
  code: string;
};

export const VERIFY_FORGOT_PASSWORD = async ({ id, code }: VerifyUser) => {
  const token = await db.verificationToken.findFirst({
    where: {
      identifier: id,
    },
  });

  if (!token) {
    throw new Error("Invalid verification code");
  }

  if (code !== token.token) {
    throw new Error("Invalid verification code");
  }

  const isExpired = new Date() > new Date(token.expires);

  if (isExpired) {
    throw new Error("Verification token has expired");
  }

  return {
    success: true,
    id: token.identifier,
  };
};

type ChangePassword = {
  id: string;
  password: string;
};

export const CHANGE_PASSWORD = async ({ id, password }: ChangePassword) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = saltAndHashPassword(password);

  await db.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: "Password changed",
  };
};
