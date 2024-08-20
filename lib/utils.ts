import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatString(input: string) {
  return input.replace(/([A-Z])/g, " $1").trim();
}

export function saltAndHashPassword(password: any) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function adjustTime(time: string): string {
  const [hours, minutesPart] = time.split(":");
  let [minutes, period] = minutesPart.split(" ");

  let minutesNumber = parseInt(minutes);

  if (minutesNumber >= 30) {
    minutes = "00";
  }

  return `${hours}:${minutes.padStart(2, "0")} ${period}`;
}
