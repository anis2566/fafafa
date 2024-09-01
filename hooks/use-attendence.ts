import { create } from "zustand";

type Student = {
  name: string;
  mPhone: string;
  imageUrl: string;
};

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

interface AttendenceUpdateState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useAttendenceUpdate = create<AttendenceUpdateState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));


export const useAttendenceLeft = create<AttendenceUpdateState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));
