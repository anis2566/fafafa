"use server";

import { db } from "@/lib/prisma";

type VerifyUser = {
  id: string;
  code: string;
};
export const VERIFY_USER = async ({ id, code }: VerifyUser) => {
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

  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await db.verificationToken.delete({
    where: {
      identifier: id,
    },
  });

  return {
    success: "Verification successful",
    user,
  };
};
