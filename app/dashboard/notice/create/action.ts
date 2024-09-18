"use server";

import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";
import { NoticeType, Role, Status } from "@prisma/client";

import { db } from "@/lib/prisma";
import { NoticeSchema, NoticeSchemaType } from "./schema";

export const CREATE_NOTICE = async (values: NoticeSchemaType) => {
  const { data, success } = NoticeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  await db.notice.create({
    data: {
      ...data,
    },
  });

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
      for (const item of subscribers) {
        await webPush
          .sendNotification(
            {
              endpoint: item.endpoint,
              keys: {
                auth: item.auth,
                p256dh: item.p256dh,
              },
            },
            JSON.stringify({
              title: "Import Notice",
              body: data.text,
              // sound: "/notification.mp3"
            }),
            {
              vapidDetails: {
                subject: "mailto:anis@flowchat.com",
                publicKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
                privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
              },
            }
          )
          .catch(async (error) => {
            console.error("Error sending push notification: ", error);
            if (error instanceof WebPushError && error.statusCode === 410) {
              console.log("Push subscription expired, deleting...");
              await db.pushSubscriber.delete({
                where: {
                  id: item.id,
                },
              });
            }
          });
      }
    }
  }

  revalidatePath("/dashboard/notice");

  return {
    success: "Notice created",
  };
};
