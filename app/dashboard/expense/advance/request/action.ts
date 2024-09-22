"use server";

import { Month, Status, TransactionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { TeacherAdvanceSchema, TeacherAdvanceSchemaType } from "./schema";
import { sendNotification } from "@/services/notification.service";
import { GET_ADMIN, GET_USER } from "@/services/user.service";

export const GET_TEACHERS = async (id?: number) => {
  const teachers = await db.teacher.findMany({
    where: {
      ...(id && { teacherId: id }),
      status: Status.Active,
    },
    orderBy: {
      teacherId: "asc",
    },
    take: 3,
  });

  return { teachers };
};

export const CREATE_ADVANCE = async (values: TeacherAdvanceSchemaType) => {
  const { data, success } = TeacherAdvanceSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const teacher = await db.teacher.findUnique({
    where: {
      id: data.teacherId,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  await db.$transaction(async (ctx) => {
    await ctx.teacherAdvance.create({
      data: {
        session: new Date().getFullYear(),
        month: Object.values(Month)[new Date().getMonth()],
        ...data,
        status: TransactionStatus.Pending,
        teacherName: teacher.name,
      },
    });

    await ctx.bank.update({
      where: {
        teacherId: data.teacherId,
      },
      data: {
        advance: {
          increment: data.amount,
        },
        current: {
          decrement: data.amount,
        },
      },
    });
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
              title: `Advance Request`,
              body: `Teacher ${teacher.name} has requested advance of BDT ${data.amount}`,
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
    const { id } = await GET_ADMIN();

    await sendNotification({
      trigger: "advance-request",
      actor: { id: userId },
      recipients: [id],
      data: {
        teacher: teacher.name,
        amount: data.amount.toString(),
        redirectUrl: "/dashboard/expense/advance/approval",
      },
    });
  }

  revalidatePath("/dashboard/expense/advance");

  return {
    success: "Request successful",
  };
};
