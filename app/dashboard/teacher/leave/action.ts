"use server";

import { LeaveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { sendNotification } from "@/services/notification.service";

type UpdateStatus = {
  id: string;
  status: LeaveStatus;
};

export const UPDATE_LEAVE_STATUS = async ({ id, status }: UpdateStatus) => {
  const app = await db.leaveApp.findUnique({
    where: {
      id,
    },
    include: {
      teacher: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!app) throw new Error("Application not found");

  await db.leaveApp.update({
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
              title: `Leave Response`,
              body: `Your leave request has been ${LeaveStatus.Approved}`,
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
      trigger: "leave-response",
      actor: { id: userId },
      recipients: [app.teacher.userId],
      data: {
        status: LeaveStatus.Approved,
      },
    });
  }

  revalidatePath("/dashboard/teacher/leave");

  return {
    success: "Status updated",
  };
};
