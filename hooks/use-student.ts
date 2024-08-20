import { Class } from "@prisma/client";
import { create } from "zustand";

interface AddStudentState {
  open: boolean;
  id: string;
  className: Class;
  onOpen: (id: string, className: Class) => void;
  onClose: () => void;
}

export const useAddStudent = create<AddStudentState>()((set) => ({
  open: false,
  id: "",
  className: Class.Two,
  onOpen: (id, className) => set({ open: true, id, className }),
  onClose: () => set({ open: false, id: "" }),
}));

interface RemoveStudentState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useRemoveStudent = create<RemoveStudentState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));
