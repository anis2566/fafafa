import { Subject } from "@prisma/client";
import { create } from "zustand";

interface AddSubjectState {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAddSubject = create<AddSubjectState>()((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));

interface EditSubjectState {
  open: boolean;
  id: string;
  subject: Subject | null;
  onOpen: (id: string, subject: Subject) => void;
  onClose: () => void;
}

export const useUpdateSubject = create<EditSubjectState>()((set) => ({
  open: false,
  id: "",
  subject: null,
  onOpen: (id, subject) => set({ open: true, id, subject }),
  onClose: () => set({ open: false, id: "", subject: null }),
}));

interface DeleteSubjectState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteSubject = create<DeleteSubjectState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));
