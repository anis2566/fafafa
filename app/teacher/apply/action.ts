"use server";

import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_HR } from "@/services/user.service";

const TeacherApplySchema = z.object({
  teacherId: z.number().min(1, { message: "required" }),
  phone: z.string().min(11, { message: "required" }),
});

type TeacherApplySchemaType = z.infer<typeof TeacherApplySchema>;

export const APPLY_TEACHER = async (values: TeacherApplySchemaType) => {
  const { data, success } = TeacherApplySchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const session = await auth();

  if (!session || !session.userId) redirect("/auth/sign-in");

  const teacher = await db.teacher.findFirst({
    where: {
      teacherId: data.teacherId,
      phone: data.phone,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  await db.teacherRequest.create({
    data: {
      teacherId: teacher.id,
      userId: session.userId,
    },
  });

  await db.user.update({
    where: {
      id: session.userId,
    },
    data: {
      role: Role.Teacher,
    },
  });

  const { id } = await GET_HR();

  await sendNotification({
    trigger: "teacher-request",
    actor: {
      id: session.userId,
      name: session.user.name || "",
    },
    recipients: [id],
    data: {
      redirectUrl: "/dashboard/teacher/request",
    },
  });

  return {
    success: "Application successful",
  };
};
