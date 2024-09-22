"use server";

import { Class, Level } from "@prisma/client";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { BatchClassSchema, BatchClassSchemaType } from "./schema";
import { revalidatePath } from "next/cache";
import { GET_USER } from "@/services/user.service";
import { sendNotification } from "@/services/notification.service";

type CreateBatchClass = {
  id: string;
  values: BatchClassSchemaType;
};

export const CREATE_BATCH_CLASS = async ({ id, values }: CreateBatchClass) => {
  const { data, success } = BatchClassSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const { day } = data;

  for (const item of day) {
    const isBatchTimeBook = await db.batchClass.findFirst({
      where: {
        batchId: id,
        AND: [
          {
            day: item,
          },
          {
            time: data.time,
          },
        ],
      },
    });

    if (isBatchTimeBook) {
      throw new Error(`The batch time is booked for day ${item}`);
    }
  }

  for (const item of day) {
    const isTeacherTimeBook = await db.batchClass.findFirst({
      where: {
        teacherId: data.teacherId,
        AND: [
          {
            day: item,
          },
          {
            time: data.time,
          },
        ],
      },
    });

    if (isTeacherTimeBook) {
      throw new Error(`The teacher time is booked for day ${item}`);
    }
  }

  const subject = await db.subject.findUnique({
    where: {
      id: data.subjectId,
    },
    select: {
      name: true,
    },
  });

  if (!subject) throw new Error("Subject not found");

  const teacher = await db.teacher.findUnique({
    where: {
      id: data.teacherId,
    },
    select: {
      name: true,
      userId: true,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  const batch = await db.batch.findUnique({
    where: {
      id,
    },
    include: {
      room: true,
    },
  });

  if (!batch) throw new Error("Batch not found");

  for (const item of data.day) {
    await db.batchClass.create({
      data: {
        batchId: id,
        day: item,
        time: data.time,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        subjectName: subject.name,
        teacherName: teacher.name,
        batchName: batch.name,
        roomName: batch.room.name,
        roomId: batch.roomId,
      },
    });
  }

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
              title: `Schedule Changed`,
              body: `Your class schedule has been changed. Please checkout.`,
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
      trigger: "schedule-changed",
      actor: { id: userId },
      recipients: [teacher.userId],
      data: {},
    });
  }

  revalidatePath(`/dashboard/batch/${id}`);

  return {
    success: "Class created",
  };
};

export const GET_SUBJECT_BY_CLASS = async (className: Class) => {
  const subjects = await db.subject.findMany({
    where: {
      class: className,
    },
  });

  return {
    subjects,
  };
};

type GetTeacher = {
  level: Level;
  id?: number;
};

export const GET_TEACHER_BY_LEVEL = async ({ level, id }: GetTeacher) => {
  const teachers = await db.teacher.findMany({
    where: {
      level: {
        has: level,
      },
      ...(id && {
        teacherId: id,
      }),
    },
    take: 3,
  });

  return { teachers };
};
