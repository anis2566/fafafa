import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_KEY || !process.env.STREAM_SECRET) {
  throw new Error("Missing Stream API keys");
}

if (!StreamChat) {
  throw new Error("StreamChat is not initialized correctly");
}

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET,
  {
    timeout: 6000,
  }
);

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(
      session.userId,
      expirationTime,
      issuedAt
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
