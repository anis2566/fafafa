"use server";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";
import { Class, Day, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

type GetStudent = {
  id: number | undefined;
  className: Class;
};

export const GET_STUDENTS_FOR_BATCH = async ({ id, className }: GetStudent) => {
  const students = await db.student.findMany({
    where: {
      ...(id && { studentId: id }),
      class: className,
      isPresent: true,
      batchId: {
        equals: "" || null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return { students };
};

type AddStudent = {
  batchId: string;
  ids: string[];
};

export const ADD_STUDENT_TO_BATCH = async ({ ids, batchId }: AddStudent) => {
  const batch = await db.batch.findUnique({
    where: {
      id: batchId,
    },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.capacity - batch.students.length < ids.length) {
    throw new Error("Batch is full");
  }

  for (const id of ids) {
    await db.student.update({
      where: {
        id,
      },
      data: {
        batchId,
      },
    });
  }

  revalidatePath(`/dashboard/batch/${batchId}`);

  return {
    success: "Student assigned",
  };
};

export const REMOVE_STUDENT_FROM_BATCH = async (id: string) => {
  const student = await db.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  await db.student.update({
    where: {
      id,
    },
    data: {
      batchId: null,
    },
  });

  revalidatePath(`/dashboard/batch/${student.batchId}`);

  return {
    success: "Student removed",
  };
};

export const REMOVE_CLASS_FROM_BATCH = async (id: string) => {
  const batchClass = await db.batchClass.findUnique({
    where: {
      id,
    },
    include: {
      teacher: true,
    },
  });

  if (!batchClass) {
    throw new Error("Class not found");
  }

  await db.batchClass.delete({
    where: {
      id,
    },
  });

  if (batchClass.teacher.userId) {
    const subscribers = await db.pushSubscriber.findMany({
      where: { userId: batchClass.teacher.userId },
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
      recipients: [batchClass.teacher.userId],
      data: {},
    });
  }

  revalidatePath(`/dashboard/batch/${batchClass.batchId}`);
  revalidatePath(`/dashboard/teacher/${batchClass.teacherId}`);

  return {
    success: "Class removed",
  };
};

export const GET_SUBJECT_BY_BATCH = async (id: string) => {
  const batch = await db.batch.findUnique({
    where: {
      id,
    },
  });

  if (!batch) throw new Error("Batch not found");

  const subjects = await db.subject.findMany({
    where: {
      class: batch.class,
    },
  });

  return { subjects };
};

type GetTeachers = {
  id: string;
  searchId?: number;
};

export const GET_TEACHERS_BY_BATCH = async ({ id, searchId }: GetTeachers) => {
  const batch = await db.batch.findUnique({
    where: {
      id,
    },
  });

  if (!batch) throw new Error("Batch not found");

  const teachers = await db.teacher.findMany({
    where: {
      level: {
        has: batch.level,
      },
      status: Status.Active,
      ...(searchId && { teacherId: searchId }),
    },
    take: 3,
  });

  return { teachers };
};

type CreateBatchClass = {
  batchId: string;
  time: string;
  day: Day;
  subjectId: string;
  teacherId: string;
};

export const ADD_BATCH_CLASS = async ({
  batchId,
  time,
  day,
  subjectId,
  teacherId,
}: CreateBatchClass) => {
  const isBatchTimeBook = await db.batchClass.findFirst({
    where: {
      batchId,
      AND: [
        {
          day,
        },
        {
          time,
        },
      ],
    },
  });

  if (isBatchTimeBook) {
    throw new Error(`The batch time is booked for day ${day}`);
  }

  const isTeacherTimeBook = await db.batchClass.findFirst({
    where: {
      teacherId,
      AND: [
        {
          day,
        },
        {
          time,
        },
      ],
    },
  });

  if (isTeacherTimeBook) {
    throw new Error(`The teacher time is booked for day ${day}`);
  }

  const subject = await db.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      name: true,
    },
  });

  if (!subject) throw new Error("Subject not found");

  const teacher = await db.teacher.findUnique({
    where: {
      id: teacherId,
    },
    select: {
      name: true,
      userId: true,
    },
  });

  if (!teacher) throw new Error("Teacher not found");

  const batch = await db.batch.findUnique({
    where: {
      id: batchId,
    },
    include: {
      room: true,
    },
  });

  if (!batch) throw new Error("Batch not found");

  await db.batchClass.create({
    data: {
      batchId,
      day,
      time,
      subjectId,
      teacherId,
      subjectName: subject.name,
      teacherName: teacher.name,
      batchName: batch.name,
      roomName: batch.room.name,
      roomId: batch.roomId,
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

  revalidatePath(`/dashboard/batch/${batchId}`);

  return {
    success: "Class added",
  };
};
