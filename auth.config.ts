import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "./lib/prisma";
import { SignInSchema } from "./app/auth/sign-in/schema";
import { GET_USER_BY_EMAIL, VERIFY_EMAIL } from "./services/user.service";

export const authConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/sign-in", signOut: "/auth/sign-in" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.userId = user.id ?? "";
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.role = token.role;
      session.status = token.status;
      session.userId = token.userId;
      session.user.role = token.role;
      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        if (user.email) {
          await VERIFY_EMAIL(user.email);
        }
      }
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const { success, data } = SignInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid input value");
        }

        const user = await GET_USER_BY_EMAIL(data.email);

        if (!user || !user.password) {
          return null;
        }

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isMatch = bcrypt.compareSync(data.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        if (user) return { ...user, isVerified: !!user.emailVerified };

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
