import { db } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
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
        await db.monthlyPayment.update({
          where: {
            id: queryParams.id,
          },
          data: {
            method: PaymentMethod.MobileBanking,
            status: PaymentStatus.Paid,
          },
        });
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
