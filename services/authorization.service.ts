"use server";

import { Role } from "@prisma/client";

import { GET_USER } from "./user.service";

export const IS_ADMIN = async () => {
  const { role } = await GET_USER();

  const isAdmin =
    role === Role.Admin ||
    role === Role.Management ||
    role === Role.HR ||
    role === Role.Accountant;

  return isAdmin;
};
