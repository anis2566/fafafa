import { Day } from "@prisma/client";
import { create } from "zustand";

interface ClassState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useClass = create<ClassState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));

interface AddClassState {
  open: boolean;
  time: string;
  day: Day;
  batchId: string;
  onOpen: (batchId: string, time: string, day: Day) => void;
  onClose: () => void;
}

export const useAddClass = create<AddClassState>()((set) => ({
  open: false,
  time: "",
  day: Day.Friday,
  batchId: "",
  onOpen: (batchId, time, day) => set({ open: true, batchId, time, day }),
  onClose: () => set({ open: false, batchId: "", time: "", day: Day.Friday }),
}));
