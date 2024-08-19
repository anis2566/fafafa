import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.user) {
    return NextResponse.json({ message: "User not found" });
  }

  //   await streamServerClient.upsertUser({
  //     id: body?.user.id ?? "",
  //     name: body?.user.name ?? "Guest",
  //     username: body?.user.name ?? "Guest",
  //   });

  return NextResponse.json({ message: "User verified" });
}
