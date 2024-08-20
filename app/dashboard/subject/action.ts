"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { SubjectSchema, SubjectSchemaType } from "./schema";

export const CREATE_SUBJECT = async (values: SubjectSchemaType) => {
  const { data, success } = SubjectSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const subject = await db.subject.findFirst({
    where: {
      class: data.class,
      name: data.name,
    },
  });

  if (subject) {
    throw new Error("Subject already exists");
  }

  await db.subject.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/subject");

  return {
    success: "Subject added",
  };
};

type UpdateSubject = {
  id: string;
  values: SubjectSchemaType;
};

export const UPDATE_SUBJECT = async ({ id, values }: UpdateSubject) => {
  const { data, success } = SubjectSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const subject = await db.subject.findUnique({
    where: {
      id,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  await db.subject.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/subject");

  return {
    success: "Subject updated",
  };
};

export const DELETE_SUBJECT = async (id: string) => {
  const subject = await db.subject.findUnique({
    where: {
      id,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  await db.subject.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/subject");

  return {
    success: "Subject deleted",
  };
};
