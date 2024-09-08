import { Day, Level } from "@prisma/client";
import { create } from "zustand";

interface LeaveClassState {
  open: boolean;
  id: string;
  day: Day | undefined;
  time: string;
  onOpen: (id: string, day: Day, time: string) => void;
  onClose: () => void;
}

export const useLeaveClass = create<LeaveClassState>()((set) => ({
  open: false,
  id: "",
  day: undefined,
  time: "",
  onOpen: (id, day, time) => set({ open: true, id, day, time }),
  onClose: () => set({ open: false, id: "", day: undefined, time: "" }),
}));

interface LeaveClassUpdateState {
  open: boolean;
  id: string;
  teacherId: string;
  day: Day | undefined;
  time: string;
  onOpen: (id: string, day: Day, time: string, teacherId: string) => void;
  onClose: () => void;
}

export const useLeaveClassUpdate = create<LeaveClassUpdateState>()((set) => ({
  open: false,
  id: "",
  teacherId: "",
  day: undefined,
  time: "",
  onOpen: (id, day, time, teacherId) =>
    set({ open: true, id, day, time, teacherId }),
  onClose: () =>
    set({ open: false, id: "", day: undefined, time: "", teacherId: "" }),
}));

interface LeaveClassStatusState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useLeaveClassStatus = create<LeaveClassStatusState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));
