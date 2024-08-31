import { Student } from "@prisma/client";
import { create } from "zustand";

interface AttendenceCallState {
  open: boolean;
  id: string;
  student: Student | null;
  onOpen: (id: string, student: Student) => void;
  onClose: () => void;
}

export const useAttendenceCall = create<AttendenceCallState>()((set) => ({
  open: false,
  id: "",
  student: null,
  onOpen: (id, student) => set({ open: true, id, student }),
  onClose: () => set({ open: false, id: "", student: null }),
}));
