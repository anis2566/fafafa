"use server";

import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";
import { NoticeType, Role, Status } from "@prisma/client";

import { db } from "@/lib/prisma";
import { NoticeSchema, NoticeSchemaType } from "./schema";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

export const CREATE_NOTICE = async (values: NoticeSchemaType) => {
  const { data, success } = NoticeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  await db.notice.create({
    data: { ...data },
  });

  const { userId } = await GET_USER();

  if (data.type === NoticeType.Teacher) {
    const subscribers = await db.pushSubscriber.findMany({
      where: {
        user: {
          role: Role.Teacher,
          status: Status.Active,
          teacher: {
            isNot: null,
          },
        },
      },
    });

    if (subscribers.length > 0) {
      // Push notifications in parallel
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
              title: "New Notice",
              body: data.text,
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

        await sendNotification({
          trigger: "notice",
          actor: { id: userId },
          recipients: [item.userId],
          data: {},
        });
      });

      await Promise.all(pushPromises); // Wait for all push notifications
    }
  }

  await revalidatePath("/dashboard/notice");

  return { success: "Notice created" };
};
