"use server";

import { TransactionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_ACCOUNTANT, GET_USER } from "@/services/user.service";

type UpdateStatus = {
  id: string;
  status: TransactionStatus;
};

export const UPDATE_STATUS = async ({ id, status }: UpdateStatus) => {
  const advance = await db.teacherAdvance.findUnique({
    where: { id },
    include: { teacher: true },
  });

  if (!advance) {
    throw new Error("Advance not found");
  }

  await db.teacherAdvance.update({
    where: { id },
    data: { status },
  });

  if (advance.teacher.userId) {
    const subscribers = await db.pushSubscriber.findMany({
      where: { userId: advance.teacher.userId },
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
              title: `Advance Response`,
              body: `Advance request of teacher ${advance.teacher.name} has been ${status}`,
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
    const { id } = await GET_ACCOUNTANT();

    await sendNotification({
      trigger: "advance-response",
      actor: { id: userId },
      recipients: [id],
      data: {
        teacher: advance.teacher.name,
        status,
      },
    });
  }

  await revalidatePath("/dashboard/expense/advance/approval");

  return { success: "Status updated" };
};
