"use server";

import { db } from "@/lib/prisma";
import { Month, PaymentStatus } from "@prisma/client";
import axios from "axios";

type PayForRegistration = {
  studentId: string;
  amount: string;
};

export const PAY_WITH_MOBILE_BANKING = async ({
  studentId,
  amount,
}: PayForRegistration) => {
  const transactionId = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const res = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      cus_name: "Imtiaz Akil",
      cus_email: "imtiaz.akil@softbd.com",
      cus_phone: "01870762472",
      cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      amount: amount,
      tran_id: transactionId,
      currency: "BDT",
      success_url: `https://basiceducationcare.vercel.app/api/payment/verify?id=${studentId}`,
      fail_url: "https://example.com/fail.php",
      cancel_url: "https://example.com/cancel.php",
      desc: "Lend Money",
      type: "json",
    });
    return {
      url: res.data?.payment_url,
    };
  } catch (error) {
    console.log(error);
  }
};

type PayWithMbl = {
  studentId: string;
  amount: string;
  month: Month;
};

export const PAY_WITH_MBL = async ({
  studentId,
  amount,
  month,
}: PayWithMbl) => {
  const dueMonth = await db.monthlyPayment.findFirst({
    where: {
      studentId,
      status: PaymentStatus.Unpaid,
      month: month,
    },
  });

  if (!dueMonth) {
    throw new Error("Invalid month");
  }

  const transactionId = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const res = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      cus_name: "Imtiaz Akil",
      cus_email: "imtiaz.akil@softbd.com",
      cus_phone: "01870762472",
      cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      amount: amount,
      tran_id: transactionId,
      currency: "BDT",
      success_url: `https://basiceducationcare.vercel.app/api/payment/month/verify?id=${dueMonth.id}`,
      fail_url: "https://example.com/fail.php",
      cancel_url: "https://example.com/cancel.php",
      desc: "Lend Money",
      type: "json",
    });
    return {
      url: res.data?.payment_url,
    };
  } catch (error) {
    console.log(error);
  }
};
