"use server";

import { Role, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { sendNotification } from "@/services/notification.service";

type UpdateStatus = {
  id: string;
  status: Status;
};

export const UPDATE_TEACHER_STATUS = async ({ id, status }: UpdateStatus) => {
  const app = await db.teacherRequest.findUnique({
    where: {
      id,
    },
    include: {
      teacher: true,
    },
  });

  if (!app) throw new Error("Application not found");

  if (status === Status.Active) {
    await db.$transaction(async (ctx) => {
      await ctx.user.update({
        where: {
          id: app.userId,
        },
        data: {
          status: Status.Active,
        },
      });

      await ctx.teacher.update({
        where: {
          id: app.teacherId,
        },
        data: {
          userId: app.userId,
        },
      });
    });
  }

  await db.teacherRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  if (app.teacher.userId) {
    const subscribers = await db.pushSubscriber.findMany({
      where: { userId: app.teacher.userId },
    });

    console.log(subscribers)

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
              title: `Account Approval`,
              body: `Your teacher account has been ${status}`,
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
      trigger: "teacher-response",
      actor: { id: userId },
      recipients: [app.teacher.userId],
      data: {
        status,
      },
    });
  }

  revalidatePath("/dashboard/teacher/request");

  return {
    success: "Status updated",
  };
};

export const DELETE_REQUEST = async (id: string) => {
  const app = await db.teacherRequest.findUnique({
    where: {
      id,
    },
  });

  if (!app) {
    throw new Error("Application not found");
  }

  await db.$transaction(async (ctx) => {
    await ctx.user.update({
      where: {
        id: app.userId,
      },
      data: {
        role: Role.User,
        status: Status.Pending,
      },
    });
    await ctx.teacherRequest.delete({
      where: {
        id,
      },
    });
  });

  revalidatePath("/dashboard/teacher/request");

  return {
    success: "Application deleted",
  };
};
