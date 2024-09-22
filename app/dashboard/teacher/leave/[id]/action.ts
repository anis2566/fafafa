"use server";

import { Day } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { sendNotification } from "@/services/notification.service";

type GetTeachers = {
  day: Day;
  time: string;
  id?: number;
  date: Date;
};

export const GET_TEACHERS_BY_DAY_TIME = async ({
  day,
  time,
  id,
  date,
}: GetTeachers) => {
  const teachers = await db.teacher.findMany({
    where: {
      classes: {
        none: {
          day,
          time,
        },
      },
      leaveClasses: {
        none: {
          day,
          time,
          date,
        },
      },
      ...(id && { teacherId: id }),
    },
    select: {
      id: true,
      teacherId: true,
      name: true,
    },
  });

  return { teachers };
};

type LeaveClassTeacher = {
  id: string;
  teacherId: string;
};

export const UPDATE_LEAVE_CLASS_TEACHER = async ({
  id,
  teacherId,
}: LeaveClassTeacher) => {
  const teacher = await db.teacher.findUnique({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  const updatedClass = await db.leaveClass.update({
    where: {
      id,
    },
    data: {
      teacherId,
      teacherName: teacher.name,
    },
  });

  if (teacher.userId) {
    const subscribers = await db.pushSubscriber.findMany({
      where: { userId: teacher.userId },
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
              title: `Proxy Notification`,
              body: `You have new proxy class. Please checkout`,
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

    const { userId } = await GET_USER();

    await sendNotification({
      trigger: "proxy-notification",
      actor: { id: userId },
      recipients: [teacher.userId],
      data: {},
    });
  }

  revalidatePath(`/dashboard/teacher/leave/${updatedClass.appId}`);

  return {
    success: "Teacher assigned",
  };
};
