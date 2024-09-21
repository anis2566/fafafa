"use server";

import { TeacherPaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

type UpdateStatus = {
  id: string;
  status: TeacherPaymentStatus;
};

export const UPDATE_STATUS = async ({ id, status }: UpdateStatus) => {
  const payment = await db.teacherPayment.findUnique({
    where: { id },
    include: { teacher: true },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  await db.teacherPayment.update({
    where: { id },
    data: { status },
  });

  const { userId } = await GET_USER();

  if (payment.teacher?.userId) {
    const subscribers = await db.pushSubscriber.findMany({
      where: { userId: payment.teacher.userId },
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
              title: `Salary Approval`,
              body: `Your salary for the month of ${payment.month} has been approved. Please contact the accountant to receive your salary.`,
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
      trigger: "salary-response",
      actor: { id: userId },
      recipients: [payment.teacher.userId],
      data: { month: payment.month },
    });
  }

  await revalidatePath("/dashboard/expense/teacher/approval");

  return { success: "Status updated" };
};
