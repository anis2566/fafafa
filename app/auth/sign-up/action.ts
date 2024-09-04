"use server";

import { redirect } from "next/navigation";
import axios from "axios";
import { Role } from "@prisma/client";

import { db } from "@/lib/prisma";
import { SignInSchemaType } from "../sign-in/schema";
import { SignUpSchema } from "./schema";
import { saltAndHashPassword } from "@/lib/utils";

export const SIGN_UP = async (values: SignInSchemaType) => {
  const { data, success } = SignUpSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input value");
  }

  const user = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user) {
    throw new Error("User already exists");
  }

  let role: Role = Role.User;

  if (data.teacherId && data.phone) {
    const teacher = await db.teacher.findFirst({
      where: {
        teacherId: data.teacherId,
        phone: data.phone,
      },
    });

    if (teacher) {
      role = Role.Teacher;
    } else {
      throw new Error("Invalid teacher information");
    }
  }

  const hashedPassword = saltAndHashPassword(data.password);

  const newUser = await db.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role,
    },
  });

  const { data: res } = await axios.post(
    `${
      process.env.NODE_ENV === "production"
        ? "https://scout-org.vercel.app/api/send-email"
        : "http://localhost:3000/api/email/verify"
    }`,
    {
      email: newUser.email,
      id: newUser.id,
    }
  );

  if (res?.success) {
    redirect(`/auth/verify/${newUser.id}`);
  } else {
    throw new Error("Something went wrong! Try again!");
  }
};
