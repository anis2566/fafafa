"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import axios from "axios";

import { signIn } from "@/auth";
import { SignInSchemaType } from "./schema";
import { db } from "@/lib/prisma";

type SignInUser = {
  values: SignInSchemaType;
  callbackUrl: string | null;
};

export const SIGN_IN_USER = async ({ values, callbackUrl }: SignInUser) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.emailVerified) {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? "https://www.apbnscouts.org/api/send-email"
          : "http://localhost:3000/api/email/verify";

      const { data } = await axios.post(apiUrl, {
        email: user.email,
        id: user.id,
      });

      if (data?.success) {
        redirect(`/auth/verify/${user.id}`);
      } else {
        throw new Error("Something went wrong! Try again!");
      }
    } else {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        redirectTo: callbackUrl ? callbackUrl : "/",
      });
      return { success: "Login successful", user };
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      const { type, cause } = error as AuthError;

      switch (type) {
        case "CredentialsSignin":
          throw new Error("Invalid credentials");
        case "CallbackRouteError":
          throw new Error(cause?.err?.toString());
        default:
          throw new Error("Something went wrong");
      }
    }
  }
};
