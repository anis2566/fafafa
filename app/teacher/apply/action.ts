"use server";

import { Role } from "@prisma/client";
import { z } from "zod";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_HR, GET_USER } from "@/services/user.service";

const TeacherApplySchema = z.object({
  teacherId: z.number().min(1, { message: "required" }),
  phone: z.string().min(11, { message: "required" }),
});

type TeacherApplySchemaType = z.infer<typeof TeacherApplySchema>;

export const APPLY_TEACHER = async (values: TeacherApplySchemaType) => {
  const { data, success } = TeacherApplySchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const { userId, user } = await GET_USER();

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
      userId: userId,
    },
  });

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      role: Role.Teacher,
    },
  });

  const { id } = await GET_HR();

  const subscribers = await db.pushSubscriber.findMany({
    where: { userId: id },
  });

  if (subscribers.length > 0) {
    const pushPromises = subscribers.map(async (item) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: item.endpoint,
            keys: {
              auth: item.auth,
              p256dh: item.p256dh,
            },
          },
          JSON.stringify({
            title: `Teacher Request`,
            body: `You have a teacher request from teacher ${teacher.name}`,
          }),
          {
            vapidDetails: {
              subject: "mailto:anis@flowchat.com",
              publicKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
              privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
            },
          }
        );
      } catch (error) {
        console.error("Error sending push notification:", error);

        if (error instanceof WebPushError && error.statusCode === 410) {
          console.log("Push subscription expired, deleting...");
          await db.pushSubscriber.delete({
            where: { id: item.id },
          });
        }
      }
    });

    await Promise.all(pushPromises);
  }

  await sendNotification({
    trigger: "teacher-request",
    actor: {
      id: userId,
      name: user.name || "",
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
