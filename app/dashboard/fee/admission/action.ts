"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { AdmissionFeeSchema, AdmissionFeeSchemaType } from "./schema";

export const CREATE_FEE = async (values: AdmissionFeeSchemaType) => {
  const { data, success } = AdmissionFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.admissionFee.findFirst({
    where: {
      class: data.class,
    },
  });

  if (fee) {
    throw new Error("Fee with this class is exists");
  }

  await db.admissionFee.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/fee/admission");

  return {
    success: "Fee assigned",
  };
};

type UpdateFee = {
  id: string;
  values: AdmissionFeeSchemaType;
};

export const UPDATE_FEE = async ({ id, values }: UpdateFee) => {
  const { data, success } = AdmissionFeeSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const fee = await db.admissionFee.findUnique({
    where: {
      id,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  await db.admissionFee.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/fee/admission");

  return {
    success: "Fee updated",
  };
};

export const DELETE_FEE = async (id: string) => {
  const fee = await db.admissionFee.findUnique({
    where: {
      id,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  await db.admissionFee.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/fee/admission");

  return {
    success: "Fee deleted",
  };
};
