import { db } from "@/lib/prisma";
import { Month, PaymentMethod, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get the URL from the request
    const url = new URL(request.url);

    // Extract query parameters
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Parse the POST body (URL-encoded data)
    const data = await request.text();
    const params = new URLSearchParams(data);
    const paymentData = Object.fromEntries(params.entries());

    // Construct the base URL dynamically
    const baseUrl = `${url.protocol}//${url.host}`;

    if (paymentData.pay_status === "Successful") {
      if (queryParams.id) {
        const student = await db.student.findUnique({
          where: {
            id: queryParams.id,
          },
        });

        if (!student) {
          throw new Error("Student not found");
        }

        const currentMonthIndex = new Date().getMonth();

        await db.admissionPayment.create({
          data: {
            month: Object.values(Month)[new Date().getMonth()],
            studentId: student.id,
            amount: student.admissionFee,
            method: PaymentMethod.Cash,
            status: PaymentStatus.Paid,
            session: new Date().getFullYear(),
          },
        });

        await db.monthlyPayment.create({
          data: {
            amount: student.monthlyFee,
            session: new Date().getFullYear(),
            method: PaymentMethod.Cash,
            status: PaymentStatus.Paid,
            studentId: student.id,
            month: Object.values(Month)[currentMonthIndex],
            class: student.class, // Add this line
          },
        });

        for (let i = 0; i <= currentMonthIndex; i++) {
          await db.monthlyPayment.create({
            data: {
              amount: student.monthlyFee,
              session: new Date().getFullYear(),
              method: PaymentMethod.Cash,
              status: PaymentStatus.NA,
              studentId: student.id,
              month: Object.values(Month)[i],
              class: student.class, // Add this line
            },
          });
        }
      }
      return NextResponse.redirect(
        `${baseUrl}/dashboard/payment/success?callback=/dashboard`,
        303
      ); // Use 303 status for GET request
    } else {
      return NextResponse.redirect(`${baseUrl}/dashboard/payment/fail`, 303); // Use 303 status for GET request
    }
  } catch (error) {
    console.log(error);
  }
}
