import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  const body = await req.json();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: body.email,
    subject: "Account Verification",
    text: "Verification",
    html: `Your verification code is <h1>${code}</h1>`,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    if (res.messageId) {
      await db.verificationToken.create({
        data: {
          identifier: body.id,
          token: code,
          expires: new Date(Date.now() + 30 * 60 * 1000),
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
