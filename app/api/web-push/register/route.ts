import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PushSubscription } from "web-push";

export async function POST(req: Request) {
  try {
    const newSubscription: PushSubscription | undefined = await req.json();

    if (!newSubscription) {
      return NextResponse.json(
        { error: "Missing push subscription in body" },
        { status: 400 }
      );
    }

    console.log("Received push subscription to add: ");

    const session = await auth();

    if (!session || !session.userId) throw new Error("Unauthorized");

    const currentSubscription = await db.pushSubscriber.findFirst({
      where: {
        userId: session.userId,
        endpoint: newSubscription.endpoint,
      },
    });

    if (!currentSubscription) {
      await db.pushSubscriber.create({
        data: {
          userId: session.userId,
          endpoint: newSubscription.endpoint,
          auth: newSubscription.keys.auth,
          p256dh: newSubscription.keys.p256dh,
        },
      });
    }

    return NextResponse.json(
      { message: "Push subscription saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
