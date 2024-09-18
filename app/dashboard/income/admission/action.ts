"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { AdmissionPaymentSchema, AdmissionPaymentSchemaType } from "./schema";

type UpdatePayment = {
  id: string;
  values: AdmissionPaymentSchemaType;
};

export const UPDATE_ADMISSION_PAYMENT = async ({
  id,
  values,
}: UpdatePayment) => {
  const { data, success } = AdmissionPaymentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const payment = await db.admissionPayment.findUnique({
    where: {
      id,
    },
    include: {
        student: {
            select: {
                admissionFee: true
            }
        }
    }
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if(payment.student.admissionFee !== data.amount) {
    throw new Error("Invalid amount")
  }

  await db.admissionPayment.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/dashboard/salary/admission");

  return {
    success: "Payment updated",
  };
};
