"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { Knock } from "@knocklabs/node";

import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Role } from "@prisma/client";

const knock = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY);

export const GET_USER = async () => {
  const session = await auth();

  if (!session?.userId) redirect("/auth/sign-in");

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) throw new Error("User not found");

  return {
    user,
    userId: user.id,
    role: user.role,
    status: user.status
  };
};

export const GET_ADMIN = async () => {
  const admin = await db.user.findFirst({
    where: {
      role: Role.Admin,
    },
  });

  if (!admin) throw new Error("Admin not found");

  return { id: admin.id, admin };
};

export const GET_HR = async () => {
  const hr = await db.user.findFirst({
    where: {
      role: Role.HR,
    },
  });

  if (!hr) throw new Error("Hr not found");

  return { id: hr.id, hr };
};

export const GET_ACCOUNTANT = async () => {
  const accountant = await db.user.findFirst({
    where: {
      role: Role.Accountant,
    },
  });

  if (!accountant) throw new Error("Accountant not found");

  return { id: accountant.id, accountant };
};

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

  const updatedUser = await db.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await knock.users.identify(updatedUser.id, {
    name: updatedUser.name ?? "Guest",
    avatar: updatedUser.image,
  });

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

export const GET_TEACHER = async () => {
  const session = await auth();

  if (!session?.userId) redirect("/auth/sign-in");

  const teacher = await db.teacher.findUnique({
    where: {
      userId: session.userId,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  return {
    teacher,
    teacherId: teacher.id,
  };
};
