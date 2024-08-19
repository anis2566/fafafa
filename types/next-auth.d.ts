import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { User as DefaultUser, Session as DefaultSession } from "next-auth";
import { Role, Status } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    role: Role;
    status: Status;
    userId: string;
    user: User;
  }

  interface User extends DefaultUser {
    role: Role;
    status: Status;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    status: Status;
    userId: string;
  }
}
