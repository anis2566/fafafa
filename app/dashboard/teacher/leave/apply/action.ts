"use server";

import { Day, LeaveStatus } from "@prisma/client";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { LeaveAppSchema, LeaveAppSchemaType } from "./schema";
import { GET_USER } from "@/services/user.service";
import { sendNotification } from "@/services/notification.service";

export const CREATE_LEAVE_APP = async (values: LeaveAppSchemaType) => {
  const { data, success } = LeaveAppSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");
  const { dates } = data;

  const isApplied = await db.leaveApp.findFirst({
    where: {
      teacherId: data.teacherId,
      status: LeaveStatus.Pending,
    },
  });

  if (isApplied) throw new Error("This teacher has already applied.");

  const dayNames = dates.map((date) => {
    const dayOfWeek = new Date(date).getDay();
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayOfWeek] as Day;
  });

  const batchClasses = await db.batchClass.findMany({
    where: {
      day: {
        in: dayNames,
      },
    },
  });

  const updatedDays = dates.map((date) => addDays(new Date(date), 1));

  const app = await db.$transaction(async (ctx) => {
    const app = await ctx.leaveApp.create({
      data: {
        ...data,
        days: dayNames,
        status: LeaveStatus.Approved,
      },
      include: {
        teacher: true,
      },
    });

    for (const cls of batchClasses) {
      const {
        day,
        time,
        subjectId,
        subjectName,
        batchId,
        batchName,
        roomName,
      } = cls;
      await ctx.leaveClass.create({
        data: {
          day,
          time,
          subjectId,
          subjectName,
          batchId,
          batchName,
          date: updatedDays[dayNames.indexOf(day)],
          appId: app.id,
          roomName,
        },
      });
    }

    return app;
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
    success: "Application successful",
  };
};
